---
id: "ev-banco-pool-1"
afirmacao: "[[af-banco-pool]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/database.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de database.py distribuído como dados.txt, linhas 2–2"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/dados.txt"
sha256: "12a6d2249ad462ac57731218a17101ea4dd61725cdd453ff2f5a54aecb7dc042"
linha_inicial: 2
linha_final: 2
---
# ev-banco-pool-1

Os argumentos são explícitos no construtor da engine. O trecho não mede conexões abertas.

## Trecho verificado

~~~text
engine = create_async_engine(settings.db_url, pool_size=4, max_overflow=2)
~~~

[Arquivo sanitizado completo](provas/dados.txt)
