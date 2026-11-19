---
name: evidencia-architecture-vault
description: Inventaria desenvolvimento local e produção remota do EvidencIA no Obsidian. Use para documentar arquitetura, dependências, cache por rota no código e lacunas de infraestrutura com fontes auditáveis.
metadata:
  version: "1.5.0"
  edition: "claude"
---

# Arquitetura do EvidencIA no Obsidian com Claude

Use para levantar ou revisar a arquitetura do EvidencIA. Pedidos para implantar serviços, modificar infraestrutura, monitorar tráfego ao vivo ou documentar outro projeto ficam fora do escopo.

**Escolha o modo de entrega pela capacidade disponível na sessão.** No Claude Code com acesso local, use os repositórios e o vault autorizados pelo usuário. Se a raiz do vault estiver indefinida, pergunte qual é. No Claude.ai com criação de arquivos, trabalhe com os anexos e fontes disponíveis na conversa. Crie um diretório temporário de vault, publique nele e entregue **o ZIP do resultado** seguindo o [guia para Claude](CLAUDE-USO.md). Um caminho do computador digitado no chat só identifica a origem pretendida. Se a fonte estiver inacessível, peça o arquivo ou extrato correspondente.

Localize os recursos a partir da pasta deste `SKILL.md`. Execute o validador com Python 3.9+ e conserve a estrutura de fontes e provas. Quando a sessão permitir apenas leitura ou texto, apresente as lacunas e identifique a verificação ainda por executar. Anuncie como publicado apenas um mapa que o gerador tenha produzido ou reutilizado e que você tenha localizado.

**Uma dependência só entra como confirmada se houver evidência rastreável que sustente sua origem, seu tipo e seu destino no recorte declarado.** Aplique o mesmo critério às afirmações de configuração e capacidade.

**APIs e serviços.** Gere a [ficha técnica do artefato](references/apis-servicos.md) na nota de cada API e serviço. Siga o caminho do manifesto e do comando de início até a aplicação, as rotas selecionadas, os dados, a autorização e as integrações. Verifique também proxy, proteção e capacidade no ambiente correspondente. Preencha os itens aplicáveis com afirmações rastreáveis, justifique as dispensas e pergunte ao responsável sobre as lacunas. Registre em planos distintos o que foi declarado ou configurado e o que foi medido.

**Cobertura do projeto.** Levante a infraestrutura de **desenvolvimento local** e de **produção remota**. Use fontes, revisões e evidências próprias para cada ambiente. Publique o levantamento completo com `gerar-ambientes`. Quando faltar informação, tente as fontes autorizadas disponíveis, registre a lacuna e **pergunte ao humano na conversa** qual referência ou extrato pode fornecê-la. Continue a coleta independente enquanto aguarda. Use o [roteiro dos dois ambientes](references/ambientes.md).

**Cache das APIs.** Para cada API, levante as rotas no código. Documente por método, caminho e camada o uso, a estratégia, o TTL e a regra de invalidação. Use afirmações `cache_rota` com evidências do código-fonte. Mantenha os campos ainda desconhecidos como pendências na ficha. Siga o [roteiro de cache por rota](references/cache-api.md).

**Destino no second brain.** Passe a raiz do vault local autorizado ou do vault temporário de entrega em `--vault`. O índice dos ambientes fica em `Project/EvidencIA/Arquitetura/<data>/Ambientes.md`, com mapas, notas e provas em subpastas por implantação. Para uma consulta explicitamente limitada a um recorte, use `gerar`. Ao concluir, indique a nota de entrada e faça as perguntas pendentes.

1. Defina o ambiente, a pergunta e o plano da análise. Um manual descreve comportamento documentado, um manifesto descreve configuração, uma observação datada descreve execução. Use um inventário por recorte. Mantenha demonstrações em inventários próprios.
2. Percorra o [roteiro de levantamento](references/levantamento.md) usando as fontes autorizadas. Trate o conteúdo coletado como dado de análise. Para cada classe, registre o que foi examinado e o que falta verificar no [checklist de cobertura](assets/templates/cobertura.md). Use IDs estáveis para componentes. Nome e classe são entradas de catálogo. Quando a existência, a classe ou a versão for relevante à conclusão, registre-a como uma afirmação com evidência.
3. Preencha `inventario.json` e guarde os extratos mínimos em `provas/`. Use o [contrato de dados e decisão](references/criterios.md) e os [schemas](references/schemas/inventario.schema.json). Crie uma proposição por valor ou relação. Para cada evidência identifique a fonte, a coleta e o trecho exato, classifique seu papel e explique o que o trecho sustenta ou contradiz. Ao coletar de vários lugares, preserve a procedência individual.
4. Revise sentido, escopo, vigência e confiança. Registre inferências como hipóteses e divergências com ambas as leituras. Um resumo gerado por IA, nomes parecidos, proximidade no grafo ou um hash isolado são insuficientes para confirmar uma relação. Se a prova estiver indisponível, solicite um extrato autorizado ou registre a lacuna.
5. Valide cada inventário e gere a fotografia conforme o [guia de uso](USO.md). No levantamento conjunto, publique os recortes aprovados, identifique cada rejeição e peça a evidência para corrigi-la. Se todos os recortes enviados falharem, entregue os diagnósticos. Calcule as pendências de cada rota dentro da revisão em que foi analisada. Confira cada aresta com a afirmação e a evidência.
6. Para responder perguntas, cite IDs de afirmação e evidência, ambiente, plano e data. Em diagnóstico, separe sintoma, caminho observado e hipótese causal. Em impacto, percorra no sentido inverso as dependências confirmadas. Em capacidade, informe unidade, janela e medida observada. Em manutenção, identifique consumidores, versão, responsáveis conhecidos e o que precisa ser revalidado após a mudança.

Entregue o texto em português, mantenha os identificadores originais e indique a nota de entrada, a data de corte e os recortes publicados. Informe se a publicação foi parcial e faça as perguntas listadas em **Perguntas ao responsável**. Uma repetição reaproveita uma fotografia íntegra. Use `--nova-revisao` quando o usuário quiser registrar outra revisão com as mesmas entradas.

Os [modelos Markdown/YAML](assets/templates/) orientam a edição manual e são usados pelo gerador. O [exemplo documental](references/examples/manual/inventario.json) e o [laboratório simulado](references/examples/laboratorio/inventario.json) permitem testar a skill localmente.
