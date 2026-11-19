---
id: "cmp-api-coletas"
nome: "API de coletas (simulação)"
classe: "api"
ambiente: "EvidencIA / laboratório de cache"
plano: "configurado"
natureza: "simulada"
---
# API de coletas (simulação)

## Ficha técnica

### Dependências e execução

A verificar neste recorte: Versão do FastAPI; Versão e geração do Pydantic (v1/v2); ORM e versão; Driver do banco e modo síncrono/assíncrono; Comando efetivo de inicialização; Workers configurados por réplica; Workers ativos por réplica e instante de coleta; Flags de limite e timeout do servidor.

### Ponto de entrada

A verificar neste recorte: Módulo, factory ou instância FastAPI; Política CORS; Middlewares e ordem de execução; Tratadores de exceção; Lifespan ou eventos de startup/shutdown.

### Banco de dados e dependências

A verificar neste recorte: Criação da engine e escopo; Fábrica de sessões (sessionmaker); Tipo, tamanho, overflow e timeout do pool; Abertura, yield, encerramento e rollback da sessão; Objetos globais, ciclo de vida e compartilhamento por processo.

### Amostra de rotas, serviços e schemas

A verificar neste recorte: Método, rota e motivo da seleção; Assinatura def/async def; Parâmetros Depends; response_model e schema de saída; Uso de BackgroundTasks; Serviço ou repositório chamado; Consulta ao banco ou chamada externa; Modelo ORM e mapeamento; Schemas Pydantic de entrada e saída.

### Autenticação e autorização

A verificar neste recorte: Dependência que valida o usuário atual; Autorização sobre o recurso específico.

### Clientes HTTP e integrações

A verificar neste recorte: Destinos lógicos e cliente HTTP; Reutilização, fechamento e escopo do cliente; Timeouts de conexão, leitura, escrita e pool; Política de retries; Circuit breaker e critérios de abertura/recuperação.

### Proteção contra abuso e configuração

A verificar neste recorte: Rate limiting, chave e janela; Limite de payload/upload e camada que o aplica; Carregamento das configurações de ambiente; Ciclo de vida das configurações (ex.: lru_cache).

### Filas, cache e tarefas assíncronas

TTL e invalidação da API por método, rota e camada → [[Cache por rota]]

A verificar neste recorte: Broker/backend e conexões (Redis/RabbitMQ); Worker ou executor (Celery/ARQ); Produtor, fila, tarefa pesada e consumidor; Criação, reutilização e fechamento do cliente de cache; Serialização e desserialização das entradas em cache.

### Proxy reverso e balanceador

A verificar neste recorte: Produto e rota do proxy/balanceador; Timeouts de leitura e escrita; Limite do corpo da requisição; Repasse e confiança de X-Forwarded-For e X-Forwarded-Proto.

### Recursos e escalabilidade

A verificar neste recorte: vCPUs solicitadas, limitadas e escopo; Memória RAM solicitada, limitada e escopo; Número e escopo das réplicas; Autoscaling, limites mínimo/máximo e métrica-alvo.

## Configuração e afirmações sobre este componente

- `GET /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — Ativo na leitura da lista por repositório. · [[af-get-uso]] · confirmada
- `GET /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Cache-aside em memória, com uma entrada por repositório. · [[af-get-estrategia]] · confirmada
- `GET /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — 300 segundos a partir da leitura do relógio no preenchimento. Acertos preservam o vencimento. · [[af-get-ttl]] · confirmada
- `GET /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — Após registrar uma coleta via POST, remover a entrada da lista do mesmo repositório. · [[af-get-invalidacao]] · confirmada
- `POST /v1/repositorios/{id}/coletas` · aplicacao · Uso do cache — A resposta da operação de escrita é devolvida diretamente. · [[af-post-uso]] · confirmada
- `POST /v1/repositorios/{id}/coletas` · aplicacao · Estratégia — Resposta direta após a gravação, sem preencher o cache da resposta POST. · [[af-post-estrategia]] · confirmada
- `POST /v1/repositorios/{id}/coletas` · aplicacao · Tempo de validade (TTL) — Não se aplica à resposta POST nesta camada. · [[af-post-ttl]] · confirmada
- `POST /v1/repositorios/{id}/coletas` · aplicacao · Regra de invalidação — O POST invalida a lista do GET para o repositório alterado após gravar a coleta. · [[af-post-invalidacao]] · confirmada

## Dependências de saída

Nenhum registro neste recorte.

## Componentes que o utilizam ou investigam uma relação

Nenhum registro neste recorte.
