"""Publicação local serializada e recuperação de fotografias íntegras."""
import hashlib
import json
import re
import sqlite3
import tempfile
from contextlib import closing, contextmanager
from pathlib import Path

MANIFESTO = ".publicacao.json"


def digest(value):
    raw = json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


@contextmanager
def escritor(pasta):
    pasta.mkdir(parents=True, exist_ok=True)
    lock = pasta / ".evidencia-publicacao.sqlite3"
    if lock.resolve() != pasta.resolve() / lock.name:
        raise ValueError("Local de coordenação redirecionado")
    try:
        with closing(sqlite3.connect(str(lock), timeout=30)) as db:
            db.execute("BEGIN IMMEDIATE")
            yield
    except sqlite3.Error as exc:
        raise ValueError("Não foi possível reservar a publicação. Confira a pasta e tente novamente.") from exc


def reutilizar(pasta, chave, entrada):
    manifesto = pasta / MANIFESTO
    if pasta.is_symlink() or not manifesto.is_file() or manifesto.is_symlink():
        return None
    try:
        m = json.loads(manifesto.read_text(encoding="utf-8"))
        if m["chave"] != chave or entrada not in m["arquivos"]:
            return None
        for nome, esperado in m["arquivos"].items():
            arquivo = pasta / nome
            if (not arquivo.resolve().is_relative_to(pasta.resolve()) or
                    not arquivo.is_file() or hashlib.sha256(arquivo.read_bytes()).hexdigest() != esperado):
                return None
        perguntas = m["perguntas"]
        if isinstance(perguntas, list) and all(isinstance(p, str) for p in perguntas):
            return perguntas
    except (OSError, ValueError, KeyError, TypeError, AttributeError):
        pass
    return None


def gravar(destino, chave, construir):
    with tempfile.TemporaryDirectory(dir=destino.parent, prefix=".evidencia-") as tmp:
        pronta = Path(tmp) / "fotografia"
        pronta.mkdir()
        perguntas = construir(pronta, destino)
        arquivos = {p.relative_to(pronta).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in pronta.rglob("*") if p.is_file()}
        manifesto = {"chave": chave, "arquivos": arquivos, "perguntas": perguntas}
        (pronta / MANIFESTO).write_text(json.dumps(manifesto, ensure_ascii=False, indent=2), encoding="utf-8")
        if destino.exists() or destino.is_symlink():
            raise ValueError(f"Destino ocupado durante a geração: {destino}")
        pronta.rename(destino)
    return perguntas


def publicar(pasta, nome, entrada, chave, construir, *, datada, nova=False):
    """Escolhe, verifica e publica sob a mesma reserva. Pastas antigas são preservadas."""
    with escritor(pasta):
        if datada:
            padrao = re.compile(re.escape(nome) + r"(?:-r([1-9][0-9]*))?$")
            revisoes = []
            for p in pasta.iterdir():
                match = padrao.fullmatch(p.name)
                if match:
                    revisoes.append((int(match.group(1) or 1), p))
            revisoes.sort(reverse=True)
            if not nova:
                for _, p in revisoes:
                    perguntas = reutilizar(p, chave, entrada)
                    if perguntas is not None:
                        return p / entrada, perguntas
            numero = revisoes[0][0] + 1 if revisoes else 1
            destino = pasta / (nome if numero == 1 else f"{nome}-r{numero}")
        else:
            destino = pasta / nome
            if destino.exists() or destino.is_symlink():
                perguntas = reutilizar(destino, chave, entrada)
                if perguntas is not None:
                    return destino / entrada, perguntas
                raise ValueError(f"Use uma pasta de saída nova: {destino}")
        return destino / entrada, gravar(destino, chave, construir)
