---
name: criar-licoes-interativas
description: Criar conteúdos didáticos e transformá-los em lições HTML interativas, visuais e responsivas, com sliders, imagens, quizzes, checklists, simuladores leves e práticas divertidas. Usar quando Codex precisar planejar uma experiência de aprendizagem, produzir aulas ou materiais educacionais em HTML, adaptar conteúdo para o padrão visual ESMAT/TJTO deste projeto, ou estruturar uma sequência pedagógica com missão, fontes, recuperação ativa e feedback imediato.
---

# Criar lições interativas

Executar o trabalho em duas etapas sequenciais. Não começar pelo layout: primeiro decidir o que o aluno deve aprender e praticar; depois materializar essa experiência em HTML.

## Etapa 1 — Criar o conteúdo

1. Identificar a missão: público, contexto, resultado real esperado e restrições.
2. Verificar o conhecimento prévio e escolher um desafio ligeiramente acima do domínio atual.
3. Pesquisar fontes confiáveis. Para temas técnicos, jurídicos, científicos ou atuais, priorizar fontes primárias e registrar links.
4. Delimitar uma lição a uma vitória observável. Dividir assuntos extensos em lições numeradas.
5. Produzir um roteiro com:
   - pergunta-guia;
   - conhecimento mínimo necessário;
   - exemplo concreto;
   - prática com esforço de recuperação;
   - feedback imediato;
   - síntese ou bilhete de saída;
   - fonte principal.
6. Alternar aquisição fácil de conhecimento com prática deliberadamente desafiadora. Usar recuperação ativa, espaçamento e interleaving quando melhorarem retenção.
7. Confirmar que a prática mede o objetivo declarado, e não apenas leitura ou reconhecimento superficial.

Ler [pedagogia.md](references/pedagogia.md) para planejar missão, fontes, registros de aprendizagem e progressão. Ler [praticas-interativas.md](references/praticas-interativas.md) ao escolher o tipo de exercício.

### Saída obrigatória da etapa 1

Antes de escrever HTML, registrar um mapa curto:

```md
Missão:
Público e contexto:
Vitória observável da lição:
Conceitos essenciais:
Exemplo central:
Prática e feedback:
Fonte principal:
Quantidade e função dos slides:
```

Se o pedido for end-to-end, continuar para a etapa 2 sem interromper. Se uma decisão pedagógica mudar materialmente o escopo, apresentar o mapa e pedir confirmação.

## Etapa 2 — Gerar o HTML interativo

1. Ler [sistema-visual.md](references/sistema-visual.md) antes de produzir a interface.
2. Inspecionar `assets/` no workspace de destino e reutilizar componentes existentes.
3. Quando não existir workspace, executar:

```bash
node <skill-dir>/scripts/init-workspace.mjs <diretorio-destino>
```

4. Usar `assets/licao-modelo.html` como ponto de partida e `assets/estilo-slides.css` como identidade visual. Copiar e adaptar, sem editar os arquivos instalados da skill.
5. Organizar a experiência em slides curtos com `scroll-snap`, navegação por pontos, teclado, contador e layout responsivo.
6. Incluir pelo menos uma prática interativa com feedback automático ou imediatamente revelável. Evitar interação meramente decorativa.
7. Incluir exemplos expansíveis, dicas ou explicações quando reduzirem carga cognitiva.
8. Salvar respostas locais apenas quando forem úteis; informar que `localStorage` não envia dados ao LMS.
9. Garantir impressão legível, foco de teclado, contraste, `aria-live`, redução de movimento e textos alternativos.

## Imagens e ilustrações

1. Planejar a função pedagógica de cada imagem antes de gerar.
2. Usar a skill `$imagegen` ou ferramenta de geração de imagens disponível quando a lição se beneficiar de ilustrações originais.
3. Preferir uma prancha 4×4 de vinhetas coerentes para sequências com muitos slides. Salvar em `assets/illustrations/<slug>-sprites.png` e selecionar cada quadro por `background-position`.
4. Manter a paleta azul-marinho, ciano, turquesa, branco e cinza; usar traço editorial simples e evitar texto dentro da imagem.
5. Tratar vinhetas decorativas como pseudo-elementos. Para imagens que carregam informação, usar `<img>` com `alt` significativo.
6. Se a ferramenta de imagem não estiver disponível, criar diagrama HTML/CSS/SVG simples ou deixar um placeholder explícito; não inventar que a imagem foi gerada.

## Práticas divertidas

Selecionar um padrão de [praticas-interativas.md](references/praticas-interativas.md), por exemplo:

- caça ao erro;
- missão com cenário;
- compare e escolha;
- classificação de cartões;
- quiz de recuperação;
- mini simulador;
- checklist com progresso;
- bilhete de saída.

Associar cada prática a um feedback claro: acerto, explicação, pista, comparação com critério ou próxima tentativa.

## Validação

Executar após criar cada lição:

```bash
node <skill-dir>/scripts/validate-lesson.mjs <arquivo.html>
```

Corrigir erros e revisar alertas pertinentes. Abrir a lição em navegador real, testar desktop e largura móvel, navegar pelo teclado, acionar todas as práticas, recarregar a página e conferir a impressão.

## Entregáveis

Entregar:

- HTML funcional;
- CSS/JS/imagens locais necessários;
- breve resumo da arquitetura pedagógica;
- fontes utilizadas;
- resultado das validações.

Quando solicitado, gerar também uma versão HTML única incorporando CSS, JS e imagens, ou empacotar a lição como SCORM em etapa separada.
