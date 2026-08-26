# SCORM, retomada e conclusão verificável

Ler esta referência quando a lição for usada em LMS, precisar persistir respostas entre sessões ou tiver botão de conclusão.

## Diagnóstico

Inventariar textos, seletores, checkboxes, quizzes, sliders, simuladores, atividades e bilhetes de saída. Para cada interação, registrar ID estável, valor, critério de correção, obrigatoriedade, local de persistência e comportamento na retomada.

Procurar no runtime por `localStorage`, `cmi.suspend_data`, `LMSSetValue`, `LMSGetValue`, `LMSCommit` e pela regra que habilita a conclusão. Identificar respostas que ficam apenas no navegador, controles sem ID, estados visuais não restaurados e conclusão baseada apenas em visita ou tentativa.

## Modelo de estado

Manter um objeto compacto, adequado ao limite reduzido do SCORM 1.2:

```js
{
  visited: [],
  quizAttempted: false,
  quizCorrect: false,
  quizSelected: "",
  fields: {},
  exploration: {}
}
```

- `fields`: valores de controles persistentes; checkboxes e rádios usam booleanos.
- `exploration`: condições pedagogicamente relevantes já observadas em simuladores.
- Limitar textos ou escolher outro mecanismo do LMS para produções longas.

## Persistência

Fluxo mínimo:

```text
interação
→ coletar estado atual
→ LMSSetValue("cmi.suspend_data", JSON)
→ LMSCommit("")
→ LMSGetValue("cmi.suspend_data")
→ comparar estado lido com estado atual
```

Aplicar debounce curto durante digitação e gravação imediata antes de concluir ou sair. `localStorage` pode ser contingência, nunca evidência de persistência no LMS.

Mostrar mensagens distintas: “Salvo no LMS”, “O LMS não confirmou a gravação” e “Salvo apenas neste navegador”.

## Retomada

Inicializar na ordem:

1. localizar e inicializar a API SCORM;
2. ler `cmi.suspend_data` e localização;
3. restaurar textos, seletores, checkboxes e sliders;
4. restaurar alternativa, correção e feedback do quiz;
5. recalcular simuladores e estados visuais;
6. recalcular os requisitos de conclusão;
7. retomar o último slide.

Preferir o estado do LMS ao armazenamento local. Não considerar retomada validada sem uma segunda sessão.

## Conclusão verificável

Derivar os requisitos da vitória observável. Distinguir:

- visita: slide observado;
- tentativa: interação realizada;
- acerto: resposta correta;
- completude: texto ou checklist atende ao critério;
- exploração: cenários contrastantes foram investigados;
- persistência: o LMS confirmou o estado atual.

Exibir um checklist vivo com cada requisito. Não liberar conclusão por simples navegação ou tentativa. No clique final, revalidar, persistir imediatamente e somente então definir `cmi.core.lesson_status` como `completed`.

Quando a persistência no LMS for obrigatória, manter conclusão bloqueada fora do LMS e explicar o motivo. Para lição autônoma, declarar explicitamente que a conclusão é apenas local.

## Sliders e simuladores

Não tratar movimento como aprendizagem. Definir condições significativas, como cenário sustentável e cenário de sobrecarga, ou valores que permitam comparar classes equilibradas e raras. Persistir tanto os valores finais quanto as condições já exploradas.

## Limpeza

Ao limpar respostas, remover campos, seleções, checkboxes, quiz e exploração no navegador e no estado SCORM; retornar a unidade a `incomplete`. Pedir confirmação e nomear o alcance da limpeza.

## Testes

Criar teste com API SCORM simulada que:

1. preencha todos os tipos de interação;
2. registre acertos e explorações;
3. execute commit e conclusão;
4. encerre a sessão;
5. abra novo contexto com o mesmo `cmi.suspend_data`;
6. confirme restauração funcional e visual;
7. confirme que falha de commit impede conclusão.

Depois, testar importação, logout e novo login no LMS real. O mock não substitui o servidor.
