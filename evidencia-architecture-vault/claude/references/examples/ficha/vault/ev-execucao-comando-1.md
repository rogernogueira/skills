---
id: "ev-execucao-comando-1"
afirmacao: "[[af-execucao-comando]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/Procfile"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de Procfile distribuído como inicio.txt, linhas 2–2"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/inicio.txt"
sha256: "2bb5fe8b262d7336e9d33ad981abfff5c1103545b0a4bff7e1a9197e8ad72d50"
linha_inicial: 2
linha_final: 2
---
# ev-execucao-comando-1

O Procfile contém o comando do processo web na configuração didática.

## Trecho verificado

~~~text
web: uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --limit-concurrency 80 --timeout-keep-alive 5
~~~

[Arquivo sanitizado completo](provas/inicio.txt)
