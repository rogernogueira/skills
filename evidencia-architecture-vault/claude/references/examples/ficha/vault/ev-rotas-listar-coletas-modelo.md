---
id: "ev-rotas-listar-coletas-modelo"
afirmacao: "[[af-rotas-listar-coletas-modelo]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/consultas.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de consultas.py distribuído como consulta.txt, linhas 2–4"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/consulta.txt"
sha256: "9ac669346ccb8f4d243bb5c4b175a7771ec28600131ee657b94bda6add5d548c"
linha_inicial: 2
linha_final: 4
---
# ev-rotas-listar-coletas-modelo

O trecho mostra o modelo consultado e o filtro. A definição da tabela precisa de fonte adicional.

## Trecho verificado

~~~text
async def listar_por_repositorio(db, repo_id):
    stmt = select(Coleta).where(Coleta.repositorio_id == repo_id)
    return (await db.scalars(stmt)).all()
~~~

[Arquivo sanitizado completo](provas/consulta.txt)
