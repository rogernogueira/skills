---
id: "af-post-uso"
tipo: "cache_rota"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: null
valor: "A resposta da operação de escrita é devolvida diretamente."
metodo_http: "POST"
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
# af-post-uso

[[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — A resposta da operação de escrita é devolvida diretamente.

## Fundamentação da revisão

O handler devolve a confirmação após a gravação. Sua única operação no cache remove a entrada da lista. Rever após alteração do arquivo ou em 30 dias.

## Evidências desta proposição

- [[ev-post-uso-resposta]] · direta
- [[ev-post-uso-rota]] · direta
