# Sistema visual e técnico

## Identidade

Usar a linguagem visual do projeto ESMAT/TJTO: portal público contemporâneo, institucional e acolhedor.

| Papel | Token | Valor |
|---|---|---|
| Primário | `--azul-marinho` | `#07164D` |
| Ação | `--azul` | `#005EA8` |
| Destaque | `--ciano` | `#18A9D5` |
| Apoio | `--turquesa` | `#19B7C8` |
| Fundo | `--cinza-claro` | `#F4F6F8` |
| Texto | `--grafite` | `#222222` |
| Alerta | `--alerta` | `#B9564E` |

Usar Montserrat/Roboto/Open Sans com fallbacks de sistema. Aplicar sombras discretas, cantos de 6–14 px e grande espaço em branco. Evitar gradientes aleatórios, glassmorphism, neon, excesso de ícones ou aparência de dashboard comercial.

## Casca dos slides

Usar:

- `.apresentacao` como sequência;
- `.slide` com altura mínima de viewport e `scroll-snap`;
- `.slide-inner` como cartão branco com faixa superior azul-marinho;
- `.slide-counter` para posição;
- `.dot-nav` para navegação;
- `.master-hero`, `.master-split`, `.master-focus` e `.master-dense` conforme densidade.

Reservar um slide para uma função clara. Evitar reduzir fonte para acomodar conteúdo excessivo; dividir o conteúdo.

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

Para muitas vinhetas, gerar uma única prancha quadrada 4×4:

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

Usar imagens avulsas quando o conteúdo exigir detalhes, diagramas ou texto alternativo específico. Não usar imagem meramente para preencher espaço.

## Acessibilidade e impressão

- Usar HTML semântico e hierarquia de títulos.
- Garantir foco visível e operação por teclado.
- Incluir `aria-expanded`, `aria-controls`, `aria-live` e rótulos adequados.
- Respeitar `prefers-reduced-motion`.
- Garantir contraste WCAG AA para textos normais.
- Fornecer `alt` útil em imagens informativas.
- Em impressão, remover navegação flutuante, expandir respostas e evitar cortes de cartões.

## Validação visual

Conferir ao menos:

- 1440×900;
- 1024×768;
- 390×844;
- impressão/PDF;
- zoom de 200%;
- navegação somente por teclado.
