# criar-licoes-interativas — versão para Claude

Skill para planejar, criar, revisar e validar lições HTML interativas (slides com
`scroll-snap`, quizzes com feedback explicativo, simuladores, conclusão verificável,
persistência local ou SCORM).

Esta pasta é a adaptação da skill para Claude. A pasta `../codex/` mantém a versão original.

## Instalar

Requer apenas Node.js para os scripts de apoio (`node --version`).

**Claude Code — uso pessoal, em qualquer projeto:**

```bash
cp -r . ~/.claude/skills/criar-licoes-interativas
```

**Claude Code — compartilhada com o repositório de um projeto:**

```bash
mkdir -p <projeto>/.claude/skills
cp -r . <projeto>/.claude/skills/criar-licoes-interativas
```

**Claude.ai / Claude Desktop:** compactar a pasta preservando `SKILL.md` na raiz do zip
e enviá-la em Settings → Capabilities → Skills.

```bash
zip -r criar-licoes-interativas.zip SKILL.md README.md agents assets references scripts
```

**Agente de revisão (opcional, só em Claude Code):** um diretório de skill não registra
subagentes. Para que `revisor-licao` fique disponível, copiar o arquivo para um dos caminhos
que o Claude Code varre:

```bash
mkdir -p ~/.claude/agents && cp agents/revisor-licao.md ~/.claude/agents/
# ou, por projeto:
mkdir -p <projeto>/.claude/agents && cp agents/revisor-licao.md <projeto>/.claude/agents/
```

Sem essa cópia a skill continua funcionando: ela recorre ao agente `general-purpose`
carregando o conteúdo de `agents/revisor-licao.md` no prompt. Em claude.ai não há subagentes,
e a segunda validação passa a ser feita pelo próprio Claude na conversa.

Confirmar a instalação em Claude Code com `/skills` e `/agents`. A skill é acionada pelo pedido em
linguagem natural ("crie uma lição sobre…", "revise esta lição") ou explicitamente por
`/criar-licoes-interativas`.

## Estrutura

| Caminho | Função |
|---|---|
| `SKILL.md` | Fluxo obrigatório: projetar a aprendizagem, implementar, auditar a conclusão, validar, entregar. |
| `references/pedagogia.md` | Princípios de aprendizagem e revisão pedagógica. |
| `references/praticas-interativas.md` | Quizzes, atividades, simuladores, checklists, bilhetes de saída. |
| `references/cenario-vocabulario-e-dados.md` | Cenário fictício, vocabulário, dataset, gabaritos. |
| `references/scorm-e-conclusao.md` | Persistência, retomada, critérios de conclusão, empacotamento. |
| `references/painel-de-conclusao.md` | Etapa 3: inventário das interações, requisitos por evidência, checklist vivo, validação, testes. |
| `references/sistema-visual.md` | Identidade visual, componentes, acessibilidade, arquivo único e Artifact. |
| `assets/licao-modelo.html` | Template de oito slides com marcadores `{{...}}`. |
| `assets/estilo-slides.css`, `assets/componentes-interativos.css` | Casca visual e componentes. |
| `assets/licao-runtime.js` | Navegação, quizzes, persistência, painel de conclusão verificável. |
| `assets/scorm-runtime.js` | Ponte SCORM 1.2, com degradação silenciosa fora do LMS. |
| `scripts/init-workspace.mjs` | Cria workspace de autoria com ativos e documentos de planejamento. |
| `scripts/validate-lesson.mjs` | Valida estrutura, acessibilidade, quizzes, dataset e referências locais. |
| `scripts/build-standalone.mjs` | Gera versão de arquivo único para publicar como Artifact. |
| `scripts/test-completion.mjs` | Testa o portão de conclusão: bloqueio por evidência, revalidação, retomada, limpeza e modo SCORM. |
| `scripts/test-scorm.mjs` | Testa persistência, conclusão, retomada em nova sessão e bloqueio por falha de commit. |
| `agents/revisor-licao.md` | Subagente revisor: recalcula contas, contesta gabaritos, audita o painel de conclusão e a acessibilidade. Só relata. |

## Uso rápido

```bash
SKILL=~/.claude/skills/criar-licoes-interativas

node "$SKILL/scripts/init-workspace.mjs" ./curso-exemplo
cp ./curso-exemplo/assets/licao-modelo.html ./curso-exemplo/lessons/0001-tema.html
# editar a lição conforme o mapa pedagógico
node "$SKILL/scripts/validate-lesson.mjs" ./curso-exemplo/lessons/0001-tema.html
node "$SKILL/scripts/test-completion.mjs"
node "$SKILL/scripts/test-scorm.mjs"
node "$SKILL/scripts/build-standalone.mjs" ./curso-exemplo/lessons/0001-tema.html
```

Depois dos scripts, pedir a revisão independente: "revise a lição
./curso-exemplo/lessons/0001-tema.html com o revisor-licao".

## O que mudou em relação à versão Codex

- Removido `agents/openai.yaml`; a descoberta da skill em Claude vem do `description` no
  frontmatter de `SKILL.md`.
- Acrescentado `agents/revisor-licao.md`: segunda validação, semântica, feita por um agente que
  não participou da autoria — recalcula as contas do dataset, contesta cada gabarito, confere os
  critérios de conclusão e a precisão conceitual. Relata, não corrige.
- Removida a chamada `$imagegen`. Ilustrações são programáticas (HTML/CSS/SVG/JS); bitmaps
  só entram quando o arquivo já existe, e o briefing 4×4 virou material para entregar ao usuário.
- Caminhos de scripts descritos como absolutos a partir do diretório da skill, porque o estado
  do shell não persiste entre chamadas de ferramenta em Claude Code.
- Acrescentados o fluxo de publicação como Artifact e `scripts/build-standalone.mjs`.
- Acrescentada a composição com as skills `dataviz`, `artifact-design` e `artifact-diagramming`,
  com as cores institucionais prevalecendo sobre as paletas padrão delas.
- Reforçadas as regras de não inventar fatos, calcular números com ferramenta e relatar a
  validação como ela ocorreu, incluindo o que não pôde ser testado no ambiente.
- Acrescentada a Etapa 3, com `references/painel-de-conclusao.md`, o painel de conclusão no
  template, a linha de estado da gravação, a revalidação no clique final, a conclusão local
  persistente e `scripts/test-completion.mjs`.
