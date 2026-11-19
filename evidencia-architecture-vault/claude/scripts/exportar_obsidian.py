"""Prepara uma fotografia gerada pelo EvidencIA para download no Claude.ai."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath, PureWindowsPath
import re
import shutil
import sys
import tempfile
import zipfile


def exportar(nota, destino):
    nota = nota.resolve(strict=True)
    pasta = nota.parent
    if (nota.name not in {"Ambientes.md", "Mapa.md"} or
            pasta.parent.parts[-3:] != ("Project", "EvidencIA", "Arquitetura") or
            not re.fullmatch(r"\d{4}-\d{2}-\d{2}(?:-r[1-9]\d*)?", pasta.name)):
        raise ValueError("Informe a nota de entrada da fotografia publicada em Project/EvidencIA/Arquitetura.")
    manifesto = pasta / ".publicacao.json"
    if manifesto.is_symlink():
        raise ValueError("Manifesto redirecionado.")
    raw = manifesto.read_bytes()
    registro = json.loads(raw)
    arquivos = registro.get("arquivos") if isinstance(registro, dict) else None
    if not isinstance(arquivos, dict) or nota.name not in arquivos:
        raise ValueError("Manifesto incompleto. Gere novamente a fotografia.")
    destino = destino.absolute()
    if destino.suffix.lower() != ".zip" or destino.resolve().is_relative_to(pasta):
        raise ValueError("Escolha um ZIP novo fora da fotografia.")
    prefixo = PurePosixPath("Project/EvidencIA/Arquitetura", pasta.name)
    with tempfile.TemporaryFile() as tmp:
        with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as z:
            for nome, esperado in sorted(arquivos.items()):
                if (not nome or nome == manifesto.name or "\\" in nome or PureWindowsPath(nome).drive
                        or any(p in {"", ".", ".."} for p in nome.split("/"))):
                    raise ValueError("Nome de arquivo inválido no manifesto.")
                arquivo = pasta / nome
                if arquivo.resolve() != arquivo:
                    raise ValueError("Arquivo gerado redirecionado. Confira a fotografia.")
                dados = arquivo.read_bytes()
                if hashlib.sha256(dados).hexdigest() != esperado:
                    raise ValueError(f"Hash divergente em {nome}. Gere novamente a fotografia.")
                z.writestr(str(prefixo / nome), dados)
            z.writestr(str(prefixo / manifesto.name), raw)
        tmp.seek(0)
        with destino.open("xb") as saida:
            try:
                shutil.copyfileobj(tmp, saida)
                saida.flush()
            except OSError:
                saida.close()
                destino.unlink()
                raise
    return destino


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("nota", type=Path)
    cli.add_argument("destino", type=Path)
    args = cli.parse_args()
    try:
        print(exportar(args.nota, args.destino))
    except (OSError, ValueError) as exc:
        sys.exit(f"Erro: {exc}")
