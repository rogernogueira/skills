# Método pedagógico

Adaptação dos princípios da skill [`teach`](https://github.com/mattpocock/skills/tree/main/skills/productivity/teach), de Matt Pocock, ao fluxo de criação de materiais interativos deste projeto.

## Missão

Definir o motivo concreto da aprendizagem. Preferir resultados observáveis a objetivos vagos.

```md
# Missão: {tema}

## Por quê
{mudança concreta esperada no trabalho ou na vida do aluno}

## Sucesso significa
- {ação observável}
- {ação observável}

## Restrições
- {tempo, ferramentas, conhecimento prévio, acessibilidade}

## Fora do escopo
- {assuntos adjacentes que não entrarão agora}
```

Manter uma missão por workspace. Atualizar a missão somente quando o objetivo real mudar.

## Zona de desenvolvimento

Ensinar algo que o aluno ainda não domina, mas consegue alcançar com orientação. Usar como evidências:

- respostas em práticas anteriores;
- dúvidas recorrentes;
- experiência declarada;
- erros e estratégias observados;
- registros de aprendizagem.

Evitar tanto a repetição trivial quanto saltos que exijam muitos conceitos novos simultaneamente.

## Conhecimento, habilidade e sabedoria

- Tratar **conhecimento** como compreensão obtida de fontes confiáveis.
- Tratar **habilidade** como uso flexível do conhecimento em tarefas com feedback.
- Tratar **sabedoria** como julgamento amadurecido em situações reais e contato com praticantes.

Ensinar somente o conhecimento necessário para executar a habilidade da lição. Encaminhar perguntas de julgamento profissional para prática real, supervisão ou comunidade apropriada.

## Fluência e retenção

Não confundir facilidade imediata com aprendizagem duradoura.

- Usar **recuperação ativa**: pedir ao aluno que recorde ou aplique antes de revelar.
- Usar **espaçamento**: retomar conceitos essenciais em momentos posteriores.
- Usar **interleaving**: misturar casos relacionados quando o aluno precisar distinguir padrões.
- Usar exemplos resolvidos quando o conteúdo ainda for novo e prática mais difícil quando o objetivo for retenção ou transferência.

## Fontes

Criar `RESOURCES.md` no workspace quando a sequência depender de pesquisa contínua:

```md
# Fontes de {tema}

## Conhecimento
- [Título — instituição](URL)
  Abrange: {escopo}. Usar para: {decisões ou lições}.

## Prática e comunidade
- [Comunidade ou ambiente](URL)
  Usar para: {feedback ou experiência real}.

## Lacunas
- {questão ainda sem fonte confiável}
```

Priorizar legislação oficial, documentação técnica, artigos científicos, livros reconhecidos e especialistas responsáveis. Anotar por que cada fonte é útil. Remover fontes fracas.

## Unidade de lição

Criar cada lição como HTML autocontido em `lessons/0001-<slug>.html`. Limitar cada lição a uma vitória tangível e curta. Conectar lições e documentos de referência por links relativos.

Quando houver aplicação profissional ou institucional, começar por um cenário fictício plausível: serviço, pessoas, fluxo atual, gargalo, consequência, decisão apoiada, salvaguardas e condição de não uso. Explicar o vocabulário de domínio antes de exigir que o aluno opere com ele.

Compor uma lição com:

1. pergunta-guia;
2. modelo mental ou explicação mínima;
3. exemplo concreto;
4. prática interativa;
5. feedback;
6. síntese;
7. fonte principal;
8. convite para perguntas.

A contagem de slides não é objetivo pedagógico. Separar funções quando um mesmo slide tentar contextualizar, definir, calcular e avaliar simultaneamente. Remover carga horária e duração estimada dos materiais exibidos; períodos pertencentes ao próprio problema continuam válidos.

## Registros de aprendizagem

Criar `learning-records/0001-<slug>.md` apenas quando houver evidência de aprendizagem não trivial, conhecimento prévio relevante, correção de equívoco ou mudança da missão.

```md
# {aprendizado estabelecido}

{O que foi demonstrado e por que isso muda o próximo passo.}
```

Não usar registros como diário de aulas. Cobertura de conteúdo não prova aprendizagem.

## Glossário

Criar `GLOSSARY.md` quando o tema possuir terminologia própria. Incluir termos apenas depois que o aluno demonstrar compreensão. Preferir definições de uma ou duas frases, escolher um termo canônico e registrar ambiguidades relevantes.
