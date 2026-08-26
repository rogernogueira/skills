---
name: criar-licoes-interativas
description: Planejar, criar e revisar lições HTML interativas e responsivas, inclusive para LMS/SCORM, com cenários didáticos, vocabulário contextual, datasets fictícios, quizzes explicativos, simuladores, conclusão verificável e persistência. Usar para aulas, trilhas, materiais educacionais ou revisão pedagógica de lições existentes.
---

# Criar lições interativas

Trabalhar em duas etapas: primeiro projetar a aprendizagem; depois implementar e validar a experiência. Não começar pelo layout.

## Roteamento de referências

- Ler [pedagogia.md](references/pedagogia.md) em toda criação ou revisão substancial.
- Ler [praticas-interativas.md](references/praticas-interativas.md) ao criar quizzes, atividades, simuladores, checklists ou bilhetes de saída.
- Ler [cenario-vocabulario-e-dados.md](references/cenario-vocabulario-e-dados.md) quando houver problema aplicado, cenário, termos de domínio, dataset, fórmula ou gabarito dependente de dados.
- Ler [scorm-e-conclusao.md](references/scorm-e-conclusao.md) quando a lição for destinada a LMS/SCORM, precisar retomar respostas ou tiver conclusão condicionada.
- Ler [sistema-visual.md](references/sistema-visual.md) antes de criar ou alterar HTML/CSS.

## Etapa 1 — Projetar a aprendizagem

1. Definir público, contexto, conhecimento prévio, restrições e uma vitória observável.
2. Formular uma pergunta-guia que leve à ação esperada.
3. Quando houver problema aplicado, apresentar antes da técnica: organização ou ambiente fictício, serviço, pessoas e papéis, fluxo atual, dificuldade concreta, consequências, decisão apoiada, salvaguardas e condição de não uso.
4. Explicar termos abstratos na primeira ocorrência com definição curta, exemplo no cenário e, quando útil, contraexemplo.
5. Selecionar somente o conhecimento necessário para executar a habilidade.
6. Planejar exemplo resolvido, recuperação ativa, prática aplicada, feedback e síntese.
7. Definir antes da implementação as evidências que liberam a conclusão. Distinguir visita, tentativa, acerto, completude, exploração e persistência.
8. Remover carga horária, duração estimada e promessas de tempo. Manter apenas períodos pertencentes ao problema estudado.

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
Interações que precisam persistir:
Comportamento esperado na retomada:
Fonte principal:
Ilustrações didáticas em HTML/CSS/SVG/JS:
Quantidade e função dos slides:
```

A quantidade de slides é consequência da progressão. Ampliar quando isso separar contexto, vocabulário, conceito, exemplo, prática, feedback ou síntese. Não reduzir fonte nem condensar funções distintas apenas para preservar uma contagem fixa.

## Regras para dados, exemplos e gabaritos

- Usar dados fictícios ou públicos e declarar a natureza do cenário.
- Quando um dataset for usado em atividade aplicada, criar mais de 30 registros coerentes com o problema. Esse mínimo é didático e não demonstra suficiência estatística ou prontidão para produção.
- Incluir dicionário de dados, momento de disponibilidade das colunas, regra reproduzível do alvo, casos comuns, classe minoritária e casos de fronteira.
- Evitar vazamento: atributos de entrada devem existir no momento da previsão.
- Recalcular do dataset todas as contagens, prevalências, baselines, métricas e respostas numéricas mostradas.
- Garantir uma única resposta defensável por questão. Usar distratores plausíveis e visualmente equivalentes.
- Explicar por que cada alternativa está correta ou incorreta. Não usar apenas “correto” ou “tente novamente”.
- Criar teste automatizado sempre que dataset, slide e gabarito compartilhem um resultado calculável.

## Etapa 2 — Implementar a experiência

1. Inspecionar o workspace e reutilizar seus componentes. Quando não existir, executar:

```bash
node <skill-dir>/scripts/init-workspace.mjs <diretorio-destino>
```

2. Partir de `assets/licao-modelo.html`, adaptando a sequência ao mapa pedagógico.
3. Usar slides curtos com `scroll-snap`, contador, navegação por pontos e teclado. Reservar uma função principal por slide.
4. Incluir ao menos uma prática que meça a vitória observável e ofereça tentativa, feedback e revisão.
5. Tratar sliders como exploração orientada: registrar cenários relevantes, não apenas movimento.
6. Dar IDs estáveis a todos os campos persistentes.
7. Usar `localStorage` apenas como conveniência ou contingência. Em LMS, persistir no estado SCORM e restaurar estado funcional e visual.
8. Quando houver botão de conclusão, mostrar checklist do que falta e revalidar tudo no clique final.
9. Garantir foco visível, teclado, contraste, `aria-live`, redução de movimento, texto alternativo e impressão legível.

## Imagens e ilustrações

- Planejar a função pedagógica antes de gerar uma imagem.
- Sempre que possível, criar ilustrações didáticas com HTML, CSS, SVG e JavaScript: fluxos, filas, linhas do tempo, matrizes, comparações, gráficos, estados antes/depois e simulações respondem melhor quando permanecem nítidos, responsivos e manipuláveis.
- Usar JavaScript quando a mudança de parâmetros, o destaque progressivo ou a interação ajudarem a explicar uma relação. Para ilustração estática, preferir HTML/CSS/SVG sem complexidade desnecessária.
- Usar `$imagegen` quando uma ilustração original melhorar a compreensão.
- Preferir diagramas programáticos a imagens rasterizadas para fluxos, fórmulas e relações que exigem precisão.
- Toda ilustração programática deve ter rótulos compreensíveis, equivalente textual, contraste adequado, leitura sem depender apenas de cor, comportamento responsivo e versão estável para impressão.
- Não usar imagem decorativa para ocupar espaço nem inserir texto essencial dentro de bitmap.
- Manter a identidade definida em [sistema-visual.md](references/sistema-visual.md).

## Validação

Executar após cada lição:

```bash
node <skill-dir>/scripts/validate-lesson.mjs <arquivo.html>
```

Além do validador:

1. Verificar precisão conceitual em fontes primárias ou confiáveis.
2. Conferir dataset, fórmulas, exemplos e gabaritos por cálculo independente.
3. Acionar todas as práticas e testar respostas corretas, incorretas e incompletas.
4. Testar 1440×900, 1024×768, 390×844, zoom de 200%, teclado e impressão.
5. Recarregar e confirmar retomada.
6. Em SCORM, simular nova sessão e depois testar logout/login no LMS real.
7. Empacotar somente depois que conteúdo, referências locais, manifesto e testes passarem.

## Entregáveis

Entregar:

- mapa pedagógico;
- HTML e ativos locais;
- dataset e dicionário quando aplicáveis;
- explicação dos critérios de conclusão e persistência;
- fontes;
- testes e resultados de validação;
- pacote SCORM quando solicitado.
