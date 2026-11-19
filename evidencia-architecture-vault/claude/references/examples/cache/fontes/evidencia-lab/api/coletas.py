"""API mínima de coletas do laboratório fictício do EvidencIA."""
from time import monotonic

ORIGEM = {}
CACHE = {}


def listar(repo):
    agora = monotonic()
    entrada = CACHE.get(repo)
    if entrada is not None and agora < entrada[0]:
        return entrada[1]
    registros = tuple(ORIGEM.get(repo, ()))
    CACHE[repo] = (agora + 300, registros)
    return registros


def registrar(repo, coleta):
    ORIGEM.setdefault(repo, []).append(coleta)
    CACHE.pop(repo, None)
    return "registrada"


ROTAS = {
    ("GET", "/v1/repositorios/{id}/coletas"): listar,
    ("POST", "/v1/repositorios/{id}/coletas"): registrar,
}
