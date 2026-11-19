---
id: "af-rotas-listar-coletas-depends"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.rotas.listar-coletas.depends"
valor: "Depends(get_current_user) e Depends(get_db) na assinatura da rota."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-rotas-listar-coletas-depends

[[cmp-api-coletas]] · ficha.rotas.listar-coletas.depends = Depends(get_current_user) e Depends(get_db) na assinatura da rota.

## Fundamentação da revisão

Os parâmetros usuario e db resolvem dependências distintas. O mecanismo de validação da identidade precisa de fonte adicional.

## Evidências desta proposição

- [[ev-rotas-listar-coletas-depends]] · direta
