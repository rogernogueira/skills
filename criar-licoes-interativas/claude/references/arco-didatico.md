# Arco didático, interativo e visual da lição rica

Padrão extraído da **Lição 05B · SVM** do curso Introdução ao Machine Learning
(`Introduçao á Machine Learning/lessons/0005b-svm.html` e `0005b-MAPA-PEDAGOGICO.md`). É o modelo
padrão de toda lição nova desta skill e está materializado em `assets/licao-modelo.html`.

Comparada a lições do mesmo projeto, a 05B se destacou por cinco coisas que este documento
transforma em regra:

1. **um personagem e um cenário atravessam a lição inteira**, do problema ao bilhete de saída;
2. **metáfora antes do termo**: a ideia aparece num objeto cotidiano antes do vocabulário técnico;
3. **todo número tem origem** à vista, calculada sobre o dataset do cenário;
4. **a interação sobe de nível**: ver → manipular → raciocinar → criticar → transferir;
5. **uma figura desenhada para o conteúdo em quase todo slide**, com a mesma codificação visual do
   começo ao fim.

## O arco em 14 funções

A contagem é consequência das funções, não meta. Dividir um slide quando duas funções disputarem
espaço; fundir só quando uma função não existir no tema (por exemplo, técnica sem "limite" visível).

| # | Função | O slide precisa ter | Componentes |
|---|---|---|---|
| 1 | **Abertura e ancoragem** | título evocativo + subtítulo técnico; pergunta-guia em linguagem cotidiana; vitória observável com as ações que a lição vai exigir; "**Você já viu:**" retomando a lição anterior e dizendo o que esta faz de diferente; figura de abertura | `.hero-figura`, `.caixa`, `.figura-licao` |
| 2 | **Metáfora** | a ideia central num objeto cotidiano (rua mais larga entre cães e gatos); o jeito ingênuo × o que a técnica quer a mais; "**Por quê:**" com a consequência; ponte para o cenário | `.duas-colunas`, `.ponte` |
| 3 | **Cenário** | organização fictícia, personagem nomeado, processo atual, gargalo, o que se quer; dados (atributos, escala, alvo, quantidade, IDs); consequências de cada erro e qual custa mais; salvaguardas **ligadas ao conceito que virá** (a "rua" vira zona de triagem manual); condição de não uso; aviso de ficção | `data-scenario`, `.card-grid`, `.aviso` |
| 4 | **Conceito 1/3** | termo em negrito com definição curta na primeira aparição; gráfico com os dados do cenário; candidatos comparados com **números calculados**; demonstração opcional; "**O que fazer aqui**" com o verbo cognitivo (comparar, compreender, calcular) | `data-vocabulary`, `.termo-def`, `.key-list`, `[data-demo]`, `.lt-nota` |
| 5 | **Conceito 2/3 + exemplo resolvido** | a regra da técnica em uma frase; "**De onde vêm os números:**" com a conta passo a passo; "**No cenário:**" o que o conceito significa para a decisão | `.origem-numero` |
| 6 | **Prática manipulável** | "Como fazer" (o que fazer · quanto falta · quando está completo); controles que alteram a figura; painel de retorno a cada movimento; **critério numérico** calculado (≥ 90% do ótimo, sem invasão); desfazer devolve a pendente | `.instrucao`, `.sim-bloco`, campo derivado `data-correct-value` |
| 7 | **Conceito 3/3 + quiz de erro conceitual** | termo com **apelido memorável** ("os guardiões da rua"); identificadores e valores no cenário; quiz que ataca a confusão mais comum de quem começa | `[data-quiz]` com `[data-porque]` |
| 8 | **O mundo real** | um caso plausível que quebra o modelo limpo (garrafa PET com areia); **Lado A** (tentação, com custo) × **Lado B** (decisão defensável); elo com lição anterior (sobreajuste); nome do parâmetro real; quiz de crítica | `.lado-a-lado`, marcadores ✕/✓ |
| 9 | **Limite da técnica** | sair do cenário **declarando** que o caso é sintético e por quê; demonstração que tenta e falha; conclusão com número ("a melhor reta erra 7 de 20") e "não é falta de jeito" | `[data-demo]`, `.sim-result` |
| 10 | **Nova perspectiva** | segunda metáfora física (peteleco na folha); fórmula "como se"; demonstração com ida e volta; **caixa-preta** declarada com o nome real e onde será aprofundada; quiz de aplicação | `.caixa-preta` |
| 11 | **Quando usar** | "Brilha quando" × "Cuidado quando", cada item com motivo; comparação com a técnica anterior | `.lado-a-lado` (correto/atenção) |
| 12 | **Transferência** | a mesma ideia num **contexto novo** (tabuleiro de xadrez); campos com motivo por campo; revelação visual só com tudo correto | `[data-activity]`, `[data-check-activity]`, `.revelar-ao-concluir` |
| 13 | **Síntese + bilhete** | um princípio por conceito, cada um com o apelido; bilhete **dirigido ao personagem**; resposta-modelo só depois de escrever | `.sintese-lista`, `data-min-words`, `.example-button` |
| 14 | **Fontes e conclusão** | fontes primárias com o que cada uma sustenta; o que ficou para a próxima lição; painel de conclusão vivo | `.completion-panel` |

Lição de **aplicação** (laboratório, entrega a parceiro) segue o mesmo arco até o slide 8 e troca
9–12 por laboratório, entrega com checklist e matriz de risco — o padrão da Lição 05 do mesmo curso.
A 05B é preparação conceitual; as duas se complementam.

## Regras de escrita

- **Ancorar antes de introduzir.** O slide 1 retoma em uma frase o que o estudante já viu e diz o
  que muda agora. Nenhum termo novo sem âncora.
- **Metáfora → cenário → termo.** O nome técnico chega depois de a ideia ter sido vista num objeto
  e no problema. Ao definir, usar o formato `**Termo** — definição curta. Exemplo no cenário.`
- **Apelido memorável** para cada conceito ("a rua mais larga", "os guardiões", "o peteleco"). A
  síntese retoma os apelidos; o bilhete e os quizzes podem usá-los.
- **Todo número tem origem no lugar em que aparece.** "De onde vêm os números:" com a conta curta.
  Cada número exibido é recalculado por script e testado contra o gabarito.
- **Pontes explícitas.** Terminar slides de transição com `**Próximo passo:**` justificando o
  slide seguinte. Ao sair do cenário, dizer que saiu e por quê; ao voltar, dizer que voltou.
- **Dizer o nível cognitivo.** "O que fazer aqui" diz se é para compreender, comparar, calcular,
  aplicar ou criticar — e, quando for "apenas compreenda", onde isso será usado.
- **Caixa-preta declarada.** Conceito que não será aprofundado recebe a caixa com o nome real, o
  que ele faz em uma frase e onde será estudado. Nunca esconder a simplificação.
- **O personagem volta.** Salvaguardas, Lado B, quizzes e bilhete falam com ou sobre ele. Se o
  personagem some depois do slide 3, o cenário virou decoração.
- **Elo com o que veio antes.** Ao menos uma ligação explícita com conceito de lição anterior
  ("É a mesma lição do sobreajuste da 05A").
- **Sem promessas de tempo** e sem carga horária, como em toda a skill.

## Progressão da interação

| Nível | Exemplo na 05B | Conta para conclusão? |
|---|---|---|
| **Ver** — demonstração | "Ficar só com a melhor", "Ver a rua se abrir", "Dar o peteleco" | não; não persiste; "Limpar" desfaz |
| **Manipular** — prática com critério | abrir a rua até ≥ 90% da largura máxima, sem invasão | sim, por campo derivado recalculado |
| **Raciocinar** — quiz de erro conceitual | "apagar os 33 itens longe da rua muda a rua?" | sim, exige acerto |
| **Criticar** — Lado A × Lado B + quiz | fronteira torta × margem suave | sim, exige acerto |
| **Transferir** — contexto novo | tabuleiro: qual laser, quais peças tocam a rua | sim, todos os campos corretos |
| **Explicar** — bilhete ao personagem | explicar ao Rafael por que a rua mais larga | sim, mínimo de palavras visível |

Regras dos quizzes neste padrão:

- **Quatro alternativas**, cada uma com `[data-porque]` específico; distratores são os erros reais
  de quem começa (confundir com média, apagar o dado incômodo, "tanto faz").
- **Gabarito variado** entre os quizzes da lição (na 05B: A, B, C). Nunca sempre a primeira.
- O runtime revela o "por quê" de cada alternativa **já tentada** e, ao acertar, o de todas.
- Extensão e forma semelhantes entre alternativas: o formato não pode entregar a resposta.

## Linguagem visual

- **Cromo idêntico em todos os slides**: etapa à esquerda e número à direita no topo; progresso e
  `← Anterior` / `Próximo →` no rodapé; barra de progresso fixa no alto. Ver "Lição rica" em
  [sistema-visual.md](sistema-visual.md).
- **Figura ao lado do texto** (`.duas-colunas`) em todo slide conceitual. A figura carrega a ideia;
  o texto ao lado a nomeia e quantifica.
- **Codificação estável**: a mesma classe tem a mesma forma, cor e rótulo do início ao fim (vidro =
  círculo azul, plástico = quadrado marrom). Nunca só cor.
- **A mesma figura evolui**: o gráfico do slide 4 ganha margem no 5, vira simulador no 6 e destaca
  os vetores no 7. O estudante não reaprende a ler a figura a cada slide.
- **Figuras desenhadas a partir dos dados**: coordenadas calculadas do dataset do cenário, não
  posicionadas a olho; os números da legenda batem com os do texto.
- **Ilustração da metáfora** em SVG simples (cães, gatos, avenida; esferas e cubos) — traço
  consistente, sem bitmap.
- **Semântica de cor fixa** com ícone e etiqueta: ◆ conceito, ✓ correto, ▲ atenção, ✕ risco.
- **Animação com propósito, finita e opcional**: menos de 5 s, só sob
  `prefers-reduced-motion: no-preference`, e o estado padrão é o final — sem JavaScript, com
  movimento reduzido ou na impressão nada fica escondido.
- **Densidade medida**: slides com quiz podem passar da altura da tela; medir em 1280×800 e
  390×844 e aceitar rolagem só onde a prática exige. Nunca reduzir fonte para caber.

## Antes de entregar

- [ ] O personagem aparece no cenário, em ao menos um quiz ou no Lado B e no bilhete.
- [ ] Cada termo técnico tem definição na primeira aparição e apelido retomado na síntese.
- [ ] Cada número exibido tem "de onde vem" no próprio slide e um teste que o recalcula.
- [ ] Há ao menos uma prática manipulável com critério numérico e evidência derivada.
- [ ] Os quizzes têm 4 alternativas com "por quê" e gabaritos em posições diferentes.
- [ ] Há um caso que quebra o modelo limpo e um desafio de transferência em contexto novo.
- [ ] Toda simplificação está numa caixa-preta com o nome real.
- [ ] Todo slide conceitual tem figura com legenda descritiva; nenhum placeholder `{{…}}` restou.
- [ ] A conclusão foi percorrida em navegador real em 1280×800, 390×844 e 360×640.
