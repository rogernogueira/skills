---
id: "af-http-timeouts"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.http.timeouts"
valor: "httpx.Timeout(5.0, connect=1.0) configura timeout padrão de 5 s e conexão de 1 s."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-http-timeouts

[[cmp-api-coletas]] · ficha.http.timeouts = httpx.Timeout(5.0, connect=1.0) configura timeout padrão de 5 s e conexão de 1 s.

## Fundamentação da revisão

O construtor do cliente define o objeto Timeout no ponto de criação.

## Evidências desta proposição

- [[ev-http-timeouts-1]] · direta
