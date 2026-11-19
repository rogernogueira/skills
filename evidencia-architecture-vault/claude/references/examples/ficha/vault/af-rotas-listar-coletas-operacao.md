---
id: "af-rotas-listar-coletas-operacao"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.rotas.listar-coletas.operacao"
valor: "consultas.listar_por_repositorio usa select(Coleta) filtrando Coleta.repositorio_id."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-rotas-listar-coletas-operacao

[[cmp-api-coletas]] · ficha.rotas.listar-coletas.operacao = consultas.listar_por_repositorio usa select(Coleta) filtrando Coleta.repositorio_id.

## Fundamentação da revisão

O primeiro trecho localiza o chamador e o segundo identifica a consulta SQLAlchemy do serviço.

## Evidências desta proposição

- [[ev-rotas-listar-coletas-operacao-1]] · direta
- [[ev-rotas-listar-coletas-operacao-2]] · direta
