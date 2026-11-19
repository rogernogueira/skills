---
id: "af-post-ttl"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "Não se aplica à resposta POST nesta camada."
metodo_http: "POST"
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
# af-post-ttl

[[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — Não se aplica à resposta POST nesta camada.

## Fundamentação da revisão

O único acesso ao cache pelo handler é a remoção de uma chave. O retorno literal não cria uma entrada com vencimento.

## Evidências desta proposição

- [[ev-post-ttl-resposta]] · direta
- [[ev-post-ttl-rota]] · direta
