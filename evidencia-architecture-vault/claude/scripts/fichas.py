"""Campos da ficha de API/serviço que complementam as notas de afirmação."""
import json
from collections import defaultdict
from pathlib import Path

CATALOGO = json.loads((Path(__file__).resolve().parents[1] / "references" / "campos-ficha.json")
                      .read_text(encoding="utf-8"))
CLASSES = {"api", "servico"}
CAMPOS_DE_CODIGO = {"ficha.tarefas.serializacao", "ficha.tarefas.conexoes",
                    "ficha.tarefas.ttl", "ficha.tarefas.invalidacao"}


def endereco(chave):
    partes = chave.split(".")
    bloco = partes[1] if len(partes) >= 3 else ""
    if bloco not in CATALOGO:
        raise ValueError(f"Bloco de ficha desconhecido: {chave}")
    campo = partes[-1]
    if campo == "aplicabilidade" and len(partes) == 3:
        return bloco, "", campo
    rota = bloco == "rotas"
    if (len(partes) != (4 if rota else 3) or campo not in CATALOGO[bloco]["campos"]
            or (rota and not partes[2])):
        raise ValueError(f"Campo de ficha inválido: {chave}")
    return bloco, partes[2] if rota else "", campo


def organizar(part, claims, states):
    """Valida apenas a convenção ficha.*; preserva outras propriedades do inventário."""
    grupos = defaultdict(dict)
    for c in claims:
        bloco, amostra, campo = endereco(c["chave"])
        if part["classe"] not in CLASSES:
            raise ValueError(f"{c['id']}: a ficha técnica requer componente API ou serviço")
        if bloco == "tarefas" and campo in {"ttl", "invalidacao"} and part["classe"] == "api":
            raise ValueError(f"{c['id']}: use cache_rota para a política de cache da API")
        if campo == "aplicabilidade" and c["valor"] != "nao-aplicavel":
            raise ValueError(f"{c['id']}: use nao-aplicavel e justifique a exceção no critério")
        grupos[bloco][(amostra, campo)] = c
    for bloco, registros in grupos.items():
        dispensa = registros.get(("", "aplicabilidade"))
        if dispensa and states[dispensa["id"]] == "confirmada" and any(
                campo != "aplicabilidade" and states[c["id"]] == "confirmada"
                for (_, campo), c in registros.items()):
            raise ValueError(f"{part['id']}: dispensa contradiz campos vigentes de {bloco}")
        if bloco == "rotas" and len({s for s, _ in registros if s}) > 2:
            raise ValueError(f"{part['id']}: selecione até duas rotas nesta amostra")
    return grupos


def itens_por_componente(data):
    index = defaultdict(list)
    for c in data["afirmacoes"]:
        if c.get("chave", "").startswith("ficha."):
            index[c["origem"]].append(c)
    return index


def ficha(part, claims, states, wik):
    grupos = organizar(part, claims, states)
    secoes = ["## Ficha técnica"]
    pendentes = []
    for bloco, descricao in CATALOGO.items():
        secoes.append("### " + descricao["titulo"])
        registros = grupos.get(bloco, {})
        dispensa = registros.get(("", "aplicabilidade"))
        if dispensa:
            secoes.append(f"Não se aplica · {states[dispensa['id']]} — {dispensa['criterio']} · {wik(dispensa['id'])}")
            if states[dispensa["id"]] == "confirmada":
                continue
        campos = dict(descricao["campos"])
        if bloco == "tarefas" and part["classe"] == "api":
            for nome in ("ttl", "invalidacao"):
                del campos[nome]
            secoes.append("TTL e invalidação da API por método, rota e camada → " + wik("Cache por rota"))
        amostras = sorted({a for a, c in registros if c != "aplicabilidade"}) or [""]
        for amostra in amostras:
            if amostra:
                secoes.append("#### " + amostra)
            faltam, linhas = [], []
            for campo, titulo in campos.items():
                c = registros.get((amostra, campo))
                if not c:
                    faltam.append(titulo)
                    continue
                linhas.append(f"- **{titulo}** — {c['valor']} · {states[c['id']]} · {wik(c['id'])}")
            if linhas:
                secoes.append("\n".join(linhas))
            if faltam:
                secoes.append("A verificar neste recorte: " + "; ".join(faltam) + ".")
                if descricao["titulo"] not in pendentes:
                    pendentes.append(descricao["titulo"])
    return "\n\n".join(secoes), pendentes
