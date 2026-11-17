# Padrões de práticas interativas

Escolher uma prática que exija a habilidade pretendida. Toda prática deve apresentar instrução, tentativa, feedback e oportunidade de revisão.

## Quiz de recuperação

Pedir resposta antes de revelar a explicação. Manter alternativas visualmente equivalentes e, quando possível, com extensão semelhante para não denunciar o gabarito.

Usar para conceitos, distinções e decisões rápidas. Evitar perguntas de pura memorização quando o objetivo for aplicação.

Antes de publicar, confirmar que existe uma única resposta defensável, que o gabarito decorre do conteúdo ou dos dados e que cada alternativa recebe uma explicação específica. Distratores devem representar erros plausíveis, não frases obviamente absurdas. Quando a resposta depender de cálculo, testar automaticamente a igualdade entre dataset, número exibido e gabarito.

Na lição rica ([arco-didatico.md](arco-didatico.md)), o quiz é de **erro conceitual**: o enunciado
fica dentro do cenário e cada distrator é um erro real de quem começa. Usar quatro alternativas,
cada uma com `.quiz-letra` e um `[data-porque] hidden` próprio; o runtime revela o "por quê" das
alternativas já tentadas e, ao acertar, o de todas. Variar a posição do gabarito entre os quizzes
da lição e gravá-la em `data-correct-response`. Antes do quiz, a instrução "Como fazer": o que
fazer, "uma escolha; dá para tentar de novo sem penalidade", quando está completo.

## Caça ao erro

Apresentar uma resposta plausível com dois ou três problemas localizáveis. Permitir clicar nos trechos ou marcar uma lista. Revelar o critério e a correção depois da tentativa.

Usar para revisão, auditoria, segurança, escrita e leitura crítica.

## Demonstração de figura

Botão que altera a figura para tornar visível uma ideia: esconder as candidatas ruins, abrir a
margem de novo, aplicar uma transformação e voltar. Marcar com `data-demo="<nome>"` e tratar no
script da lição. Demonstração **não conta para conclusão**, não persiste e é desfeita por
"Limpar". Usar quando o estudante ainda deve compreender, não decidir.

## Prática manipulável com critério calculado

Controles (dois sliders, por exemplo) movem um objeto sobre a figura do cenário; um painel
`[data-sim-result]` devolve a medida atual e o que ainda impede a solução a cada movimento. O
critério de sucesso é numérico e calculado do dataset (na 05B: largura ≥ 90% da máxima, sem item
invadindo). O script grava `"sim"` ou `""` num `input type="hidden"` com `data-save
data-required data-correct-value="sim"` e dispara `input`: desfazer a solução devolve o requisito
a pendente. Confirmar por teste que a grade dos controles alcança o critério.

## Lado A × Lado B

Dois painéis lado a lado (`.lado-a-lado`) para o mesmo caso difícil: a resposta tentadora, com
marcador ✕ e o custo dela para os casos futuros, e a decisão defensável, com ✓ e quem cuida do
caso na operação. Cada lado tem figura própria. Fechar com um quiz que pede para criticar, não
para repetir.

## Desafio de transferência

A mesma ideia num contexto que o estudante ainda não viu (na 05B, um tabuleiro de xadrez depois
da esteira de reciclagem). Campos `select` com `data-correct-value`, `data-porque-ok`,
`data-porque-no` e um `[data-nota-for]`; o botão `[data-check-activity]` devolve o motivo campo
por campo; com todos corretos, o contêiner `[data-activity]` ganha `.concluida` e mostra
`.revelar-ao-concluir` (a resposta desenhada na figura). O requisito é o `data-required` do
contêiner. Todo `select` tem `<option value="">Escolha…</option>`.

## Compare e escolha

Mostrar duas ou três soluções para o mesmo caso. Pedir ao aluno que selecione a melhor com base em critérios explícitos. Explicar por que as alternativas fracas são sedutoras.

Usar para qualidade de prompts, argumentação, design e tomada de decisão.

## Classificação de cartões

Pedir que o aluno distribua itens em categorias. Implementar com botões ou seleção acessível; não depender exclusivamente de arrastar e soltar.

Usar para taxonomias, triagem, padrões e diferenciação de conceitos.

## Missão com cenário

Criar personagem, contexto, restrição e objetivo concreto. Dividir em passos curtos e terminar com um artefato observável.

Usar para aproximar a aprendizagem do trabalho real. Preferir dados fictícios ou públicos quando houver privacidade ou sigilo.

## Mini simulador

Oferecer dois ou três controles que alterem uma saída visual ou textual. Explicar a relação causal e incluir um desafio, não apenas exploração livre.

Usar para parâmetros, sistemas, probabilidades, custos e trade-offs.

Definir previamente quais condições contrastantes demonstram a aprendizagem. Registrar esses cenários para a conclusão; não considerar o simples movimento de um slider como evidência suficiente.

## Checklist com progresso

Permitir marcar etapas e mostrar progresso. Cada item deve ser verificável. Incluir exemplos expansíveis para reduzir ambiguidades.

Usar para procedimentos, projetos e revisão de entregas. Informar onde os dados são armazenados.

## Bilhete de saída

Pedir uma resposta curta que revele entendimento ou dúvida remanescente. Oferecer um modelo de resposta somente depois da tentativa.

Na lição rica, o bilhete é **dirigido ao personagem do cenário** ("explique ao Rafael por que…") e
pede também o que fazer com o caso duvidoso; `data-min-words` mostra a contagem enquanto o
estudante escreve. A resposta-modelo fica num `.example-panel` aberto por "Comparar com uma
resposta-modelo (depois de escrever)" e usa os apelidos dos conceitos.

Usar para síntese e para decidir a próxima lição.

## Critérios de diversão responsável

- Usar humor, personagens e situações inesperadas sem ridicularizar o aluno ou grupos sociais.
- Fazer a mecânica reforçar o conteúdo.
- Manter tentativas curtas e feedback rápido.
- Celebrar progresso sem transformar a atividade em competição obrigatória.
- Evitar cronômetros, sons automáticos e estímulos excessivos.
- Incluir alternativa acessível a gestos, drag-and-drop ou percepção de cor.
