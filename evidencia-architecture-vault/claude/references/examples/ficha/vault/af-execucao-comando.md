---
id: "af-execucao-comando"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.execucao.comando"
valor: "uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --limit-concurrency 80 --timeout-keep-alive 5"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-execucao-comando

[[cmp-api-coletas]] · ficha.execucao.comando = uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --limit-concurrency 80 --timeout-keep-alive 5

## Fundamentação da revisão

O Procfile contém o comando do processo web na configuração didática.

## Evidências desta proposição

- [[ev-execucao-comando-1]] · direta
