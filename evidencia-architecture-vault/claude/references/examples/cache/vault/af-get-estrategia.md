---
id: "af-get-estrategia"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "Cache-aside em memória, com uma entrada por repositório."
metodo_http: "GET"
rota: "/v1/repositorios/{id}/coletas"
camada: "aplicacao"
campo: "estrategia"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-get-estrategia

[[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Cache-aside em memória, com uma entrada por repositório.

## Fundamentação da revisão

O dicionário CACHE pertence ao processo. Na falta de uma entrada vigente, listar lê ORIGEM e preenche o cache. Rever após alteração do arquivo ou em 30 dias.

## Evidências desta proposição

- [[ev-get-estrategia-estrutura]] · direta
- [[ev-get-estrategia-fluxo]] · direta
- [[ev-get-estrategia-rota]] · direta
