---
id: "af-worker-tarefas-executor"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-worker-coletas]]"
relacao: null
destino: null
chave: "ficha.tarefas.executor"
valor: "Worker ARQ para a função processar_coleta."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-worker-tarefas-executor

[[cmp-worker-coletas]] · ficha.tarefas.executor = Worker ARQ para a função processar_coleta.

## Fundamentação da revisão

WorkerSettings registra a função e o executável chama run_worker com essa configuração.

## Evidências desta proposição

- [[ev-worker-tarefas-executor-1]] · direta
