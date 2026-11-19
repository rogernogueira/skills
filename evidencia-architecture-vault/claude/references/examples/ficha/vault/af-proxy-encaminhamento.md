---
id: "af-proxy-encaminhamento"
tipo: "propriedade"
estado_registrado: "confirmada"
estado_efetivo: "confirmada"
confianca_na_revisao: "alta"
origem: "[[cmp-api-coletas]]"
relacao: null
destino: null
chave: "ficha.proxy.encaminhamento"
valor: "O Nginx define X-Forwarded-For a partir de $remote_addr e X-Forwarded-Proto a partir de $scheme. A confiança configurada no app permanece por verificar."
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
revisado_por: "revisor do exemplo"
revisado_em: "2026-11-19"
valido_de: "2026-11-19"
valido_ate: "2026-12-19"
---
# af-proxy-encaminhamento

[[cmp-api-coletas]] · ficha.proxy.encaminhamento = O Nginx define X-Forwarded-For a partir de $remote_addr e X-Forwarded-Proto a partir de $scheme. A confiança configurada no app permanece por verificar.

## Fundamentação da revisão

O trecho vincula a diretiva ao recorte configurado desta implantação sintética.

## Evidências desta proposição

- [[ev-proxy-encaminhamento]] · direta
