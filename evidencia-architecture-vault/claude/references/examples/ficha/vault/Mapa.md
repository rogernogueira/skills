---
ambiente: "EvidencIA / exemplo local de revisão"
plano: "configurado"
natureza: "simulada"
data_de_corte: "2026-11-19"
---
# Mapa de dependências

EvidencIA / exemplo local de revisão · configurado · simulada · 2026-11-19

Políticas das APIs por método e rota → [[Cache por rota]]

## Relações confirmadas na data de corte

Nenhuma aresta confirmada vigente.

Nenhum registro neste recorte.

## Inventário de componentes

- [[cmp-api-coletas]] · API de coletas (exemplo) (api)
- [[cmp-worker-coletas]] · Consumidor da fila de coletas (exemplo) (servico)

## Afirmações de configuração e relações pendentes ou históricas

- [[cmp-api-coletas]] · ficha.execucao.fastapi = Faixa declarada: fastapi>=0.115,<1. · [[af-execucao-fastapi]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.pydantic = Pydantic v2, faixa declarada >=2,<3. · [[af-execucao-pydantic]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.workers_configurados = 2 workers no comando do processo web. · [[af-execucao-workers-configurados]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.comando = uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2 --limit-concurrency 80 --timeout-keep-alive 5 · [[af-execucao-comando]] · confirmada
- [[cmp-api-coletas]] · ficha.entrada.ciclo = O lifespan abre o cliente HTTP antes do yield e o fecha na saída do contexto. · [[af-entrada-ciclo]] · confirmada
- [[cmp-api-coletas]] · ficha.banco.pool = Pool configurado com tamanho 4 e overflow máximo 2 por instância de engine. · [[af-banco-pool]] · confirmada
- [[cmp-api-coletas]] · ficha.banco.sessao = A dependência fornece uma sessão com yield e deixa o bloco async with ao terminar. · [[af-banco-sessao]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.selecao = GET /repositorios/{id}/coletas — amostra funcional do fluxo de leitura de coletas. · [[af-rotas-listar-coletas-selecao]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.assinatura = async def listar_coletas(id: int, usuario=Depends(get_current_user), db=Depends(get_db)). · [[af-rotas-listar-coletas-assinatura]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.resposta = response_model=list[ColetaSaida]. · [[af-rotas-listar-coletas-resposta]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.operacao = consultas.listar_por_repositorio usa select(Coleta) filtrando Coleta.repositorio_id. · [[af-rotas-listar-coletas-operacao]] · confirmada
- [[cmp-api-coletas]] · ficha.acesso.recurso = Antes da consulta, exige vínculo entre o usuário atual e o repositório. Ausência do vínculo gera 403. · [[af-acesso-recurso]] · confirmada
- [[cmp-api-coletas]] · ficha.http.ciclo = O cliente HTTP compartilhado fica em app.state.http durante o lifespan. · [[af-http-ciclo]] · confirmada
- [[cmp-api-coletas]] · ficha.http.timeouts = httpx.Timeout(5.0, connect=1.0) configura timeout padrão de 5 s e conexão de 1 s. · [[af-http-timeouts]] · confirmada
- [[cmp-worker-coletas]] · ficha.rotas.aplicabilidade = nao-aplicavel · [[af-worker-rotas-aplicabilidade]] · confirmada
- [[cmp-worker-coletas]] · ficha.tarefas.executor = Worker ARQ para a função processar_coleta. · [[af-worker-tarefas-executor]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.orm = SQLAlchemy com o extra asyncio, faixa declarada >=2,<3. · [[af-execucao-orm]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.driver = asyncpg assíncrono, faixa declarada >=0.29,<1. O driver selecionado pela URL efetiva segue pendente. · [[af-execucao-driver]] · confirmada
- [[cmp-api-coletas]] · ficha.entrada.instancia = O módulo app cria app = FastAPI(lifespan=lifespan) e inclui o router de coletas. · [[af-entrada-instancia]] · confirmada
- [[cmp-api-coletas]] · ficha.banco.fabrica = async_sessionmaker(engine, expire_on_commit=False). · [[af-banco-fabrica]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.depends = Depends(get_current_user) e Depends(get_db) na assinatura da rota. · [[af-rotas-listar-coletas-depends]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.servico = A rota delega a leitura a consultas.listar_por_repositorio(db, id). · [[af-rotas-listar-coletas-servico]] · confirmada
- [[cmp-api-coletas]] · ficha.rotas.listar-coletas.modelo = A query usa o modelo Coleta e a coluna Coleta.repositorio_id. · [[af-rotas-listar-coletas-modelo]] · confirmada
- [[cmp-api-coletas]] · ficha.execucao.limites = Limite de concorrência 80 e keep-alive 5 s no comando web. · [[af-execucao-limites]] · confirmada
- [[cmp-api-coletas]] · ficha.proxy.camada = Nginx encaminha /repositorios/ ao upstream lógico api_coletas. · [[af-proxy-camada]] · confirmada
- [[cmp-api-coletas]] · ficha.proxy.timeouts = Entre o Nginx e o upstream, proxy_read_timeout 20 s e proxy_send_timeout 10 s. · [[af-proxy-timeouts]] · confirmada
- [[cmp-api-coletas]] · ficha.proxy.corpo = client_max_body_size 4m na localização /repositorios/. · [[af-proxy-corpo]] · confirmada
- [[cmp-api-coletas]] · ficha.proxy.encaminhamento = O Nginx define X-Forwarded-For a partir de $remote_addr e X-Forwarded-Proto a partir de $scheme. A confiança configurada no app permanece por verificar. · [[af-proxy-encaminhamento]] · confirmada
- [[cmp-api-coletas]] · ficha.protecao.payload = O limite configurado na entrada Nginx desta rota é de 4 MiB. · [[af-protecao-payload]] · confirmada
- [[cmp-api-coletas]] · ficha.recursos.vcpu = Limite de 1,5 CPU para cada contêiner api no Compose local. · [[af-recursos-vcpu]] · confirmada
- [[cmp-api-coletas]] · ficha.recursos.ram = Limite mem_limit de 512m para o contêiner api. · [[af-recursos-ram]] · confirmada

## Perguntas ao responsável

- Quais arquivos ou extratos completam a ficha de [[cmp-api-coletas]] no plano configurado? Ver campos a verificar em: Dependências e execução, Ponto de entrada, Banco de dados e dependências, Amostra de rotas, serviços e schemas, Autenticação e autorização, Clientes HTTP e integrações, Proteção contra abuso e configuração, Filas, cache e tarefas assíncronas, Recursos e escalabilidade.
- Quais arquivos ou extratos completam a ficha de [[cmp-worker-coletas]] no plano configurado? Ver campos a verificar em: Dependências e execução, Ponto de entrada, Banco de dados e dependências, Autenticação e autorização, Clientes HTTP e integrações, Proteção contra abuso e configuração, Filas, cache e tarefas assíncronas, Proxy reverso e balanceador, Recursos e escalabilidade.
- Qual repositório e revisão contêm as rotas de cmp-api-coletas neste recorte?
