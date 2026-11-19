---
id: "ev-get-ttl-prazo"
afirmacao: "[[af-get-ttl]]"
papel: "direta"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
fonte: "Código Python de demonstração"
origem_dado: "evidencia-lab/api/coletas.py"
metodo: "Leitura local da revisão identificada pelo SHA-256"
localizador: "api/coletas.py, linhas 8–15"
versao_fonte: "sha256:94780a5c2572bf8de3f620bff01910625c3e51a502576ffaf5ebc87de75e854c"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Cópia do pequeno arquivo didático em UTF-8, limitada à implementação sintética."
arquivo: "provas/coletas.txt"
sha256: "94780a5c2572bf8de3f620bff01910625c3e51a502576ffaf5ebc87de75e854c"
linha_inicial: 8
linha_final: 15
codigo_repositorio: "evidencia-lab"
codigo_caminho: "api/coletas.py"
codigo_linha_inicial: 8
codigo_linha_final: 15
codigo_tipo: "implementacao"
---
# ev-get-ttl-prazo

A comparação usa a data de expiração da entrada. Somente o preenchimento define uma nova expiração.

## Trecho verificado

~~~text
def listar(repo):
    agora = monotonic()
    entrada = CACHE.get(repo)
    if entrada is not None and agora < entrada[0]:
        return entrada[1]
    registros = tuple(ORIGEM.get(repo, ()))
    CACHE[repo] = (agora + 300, registros)
    return registros
~~~

[Arquivo sanitizado completo](provas/coletas.txt)
