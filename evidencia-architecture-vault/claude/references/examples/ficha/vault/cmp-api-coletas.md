---
id: "cmp-api-coletas"
nome: "API de coletas (exemplo)"
classe: "api"
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
---
# API de coletas (exemplo)

## Ficha técnica

### Dependências e execução

- **Versão do FastAPI** — Faixa declarada: fastapi>=0.115,<1. · confirmada · [[af-execucao-fastapi]]
- **Versão e geração do Pydantic (v1/v2)** — Pydantic v2, faixa declarada >=2,<3. · confirmada · [[af-execucao-pydantic]]
- **ORM e versão** — SQLAlchemy com o extra asyncio, faixa declarada >=2,<3. · confirmada · [[af-execucao-orm]]
- **Driver do banco e modo síncrono/assíncrono** — asyncpg assíncrono, faixa declarada >=0.29,<1. O driver selecionado pela URL efetiva segue pendente. · confirmada · [[af-execucao-driver]]
- **Comando efetivo de inicialização** — uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --limit-concurrency 80 --timeout-keep-alive 5 · confirmada · [[af-execucao-comando]]
- **Workers configurados por réplica** — 2 workers no comando do processo web. · confirmada · [[af-execucao-workers-configurados]]
- **Flags de limite e timeout do servidor** — Limite de concorrência 80 e keep-alive 5 s no comando web. · confirmada · [[af-execucao-limites]]

A verificar neste recorte: Workers ativos por réplica e instante de coleta.

### Ponto de entrada

- **Módulo, factory ou instância FastAPI** — O módulo app cria app = FastAPI(lifespan=lifespan) e inclui o router de coletas. · confirmada · [[af-entrada-instancia]]
- **Lifespan ou eventos de startup/shutdown** — O lifespan abre o cliente HTTP antes do yield e o fecha na saída do contexto. · confirmada · [[af-entrada-ciclo]]

A verificar neste recorte: Política CORS; Middlewares e ordem de execução; Tratadores de exceção.

### Banco de dados e dependências

- **Fábrica de sessões (sessionmaker)** — async_sessionmaker(engine, expire_on_commit=False). · confirmada · [[af-banco-fabrica]]
- **Tipo, tamanho, overflow e timeout do pool** — Pool configurado com tamanho 4 e overflow máximo 2 por instância de engine. · confirmada · [[af-banco-pool]]
- **Abertura, yield, encerramento e rollback da sessão** — A dependência fornece uma sessão com yield e deixa o bloco async with ao terminar. · confirmada · [[af-banco-sessao]]

A verificar neste recorte: Criação da engine e escopo; Objetos globais, ciclo de vida e compartilhamento por processo.

### Amostra de rotas, serviços e schemas

#### listar-coletas

- **Método, rota e motivo da seleção** — GET /repositorios/{id}/coletas — amostra funcional do fluxo de leitura de coletas. · confirmada · [[af-rotas-listar-coletas-selecao]]
- **Assinatura def/async def** — async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db)). · confirmada · [[af-rotas-listar-coletas-assinatura]]
- **Parâmetros Depends** — Depends(get_current_user) e Depends(get_db) na assinatura da rota. · confirmada · [[af-rotas-listar-coletas-depends]]
- **response_model e schema de saída** — response_model=list[ColetaSaida]. · confirmada · [[af-rotas-listar-coletas-resposta]]
- **Serviço ou repositório chamado** — A rota delega a leitura a consultas.listar_por_repositorio(db, id). · confirmada · [[af-rotas-listar-coletas-servico]]
- **Consulta ao banco ou chamada externa** — consultas.listar_por_repositorio usa select(Coleta) filtrando Coleta.repositorio_id. · confirmada · [[af-rotas-listar-coletas-operacao]]
- **Modelo ORM e mapeamento** — A query usa o modelo Coleta e a coluna Coleta.repositorio_id. · confirmada · [[af-rotas-listar-coletas-modelo]]

A verificar neste recorte: Uso de BackgroundTasks; Schemas Pydantic de entrada e saída.

### Autenticação e autorização

- **Autorização sobre o recurso específico** — Antes da consulta, exige vínculo entre o usuário atual e o repositório. Ausência do vínculo gera 403. · confirmada · [[af-acesso-recurso]]

A verificar neste recorte: Dependência que valida o usuário atual.

### Clientes HTTP e integrações

- **Reutilização, fechamento e escopo do cliente** — O cliente HTTP compartilhado fica em app.state.http durante o lifespan. · confirmada · [[af-http-ciclo]]
- **Timeouts de conexão, leitura, escrita e pool** — httpx.Timeout(5.0, connect=1.0) configura timeout padrão de 5 s e conexão de 1 s. · confirmada · [[af-http-timeouts]]

A verificar neste recorte: Destinos lógicos e cliente HTTP; Política de retries; Circuit breaker e critérios de abertura/recuperação.

### Proteção contra abuso e configuração

- **Limite de payload/upload e camada que o aplica** — O limite configurado na entrada Nginx desta rota é de 4 MiB. · confirmada · [[af-protecao-payload]]

A verificar neste recorte: Rate limiting, chave e janela; Carregamento das configurações de ambiente; Ciclo de vida das configurações (ex.: lru_cache).

### Filas, cache e tarefas assíncronas

TTL e invalidação da API por método, rota e camada → [[Cache por rota]]

A verificar neste recorte: Broker/backend e conexões (Redis/RabbitMQ); Worker ou executor (Celery/ARQ); Produtor, fila, tarefa pesada e consumidor; Criação, reutilização e fechamento do cliente de cache; Serialização e desserialização das entradas em cache.

### Proxy reverso e balanceador

- **Produto e rota do proxy/balanceador** — Nginx encaminha /repositorios/ ao upstream lógico api_coletas. · confirmada · [[af-proxy-camada]]
- **Timeouts de leitura e escrita** — Entre o Nginx e o upstream, proxy_read_timeout 20 s e proxy_send_timeout 10 s. · confirmada · [[af-proxy-timeouts]]
- **Limite do corpo da requisição** — client_max_body_size 4m na localização /repositorios/. · confirmada · [[af-proxy-corpo]]
- **Repasse e confiança de X-Forwarded-For e X-Forwarded-Proto** — O Nginx define X-Forwarded-For a partir de $remote_addr e X-Forwarded-Proto a partir de $scheme. A confiança configurada no app permanece por verificar. · confirmada · [[af-proxy-encaminhamento]]

### Recursos e escalabilidade

- **vCPUs solicitadas, limitadas e escopo** — Limite de 1,5 CPU para cada contêiner api no Compose local. · confirmada · [[af-recursos-vcpu]]
- **Memória RAM solicitada, limitada e escopo** — Limite mem_limit de 512m para o contêiner api. · confirmada · [[af-recursos-ram]]

A verificar neste recorte: Número e escopo das réplicas; Autoscaling, limites mínimo/máximo e métrica-alvo.

## Configuração e afirmações sobre este componente

As propriedades levantadas estão na ficha técnica.

## Dependências de saída

Nenhum registro neste recorte.

## Componentes que o utilizam ou investigam uma relação

Nenhum registro neste recorte.
