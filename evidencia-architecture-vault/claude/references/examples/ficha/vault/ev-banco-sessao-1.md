---
id: "ev-banco-sessao-1"
afirmacao: "[[af-banco-sessao]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/database.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de database.py distribuído como dados.txt, linhas 3–7"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/dados.txt"
sha256: "12a6d2249ad462ac57731218a17101ea4dd61725cdd453ff2f5a54aecb7dc042"
linha_inicial: 3
linha_final: 7
---
# ev-banco-sessao-1

A fábrica cria a sessão e o bloco controla o encerramento.

## Trecho verificado

~~~text
sessoes = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with sessoes() as sessao:
        yield sessao
~~~

[Arquivo sanitizado completo](provas/dados.txt)
