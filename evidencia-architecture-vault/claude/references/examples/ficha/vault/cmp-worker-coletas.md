---
id: "cmp-worker-coletas"
nome: "Consumidor da fila de coletas (exemplo)"
classe: "servico"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
---
# Consumidor da fila de coletas (exemplo)

## Ficha técnica

### Dependências e execução

A verificar neste recorte: Versão do FastAPI; Versão e geração do Pydantic (v1/v2); ORM e versão; Driver do banco e modo síncrono/assíncrono; Comando efetivo de inicialização; Workers configurados por réplica; Workers ativos por réplica e instante de coleta; Flags de limite e timeout do servidor.

### Ponto de entrada

A verificar neste recorte: Módulo, factory ou instância FastAPI; Política CORS; Middlewares e ordem de execução; Tratadores de exceção; Lifespan ou eventos de startup/shutdown.

### Banco de dados e dependências

A verificar neste recorte: Criação da engine e escopo; Fábrica de sessões (sessionmaker); Tipo, tamanho, overflow e timeout do pool; Abertura, yield, encerramento e rollback da sessão; Objetos globais, ciclo de vida e compartilhamento por processo.

### Amostra de rotas, serviços e schemas

Não se aplica · confirmada — O ponto de entrada deste processo inicia apenas o worker ARQ e registra a tarefa processar_coleta na fila coletas. · [[af-worker-rotas-aplicabilidade]]

### Autenticação e autorização

A verificar neste recorte: Dependência que valida o usuário atual; Autorização sobre o recurso específico.

### Clientes HTTP e integrações

A verificar neste recorte: Destinos lógicos e cliente HTTP; Reutilização, fechamento e escopo do cliente; Timeouts de conexão, leitura, escrita e pool; Política de retries; Circuit breaker e critérios de abertura/recuperação.

### Proteção contra abuso e configuração

A verificar neste recorte: Rate limiting, chave e janela; Limite de payload/upload e camada que o aplica; Carregamento das configurações de ambiente; Ciclo de vida das configurações (ex.: lru_cache).

### Filas, cache e tarefas assíncronas

- **Worker ou executor (Celery/ARQ)** — Worker ARQ para a função processar_coleta. · confirmada · [[af-worker-tarefas-executor]]

A verificar neste recorte: Broker/backend e conexões (Redis/RabbitMQ); Produtor, fila, tarefa pesada e consumidor; Criação, reutilização e fechamento do cliente de cache; Serialização e desserialização das entradas em cache; Tempo de validade do cache do serviço; Gatilho e alcance da invalidação no serviço.

### Proxy reverso e balanceador

A verificar neste recorte: Produto e rota do proxy/balanceador; Timeouts de leitura e escrita; Limite do corpo da requisição; Repasse e confiança de X-Forwarded-For e X-Forwarded-Proto.

### Recursos e escalabilidade

A verificar neste recorte: vCPUs solicitadas, limitadas e escopo; Memória RAM solicitada, limitada e escopo; Número e escopo das réplicas; Autoscaling, limites mínimo/máximo e métrica-alvo.

## Configuração e afirmações sobre este componente

As propriedades levantadas estão na ficha técnica.

## Dependências de saída

Nenhum registro neste recorte.

## Componentes que o utilizam ou investigam uma relação

Nenhum registro neste recorte.
