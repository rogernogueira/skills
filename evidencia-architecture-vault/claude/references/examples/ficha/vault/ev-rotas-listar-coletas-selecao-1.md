---
id: "ev-rotas-listar-coletas-selecao-1"
afirmacao: "[[af-rotas-listar-coletas-selecao]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/coletas.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de coletas.py distribuído como rota.txt, linhas 2–5"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/rota.txt"
sha256: "3d66d07fc870779e4f5dba57a79c875363fc027991333009a38ca41c7a3bbd9f"
linha_inicial: 2
linha_final: 5
---
# ev-rotas-listar-coletas-selecao-1

O handler liga a consulta ao repositório solicitado. A seleção é funcional; não houve medição de lentidão.

## Trecho verificado

~~~text
@router.get("/repositorios/{id}/coletas", response_model=list[ColetaSaida])
async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db)):
    await exigir_acesso_ao_repositorio(usuario, id, db)
    return await consultas.listar_por_repositorio(db, id)
~~~

[Arquivo sanitizado completo](provas/rota.txt)
