---
id: "af-get-ttl"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "300 segundos a partir da leitura do relógio no preenchimento. Acertos preservam o vencimento."
metodo_http: "GET"
rota: "/v1/repositorios/{id}/coletas"
camada: "aplicacao"
campo: "ttl"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-get-ttl

[[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — 300 segundos a partir da leitura do relógio no preenchimento. Acertos preservam o vencimento.

## Fundamentação da revisão

O relógio monotônico usa segundos. A função soma 300 e exige que o instante atual seja anterior ao vencimento. Rever após alteração do arquivo ou em 30 dias.

## Evidências desta proposição

- [[ev-get-ttl-relogio]] · direta
- [[ev-get-ttl-prazo]] · direta
- [[ev-get-ttl-rota]] · direta
