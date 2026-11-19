---
id: "ev-http-timeouts-1"
afirmacao: "[[af-http-timeouts]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/app.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de app.py distribuído como entrada.txt, linhas 4–4"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/entrada.txt"
sha256: "3dd3f85291e3ff6a3934e4c529d07e46c82a2764aed25cd251ba750a9f89c3d9"
linha_inicial: 4
linha_final: 4
---
# ev-http-timeouts-1

O construtor do cliente define o objeto Timeout no ponto de criação.

## Trecho verificado

~~~text
    async with httpx.AsyncClient(timeout=httpx.Timeout(5.0, connect=1.0)) as client:
~~~

[Arquivo sanitizado completo](provas/entrada.txt)
