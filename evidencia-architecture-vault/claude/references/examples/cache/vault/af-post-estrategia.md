---
id: "af-post-estrategia"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "Resposta direta após a gravação, sem preencher o cache da resposta POST."
metodo_http: "POST"
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
# af-post-estrategia

[[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Resposta direta após a gravação, sem preencher o cache da resposta POST.

## Fundamentação da revisão

O handler realiza a escrita, remove a chave da lista e devolve a confirmação diretamente.

## Evidências desta proposição

- [[ev-post-estrategia-resposta]] · direta
- [[ev-post-estrategia-rota]] · direta
