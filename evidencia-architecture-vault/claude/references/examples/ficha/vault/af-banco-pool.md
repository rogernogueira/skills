---
id: "af-banco-pool"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.banco.pool"
valor: "Pool configurado com tamanho 4 e overflow máximo 2 por instância de engine."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-banco-pool

[[cmp-api-coletas]] · ficha.banco.pool = Pool configurado com tamanho 4 e overflow máximo 2 por instância de engine.

## Fundamentação da revisão

Os argumentos são explícitos no construtor da engine. O trecho não mede conexões abertas.

## Evidências desta proposição

- [[ev-banco-pool-1]] · direta
