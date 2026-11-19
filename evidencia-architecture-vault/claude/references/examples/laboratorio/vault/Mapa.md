---
ambiente: "EvidencIA / laboratório fictício"
plano: "observado"
natureza: "simulada"
data_de_corte: "2026-11-19"
---
# Mapa de dependências

EvidencIA / laboratório fictício · observado · simulada · 2026-11-19

Políticas das APIs por método e rota → [[Cache por rota]]

## Relações confirmadas na data de corte

~~~mermaid
flowchart LR
    cmp_trabalhador["cmp-trabalhador"] -->|executa_em| cmp_host["cmp-host"]
    cmp_trabalhador["cmp-trabalhador"] -->|conecta_a| cmp_rede["cmp-rede"]
    cmp_triagem["cmp-triagem"] -->|consome_de| cmp_coleta["cmp-coleta"]
    cmp_ingestao["cmp-ingestao"] -->|grava_em| cmp_acervo["cmp-acervo"]
~~~

- [[cmp-trabalhador]] → executa_em → [[cmp-host]] · [[af-execucao]]
- [[cmp-trabalhador]] → conecta_a → [[cmp-rede]] · [[af-rede]]
- [[cmp-triagem]] → consome_de → [[cmp-coleta]] · [[af-consumo]]
- [[cmp-ingestao]] → grava_em → [[cmp-acervo]] · [[af-gravacao]]

## Inventário de componentes

- [[cmp-host]] · Host de laboratório (servidor)
- [[cmp-trabalhador]] · Contêiner trabalhador-01 (docker)
- [[cmp-rede]] · Rede de coleta (rede)
- [[cmp-triagem]] · Serviço de triagem (servico)
- [[cmp-ingestao]] · API de ingestão (api)
- [[cmp-coleta]] · Fila de coleta (fila)
- [[cmp-modelo]] · Classificador de demonstração (modelo)
- [[cmp-acervo]] · Armazenamento do acervo (armazenamento)

## Afirmações de configuração e relações pendentes ou históricas

- [[cmp-triagem]] → carrega_modelo → [[cmp-modelo]] · [[af-modelo]] · inferencia
- [[cmp-triagem]] · replicas.ativas = 2 réplicas às 09:06 UTC · [[af-replicas]] · divergente
- [[cmp-coleta]] · profundidade.maxima = 12 mensagens, 09:00–09:03 UTC de 2026-11-17 · [[af-profundidade]] · obsoleta

## Perguntas ao responsável

- Qual fonte atual permite revisar [[af-modelo]] de cmp-triagem (inferencia)?
- Qual fonte atual permite revisar [[af-replicas]] de cmp-triagem (divergente)?
- Qual fonte atual permite revisar [[af-profundidade]] de cmp-coleta (obsoleta)?
- Quais arquivos ou extratos completam a ficha de [[cmp-triagem]] no plano observado? Ver campos a verificar em: Dependências e execução, Ponto de entrada, Banco de dados e dependências, Amostra de rotas, serviços e schemas, Autenticação e autorização, Clientes HTTP e integrações, Proteção contra abuso e configuração, Filas, cache e tarefas assíncronas, Proxy reverso e balanceador, Recursos e escalabilidade.
- Quais arquivos ou extratos completam a ficha de [[cmp-ingestao]] no plano observado? Ver campos a verificar em: Dependências e execução, Ponto de entrada, Banco de dados e dependências, Amostra de rotas, serviços e schemas, Autenticação e autorização, Clientes HTTP e integrações, Proteção contra abuso e configuração, Filas, cache e tarefas assíncronas, Proxy reverso e balanceador, Recursos e escalabilidade.
- Qual repositório e revisão contêm as rotas de cmp-ingestao neste recorte?
