---
id: "af-post-invalidacao"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "O POST invalida a lista do GET para o repositório alterado após gravar a coleta."
metodo_http: "POST"
rota: "/v1/repositorios/{id}/coletas"
camada: "aplicacao"
campo: "invalidacao"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-post-invalidacao

[[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — O POST invalida a lista do GET para o repositório alterado após gravar a coleta.

## Fundamentação da revisão

A função usa a mesma chave repo na escrita da origem e na remoção da lista. A tabela de rotas identifica a operação de escrita.

## Evidências desta proposição

- [[ev-post-invalidacao-resposta]] · direta
- [[ev-post-invalidacao-rota]] · direta
