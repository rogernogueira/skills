---
name: criar-licoes-interativas
description: Planejar, criar, revisar e validar lições HTML interativas e responsivas — inclusive pacotes LMS/SCORM e versões publicáveis como Artifact — com cenário didático, vocabulário contextual, dataset fictício, quizzes de feedback explicativo, simuladores, conclusão verificável e persistência de respostas. Usar quando o pedido envolver aula, lição, slide, trilha, curso, módulo, material educacional, quiz, atividade interativa, SCORM, revisão pedagógica de uma lição existente ou auditoria da conclusão de um módulo cujo botão libera sem evidência de aprendizagem.
---

# Criar lições interativas

Trabalhar em três etapas: projetar a aprendizagem; implementar a experiência; auditar a conclusão verificável. Não começar pelo layout.

## Roteamento de referências

Ler apenas o que a tarefa exigir:

- [pedagogia.md](references/pedagogia.md) em toda criação ou revisão substancial.
- [praticas-interativas.md](references/praticas-interativas.md) ao criar quizzes, atividades, simuladores, checklists ou bilhetes de saída.
- [cenario-vocabulario-e-dados.md](references/cenario-vocabulario-e-dados.md) quando houver problema aplicado, cenário, termos de domínio, dataset, fórmula ou gabarito dependente de dados.
- [scorm-e-conclusao.md](references/scorm-e-conclusao.md) quando a lição for destinada a LMS/SCORM, precisar retomar respostas ou tiver conclusão condicionada.
- [painel-de-conclusao.md](references/painel-de-conclusao.md) ao montar o slide de conclusão e sempre que a tarefa for auditar um módulo existente cuja conclusão dependa apenas de navegação ou de tentativa.
- [sistema-visual.md](references/sistema-visual.md) antes de criar ou alterar HTML/CSS.

## Caminhos, scripts e ambiente

- `scripts/` e `assets/` são relativos ao diretório desta skill (por exemplo `~/.claude/skills/criar-licoes-interativas/` ou `.claude/skills/criar-licoes-interativas/`). Resolver esse caminho uma vez, no início, e usá-lo absoluto em cada comando: o estado do shell não persiste entre chamadas de ferramenta, então não confiar em `cd` nem em variáveis exportadas de um comando para o outro.
- Os scripts exigem apenas Node.js, sem dependências externas. Confirmar com `node --version` antes do primeiro uso.
- Antes de criar arquivos, inspecionar o diretório de trabalho com as ferramentas de busca e reutilizar componentes já existentes; só gerar workspace novo quando não houver nada aproveitável.
- Em tarefas longas (mapa pedagógico → slides → dataset → validação), manter a lista de tarefas visível ao usuário e fechar cada item apenas depois de validado.

## Etapa 1 — Projetar a aprendizagem

1. Definir público, contexto, conhecimento prévio, restrições e uma vitória observável.
2. Formular uma pergunta-guia que leve à ação esperada.
3. Quando houver problema aplicado, apresentar antes da técnica: organização ou ambiente fictício, serviço, pessoas e papéis, fluxo atual, dificuldade concreta, consequências, decisão apoiada, salvaguardas e condição de não uso.
4. Explicar termos abstratos na primeira ocorrência com definição curta, exemplo no cenário e, quando útil, contraexemplo.
5. Selecionar somente o conhecimento necessário para executar a habilidade.
6. Planejar exemplo resolvido, recuperação ativa, prática aplicada, feedback e síntese.
7. Definir antes da implementação as evidências que liberam a conclusão. Distinguir visita, tentativa, acerto, completude, exploração e persistência.
8. Remover carga horária, duração estimada e promessas de tempo. Manter apenas períodos pertencentes ao problema estudado.

Perguntar ao usuário somente quando leituras diferentes do pedido levariam a lições materialmente diferentes — público, nível, uso em LMS ou tema do cenário. Nos demais casos, decidir, registrar a suposição no mapa pedagógico e seguir.

### Mapa pedagógico obrigatório

Registrar antes de escrever HTML:

```md
Missão:
Público e contexto:
Conhecimento prévio presumido:
Vitória observável:
Pergunta-guia:
Problema concreto:
Organização, personagens e papéis fictícios:
Processo atual e gargalo:
Decisão que receberá apoio:
Consequências, salvaguardas e condição de não uso:
Vocabulário que precisa ser explicado:
Conceitos essenciais:
Exemplo resolvido:
Dataset, quantidade de registros e regra do alvo:
Contas e gabaritos que precisam ser reproduzidos:
Prática e feedback:
Evidências exigidas para conclusão:
Como cada evidência será verificada no código:
Interações que precisam persistir:
Comportamento esperado na retomada:
Fonte principal:
Ilustrações didáticas em HTML/CSS/SVG/JS:
Quantidade e função dos slides:
Destino: arquivo local, pacote SCORM ou Artifact:
```

A quantidade de slides é consequência da progressão. Ampliar quando isso separar contexto, vocabulário, conceito, exemplo, prática, feedback ou síntese. Não reduzir fonte nem condensar funções distintas apenas para preservar uma contagem fixa.

## Regras para dados, exemplos e gabaritos

- Usar dados fictícios ou públicos e declarar a natureza do cenário.
- Quando um dataset for usado em atividade aplicada, criar mais de 30 registros coerentes com o problema. Esse mínimo é didático e não demonstra suficiência estatística ou prontidão para produção.
- Incluir dicionário de dados, momento de disponibilidade das colunas, regra reproduzível do alvo, casos comuns, classe minoritária e casos de fronteira.
- Evitar vazamento: atributos de entrada devem existir no momento da previsão.
- Recalcular do dataset todas as contagens, prevalências, baselines, métricas e respostas numéricas mostradas. Calcular com script ou ferramenta, nunca de memória.
- Garantir uma única resposta defensável por questão. Usar distratores plausíveis e visualmente equivalentes.
- Explicar por que cada alternativa está correta ou incorreta. Não usar apenas "correto" ou "tente novamente".
- Criar teste automatizado sempre que dataset, slide e gabarito compartilhem um resultado calculável.
- Não inventar cenário real, pessoa real, instituição real, norma, jurisprudência, número ou citação. Verificar em fonte primária ou manter o cenário explicitamente fictício.

## Etapa 2 — Implementar a experiência

1. Inspecionar o workspace e reutilizar seus componentes. Quando não existir, executar:

```bash
node <caminho-da-skill>/scripts/init-workspace.mjs <diretorio-destino>
```

2. Partir de `assets/licao-modelo.html`, adaptando a sequência ao mapa pedagógico.
3. Usar slides curtos com `scroll-snap`, contador, navegação por pontos e teclado. Reservar uma função principal por slide.
4. Incluir ao menos uma prática que meça a vitória observável e ofereça tentativa, feedback e revisão.
5. Tratar sliders como exploração orientada: registrar cenários relevantes, não apenas movimento.
6. Dar IDs estáveis a todos os campos persistentes.
7. Usar `localStorage` apenas como conveniência ou contingência, sempre com leitura e escrita protegidas. Em LMS, persistir no estado SCORM e restaurar estado funcional e visual.
8. Quando houver botão de conclusão, montar o painel da Etapa 3 em vez de improvisar regra própria: checklist vivo, linha de estado da gravação e revalidação no clique final.
9. Garantir foco visível, teclado, contraste, `aria-live`, redução de movimento, texto alternativo e impressão legível.

## Etapa 3 — Auditar a conclusão verificável

Executar sempre que a lição tiver botão de conclusão — na criação e, obrigatoriamente, quando a
tarefa for revisar ou retrofitar um módulo existente. O detalhamento está em
[painel-de-conclusao.md](references/painel-de-conclusao.md); esta etapa é o roteiro.

1. Antes de tocar no código, inventariar todos os slides e interações: quizzes, atividades,
   seletores, campos de texto, checkboxes, simuladores, desafios, exercícios e bilhetes de
   saída. Para cada um, registrar ID estável, tipo, critério de acerto, obrigatoriedade, local
   de persistência e comportamento na retomada. Registrar também a regra que hoje libera a
   conclusão, por escrito, antes de substituí-la.
2. Derivar os requisitos das evidências reais de aprendizagem já presentes no módulo. Não
   inventar atividade para engordar a lista nem usar uma quantidade fixa de requisitos.
   Distinguir visita, tentativa, acerto, completude, exploração e persistência.
3. Implementar o checklist vivo junto ao botão: contagem do que falta, requisitos em linguagem
   do estudante, `✓` para cumprido e `○` para pendente, atualização a cada navegação ou
   mudança de resposta, `role="status"` com `aria-live="polite"`, estado nunca comunicado só
   por cor, e funcionamento em celular, tablet, desktop, zoom de 200% e impressão.
4. Manter visível a linha de estado da gravação com as três mensagens distintas: "Salvo no
   LMS", "O LMS não confirmou a gravação" e "Salvo apenas neste navegador".
5. Aplicar as regras de validação: visita a slides não libera quando há prática obrigatória;
   quiz obrigatório exige acerto, não tentativa; atividade com gabarito exige todos os campos
   corretos; texto obrigatório usa critério objetivo com contagem visível; simulador registra
   condições significativas, não movimento; resposta desfeita devolve o requisito a pendente; o
   botão fica desabilitado enquanto houver pendência; no clique final, revalidar tudo.
6. Concluir em LMS na ordem revalidar → gravar → commit → reler e comparar → só então
   `completed`. Falha de gravação não conclui e mostra mensagem para tentar novamente.
7. Fora do LMS, declarar que a conclusão é apenas local; se ela for apresentada como
   persistente, gravar e restaurar o marcador de módulo concluído.
8. Reutilizar o runtime compartilhado e o contrato de atributos (`data-required`,
   `data-requirement-label`, `data-correct-value`, `data-min-words`, `data-explore-rules`,
   `data-require-all-slides`). Não duplicar lógica de checklist entre módulos nem dentro do
   HTML de um slide.
9. Preservar conteúdo pedagógico, identidade visual e alterações existentes não relacionadas à
   conclusão.

Ao final, relatar: requisitos identificados, como cada um é validado, arquivos modificados,
comportamento dentro e fora do LMS, testes executados com resultados, limitações e
inconsistências encontradas.

## Imagens e ilustrações

- Planejar a função pedagógica antes de gerar uma imagem.
- Sempre que possível, criar ilustrações didáticas com HTML, CSS, SVG e JavaScript: fluxos, filas, linhas do tempo, matrizes, comparações, gráficos, estados antes/depois e simulações respondem melhor quando permanecem nítidos, responsivos e manipuláveis.
- Usar JavaScript quando a mudança de parâmetros, o destaque progressivo ou a interação ajudarem a explicar uma relação. Para ilustração estática, preferir HTML/CSS/SVG sem complexidade desnecessária.
- Não há geração de bitmap nesta skill. Quando uma foto ou arte rasterizada for realmente necessária, pedir o arquivo ao usuário, reutilizar um ativo já presente no workspace ou substituir por diagrama programático — nunca referenciar um arquivo de imagem que não exista.
- Preferir diagramas programáticos a imagens rasterizadas para fluxos, fórmulas e relações que exigem precisão.
- Toda ilustração programática deve ter rótulos compreensíveis, equivalente textual, contraste adequado, leitura sem depender apenas de cor, comportamento responsivo e versão estável para impressão.
- Não usar imagem decorativa para ocupar espaço nem inserir texto essencial dentro de bitmap.
- Manter a identidade definida em [sistema-visual.md](references/sistema-visual.md).

## Skills complementares

- Antes de qualquer gráfico, painel ou indicador dentro da lição, carregar a skill `dataviz`.
- Antes de publicar a lição como Artifact, carregar a skill `artifact-design`; para diagramas dessa versão, `artifact-diagramming`.
- A identidade visual em [sistema-visual.md](references/sistema-visual.md) prevalece sobre paletas padrão dessas skills; usá-las para forma, acessibilidade e legibilidade, não para trocar as cores institucionais.

## Publicar como Artifact

O arquivo de lição comum referencia `assets/` externos e não funciona publicado. Quando o usuário quiser um link para compartilhar:

1. Gerar a versão de arquivo único, com CSS e JS embutidos:

```bash
node <caminho-da-skill>/scripts/build-standalone.mjs <lesson.html> [saida.html]
```

2. Ler o arquivo gerado e remover as tags `<!doctype>`, `<html>`, `<head>` e `<body>` antes de publicar: o Artifact injeta esse esqueleto. Manter `<title>`, estilos e scripts.
3. Publicar com `favicon` e `description`, mantendo o mesmo caminho de arquivo nas atualizações para preservar a URL.
4. Limites a respeitar: nada de recursos externos além de Google Fonts; `localStorage` sempre em `try/catch`; conteúdo largo com rolagem própria; cores explícitas em `:root` para os dois temas.
5. SCORM não funciona em Artifact. Publicar sempre em modo `local` e entregar o pacote SCORM separadamente quando ambos forem pedidos.

## Validação

Executar após cada lição:

```bash
node <caminho-da-skill>/scripts/validate-lesson.mjs <arquivo.html>
```

Quando a lição tiver botão de conclusão, executar também:

```bash
node <caminho-da-skill>/scripts/test-completion.mjs
```

Esse teste roda `assets/licao-runtime.js` contra um DOM mínimo e cobre a lista da Etapa 3:
estado inicial, visita sem prática, tentativa versus acerto, cada requisito isolado, liberação,
novo bloqueio ao desfazer, revalidação no clique final, retomada, limpeza, modo SCORM e falha de
gravação. Se a lição tiver lógica de conclusão própria em vez do runtime compartilhado,
reproduzir esses casos nela.

Quando a lição usar SCORM, executar também:

```bash
node <caminho-da-skill>/scripts/test-scorm.mjs
```

Além dos scripts:

1. Verificar precisão conceitual em fontes primárias ou confiáveis.
2. Conferir dataset, fórmulas, exemplos e gabaritos por cálculo independente.
3. Acionar todas as práticas e testar respostas corretas, incorretas e incompletas.
4. Testar a conclusão pela lista da Etapa 3: estado inicial, visita a todos os slides sem
   praticar, cumprimento individual de cada requisito, liberação ao cumprir todos, novo
   bloqueio ao desfazer uma resposta correta, revalidação no clique final, limpeza das
   respostas e falha de commit impedindo a conclusão.
5. Calcular o contraste de todo texto contra o fundo herdado, pela receita de
   [sistema-visual.md](references/sistema-visual.md). Herança e cascata apagam texto
   sem que validação estrutural, dataset ou revisão de conteúdo percebam.
6. Testar 1440×900, 1024×768, 390×844, zoom de 200%, teclado e impressão.
7. Recarregar e confirmar retomada.
8. Em SCORM, simular nova sessão e depois testar logout/login no LMS real.
9. Empacotar somente depois que conteúdo, referências locais, manifesto e testes passarem.

Relatar o resultado da validação como ele foi: erros e alertas pendentes explicitamente, e verificações que não puderam ser feitas no ambiente — LMS real, navegadores, impressão — declaradas como não executadas em vez de presumidas.

## Segunda validação independente

`validate-lesson.mjs` cobre estrutura; não sabe se a conta fecha nem se o distrator também está correto. Quando a lição tiver dataset, gabarito calculado, critério de conclusão ou afirmação factual verificável, acionar o subagente `revisor-licao` depois que os scripts passarem e antes de entregar.

Invocar com o agente `revisor-licao` e, quando ele não estiver instalado, com `general-purpose` mais o conteúdo de `agents/revisor-licao.md` no prompt. Informar sempre:

- caminho absoluto do HTML, do dataset e dos runtimes;
- caminho absoluto de `scripts/validate-lesson.mjs`, `scripts/test-completion.mjs` e `scripts/test-scorm.mjs`, com a saída que cada um já produziu;
- caminho absoluto de `references/painel-de-conclusao.md`, quando a lição tiver botão de conclusão;
- as evidências que a lição promete exigir para concluir, com o critério declarado de cada requisito do painel;
- as fontes citadas;
- o que já foi conferido, para ele não repetir.

O valor do revisor está em não ter participado da autoria: passar a ele o problema e os arquivos, nunca o próprio raciocínio de quem escreveu, nem a conclusão esperada.

Ao receber o laudo:

1. Recalcular por conta própria cada bloqueio antes de aceitá-lo — revisor também erra; achado sem evidência reproduzível não é corrigido às cegas.
2. Corrigir os bloqueios confirmados, reexecutar `validate-lesson.mjs` — e `test-completion.mjs` quando a correção tocar o portão de conclusão — e, quando houver correção em conta ou gabarito, submeter novamente à revisão.
3. Relatar ao usuário os bloqueios confirmados, os descartados com a razão e o que segue não verificável no ambiente.

Não delegar a autoria. O revisor não escreve slide, não corrige arquivo e não decide o desenho pedagógico.

## Entregáveis

Entregar:

- mapa pedagógico;
- HTML e ativos locais;
- dataset e dicionário quando aplicáveis;
- explicação dos critérios de conclusão e persistência, com a lista dos requisitos e como cada um é validado;
- fontes;
- testes, resultados de validação e laudo da revisão independente;
- versão de arquivo único e URL do Artifact quando houver publicação;
- pacote SCORM quando solicitado.
