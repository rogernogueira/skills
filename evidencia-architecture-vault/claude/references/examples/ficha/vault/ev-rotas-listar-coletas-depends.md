---
id: "ev-rotas-listar-coletas-depends"
afirmacao: "[[af-rotas-listar-coletas-depends]]"
papel: "direta"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
fonte: "Fixture de revisão de API e serviço"
origem_dado: "ficha-lab/coletas.py"
metodo: "Leitura do trecho sanitizado fornecido na revisão didática"
localizador: "Trecho de coletas.py distribuído como rota.txt, linhas 2–3"
versao_fonte: "ficha-lab-v1"
coletado_por: "revisor do exemplo"
coletado_em: "2026-11-19T12:00:00Z"
transformacao: "Trecho sintético distribuído em UTF-8. Numeração relativa ao extrato."
arquivo: "provas/rota.txt"
sha256: "3d66d07fc870779e4f5dba57a79c875363fc027991333009a38ca41c7a3bbd9f"
linha_inicial: 2
linha_final: 3
---
# ev-rotas-listar-coletas-depends

Os parâmetros usuario e db resolvem dependências distintas. O mecanismo de validação da identidade precisa de fonte adicional.

## Trecho verificado

~~~text
@router.get("/repositorios/{id}/coletas", response_model=list[ColetaSaida])
async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db)):
~~~

[Arquivo sanitizado completo](provas/rota.txt)
