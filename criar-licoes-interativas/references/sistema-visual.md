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
- **Modelo mental:** diagrama ou comparação simples.
- **Exemplo:** situação concreta com evidências.
- **Prática:** instrução, interação e feedback visíveis.
- **Síntese:** princípios essenciais e bilhete de saída.

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
- `localStorage` apenas para conveniência;
- botão de impressão;
- opção de limpar dados com confirmação.

Não bloquear rolagem natural em telas pequenas. Ignorar atalhos quando o foco estiver em `input`, `textarea`, `select`, botão ou link.

## Imagens

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
