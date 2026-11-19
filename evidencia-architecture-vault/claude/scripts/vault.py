"""Valida uma coleta e publica um vault Obsidian autocontido (Python 3.9+)."""
import argparse
import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from string import Template
import fichas
import publicacao

ROOT = Path(__file__).resolve().parents[1]
SCHEMAS = ROOT / "references" / "schemas"
TEMPLATES = ROOT / "assets" / "templates"
MODELOS = {p.stem: Template(p.read_text(encoding="utf-8")) for p in TEMPLATES.glob("*.md")}
RENDERER = publicacao.digest({
    "modelos": {k: v.template for k, v in MODELOS.items()}, "catalogo": fichas.CATALOGO,
    "implementacao": {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in
                      [Path(__file__), Path(fichas.__file__), Path(publicacao.__file__), *SCHEMAS.glob("*.json")]}})


def require(ok, message):
    if not ok:
        raise ValueError(message)


def unique_keys(pairs):
    obj = {}
    for key, value in pairs:
        require(key not in obj, f"Chave JSON repetida: {key}")
        obj[key] = value
    return obj


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"), object_pairs_hook=unique_keys)


def iso_day(value):
    require(re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value), f"Data inválida: {value}")
    return date.fromisoformat(value)


def instant(value):
    require(re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?(?:Z|[+-][0-9]{2}:[0-9]{2})", value),
            f"Horário sem data, segundos ou fuso válido: {value}")
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def check_schema(value, schema, label, definitions):
    """Implementa somente o vocabulário presente nos schemas distribuídos."""
    if "$ref" in schema:
        return check_schema(value, definitions[schema["$ref"]], label, definitions)
    if "oneOf" in schema:
        errors = []
        for alternative in schema["oneOf"]:
            try:
                check_schema(value, alternative, label, definitions)
            except ValueError as exc:
                errors.append(str(exc))
        require(len(errors) == len(schema["oneOf"]) - 1,
                f"{label}: afirmação inválida. " + " / ".join(errors))
        return
    expected = schema["type"]
    types = {"object": dict, "array": list, "integer": int, "string": str}
    require(type(value) is types[expected], f"{label}: esperado {expected}")
    if expected == "object":
        missing = set(schema["required"]) - value.keys()
        extra = value.keys() - schema["properties"].keys()
        require(not missing, f"{label}: faltam {sorted(missing)}")
        require(not extra or schema["additionalProperties"], f"{label}: campos extras {sorted(extra)}")
        for key, item in value.items():
            check_schema(item, schema["properties"][key], f"{label}.{key}", definitions)
    if expected == "array":
        require(len(value) >= schema["minItems"], f"{label}: lista insuficiente")
        for index, item in enumerate(value):
            check_schema(item, schema["items"], f"{label}[{index}]", definitions)
    if "enum" in schema:
        require(value in schema["enum"], f"{label}: valor fora do vocabulário")
    if "pattern" in schema:
        require(re.search(schema["pattern"], value), f"{label}: formato inválido")
        if schema["pattern"].endswith("$"):
            require("\n" not in value and "\r" not in value, f"{label}: quebra de linha inválida")
    if "minLength" in schema:
        require(len(value) >= schema["minLength"], f"{label}: texto insuficiente")
    if "minimum" in schema:
        require(value >= schema["minimum"], f"{label}: menor que o mínimo")
    if schema.get("format") == "date":
        iso_day(value)
    if schema.get("format") == "date-time":
        instant(value)


def index_records(rows):
    records = {}
    for row in rows:
        key = row["id"]
        require(key not in records, f"ID repetido: {key}")
        records[key] = row
    return records


CACHE_FIELDS = {"uso": "Uso do cache", "estrategia": "Estratégia", "ttl": "Tempo de validade (TTL)",
                "invalidacao": "Regra de invalidação"}


def verify_code(ev, excerpt, source_root):
    ref = ev.get("codigo")
    key = ev["id"]
    require(ref, f"{key}: cache por rota exige evidência de código")
    repo = (source_root / ref["repositorio"]).resolve()
    require(source_root in repo.parents, f"{key}: repositório fora da raiz de fontes")
    path = (repo / ref["caminho"]).resolve()
    require(repo in path.parents, f"{key}: arquivo fora do repositório")
    require(path.suffix.lower() not in {".md", ".rst", ".pdf", ".txt", ".log", ".json", ".yaml", ".yml"},
            f"{key}: indique a implementação ou teste no código-fonte")
    require(path.is_file(), f"{key}: fonte ausente, confira --fontes e {ref['repositorio']}/{ref['caminho']}")
    raw = path.read_bytes()
    require(ev["versao_fonte"] == "sha256:" + hashlib.sha256(raw).hexdigest(),
            f"{key}: versão do arquivo-fonte diverge")
    lines = raw.decode("utf-8-sig").splitlines()
    start, end = ref["linha_inicial"], ref["linha_final"]
    require(1 <= start <= end <= len(lines), f"{key}: intervalo inválido no código")
    require(excerpt.splitlines() == lines[start - 1:end], f"{key}: extrato difere das linhas do código")


def validated(path, day, source_root=None):
    data = read_json(path)
    definitions = {p.name: read_json(p) for p in SCHEMAS.glob("*.schema.json")}
    check_schema(data, definitions["inventario.schema.json"], "inventario", definitions)
    parts = index_records(data["componentes"])
    claims = index_records(data["afirmacoes"])
    evidence = index_records(data["evidencias"])
    grouped = defaultdict(list)
    files, excerpts, states = {}, {}, {}
    base = path.parent.resolve()
    source_root = (source_root or (base / "fontes")).resolve()
    proof_dir = (base / "provas").resolve()
    require(proof_dir == base / "provas", "Diretório de provas redirecionado")
    for key, record in evidence.items():
        claim_id = record["afirmacao"]
        require(claim_id in claims, f"{key}: afirmação ausente")
        require(all(record[k] == data[k] for k in ("ambiente", "plano")), f"{key}: recorte diferente")
        capture = instant(record["coletado_em"]).date()
        require(capture <= iso_day(claims[claim_id]["revisado_em"]), f"{key}: coleta posterior à revisão")
        name = record["arquivo"]
        location = (base / name).resolve()
        require(proof_dir in location.parents, f"{key}: arquivo fora de provas")
        if name not in files:
            files[name] = location.read_bytes()
        raw = files[name]
        require(hashlib.sha256(raw).hexdigest() == record["sha256"], f"{key}: SHA-256 diverge")
        lines = raw.decode("utf-8-sig").splitlines()
        first, last = record["linha_inicial"], record["linha_final"]
        require(1 <= first <= last <= len(lines), f"{key}: linhas fora do extrato")
        excerpt = "\n".join(lines[first - 1:last])
        require(excerpt.strip(), f"{key}: trecho vazio")
        if (claims[claim_id]["tipo"] == "cache_rota" or
                claims[claim_id].get("chave") in fichas.CAMPOS_DE_CODIGO or "codigo" in record):
            verify_code(record, excerpt, source_root)
        excerpts[key] = excerpt
        grouped[claim_id].append(record)

    propositions = set()
    for key, claim in claims.items():
        require(claim["origem"] in parts, f"{key}: origem ausente")
        if claim["tipo"] == "dependencia":
            require(claim["destino"] in parts, f"{key}: destino ausente")
            identity = (claim["origem"], claim["relacao"], claim["destino"])
        elif claim["tipo"] == "cache_rota":
            require(parts[claim["origem"]]["classe"] == "api", f"{key}: indique um componente API")
            require(data["plano"] == "configurado", f"{key}: revisão de código requer plano configurado")
            identity = tuple(claim[k] for k in ("origem", "metodo_http", "rota", "camada", "campo"))
            if claim["estado"] == "confirmada":
                require(any(e["papel"] == "direta" and e["codigo"]["tipo"] == "implementacao" for e in grouped[key]),
                        f"{key}: confirmação exige prova direta na implementação")
        else:
            identity = (claim["origem"], claim["chave"])
            if claim["chave"] in fichas.CAMPOS_DE_CODIGO and claim["estado"] == "confirmada":
                require(data["plano"] == "configurado" and any(
                    e["papel"] == "direta" and e["codigo"]["tipo"] == "implementacao" for e in grouped[key]),
                    f"{key}: o cache precisa de prova direta na implementação, no plano configurado")
            if claim["chave"] == "ficha.execucao.workers_observados":
                require(data["plano"] == "observado", f"{key}: workers ativos exigem observação do ambiente")
            if parts[claim["origem"]]["classe"] == "api":
                require(not re.search(r"(?:^|[._-])cache(?:$|[._-])", claim["chave"]),
                        f"{key}: use cache_rota com evidência de código para o cache desta API")
        require(identity not in propositions, f"{key}: proposição duplicada. Consolide leituras no mesmo registro")
        propositions.add(identity)
        start, reviewed, end = (iso_day(claim[k]) for k in ("valido_de", "revisado_em", "valido_ate"))
        require(start <= end and reviewed <= day and start <= day, f"{key}: período incompatível com a data de corte")
        roles = {e["papel"] for e in grouped[key]}
        require(roles, f"{key}: falta evidência rastreável. Registre perguntas abertas na cobertura")
        state = claim["estado"]
        if state == "confirmada":
            require("direta" in roles and "contraria" not in roles, f"{key}: confirmação sem prova direta ou contestada")
            require(start <= reviewed <= end, f"{key}: confirmação fora da vigência na revisão")
        conflict = "contraria" in roles and bool(roles & {"direta", "indicio"})
        if state == "divergente" or (conflict and state != "obsoleta"):
            require(state == "divergente" and "contraria" in roles and bool(roles & {"direta", "indicio"}),
                    f"{key}: registre a divergência e os dois lados")
        states[key] = "obsoleta" if end < day else state
    for component, items in fichas.itens_por_componente(data).items():
        fichas.organizar(parts[component], items, states)
    return data, grouped, files, excerpts, states


def bullets(items):
    return "\n".join("- " + item for item in items) or "Nenhum registro neste recorte."


def front(record):
    return {k: json.dumps(v, ensure_ascii=False) for k, v in record.items()}


def note(folder, name, template, fields):
    (folder / (name + ".md")).write_text(MODELOS[template].substitute(fields), encoding="utf-8")


def cache_report(folder, apis, claims, states, wik, scope, day):
    sections = []
    questions = []
    by_api = defaultdict(lambda: defaultdict(dict))
    for claim in claims:
        if claim["tipo"] == "cache_rota":
            route = tuple(claim[k] for k in ("metodo_http", "rota", "camada"))
            by_api[claim["origem"]][route][claim["campo"]] = claim
    for api in apis:
        sections.append("## " + wik(api["id"]) + " · " + api["nome"])
        routes = by_api[api["id"]]
        if not routes:
            sections.append("Pendente identificar métodos e rotas no código da API.")
            questions.append(f"Qual repositório e revisão contêm as rotas de {api['id']} neste recorte?")
        for (method, route, layer), fields in sorted(routes.items()):
            sections.append(f"### `{method} {route}` · {layer}")
            rows = []
            for field, title in {"operacao": "Operação", **CACHE_FIELDS}.items():
                claim = fields.get(field)
                if claim:
                    rows.append(f"**{title}** — {claim['valor']} · {states[claim['id']]} · {wik(claim['id'])}")
                elif field != "operacao":
                    rows.append(f"**{title}** — Pendente de evidência no código.")
            sections.append(bullets(rows))
            gaps = [title for field, title in CACHE_FIELDS.items()
                    if field not in fields or states[fields[field]["id"]] != "confirmada"]
            if gaps:
                questions.append(f"Em que arquivo deste recorte de {api['id']} posso verificar "
                                 f"{', '.join(gaps)} de {method} {route} ({layer})?")
    note(folder, "Cache por rota", "cache-api", {**scope, "data": json.dumps(day.isoformat()),
         "operacoes": "\n\n".join(sections)})
    return questions


def render(folder, bundle, day, vault_prefix=""):
    data, grouped, files, excerpts, states = bundle
    technical = fichas.itens_por_componente(data)
    questions = [f"{g['item']} — {g['motivo']}. {g['pergunta']}" for g in data.get("pendencias", [])]

    def wik(key):
        destination = f"{vault_prefix}/{key}|{key}" if vault_prefix else key
        return f"[[{destination}]]"

    scope = front({k: data[k] for k in ("ambiente", "plano", "natureza")})
    for name, raw in files.items():
        dest = folder / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(raw)
    for ev in data["evidencias"]:
        snippet = excerpts[ev["id"]]
        fence = "~" * max(3, 1 + max((len(s) for s in re.findall("~+", snippet)), default=0))
        note(folder, ev["id"], "evidencia", {
            "codigo_yaml": "".join(f"\ncodigo_{k}: {v}" for k, v in front(ev.get("codigo", {})).items()),
            **front(ev), **scope, "afirmacao_link": json.dumps(wik(ev["afirmacao"])),
            "titulo": ev["id"], "interpretacao": ev["leitura"],
            "anexo": ("./" if vault_prefix else "") + ev["arquivo"],
            "trecho": fence + "text\n" + snippet + "\n" + fence,
        })
    outgoing, incoming, properties = defaultdict(list), defaultdict(list), defaultdict(list)
    catalog, edges, others, diagram = [], [], [], []
    for claim in data["afirmacoes"]:
        key, src = claim["id"], claim["origem"]
        state = states[key]
        if state != "confirmada":
            questions.append(f"Qual fonte atual permite revisar {wik(key)} de {src} ({state})?")
        entry = f"{wik(key)} · {state}"
        if claim["tipo"] == "dependencia":
            dst, rel = claim["destino"], claim["relacao"]
            statement = f"{wik(src)} → {rel} → {wik(dst)}"
            outgoing[src].append(f"{rel} → {wik(dst)} · {entry}")
            incoming[dst].append(f"{wik(src)} → {rel} · {entry}")
            if state == "confirmada":
                diagram.append('    ' + src.replace("-", "_") + '["' + src + '"] -->|' + rel +
                               '| ' + dst.replace("-", "_") + '["' + dst + '"]')
                edges.append(statement + " · " + wik(key))
            else:
                others.append(statement + " · " + entry)
        elif claim["tipo"] == "cache_rota":
            prop = CACHE_FIELDS.get(claim["campo"], "Operação")
            operation = f"`{claim['metodo_http']} {claim['rota']}` · {claim['camada']}"
            statement = f"{wik(src)} · {operation} · {prop} — {claim['valor']}"
            properties[src].append(f"{operation} · {prop} — {claim['valor']} · {entry}")
            others.append(statement + " · " + entry)
        else:
            prop, value = claim["chave"], claim["valor"]
            statement = f"{wik(src)} · {prop} = {value}"
            if not prop.startswith("ficha."):
                properties[src].append(f"{prop} = {value} · {entry}")
            others.append(statement + " · " + entry)
        note(folder, key, "afirmacao", {
            "cache_yaml": "".join(f"\n{k}: {json.dumps(claim[k], ensure_ascii=False)}"
                                  for k in ("metodo_http", "rota", "camada", "campo") if k in claim),
            **front(claim), **scope, "titulo": key, "efetivo": json.dumps(state),
            "origem_link": json.dumps(wik(src)), "proposicao": statement,
            "relacao": json.dumps(claim.get("relacao")),
            "destino_link": json.dumps(wik(claim["destino"]) if "destino" in claim else None),
            "chave": json.dumps(claim.get("chave")), "valor": json.dumps(claim.get("valor"), ensure_ascii=False),
            "motivo": claim["criterio"], "leituras": bullets(
                f"{wik(e['id'])} · {e['papel']}" for e in grouped[key]),
        })
    for part in data["componentes"]:
        key = part["id"]
        catalog.append(f"{wik(key)} · {part['nome']} ({part['classe']})")
        ficha = ""
        if part["classe"] in fichas.CLASSES:
            body, missing = fichas.ficha(part, technical[key], states, wik)
            ficha = "\n\n" + body
            if missing:
                questions.append(f"Quais arquivos ou extratos completam a ficha de {wik(key)} "
                                 f"no plano {data['plano']}? Ver campos a verificar em: {', '.join(missing)}.")
        note(folder, key, "componente", {**front(part), **scope, "titulo": part["nome"], "ficha": ficha,
             "propriedades": (bullets(properties[key]) if properties[key] or not ficha
                              else "As propriedades levantadas estão na ficha técnica."),
             "saidas": bullets(outgoing[key]),
             "entradas": bullets(incoming[key])})
    chart = "\n".join(["~~~mermaid", "flowchart LR", *diagram, "~~~"]) if diagram else "Nenhuma aresta confirmada vigente."
    context = " · ".join([data["ambiente"], data["plano"], data["natureza"], day.isoformat()])
    apis = [part for part in data["componentes"] if part["classe"] == "api"]
    if apis:
        questions.extend(cache_report(folder, apis, data["afirmacoes"], states, wik, scope, day))
        context += "\n\nPolíticas das APIs por método e rota → " + wik("Cache por rota")
    note(folder, "Mapa", "mapa", {**scope, "data": json.dumps(day.isoformat()), "contexto": context,
         "diagrama": chart, "arestas": bullets(edges), "catalogo": bullets(catalog), "demais": bullets(others),
         "perguntas": bullets(questions) if questions else "Nenhuma pendência registrada."})
    return questions


def signature(mode, day, inputs):
    return publicacao.digest([RENDERER, mode, day.isoformat(), inputs])


def publish(target, bundle, day, vault_prefix=""):
    key = signature("exportar", day, [vault_prefix, bundle[0]])
    return publicacao.publicar(target.parent, target.name, "Mapa.md", key,
                              lambda folder, _: render(folder, bundle, day, vault_prefix), datada=False)


def project_folder(vault_dir):
    vault_dir = vault_dir.resolve()
    require(vault_dir.is_dir(), "Informe a pasta raiz do seu vault existente em --vault")
    architecture = vault_dir
    for name in ("Project", "EvidencIA", "Arquitetura"):
        architecture = architecture / name
        architecture.mkdir(exist_ok=True)
        require(architecture.resolve(strict=True) == architecture,
                "Pasta de projeto redirecionada. Confira o destino no vault")
    return architecture


def project_report(vault_dir, bundle, day, new=False):
    def build(folder, target):
        return render(folder, bundle, day, target.relative_to(vault_dir.resolve()).as_posix())
    return publicacao.publicar(project_folder(vault_dir), day.isoformat(), "Mapa.md",
                              signature("recorte", day, bundle[0]), build, datada=True, nova=new)


def publish_project(vault_dir, bundle, day):
    return project_report(vault_dir, bundle, day)[0]


ENVIRONMENTS = {"desenvolvimento-local": "Desenvolvimento local", "producao-remota": "Produção remota"}


def environment_review(folder, prefix, environment, bundles, day, failures):
    title = ENVIRONMENTS[environment]
    if not bundles and not failures:
        return ["## " + title, "Coleta pendente."], [f"Qual fonte autorizada identifica a infraestrutura de {title.lower()}?"]
    maps, questions = [], []
    classes = read_json(SCHEMAS / "componente.schema.json")["properties"]["classe"]["enum"]
    covered = {kind: [] for kind in classes}
    verified = iter(bundles)
    for index in range(1, len(bundles) + len(failures) + 1):
        if index in failures:
            failure = failures[index]
            maps.append(f"Recorte {index} rejeitado — {failure['motivo']}")
            questions.append(f"Recorte {index} rejeitado — {failure['pergunta']}")
            continue
        bundle = next(verified)
        data, _, _, _, states = bundle
        require(data.get("contexto_infra") == environment, f"Confira contexto_infra do inventário de {title}")
        leaf = f"{environment}/{index}-{data['plano']}"
        sub = folder / leaf
        sub.mkdir(parents=True)
        revision = publicacao.digest(data)[:12]
        scope = f"recorte {index} · {data['ambiente']} · {data['plano']} · {data['natureza']} · {revision}"
        ref = f"[[{prefix}/{leaf}/Mapa|{scope}]]"
        maps.append(ref)
        questions.extend(f"{ref} — {q}" for q in render(sub, bundle, day, prefix + "/" + leaf))
        mentioned = set()
        for claim in data["afirmacoes"]:
            if states[claim["id"]] == "confirmada":
                mentioned.add(claim["origem"])
                if "destino" in claim:
                    mentioned.add(claim["destino"])
        for part in data["componentes"]:
            if part["id"] in mentioned:
                covered[part["classe"]].append(f"[[{prefix}/{leaf}/{part['id']}|{part['nome']}]]")
    lines = ["## " + title, bullets(maps)]
    if bundles:
        missing = [kind for kind, links in covered.items() if not links]
        if missing:
            questions.append(f"Que fonte cobre {', '.join(missing)} neste ambiente, ou quais dessas classes ficam fora do escopo?")
        lines.extend(["### Componentes citados em afirmações confirmadas vigentes",
                      bullets(f"{kind} — " + (", ".join(links) if links else "pendente") for kind, links in covered.items())])
    return lines, questions


def publish_environments(vault_dir, records, day, failures=None, new=False):
    failures = failures or {}
    inputs = {env: [b[0] for b in records[env]] for env in ENVIRONMENTS}
    key = signature("ambientes", day, [inputs, failures])

    def build(folder, target):
        prefix = target.relative_to(vault_dir.resolve()).as_posix()
        lines = ["# Infraestrutura do EvidencIA", "Data de corte: " + day.isoformat()]
        pending = []
        if any(failures.values()):
            lines.append("**Publicação parcial.** Os recortes rejeitados estão identificados abaixo.")
        for environment, title in ENVIRONMENTS.items():
            section, questions = environment_review(folder, prefix, environment, records[environment], day,
                                                      failures.get(environment, {}))
            lines.extend(section)
            pending.extend(f"{title} — {q}" for q in questions)
        lines.extend(["## Perguntas ao responsável", bullets(pending) if pending else "Nenhuma pendência registrada."])
        (folder / "Ambientes.md").write_text("\n\n".join(lines) + "\n", encoding="utf-8")
        return pending

    return publicacao.publicar(project_folder(vault_dir), day.isoformat(), "Ambientes.md", key, build,
                              datada=True, nova=new)


def rejection(error):
    # Somente diagnósticos sanitizados entram no vault; nomes locais e valores brutos ficam de fora.
    detail = str(error)
    match = re.match(r"^((?:ev|af)-[a-z0-9]+(?:-[a-z0-9]+)*):", detail)
    record = f" ({match[1]})" if match else ""
    if "SHA-256" in detail:
        return f"SHA-256 do extrato diverge{record}.", f"Qual extrato{record} corresponde ao hash desta coleta?"
    if "contexto_infra" in detail or "recorte diferente" in detail:
        return f"Ambiente ou plano incompatível{record}.", "Qual inventário e evidência pertencem a este ambiente?"
    if isinstance(error, OSError) or "fonte ausente" in detail:
        return "Arquivo necessário indisponível.", "Pode fornecer o inventário, extrato ou checkout autorizado que falta?"
    if "código" in detail or "arquivo-fonte" in detail:
        return f"Referência à implementação inválida{record}.", f"Qual revisão e intervalo de linhas comprovam este campo{record}?"
    return f"Inventário ou evidência inválidos{record}.", "Pode corrigir o registro indicado por validar e fornecer a evidência correspondente?"


def load_environments(args, day):
    records, failures = {}, {}
    for env, paths, sources in (("desenvolvimento-local", args.local, args.fontes_local),
                                ("producao-remota", args.producao, args.fontes_producao)):
        records[env], failures[env] = [], {}
        for index, path in enumerate(paths, 1):
            try:
                bundle = validated(path, day, sources)
                require(bundle[0].get("contexto_infra") == env, "contexto_infra incompatível")
            except (OSError, ValueError) as error:
                reason, question = rejection(error)
                failures[env][index] = {"motivo": reason, "pergunta": question}
                try:
                    failures[env][index]["inventario_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
                except OSError:
                    pass
                print(f"{ENVIRONMENTS[env]} · recorte {index} rejeitado — {reason} {question}", file=sys.stderr)
            else:
                records[env].append(bundle)
    return records, failures


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest="acao", required=True)
    pair = subs.add_parser("gerar-ambientes", help="Publicar desenvolvimento local e produção remota no second brain")
    pair.add_argument("--vault", type=Path, required=True)
    pair.add_argument("--data", help="Data de corte (AAAA-MM-DD)")
    pair.add_argument("--nova-revisao", action="store_true", help="Criar revisão mesmo para entradas idênticas")
    for arg in ("local", "producao"):
        pair.add_argument("--" + arg, type=Path, action="append", default=[], help="Inventário deste ambiente (repetível)")
        pair.add_argument("--fontes-" + arg, type=Path, help="Pasta com os repositórios desta implantação")
    for action in ("validar", "gerar", "hash"):
        sub = subs.add_parser(action)
        sub.add_argument("arquivo", type=Path)
        if action == "gerar":
            sub.add_argument("--nova-revisao", action="store_true", help="Forçar nova revisão no --vault")
            dest = sub.add_mutually_exclusive_group(required=True)
            dest.add_argument("destino", type=Path, nargs="?", help="Pasta nova para uma cópia independente")
            dest.add_argument("--vault", type=Path, help="Raiz do second brain que contém a pasta Project")
        if action != "hash":
            sub.add_argument("--fontes", type=Path, help="Pasta que contém os repositórios de código (padrão: fontes/ ao lado do inventário)")
            sub.add_argument("--data", help="Data de corte (AAAA-MM-DD), padrão hoje em UTC")
    args = parser.parse_args()
    if args.acao == "hash":
        print(hashlib.sha256(args.arquivo.read_bytes()).hexdigest())
        return
    day = iso_day(args.data) if args.data else datetime.now(timezone.utc).date()
    if args.acao == "gerar-ambientes":
        records, failures = load_environments(args, day)
        partial = any(failures.values())
        require(not partial or any(records.values()), "Todos os recortes informados foram rejeitados. Nenhuma fotografia publicada.")
        entry, pending = publish_environments(args.vault, records, day, failures, args.nova_revisao)
        print(entry)
        if partial:
            print("Publicação parcial: confira os recortes rejeitados no índice.")
        if pending:
            print("Perguntar ao responsável:\n" + bullets(pending))
        return 3 if partial else 0
    bundle = validated(args.arquivo, day, args.fontes)
    if args.acao == "gerar":
        if args.vault is not None:
            entry, pending = project_report(args.vault, bundle, day, args.nova_revisao)
        else:
            require(not args.nova_revisao, "Use --nova-revisao com --vault ou escolha outra pasta de saída.")
            entry, pending = publish(args.destino, bundle, day)
        print(entry)
        if pending:
            print("Perguntar ao responsável:\n" + bullets(pending))
    counts = Counter(bundle[-1].values())
    print(f"{day}: {len(bundle[0]['componentes'])} componentes, {sum(counts.values())} afirmações. {dict(counts)}")


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError) as error:
        sys.exit(f"Erro: {error}")
