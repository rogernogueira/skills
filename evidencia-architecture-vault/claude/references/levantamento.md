# Roteiro de levantamento

Para cada API e serviço, preencha também a [ficha técnica do artefato](apis-servicos.md) com as evidências do ambiente em análise.

Delimite ambiente, versão de implantação, intervalo e objetivo. Mantenha uma lista de cobertura com as oito classes e um resultado por classe: levantada (IDs), pendente (fonte a obter) ou fora do escopo (motivo). Registre lacunas como perguntas. Evite converter silêncio de um manual em ausência de um serviço.

| Classe | O que levantar como afirmações | Onde encontrar evidência |
|---|---|---|
| Servidor | Papel, ambiente, CPU, RAM, GPU, sistema, limites, responsável | Inventário autorizado, métricas com unidade e janela, ficha de implantação |
| Docker | Imagem e digest, réplicas, limites, volumes, host | Manifesto versionado e campos selecionados do runtime. Em host autorizado, `docker ps --format '{{.Names}} {{.Image}}'` lista nomes e imagens |
| Rede | Segmento lógico, associação, porta/protocolo e sentido | Seção de redes do manifesto ou metadados de conexão sanitizados. A mesma rede permite comunicação, mas uma chamada precisa de prova própria |
| Serviço | Papel, processo, versão, consumidores, comportamento em falha | Configuração versionada, trecho de documentação, evento com identificadores simbólicos |
| API | Rota parametrizada, método, versão, consumidor, erro relevante e política de cache por rota | Para cache, siga a implementação conforme o [roteiro de cache](cache-api.md). Para contrato e uso observado, consulte o contrato OpenAPI e as chamadas sanitizadas |
| Fila | Broker lógico, produtor, consumidor, profundidade, atraso, retentativa | Mapeamento de bindings, contadores com janela e trecho de fluxo. Uma lista de solicitações da interface não identifica um broker |
| Modelo | Identificador, revisão, formato, memória, serviço que o carrega | Registro de modelos, configuração de serving e evento de carregamento da revisão |
| Armazenamento | Tipo lógico, leituras/escritas, volume, ocupação, retenção e restauração | Manifesto de volumes, configuração selecionada, métrica e registro autorizado do teste de restauração |

**Como coletar.** Priorize artefatos já fornecidos. Para uma consulta autorizada, registre o comando com seletor de campos ou o método e a rota sem parâmetros sensíveis. Extraia o menor trecho suficiente. Omita segredos, conteúdo de usuários, credenciais, cabeçalhos, cookies, endereços privados e identificadores pessoais. Trabalhe com nomes lógicos consistentes. Evite exportar ambientes completos, dumps ou configurações integrais. Faça a redação antes de gravar e calcular SHA-256. Registre a transformação e a versão original permitida. Prefira extratos com uma única finalidade, pois o arquivo inteiro acompanha o vault.

**Convenção das setas.** A origem usa o destino. Um serviço executa em um host, publica em uma fila, consome de uma fila, carrega um modelo, lê de um repositório ou grava em um banco. A seta de consumo vai do consumidor para a fila, mesmo quando os dados fluem no sentido contrário. Use `depende_de` quando a prova estabelecer a necessidade sem especificar o mecanismo.
