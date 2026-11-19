---
id: "af-get-uso"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "Ativo na leitura da lista por repositório."
metodo_http: "GET"
rota: "/v1/repositorios/{id}/coletas"
camada: "aplicacao"
campo: "uso"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-get-uso

[[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — Ativo na leitura da lista por repositório.

## Fundamentação da revisão

O handler lê a entrada indexada pelo repositório antes de consultar a origem. Rever após alteração do arquivo ou em 30 dias.

## Evidências desta proposição

- [[ev-get-uso-leitura]] · direta
- [[ev-get-uso-rota]] · direta
