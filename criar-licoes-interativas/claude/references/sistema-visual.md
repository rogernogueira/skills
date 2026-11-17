# Sistema visual e técnico

## Identidade

Usar a linguagem visual do projeto ESMAT/TJTO: portal público contemporâneo, institucional e acolhedor.

| Papel | Token | Valor | Serve como texto? |
|---|---|---|---|
| Primário | `--azul-marinho` | `#07164D` | sim, em superfície clara |
| Ação | `--azul` | `#005EA8` | sim, em superfície clara |
| Destaque | `--ciano` | `#18A9D5` | **não** — só superfície, borda e realce |
| Apoio | `--turquesa` | `#19B7C8` | **não** — só superfície, borda e realce |
| Fundo | `--cinza-claro` | `#F4F6F8` | — |
| Texto | `--grafite` | `#222222` | sim, em superfície clara |
| Alerta | `--alerta` | `#B9564E` | só sobre branco puro |

A última coluna não é preferência: decorre da matriz de contraste abaixo.

Usar Montserrat/Roboto/Open Sans com fallbacks de sistema. Aplicar sombras discretas, cantos de 6–14 px e grande espaço em branco. Evitar gradientes aleatórios, glassmorphism, neon, excesso de ícones ou aparência de dashboard comercial.

## Contraste e superfícies

Contraste é calculável. Calcular, nunca avaliar a olho — e nunca declarar apenas
"garantir WCAG AA", porque essa frase não impede nenhum dos defeitos abaixo.

Mínimos: **4,5:1** para texto normal, **3:1** para texto grande (≥ 24 px, ou
≥ 18,66 px em negrito) e para objeto gráfico — incluindo seta, marcador e
separador decorativo. `aria-hidden="true"` dispensa a leitura, não o contraste.

### Matriz verificada da paleta

Razão de contraste de cada cor de texto sobre cada superfície da identidade:

| texto ↓ · fundo → | branco | cinza-claro | azul-suave | ciano-suave | alerta-suave | azul-marinho |
|---|---|---|---|---|---|---|
| `--azul-marinho` #07164D | 17,06 | 15,75 | 15,28 | 15,40 | 13,75 | **1,00** |
| `--azul` #005EA8 | 6,63 | 6,12 | 5,94 | 5,99 | 5,34 | **2,57** |
| `--ciano` #18A9D5 | **2,74** | **2,53** | **2,45** | **2,47** | **2,20** | 6,23 |
| `--turquesa` #19B7C8 | **2,43** | **2,24** | **2,18** | **2,19** | **1,96** | 7,03 |
| `--grafite` #222222 | 15,91 | 14,69 | 14,25 | 14,36 | 12,82 | **1,07** |
| `--cinza-medio` #525A66 | 6,97 | 6,43 | 6,24 | 6,29 | 5,62 | **2,45** |
| `--alerta` #B9564E | 4,66 | *4,30* | *4,18* | *4,21* | *3,76* | *3,66* |
| `--ok` #7F9B76 | *3,06* | **2,83** | **2,75** | **2,77** | **2,47** | 5,57 |
| `--branco` #FFFFFF | **1,00** | **1,08** | **1,12** | **1,11** | **1,24** | 17,06 |

Sem marca: aprovado para texto normal. *Itálico*: só objeto gráfico ou texto
grande. **Negrito**: reprovado em qualquer uso.

### O que a matriz determina

- `--ciano` e `--turquesa` **não são cores de texto sobre fundo claro**. Falham
  até o mínimo de objeto gráfico. Reservá-las para preenchimento, borda, foco e
  fundo de selo. Sobre `--azul-marinho` passam com folga. Para texto, `--ciano-texto`.
- `--cinza-medio` já vale `#525A66`: o valor anterior (`#6B7280`) passava só em
  branco puro e caía para 3,90:1 sobre `--alerta-suave`, 4,46 no fundo do chip
  `<code>` e 4,36 na faixa clara de um gradiente. Nunca usá-lo sobre `--azul-marinho`.
- `--alerta` como texto só sobre branco. Sobre o seu próprio `--alerta-suave` dá
  3,76:1; usar `--alerta-texto` (7,84:1).
- `--ok` como texto pede `--ok-texto` (≥ 4,81:1); o token puro não serve nem no branco.
- `--branco` só sobre `--azul-marinho`.

### Herança que apaga texto em superfície escura

`assets/estilo-slides.css` declara, no escopo global:

```css
strong   { color: var(--azul-marinho); }
em.termo { color: var(--azul); }
code     { background: var(--cinza-claro); }  /* sem color: herda do contexto */
```

As três estão certas sobre superfície clara e erradas sobre superfície escura —
e o navegador não avisa:

- `strong` dentro de cartão `--azul-marinho` fica **1,00:1**: a cor do texto é
  exatamente a cor do fundo. O texto some.
- `em.termo` no mesmo cartão fica 2,57:1.
- `code` traz o próprio fundo claro e **herda a cor do contexto**: dentro de cartão
  escuro herda o branco e desaparece sobre o cinza-claro do chip.

**Regra.** Todo componente com superfície `--azul-marinho` precisa redeclarar a cor
de `strong`, `b`, `em` e `code`, e dar a `code` um fundo próprio translúcido:

```css
.cartao-escuro strong,.cartao-escuro b,.cartao-escuro em{color:#fff}
.cartao-escuro code{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.34);color:#fff}
```

Definir `color` no contêiner **não basta**: regras de elemento como `strong` têm
especificidade maior que a herança e vencem sempre.

`assets/estilo-slides.css` já aplica esse tratamento a `.superficie-escura`,
`.marca-conclusao`, `thead th`, `.salvo` e `.btn:hover`. Marcar com
`.superficie-escura` toda superfície escura criada pela lição.

Uma ressalva do padrão: `thead th` está na lista porque o cabeçalho de tabela da
skill é azul-marinho. Lição que repintar `thead th` com fundo claro precisa
redeclarar essas cores, ou terá branco sobre claro.

### Cascata: a correção que se anula

Duas regras de mesma especificidade no mesmo arquivo — a última vence. Uma correção
de contraste escrita no topo da folha é silenciosamente desfeita por uma regra de
componente escrita depois:

```css
.aviso strong,.fluxo-passo.falha b{color:#6E322D}   /* no topo: a correção */
/* … 34 linhas adiante, na regra do componente … */
.fluxo-passo.falha b{color:var(--alerta)}           /* desfaz metade dela */
```

Depois de corrigir contraste, procurar no arquivo outra declaração de `color` para
o mesmo seletor. Um teste de string não vê isso; só a cascata resolvida vê.

### Como verificar

Ler o CSS não basta: os defeitos vêm de herança e de cascata, que só aparecem
resolvidas. Os scripts desta skill não têm dependências externas, então o teste de
contraste vive no workspace da lição, com `jsdom` como dependência de
desenvolvimento. Ele carrega o HTML com as folhas embutidas, percorre todo elemento
com texto próprio, resolve a cor e o fundo herdado e compara com o mínimo.

Duas armadilhas do ambiente, que custam falso positivo se ignoradas:

1. O jsdom **não expande** `background: var(--x)` em `background-color`. Ler o
   atalho com `getPropertyValue("background")` e resolver o token pelo `:root`, que
   `getPropertyValue("--token")` devolve. Cuidado com `||`: `backgroundColor` vem
   `rgba(0, 0, 0, 0)`, que é objeto **truthy** e descarta o atalho.
2. Um gradiente pinta mais de uma cor sob o mesmo texto. Extrair todas as paradas
   e medir contra a pior.

Registrar no relatório o número de elementos avaliados, não só "passou".

## Casca dos slides

Usar:

- `.apresentacao` como sequência;
- `.slide` com altura mínima de viewport e `scroll-snap`;
- `.slide-inner` como cartão branco com faixa superior azul-marinho;
- `.slide-counter` para posição;
- `.dot-nav` para navegação;
- `.master-hero`, `.master-split`, `.master-focus` e `.master-dense` conforme densidade.

Reservar um slide para uma função clara. Evitar reduzir fonte para acomodar conteúdo excessivo; dividir o conteúdo.

## Lição rica (padrão da Lição 05B)

Ativar com `<body class="new-edition licao-rica">`. Os componentes estão no fim de
`assets/componentes-interativos.css`; o roteiro didático está em [arco-didatico.md](arco-didatico.md).

**Cromo idêntico em todos os slides:**

- `.slide-topo`: `.etapa` (ícone + nome da função: Abertura, Conceito · 1 de 3, Prática…) à
  esquerda e `.slide-counter` à direita;
- `.slide-rodape`: `.progresso-slide` (trilho + "Slide N de M") e `.slide-nav` com
  `[data-nav-prev]` / `[data-nav-next]` (desabilitar o anterior no primeiro e o próximo no último);
- `.barra-topo` com `[data-progress-fill]`, atualizada pelo runtime;
- `.skip-link` e `h1`/`h2` com `tabindex="-1"`.

**Cores semânticas** (fixas na lição inteira, sempre com ícone e etiqueta — `.marcador`):

| Papel | Ícone | Texto | Fundo | Contraste |
|---|---|---|---|---|
| Conceito | ◆ | `--sem-conceito` #00518F | `--sem-conceito-bg` #EDF3FA | 7,31:1 |
| Evidência correta | ✓ | `--sem-correto` #1F6B3B | `--sem-correto-bg` #E9F6EC | 5,85:1 |
| Atenção | ▲ | `--sem-atencao` #8A5300 | `--sem-atencao-bg` #FDF3E0 | 5,75:1 |
| Risco ou erro | ✕ | `--sem-risco` #98302A | `--sem-risco-bg` #FCEDEB | 6,61:1 |
| Metadado / etapa | — | `--sem-neutro` #4B5563 | `--sem-neutro-bg` #F1F3F6 | 6,80:1 |

Risco usa também borda tracejada, para não depender da cor. `--cinza-medio` (#525A66) passa acima
de 6:1 sobre qualquer um desses fundos. O preenchimento ciano das barras de progresso é decorativo:
a posição está sempre escrita ao lado.

**Componentes da lição rica:**

- `.hero-figura` (abertura com figura) e `.duas-colunas` (figura + texto) — `.figura-licao` com
  `<figcaption>` descritiva; `--razao-svg` limita a altura pela razão do `viewBox`;
- `.termo-def` (termo na primeira ocorrência), `.origem-numero` ("De onde vêm os números"),
  `.ponte` ("Próximo passo"), `.caixa-preta`, `.lt-nota` + `.marcador` ("O que fazer aqui");
- `.instrucao` ("Como fazer" em três itens);
- quiz com `.quiz-letra`, `.quiz-corpo`, `.quiz-texto`, `.quiz-porque[data-porque][hidden]`;
- `.lado-a-lado` com `article.lado-risco | .lado-correto | .lado-atencao`;
- `.sim-bloco`, `.sim-controles`, `.sim-result[data-nivel]`;
- `[data-activity]` com `.activity-grid`, `.campo-atividade`, `.campo-nota[data-nota-for]`,
  `.progresso-atividade`, `[data-check-activity]`, `.revelar-ao-concluir`;
- `.sintese-lista` numerada.

**Figuras no padrão 05B:**

- uma figura SVG por slide conceitual, desenhada com coordenadas calculadas do dataset;
- forma + cor + rótulo para cada classe (círculo azul × quadrado marrom), estáveis na lição toda;
- a mesma figura base evolui entre slides (dados → candidatas → margem → simulador → destaque);
- rótulos sobre pontos com `paint-order: stroke` e contorno branco, para não sumirem no gráfico;
- conferir no navegador que rótulos e faixas não se sobrepõem a pontos nem são cortados pelo quadro;
- CSS específico da lição num arquivo próprio (`assets/<slug>.css`), com prefixo de classe próprio.

**Animação:** finita (< 5 s), só dentro de `@media (prefers-reduced-motion: no-preference)` e
disparada quando o slide entra em cena; o estado padrão é o final, para que sem JavaScript, com
movimento reduzido ou na impressão nada fique escondido.

**Densidade:** o cromo e as instruções custam altura. Slides com quiz podem passar da tela;
medir em 1280×800 e 390×844 e aceitar rolagem apenas onde a prática exige. Não reduzir fonte.

## Tipos de slide

- **Hero:** título, missão, promessa, pergunta-guia e imagem principal.
- **Cenário:** organização fictícia, pessoas, processo, gargalo e consequência.
- **Vocabulário:** definição curta, exemplo contextual e limite de termos abstratos.
- **Modelo mental:** diagrama ou comparação simples.
- **Exemplo:** situação concreta com evidências.
- **Prática:** instrução, interação e feedback visíveis.
- **Síntese:** princípios essenciais, bilhete de saída e requisitos de conclusão.

Reservar um slide para uma função principal. Ampliar a sequência quando cenário, vocabulário, cálculo, interpretação, prática e feedback disputarem espaço; não reduzir fontes para manter uma contagem fixa.

## Componentes

Reutilizar e estender:

- `.caixa`, `.aviso`, `.nota` para explicações;
- `.card-grid` e cartões para escolhas;
- `.btn` e `.btn-secundario` para ações;
- `.bloco-codigo` e `.btn-copiar` para prompts ou trechos;
- `.check-item` para checklists;
- `.example-button` e `.example-panel` para exemplos sob demanda;
- `.registro` para anotações locais;
- tabelas responsivas para comparação.

Manter os controles com rótulos verbais; não depender somente de ícones.

## Interação

Implementar:

- setas, Page Up/Down, Home e End;
- pontos clicáveis;
- anúncio de mudança de slide por `aria-live`;
- feedback imediato em quizzes;
- `localStorage` apenas para conveniência ou contingência;
- persistência SCORM quando o trabalho precisar acompanhar o aluno entre sessões;
- checklist visível do que falta antes da conclusão;
- botão de impressão;
- opção de limpar dados com confirmação.

Não bloquear rolagem natural em telas pequenas. Ignorar atalhos quando o foco estiver em `input`, `textarea`, `select`, botão ou link.

## Ilustrações programáticas

Sempre que a ideia puder ser representada com precisão, preferir HTML, CSS, SVG e JavaScript a uma imagem rasterizada. Usar esses recursos para:

- fluxos e filas;
- linhas do tempo e janelas;
- matrizes, quadrantes e árvores;
- comparações antes/depois;
- gráficos e distribuições;
- relações entre variáveis;
- simulações com parâmetros;
- destaque progressivo de etapas.

Escolher a tecnologia mais simples que preserve a função pedagógica:

1. **HTML/CSS:** cartões, fluxos, filas, matrizes, barras e comparações estáticas.
2. **SVG:** diagramas com conexões, escalas, formas ou posicionamento preciso.
3. **JavaScript:** mudanças de estado, controles, animações explicativas e simulações em que a interação revela uma relação.
4. **Canvas:** somente quando muitos elementos dinâmicos justificarem a perda de semântica do DOM.

Não adicionar JavaScript apenas para animar decoração. Cada mudança deve responder a uma ação ou tornar causa, sequência, quantidade ou consequência mais compreensível.

Toda ilustração programática deve:

- possuir título, legenda ou texto equivalente;
- continuar compreensível sem depender apenas de cor ou movimento;
- oferecer rótulos acessíveis para valores e controles;
- respeitar `prefers-reduced-motion`;
- adaptar-se à largura disponível sem corte ou rolagem horizontal desnecessária;
- produzir versão estável e legível na impressão;
- manter cálculos e proporções coerentes com o conteúdo e o dataset.

## Imagens rasterizadas

Esta skill não gera bitmaps. Uma imagem rasterizada só entra na lição quando o arquivo já existe: enviado pelo usuário, presente no workspace ou produzido fora daqui a partir de um briefing. Nunca referenciar um caminho de imagem inexistente — o validador acusa referência local ausente, e a lição publicada mostra ícone quebrado.

Briefing a entregar ao usuário ou ao gerador de imagens quando muitas vinhetas forem necessárias, como prancha quadrada 4×4:

```text
Prancha editorial 4×4, dezesseis cenas independentes, traço simples e consistente,
paleta #07164D #005EA8 #18A9D5 #19B7C8 branco e cinza claro,
fundo limpo, sem palavras, sem letras, sem números, margem segura em cada quadro,
personagens diversos, contexto institucional e educacional, leitura clara em miniatura.
```

Salvar em `assets/illustrations/<slug>-sprites.png`. Configurar no HTML:

```html
<body style="--art-sheet:url('../assets/illustrations/<slug>-sprites.png');--art-grid-x:400%;--art-grid-y:400%">
```

Selecionar quadros com `--art-x` e `--art-y` nos valores `0%`, `33.333%`, `66.667%` e `100%`.

Usar imagens avulsas quando o conteúdo exigir detalhes, diagramas ou texto alternativo específico. Não usar imagem meramente para preencher espaço. Enquanto o arquivo não existir, manter o diagrama programático equivalente em vez de deixar a referência pendente.

## Versão de arquivo único e Artifact

A lição normal referencia `assets/` externos e só funciona no diretório do workspace. Para compartilhar como Artifact, gerar a variante de arquivo único com `scripts/build-standalone.mjs` e observar:

- nenhum recurso externo é carregado, exceto fontes do Google Fonts; toda fonte precisa de pilha de fallback do sistema;
- imagens e datasets precisam estar embutidos como `data:` URI ou removidos da variante publicada;
- `localStorage` funciona por visitante, sempre dentro de `try/catch`, e não substitui SCORM;
- tabelas, blocos de código e diagramas largos rolam dentro do próprio contêiner, nunca no corpo da página;
- as cores institucionais são definidas em `:root`, com `body` sempre pintado explicitamente, para que a página não herde o tema do hospedeiro;
- downloads iniciados pela própria página são bloqueados: oferecer impressão em PDF, não link de arquivo.

## Acessibilidade e impressão

- Usar HTML semântico e hierarquia de títulos.
- Garantir foco visível e operação por teclado.
- Incluir `aria-expanded`, `aria-controls`, `aria-live` e rótulos adequados.
- Respeitar `prefers-reduced-motion`.
- Garantir os mínimos de contraste da seção "Contraste e superfícies", **calculados**
  sobre o fundo efetivamente herdado — não sobre o fundo que o componente parece ter.
- Fornecer `alt` útil em imagens informativas.
- Em impressão, remover navegação flutuante, expandir respostas e evitar cortes de cartões.

## Validação visual

Calcular por script, antes de abrir o navegador:

- contraste de todo texto contra o fundo herdado, pela receita acima;
- ausência de segunda declaração de `color` para um seletor já corrigido.

Conferir com o navegador aberto, porque nada disso é verificável por código:

- 1440×900;
- 1024×768;
- 390×844;
- impressão/PDF;
- zoom de 200%;
- navegação somente por teclado.

Relatar como não executado o que não foi aberto. Texto invisível por herança já
passou por validação estrutural limpa, dataset conferido e revisão independente —
e foi encontrado por uma pessoa olhando a tela.
