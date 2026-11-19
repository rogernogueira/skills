---
id: "af-acesso-recurso"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.acesso.recurso"
valor: "Antes da consulta, exige vínculo entre o usuário atual e o repositório. Ausência do vínculo gera 403."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-acesso-recurso

[[cmp-api-coletas]] · ficha.acesso.recurso = Antes da consulta, exige vínculo entre o usuário atual e o repositório. Ausência do vínculo gera 403.

## Fundamentação da revisão

A rota chama o guard com o usuário e o ID do recurso. O guard consulta o vínculo e decide a recusa.

## Evidências desta proposição

- [[ev-acesso-recurso-1]] · direta
- [[ev-acesso-recurso-2]] · direta
