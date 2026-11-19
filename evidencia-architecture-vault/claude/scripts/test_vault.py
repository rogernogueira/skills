"""Regressão da regra de confirmação. Execute com python -B scripts/test_vault.py."""
from copy import deepcopy
from datetime import date
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

import vault


class ValidacaoDoGrafo(unittest.TestCase):
    def setUp(self):
        temp = TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base = Path(temp.name)
        demo = vault.ROOT / "references" / "examples" / "laboratorio"
        self.data = vault.read_json(demo / "inventario.json")
        self.path = self.base / "inventario.json"
        shutil.copytree(demo / "provas", self.base / "provas")
        self.day = date(2026, 11, 19)

    def validate(self):
        self.path.write_text(json.dumps(self.data), encoding="utf-8")
        return vault.validated(self.path, self.day)

    def test_mapa_publica_somente_arestas_confirmadas(self):
        target = self.base / "saida"
        bundle = self.validate()
        vault.publish(target, bundle, self.day)
        text = (target / "Mapa.md").read_text(encoding="utf-8")
        chart = text.split("~~~mermaid", 1)[1].split("~~~", 1)[0]
        self.assertEqual(chart.count("-->"), 4)
        self.assertIn('cmp_triagem["cmp-triagem"] -->|consome_de| cmp_coleta', chart)
        self.assertNotIn("carrega_modelo", chart)
        self.assertEqual(bundle[-1]["af-profundidade"], "obsoleta")
        entry, _ = vault.publish(target, bundle, self.day)
        self.assertEqual(entry, target / "Mapa.md")
        entry.write_text("Nota particular", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "pasta de saída nova"):
            vault.publish(target, bundle, self.day)
        self.assertEqual(entry.read_text(encoding="utf-8"), "Nota particular")

    def test_prova_obrigatoria(self):
        del self.data["evidencias"][0]
        with self.assertRaisesRegex(ValueError, "falta evidência"):
            self.validate()

    def test_publica_no_projeto_do_second_brain_e_preserva_revisoes(self):
        root = self.base / "Meu second brain"
        project = root / "Project" / "EvidencIA"
        project.mkdir(parents=True)
        personal = project / "Mapa.md"
        personal.write_bytes(b"Meu mapa pessoal")
        bundle = self.validate()
        first = vault.publish_project(root, bundle, self.day)
        self.assertEqual(first, project / "Arquitetura" / "2026-11-19" / "Mapa.md")
        first.write_bytes(b"Mapa com anotacao pessoal")
        second = vault.publish_project(root, bundle, self.day)
        self.assertEqual(second.parent.name, "2026-11-19-r2")
        self.assertEqual(first.read_bytes(), b"Mapa com anotacao pessoal")
        self.assertEqual(personal.read_bytes(), b"Meu mapa pessoal")
        for note in second.parent.glob("*.md"):
            body = note.read_text(encoding="utf-8")
            for link in re.findall(r"\[\[([^\]]+)\]\]", body):
                dest, label = link.split("|")
                self.assertEqual(root / (dest + ".md"), second.parent / (label + ".md"))
                self.assertTrue((root / (dest + ".md")).is_file())
            for proof in re.findall(r"\]\((\./provas/[^)]+)\)", body):
                self.assertTrue((note.parent / proof).is_file())
        self.assertFalse(list(project.rglob(".obsidian")))

    def test_vault_existente_sem_project(self):
        root = self.base / "Vault"
        root.mkdir()
        result = vault.publish_project(root, self.validate(), self.day)
        self.assertTrue((root / "Project" / "EvidencIA") in result.parents)
        self.assertTrue(result.is_file())

    def test_vault_nao_localizado(self):
        missing = self.base / "nao-existe"
        with self.assertRaisesRegex(ValueError, "vault existente"):
            vault.publish_project(missing, self.validate(), self.day)
        self.assertFalse(missing.exists())

    def test_indicio_insuficiente(self):
        self.data["evidencias"][0]["papel"] = "indicio"
        with self.assertRaisesRegex(ValueError, "sem prova direta"):
            self.validate()

    def test_contradicao_bloqueia_confirmacao(self):
        counter = deepcopy(self.data["evidencias"][0])
        counter.update(id="ev-contra", papel="contraria")
        self.data["evidencias"].append(counter)
        with self.assertRaisesRegex(ValueError, "contestada"):
            self.validate()

    def test_extrato_adulterado(self):
        (self.base / "provas" / "eventos.txt").write_bytes(b"alterado")
        with self.assertRaisesRegex(ValueError, "SHA-256"):
            self.validate()

    def test_localizador_inexistente(self):
        self.data["evidencias"][0]["linha_final"] = 999
        with self.assertRaisesRegex(ValueError, "linhas"):
            self.validate()

    def test_outro_recorte(self):
        self.data["evidencias"][0]["ambiente"] = "ambiente-distinto"
        with self.assertRaisesRegex(ValueError, "recorte"):
            self.validate()

    def test_destino_inexistente(self):
        self.data["afirmacoes"][0]["destino"] = "cmp-ausente"
        with self.assertRaisesRegex(ValueError, "destino ausente"):
            self.validate()

    def test_validade_inclusiva_e_retirada_automatica(self):
        self.day = date(2026, 11, 24)
        self.assertEqual(self.validate()[-1]["af-consumo"], "confirmada")
        self.day = date(2026, 11, 25)
        bundle = self.validate()
        self.assertTrue(all(state == "obsoleta" for state in bundle[-1].values()))
        target = self.base / "revisao"
        vault.publish(target, bundle, self.day)
        self.assertNotIn("-->", (target / "Mapa.md").read_text(encoding="utf-8"))


class CachePorRota(unittest.TestCase):
    def setUp(self):
        temp = TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name)
        demo = vault.ROOT / "references" / "examples" / "cache"
        self.data = vault.read_json(demo / "inventario.json")
        self.path = self.root / "inventario.json"
        self.day = date(2026, 11, 19)
        self.checkouts = self.root / "checkouts"
        shutil.copytree(demo / "fontes", self.checkouts)
        shutil.copytree(demo / "provas", self.root / "provas")

    def validate(self):
        self.path.write_text(json.dumps(self.data), encoding="utf-8")
        return vault.validated(self.path, self.day, self.checkouts)

    def test_sem_referencia_ao_codigo(self):
        del self.data["evidencias"][0]["codigo"]
        with self.assertRaisesRegex(ValueError, "evidência de código"):
            self.validate()

    def test_trecho_incorreto(self):
        self.data["evidencias"][0]["codigo"]["linha_inicial"] += 1
        with self.assertRaisesRegex(ValueError, "difere das linhas"):
            self.validate()

    def test_revisao_diferente(self):
        source = self.checkouts / "evidencia-lab" / "api" / "coletas.py"
        source.write_bytes(source.read_bytes().replace(b"300,", b"500,"))
        with self.assertRaisesRegex(ValueError, "versão do arquivo-fonte diverge"):
            self.validate()

    def test_apenas_testes_nao_confirmam(self):
        for evidence in self.data["evidencias"]:
            evidence["codigo"]["tipo"] = "teste"
        with self.assertRaisesRegex(ValueError, "prova direta na implementação"):
            self.validate()

    def test_metodos_independentes_e_ttl_pendente(self):
        self.data["afirmacoes"] = [c for c in self.data["afirmacoes"] if c["id"] != "af-post-ttl"]
        self.data["evidencias"] = [e for e in self.data["evidencias"] if e["afirmacao"] != "af-post-ttl"]
        target = self.root / "saida"
        vault.publish(target, self.validate(), self.day)
        page = (target / "Cache por rota.md").read_text(encoding="utf-8")
        read, write = page.split("### `POST ")
        self.assertIn("300 segundos", read)
        self.assertNotIn("300 segundos", write)
        self.assertIn("**Tempo de validade (TTL)** — Pendente", write)
        self.assertIn("[[af-get-invalidacao]]", read)
        self.assertFalse((target / "fontes").exists())


class DoisAmbientes(unittest.TestCase):
    def setUp(self):
        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.brain = Path(tmp.name)
        self.day = date(2026, 11, 19)
        examples = vault.ROOT / "references" / "examples"
        self.local = vault.validated(examples / "cache" / "inventario.json", self.day)
        self.prod = vault.validated(examples / "laboratorio" / "inventario.json", self.day)

    def test_indice_com_dois_ambientes_e_fontes_separadas(self):
        records = {"desenvolvimento-local": [self.local], "producao-remota": [self.prod]}
        entry, questions = vault.publish_environments(self.brain, records, self.day)
        self.assertEqual(entry.relative_to(self.brain).as_posix(), "Project/EvidencIA/Arquitetura/2026-11-19/Ambientes.md")
        for p in entry.parent.rglob("*.md"):
            for ref in re.findall(r"\[\[([^\]]+)\]\]", p.read_text(encoding="utf-8")):
                file = self.brain / (ref.split("|")[0] + ".md")
                self.assertTrue(file.is_file(), ref)
                if p != entry:
                    self.assertEqual(file.parent, p.parent)
        self.assertTrue(any("Produção remota" in q and "af-replicas" in q for q in questions))

    def test_producao_inacessivel_e_lacuna_local(self):
        self.local[0]["pendencias"] = [{"item": "Runtime", "motivo": "Inventário parcial", "pergunta": "Qual é a revisão local?"}]
        entry, questions = vault.publish_environments(self.brain, {"desenvolvimento-local": [self.local], "producao-remota": []}, self.day)
        self.assertIn("Produção remota\n\nColeta pendente.", entry.read_text(encoding="utf-8"))
        self.assertFalse((entry.parent / "producao-remota").exists())
        self.assertTrue(any("produção remota?" in q for q in questions))
        self.assertTrue(any("Qual é a revisão local?" in q for q in questions))

    def test_inventario_local_nao_pode_ser_apresentado_como_producao(self):
        with self.assertRaisesRegex(ValueError, "contexto_infra"):
            vault.publish_environments(self.brain, {"desenvolvimento-local": [], "producao-remota": [self.local]}, self.day)
        self.assertFalse(list(self.brain.rglob("Ambientes.md")))


class FichaDoArtefato(unittest.TestCase):
    def setUp(self):
        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        demo = vault.ROOT / "references" / "examples" / "ficha"
        self.data = vault.read_json(demo / "inventario.json")
        shutil.copytree(demo / "provas", self.root / "provas")
        self.day = date(2026, 11, 19)

    def validate(self):
        path = self.root / "inventario.json"
        path.write_text(json.dumps(self.data), encoding="utf-8")
        return vault.validated(path, self.day)

    def test_rota_rastreavel_e_dispensa_somente_no_worker(self):
        folder = self.root / "vault"
        vault.publish(folder, self.validate(), self.day)
        api = (folder / "cmp-api-coletas.md").read_text(encoding="utf-8")
        self.assertIn("#### listar-coletas", api)
        self.assertIn("[[af-rotas-listar-coletas-operacao]]", api)
        self.assertIn("[[Cache por rota]]", api)
        worker = (folder / "cmp-worker-coletas.md").read_text(encoding="utf-8")
        routes = worker.split("### Amostra de rotas, serviços e schemas")[1].split("### ")[0]
        self.assertIn("[[af-worker-rotas-aplicabilidade]]", routes)
        self.assertNotIn("A verificar", routes)

    def test_flag_nao_prova_workers_ativos(self):
        c = next(c for c in self.data["afirmacoes"] if c["chave"].endswith("workers_configurados"))
        c["chave"] = "ficha.execucao.workers_observados"
        with self.assertRaisesRegex(ValueError, "exigem observação"):
            self.validate()

    def test_dispensa_vencida_reabre_verificacao(self):
        self.day = date(2026, 12, 20)
        folder = self.root / "revisao"
        vault.publish(folder, self.validate(), self.day)
        worker = (folder / "cmp-worker-coletas.md").read_text(encoding="utf-8")
        routes = worker.split("### Amostra de rotas, serviços e schemas")[1].split("### ")[0]
        self.assertIn("obsoleta", routes)
        self.assertIn("A verificar", routes)


class AceitacaoDaPublicacao(unittest.TestCase):
    def setUp(self):
        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.brain = self.root / "Segundo cérebro"
        self.brain.mkdir()
        self.examples = vault.ROOT / "references" / "examples"
        self.manual = self.examples / "manual" / "inventario.json"
        self.prod = self.examples / "laboratorio" / "inventario.json"

    def command(self, action, *args):
        return [sys.executable, "-B", "-X", "utf8", str(vault.ROOT / "scripts" / "vault.py"),
                action, *map(str, args), "--data", "2026-11-19"]

    def invoke(self, action, *args, status=0):
        result = subprocess.run(self.command(action, *args), capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(result.returncode, status, result.stderr)
        return result

    def copy_input(self, name, demo):
        base = self.root / name
        source = self.examples / demo
        shutil.copytree(source / "provas", base / "provas")
        return base / "inventario.json", vault.read_json(source / "inventario.json")

    def test_pergunta_explicita_preservada_nos_dois_modos_inclusive_reuso(self):
        source, data = self.copy_input("individual", "manual")
        question = "Qual release está vinculada ao serviço XYZ?"
        data.update(contexto_infra="desenvolvimento-local",
                    pendencias=[{"item": "Release", "motivo": "Coleta parcial", "pergunta": question}])
        source.write_text(json.dumps(data), encoding="utf-8")
        for action, args in [("gerar", (source, self.root / "exportacao")),
                             ("gerar", (source, "--vault", self.brain)),
                             ("gerar-ambientes", ("--local", source, "--vault", self.brain))]:
            first = self.invoke(action, *args)
            entry = Path(first.stdout.splitlines()[0])
            self.assertIn(question, entry.read_text(encoding="utf-8"))
            again = self.invoke(action, *args)
            self.assertEqual(first.stdout, again.stdout)
            self.assertIn(question, again.stdout)

    def test_cache_nao_cruza_duas_revisoes_do_mesmo_ambiente(self):
        paths = []
        for name, omit in [("um", "ttl"), ("dois", "invalidacao")]:
            p, data = self.copy_input(name, "cache")
            data["afirmacoes"] = [c for c in data["afirmacoes"] if c.get("campo") != omit]
            ids = {c["id"] for c in data["afirmacoes"]}
            data["evidencias"] = [e for e in data["evidencias"] if e["afirmacao"] in ids]
            p.write_text(json.dumps(data), encoding="utf-8")
            paths.append(p)
        result = self.invoke("gerar-ambientes", "--vault", self.brain, "--local", paths[0], "--local", paths[1],
                             "--fontes-local", self.examples / "cache" / "fontes")
        entry = Path(result.stdout.splitlines()[0])
        for text in [entry.read_text(encoding="utf-8"), result.stdout]:
            route_questions = [s for s in text.splitlines() if "GET /" in s]
            self.assertTrue(any("recorte 1" in s and "TTL" in s and "invalidação" not in s for s in route_questions))
            self.assertTrue(any("recorte 2" in s and "invalidação" in s and "TTL" not in s for s in route_questions))

    def test_isola_rejeicoes_entre_e_dentro_dos_ambientes(self):
        bad, data = self.copy_input("falha", "laboratorio")
        data["evidencias"][0]["sha256"] = "0" * 64
        bad.write_text(json.dumps(data), encoding="utf-8")
        args = ("--vault", self.brain, "--local", self.examples / "cache" / "inventario.json",
                "--producao", bad, "--producao", self.prod)
        result = self.invoke("gerar-ambientes", *args, status=3)
        index = Path(result.stdout.splitlines()[0])
        text = index.read_text(encoding="utf-8")
        self.assertIn("Publicação parcial", text)
        self.assertIn("Recorte 1 rejeitado", text)
        self.assertIn("hash desta coleta?", text)
        self.assertNotIn(str(self.root), text)
        self.assertFalse((index.parent / "producao-remota" / "1-observado").exists())
        self.assertTrue((index.parent / "producao-remota" / "2-observado" / "Mapa.md").is_file())
        self.assertTrue((index.parent / "desenvolvimento-local" / "1-configurado" / "Mapa.md").is_file())
        self.assertEqual(self.invoke("gerar-ambientes", *args, status=3).stdout, result.stdout)
        only_bad = self.invoke("gerar-ambientes", "--vault", self.brain, "--producao", bad, status=1)
        self.assertIn("rejeitados", only_bad.stderr)
        self.assertEqual(len(list(self.brain.rglob("Ambientes.md"))), 1)

    def test_repeticao_concorrente_e_revisao_intencional(self):
        args = ("--vault", self.brain, "--producao", self.prod)
        processes = [subprocess.Popen(self.command("gerar-ambientes", *args), stdout=subprocess.PIPE,
                                      stderr=subprocess.PIPE, text=True, encoding="utf-8") for _ in range(3)]
        results = [process.communicate(timeout=45) for process in processes]
        outputs = [out for out, _ in results]
        for process, (_, err) in zip(processes, results):
            self.assertEqual(process.returncode, 0, err)
        self.assertEqual(len(set(outputs)), 1)
        self.assertEqual(len(list(self.brain.rglob("Ambientes.md"))), 1)
        forced = self.invoke("gerar-ambientes", *args, "--nova-revisao")
        self.assertEqual(Path(forced.stdout.splitlines()[0]).parent.name, "2026-11-19-r2")
        self.assertEqual(self.invoke("gerar-ambientes", *args).stdout, forced.stdout)

    def test_snapshot_legado_e_prova_adulterada_apos_publicacao(self):
        archive = self.brain / "Project" / "EvidencIA" / "Arquitetura" / "2026-11-19"
        archive.mkdir(parents=True)
        (archive / "Mapa.md").write_bytes(b"Fotografia antiga")
        source, data = self.copy_input("auditado", "manual")
        source.write_text(json.dumps(data), encoding="utf-8")
        args = (source, "--vault", self.brain)
        first = self.invoke("gerar", *args)
        self.assertEqual(Path(first.stdout.splitlines()[0]).parent.name, "2026-11-19-r2")
        self.assertEqual(first.stdout, self.invoke("gerar", *args).stdout)
        forced = self.invoke("gerar", *args, "--nova-revisao")
        self.assertEqual(Path(forced.stdout.splitlines()[0]).parent.name, "2026-11-19-r3")
        proof = source.parent / data["evidencias"][0]["arquivo"]
        proof.write_bytes(proof.read_bytes() + b"alterado")
        failure = self.invoke("gerar", *args, status=1)
        self.assertIn("SHA-256", failure.stderr)
        self.assertEqual(len(list(self.brain.rglob("Mapa.md"))), 3)
        self.assertEqual((archive / "Mapa.md").read_bytes(), b"Fotografia antiga")

    def test_entrada_alterada_e_duas_publicacoes_distintas_em_paralelo(self):
        path, data = self.copy_input("alterada", "manual")
        data["ambiente"] += " outra implantação"
        for ev in data["evidencias"]:
            ev["ambiente"] = data["ambiente"]
        path.write_text(json.dumps(data), encoding="utf-8")
        procs = [subprocess.Popen(self.command("gerar", p, "--vault", self.brain),
                                  stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
                 for p in (self.manual, path)]
        results = [proc.communicate(timeout=45) for proc in procs]
        for proc, (_, err) in zip(procs, results):
            self.assertEqual(proc.returncode, 0, err)
        entries = [Path(out.splitlines()[0]) for out, _ in results]
        self.assertNotEqual(*entries)
        for p, entry in zip((self.manual, path), entries):
            repeated = self.invoke("gerar", p, "--vault", self.brain)
            self.assertEqual(str(entry), repeated.stdout.splitlines()[0])


if __name__ == "__main__":
    unittest.main()
