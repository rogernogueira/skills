---
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
data_de_corte: "2026-11-19"
---
# Mapa de dependências

EvidencIA / laboratório de cache · configurado · simulada · 2026-11-19

Políticas das APIs por método e rota → [[Cache por rota]]

## Relações confirmadas na data de corte

Nenhuma aresta confirmada vigente.

Nenhum registro neste recorte.

## Inventário de componentes

- [[cmp-api-coletas]] · API de coletas (simulação) (api)

## Afirmações de configuração e relações pendentes ou históricas

- [[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — Ativo na leitura da lista por repositório. · [[af-get-uso]] · confirmada
- [[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Cache-aside em memória, com uma entrada por repositório. · [[af-get-estrategia]] · confirmada
- [[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — 300 segundos a partir da leitura do relógio no preenchimento. Acertos preservam o vencimento. · [[af-get-ttl]] · confirmada
- [[cmp-api-coletas]] · `GET /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — Após registrar uma coleta via POST, remover a entrada da lista do mesmo repositório. · [[af-get-invalidacao]] · confirmada
- [[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — A resposta da operação de escrita é devolvida diretamente. · [[af-post-uso]] · confirmada
- [[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Resposta direta após a gravação, sem preencher o cache da resposta POST. · [[af-post-estrategia]] · confirmada
- [[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — Não se aplica à resposta POST nesta camada. · [[af-post-ttl]] · confirmada
- [[cmp-api-coletas]] · `POST /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — O POST invalida a lista do GET para o repositório alterado após gravar a coleta. · [[af-post-invalidacao]] · confirmada

## Perguntas ao responsável

- Quais arquivos ou extratos completam a ficha de [[cmp-api-coletas]] no plano configurado? Ver campos a verificar em: Dependências e execução, Ponto de entrada, Banco de dados e dependências, Amostra de rotas, serviços e schemas, Autenticação e autorização, Clientes HTTP e integrações, Proteção contra abuso e configuração, Filas, cache e tarefas assíncronas, Proxy reverso e balanceador, Recursos e escalabilidade.
