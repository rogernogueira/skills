---
id: "af-get-invalidacao"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "Após registrar uma coleta via POST, remover a entrada da lista do mesmo repositório."
metodo_http: "GET"
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
# af-get-invalidacao

[[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — Após registrar uma coleta via POST, remover a entrada da lista do mesmo repositório.

## Fundamentação da revisão

A mutação da origem antecede a remoção da chave usada pela leitura. A próxima consulta volta à origem. Rever após alteração do arquivo ou em 30 dias.

## Evidências desta proposição

- [[ev-get-invalidacao-leitura]] · direta
- [[ev-get-invalidacao-escrita]] · direta
- [[ev-get-invalidacao-rota]] · direta
