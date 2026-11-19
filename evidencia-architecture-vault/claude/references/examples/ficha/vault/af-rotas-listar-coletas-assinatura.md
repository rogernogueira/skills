---
id: "af-rotas-listar-coletas-assinatura"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.rotas.listar-coletas.assinatura"
valor: "async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db))."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-rotas-listar-coletas-assinatura

[[cmp-api-coletas]] · ficha.rotas.listar-coletas.assinatura = async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db)).

## Fundamentação da revisão

O decorator associa o handler assíncrono ao método e ao caminho.

## Evidências desta proposição

- [[ev-rotas-listar-coletas-assinatura-1]] · direta
