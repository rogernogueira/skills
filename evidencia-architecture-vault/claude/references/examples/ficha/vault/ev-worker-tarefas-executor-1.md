---
id: "ev-worker-tarefas-executor-1"
afirmacao: "[[af-worker-tarefas-executor]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/worker.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de worker.py distribuído como worker.txt, linhas 2–10"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/worker.txt"
sha256: "b14d8652fc480b4dbef89c4e1c540c4fecb25674fb165d57a1dc62732a8aa83c"
linha_inicial: 2
linha_final: 10
---
# ev-worker-tarefas-executor-1

WorkerSettings registra a função e o executável chama run_worker com essa configuração.

## Trecho verificado

~~~text
from arq import run_worker
from tarefas import processar_coleta

class WorkerSettings:
    functions = [processar_coleta]
    queue_name = "coletas"

if __name__ == "__main__":
    run_worker(WorkerSettings)
~~~

[Arquivo sanitizado completo](provas/worker.txt)
