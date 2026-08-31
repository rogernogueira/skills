# Painel de conclusão verificável

Ler esta referência ao criar o slide de conclusão de uma lição nova e, obrigatoriamente, ao
auditar um módulo já existente cuja conclusão dependa apenas de navegação, de tentativa ou de
nenhuma evidência.

O objetivo é sempre o mesmo: o botão de conclusão só libera quando o módulo tem prova de que o
estudante exerceu a habilidade, e o estudante sempre sabe o que ainda falta.

## 1. Inventário antes de alterar código

Não editar nada antes de listar o que existe. Registrar em tabela:

| Interação | ID estável | Tipo | Critério de acerto | Obrigatória? | Onde persiste | Retomada |
|---|---|---|---|---|---|---|

Percorrer todos os slides e catalogar quizzes, atividades com gabarito, seletores, campos de
texto, checkboxes, sliders, simuladores, desafios, exercícios e bilhetes de saída. Anotar
também o que falta: controle sem ID, resposta que fica só no navegador, estado visual que não
volta na retomada, feedback perdido ao recarregar.

Buscar no runtime por `data-complete`, `data-required`, `localStorage`, `cmi.suspend_data`,
`LMSSetValue`, `LMSGetValue`, `LMSCommit` e pela regra que hoje habilita a conclusão. Declarar
essa regra por escrito antes de substituí-la.

Registrar no relatório final: nome do módulo, plataforma (SCORM 1.2, SCORM 2004 ou página
autônoma), arquivo principal e runtime compartilhado.

## 2. Requisitos derivados de evidência real

Os requisitos vêm do que o módulo realmente pede ao estudante e da vitória observável do mapa
pedagógico. Não criar atividade nova só para engordar a lista, não perseguir uma quantidade
fixa de requisitos e não transformar em requisito aquilo que o módulo não consegue medir.

Distinguir os seis tipos:

- **visita** — slide efetivamente apresentado;
- **tentativa** — interação realizada;
- **acerto** — resposta correta;
- **completude** — texto ou checklist que atende ao critério;
- **exploração** — condições pedagogicamente relevantes investigadas;
- **persistência** — gravação confirmada pelo LMS.

Formulações que funcionam, usando somente as que se aplicarem ao módulo:

- Visitar todos os `N` slides.
- Acertar todos os `N` campos da atividade `NOME`.
- Responder corretamente ao desafio `NOME`.
- Marcar os itens obrigatórios do checklist `NOME`.
- Explorar os cenários `CONDIÇÕES` no simulador.
- Escrever o bilhete de saída com pelo menos `N` palavras.
- Confirmar a gravação do trabalho no LMS, quando obrigatória.

Escrever cada rótulo na língua do estudante, não na do código: "Responder corretamente ao
desafio final", nunca "quiz-3 correct".

## 3. Regras de validação

- Visitar slides, isoladamente, não libera a conclusão quando existirem práticas obrigatórias.
- Quiz obrigatório exige resposta correta, não apenas tentativa.
- Atividade com gabarito exige todos os campos corretos.
- Texto obrigatório usa critério objetivo e mostra a contagem ao estudante enquanto ele digita.
- Simulador registra condições significativas; mover um controle não é aprendizagem.
- Se uma resposta correta for alterada para incorreta ou incompleta, o requisito volta a ficar
  pendente e o botão volta a desabilitar.
- O botão de conclusão permanece desabilitado enquanto existir qualquer pendência.
- No clique final, revalidar todos os requisitos antes de gravar; nunca confiar apenas no
  estado `disabled` do botão.

## 4. Checklist vivo

O painel fica junto ao botão de conclusão e:

1. mostra quantos requisitos ainda faltam;
2. lista os requisitos em linguagem clara para o estudante;
3. usa `✓` para cumprido e `○` para pendente;
4. atualiza a cada navegação e a cada mudança de resposta;
5. informa "Todos os requisitos cumpridos. A unidade pode ser concluída." quando não há pendência;
6. é anunciado por `role="status"` com `aria-live="polite"`;
7. não comunica estado apenas por cor — o símbolo é decorativo (`aria-hidden`) e o estado vai
   em texto para o leitor de tela;
8. funciona em celular, tablet, desktop, zoom de 200% e impressão.

Organização visual de referência, a ser adaptada à identidade do projeto:

```text
┌──────────────────────────────────────────────────────────┐
│ CONCLUSÃO DO MÓDULO                                      │
│                                                          │
│ 3 requisitos ainda pendentes. Confira a lista abaixo.    │
│                                                          │
│ ✓ Visitar os 12 slides                                   │
│ ✓ Completar a atividade de classificação                 │
│ ○ Responder corretamente ao desafio final                │
│ ○ Explorar os dois cenários do simulador                 │
│ ○ Escrever o bilhete de saída com pelo menos 25 palavras │
│                                                          │
│ Respostas salvas no LMS                                  │
│                                                          │
│ [ Concluir unidade — desabilitado ] [ Imprimir ]         │
│ [ Limpar respostas ]                                     │
└──────────────────────────────────────────────────────────┘
```

Estrutura semântica esperada. Os itens da lista são gerados em tempo de execução: nunca deixar
requisito fixo no HTML.

```html
<section class="completion-panel" aria-labelledby="completion-title">
  <header class="completion-header">
    <p class="completion-eyebrow">Conclusão do módulo</p>
    <h2 id="completion-title">Confira seu progresso</h2>
  </header>

  <p class="completion-message" data-completion-message role="status" aria-live="polite">
    Verificando os requisitos…
  </p>

  <ul class="completion-checks" data-completion-checks
      aria-label="Requisitos para concluir o módulo"></ul>

  <p class="persistence-status" data-persistence-status role="status" aria-live="polite"></p>

  <div class="completion-actions">
    <button type="button" class="btn" data-complete disabled>Concluir unidade</button>
    <button type="button" class="btn btn-secundario" data-print>Imprimir</button>
    <button type="button" class="btn btn-secundario" data-reset>Limpar respostas</button>
  </div>
</section>
```

Reutilizar as classes, variáveis e componentes já presentes em
[sistema-visual.md](sistema-visual.md) e em `assets/componentes-interativos.css` antes de criar
estilo novo. HTML e CSS de exemplo são referência estrutural, não paleta a ser copiada.

## 5. Contrato do runtime compartilhado

`assets/licao-runtime.js` já monta o painel a partir do HTML. Em lição criada por esta skill,
declarar os requisitos por atributo em vez de escrever lógica nova:

| Atributo | Onde | Efeito no checklist |
|---|---|---|
| `data-require-all-slides` | `<body>` | Requisito de visita a todos os slides. |
| `data-completion-mode="scorm"` | `<body>` | Acrescenta "Abrir a lição pelo LMS" e "Confirmar a gravação no LMS". |
| `data-required` + `data-requirement-label` | quiz, input, textarea, select | Torna a interação um requisito com rótulo legível. |
| `data-correct-value` | input, select | Acerto exige valor igual ao gabarito. |
| `data-min-words="N"` | textarea | Completude por contagem de palavras, exibida ao estudante. |
| `data-explore-rules="eq:25,gte:80"` | `input[type=range]` | Exploração exige que todas as condições tenham sido visitadas. |
| `data-interaction-id` | quiz | ID estável da interação no estado persistido. |
| `data-save` | qualquer controle | Entra na persistência e na retomada. |

Quando o módulo auditado não usa este runtime — caso dos módulos herdados —, portar o módulo
para `licao-runtime.js` sempre que o HTML permitir. Se não permitir, reproduzir o mesmo
contrato de atributos e nomes de dados no runtime do módulo, para que os módulos não divirjam.
Não duplicar a lógica de checklist dentro do HTML de um slide.

## 6. Persistência e retomada

- Dar ID estável e único a cada interação persistente.
- Salvar respostas, visitas, quizzes, explorações e demais evidências exigidas.
- Em LMS, usar `cmi.suspend_data` ou mecanismo equivalente, com o fluxo
  gravar → commit → reler → comparar de [scorm-e-conclusao.md](scorm-e-conclusao.md).
- Usar armazenamento local apenas como contingência ou para execução autônoma.
- Preferir o estado do LMS ao local durante a retomada.
- Ao reabrir, restaurar valores, seleções, feedbacks, marcações visuais, explorações, último
  slide e checklist.
- Manter visível uma linha de estado com três mensagens distintas: “Salvo no LMS”, “O LMS não
  confirmou a gravação” e “Salvo apenas neste navegador”. Notificação que desaparece em
  segundos não substitui essa linha.

## 7. Conclusão no LMS

Ao clicar em "Concluir unidade":

1. revalidar todos os requisitos;
2. gravar imediatamente o estado completo;
3. executar o commit;
4. reler os dados e confirmar que correspondem ao estado enviado;
5. só então definir o status como `completed`;
6. se a gravação falhar, não concluir e mostrar mensagem clara para tentar novamente.

## 8. Fora do LMS

- Declarar que a conclusão é apenas local.
- Se a conclusão local for apresentada como persistente, gravar e restaurar um marcador de
  módulo concluído.
- Não afirmar que o módulo foi concluído se esse estado desaparecer ao recarregar a página.

## 9. Botões auxiliares

- "Imprimir" não altera progresso.
- "Limpar respostas" pede confirmação e nomeia o alcance: só este navegador ou também o LMS.
- A limpeza apaga respostas, quizzes, textos, checkboxes, explorações, feedbacks e marcações
  visuais.
- Em LMS, a limpeza devolve a unidade para `incomplete`.
- Decidir se a visita aos slides é preservada ou apagada e manter o texto da interface coerente
  com a decisão.

## 10. Testes obrigatórios

Executar e relatar um a um:

- estado inicial;
- visita a todos os slides sem realizar as práticas;
- respostas incompletas e incorretas;
- cumprimento individual de cada requisito;
- liberação após cumprir todos;
- novo bloqueio ao desfazer uma resposta correta;
- revalidação no clique final;
- retomada em uma segunda sessão;
- limpeza das respostas;
- falha de commit impedindo a conclusão;
- funcionamento dentro e fora do LMS;
- teclado, leitor de tela, celular, zoom de 200% e impressão.

`scripts/validate-lesson.mjs` cobre a estrutura do painel, `scripts/test-completion.mjs` cobre o
portão de conclusão e `scripts/test-scorm.mjs` cobre persistência, retomada e bloqueio por falha
de commit. Os itens manuais — leitor de tela, zoom, impressão, LMS real — só podem ser
declarados como executados se tiverem sido executados.

## 11. Relatório de entrega

Ao terminar a auditoria ou a implementação, entregar:

1. lista dos requisitos identificados;
2. explicação de como cada requisito é validado;
3. arquivos modificados;
4. comportamento dentro e fora do LMS;
5. testes executados e resultados;
6. limitações e inconsistências encontradas.

Preservar o conteúdo pedagógico, a identidade visual e as alterações existentes não
relacionadas à conclusão.
