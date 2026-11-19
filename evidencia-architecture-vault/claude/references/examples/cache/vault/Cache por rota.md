---
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
data_de_corte: "2026-11-19"
---
# Cache por rota

Cada afirmação leva ao trecho de código correspondente. A data de corte indica quando a implementação foi revisada. O TTL indica a duração da entrada em cache.

## [[cmp-api-coletas]] · API de coletas (simulação)

### `GET /v1/repositorios/{id}/coletas` · aplicacao

- **Uso do cache** — Ativo na leitura da lista por repositório. · confirmada · [[af-get-uso]]
- **Estratégia** — Cache-aside em memória, com uma entrada por repositório. · confirmada · [[af-get-estrategia]]
- **Tempo de validade (TTL)** — 300 segundos a partir da leitura do relógio no preenchimento. Acertos preservam o vencimento. · confirmada · [[af-get-ttl]]
- **Regra de invalidação** — Após registrar uma coleta via POST, remover a entrada da lista do mesmo repositório. · confirmada · [[af-get-invalidacao]]

### `POST /v1/repositorios/{id}/coletas` · aplicacao

- **Uso do cache** — A resposta da operação de escrita é devolvida diretamente. · confirmada · [[af-post-uso]]
- **Estratégia** — Resposta direta após a gravação, sem preencher o cache da resposta POST. · confirmada · [[af-post-estrategia]]
- **Tempo de validade (TTL)** — Não se aplica à resposta POST nesta camada. · confirmada · [[af-post-ttl]]
- **Regra de invalidação** — O POST invalida a lista do GET para o repositório alterado após gravar a coleta. · confirmada · [[af-post-invalidacao]]
