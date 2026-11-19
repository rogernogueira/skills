---
id: "ev-post-invalidacao-resposta"
afirmacao: "[[af-post-invalidacao]]"
papel: "direta"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
fonte: "Código Python de demonstração"
origem_dado: "evidencia-lab/api/coletas.py"
metodo: "Leitura local da revisão identificada pelo SHA-256"
localizador: "api/coletas.py, linhas 18–21"
versao_fonte: "sha256:94780a5c2572bf8de3f620bff01910625c3e51a502576ffaf5ebc87de75e854c"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Cópia do pequeno arquivo didático em UTF-8, limitada à implementação sintética."
arquivo: "provas/coletas.txt"
sha256: "94780a5c2572bf8de3f620bff01910625c3e51a502576ffaf5ebc87de75e854c"
linha_inicial: 18
linha_final: 21
codigo_repositorio: "evidencia-lab"
codigo_caminho: "api/coletas.py"
codigo_linha_inicial: 18
codigo_linha_final: 21
codigo_tipo: "implementacao"
---
# ev-post-invalidacao-resposta

A função usa a mesma chave repo na escrita da origem e na remoção da lista. A tabela de rotas identifica a operação de escrita.

## Trecho verificado

~~~text
def registrar(repo, coleta):
    ORIGEM.setdefault(repo, []).append(coleta)
    CACHE.pop(repo, None)
    return "registrada"
~~~

[Arquivo sanitizado completo](provas/coletas.txt)
