"""Verifica o ZIP que o Claude entrega para importação no Obsidian."""
from datetime import date
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import zipfile

from exportar_obsidian import exportar
import vault


class EntregaClaude(unittest.TestCase):
    def setUp(self):
        tmp = TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.brain = Path(tmp.name) / "Vault"
        self.brain.mkdir()
        day = date(2026, 11, 19)
        data = vault.validated(vault.ROOT / "references/examples/cache/inventario.json", day)
        self.entry, _ = vault.publish_environments(self.brain, {"desenvolvimento-local": [data], "producao-remota": []}, day)
        self.out = self.brain.parent / "EvidencIA-Obsidian.zip"

    def test_preserva_estrutura_e_exclui_arquivos_pessoais(self):
        (self.entry.parent / "pessoal.md").write_bytes(b"pessoal")
        exportar(self.entry, self.out)
        with zipfile.ZipFile(self.out) as z:
            prefix = self.entry.parent.relative_to(self.brain).as_posix() + "/"
            self.assertTrue(all(n.startswith(prefix) for n in z.namelist()))
            self.assertEqual(z.read(prefix + self.entry.name), self.entry.read_bytes())
            self.assertIn(prefix + ".publicacao.json", z.namelist())
            self.assertFalse(any("pessoal.md" in n or n.endswith(".sqlite3") for n in z.namelist()))

    def test_exige_fotografia_integra(self):
        self.entry.write_bytes(b"alterada")
        with self.assertRaisesRegex(ValueError, "Hash divergente"):
            exportar(self.entry, self.out)
        self.assertFalse(self.out.exists())

    def test_preserva_zip_existente(self):
        self.out.write_bytes(b"meu arquivo")
        with self.assertRaises(FileExistsError):
            exportar(self.entry, self.out)
        self.assertEqual(self.out.read_bytes(), b"meu arquivo")


if __name__ == "__main__":
    unittest.main()
