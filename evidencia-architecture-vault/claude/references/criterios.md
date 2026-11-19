# Critérios de registro e revisão

O inventário reúne componentes (endereços de catálogo), afirmações (unidade de conhecimento) e evidências (uma leitura de uma fonte para uma afirmação). Cada componente deve ter um ID estável. Cada configuração tem sua própria chave e valor, com unidade e janela quando aplicáveis. Mantenha nomes e classes como rótulos para navegação e as conclusões nas afirmações. Cada afirmação descreve uma propriedade, uma dependência dirigida ou um campo de cache de uma rota. Use um registro por proposição e recorte. Guarde revisões anteriores em fotografias distintas.

**Trilha de evidência.** Preencha fonte e origem do dado (sistema ou documento produtor), método de obtenção incluindo comando, endpoint ou consulta documental, localização no original, versão da fonte, agente coletor e horário com fuso. Para fontes sem versão publicada, use o digest do original quando disponível. Guarde o extrato sanitizado, sua transformação, SHA-256 em hexadecimal e as linhas exatas dentro do extrato (a partir de 1, intervalo inclusivo). Aponte a evidência para o ID da afirmação, classifique seu papel e explique como o trecho sustenta ou contradiz aquela proposição. Se um extrato sustentar duas afirmações, cadastre duas leituras que compartilhem o mesmo arquivo e hash.

| Estado de revisão | Quando usar | O que produzir |
|---|---|---|
| confirmada | Há prova direta inspecionada da proposição inteira, no ambiente e plano corretos, sem contradição pendente | Registrar responsável, critério e validade. Publicar aresta enquanto vigente |
| inferencia | Há indícios ou hipótese explicável | Registrar premissas e coleta capaz de testar a hipótese |
| divergente | Fontes do mesmo recorte sustentam e contestam a proposição | Manter as duas leituras e indicar o próximo discriminador |
| obsoleta | Mudou a implantação, expirou a revisão ou há substituição conhecida | Preservar histórico com razão e refazer a coleta |

**Validade.** Informe `valido_de`, data de revisão e `valido_ate`, inclusive. Justifique o prazo conforme estabilidade e criticidade. A confirmação vale somente para o plano e o ambiente do conjunto. Uma coleta feita após a revisão exige nova revisão. O gerador reclassifica como obsoleta toda afirmação vencida na data de corte, preservando o estado registrado na nota. Para retirar uma confirmação antes do prazo, faça nova fotografia com a razão da mudança. Para reproduzir uma data anterior à última revisão, use a fotografia arquivada correspondente.

**Confiança.** Use alta para prova direta inequívoca no recorte ou fontes independentes concordantes, média quando há cobertura parcial com limites explícitos e baixa para hipótese fraca ou conflito aberto. Registre a razão concreta em `criterio`. Uma relação com prova parcial permanece inferência mesmo quando parece provável. Uma divergência pode ter fontes individualmente fortes. Avalie a confiança na proposição. A passagem do prazo afeta a vigência mesmo que a avaliação histórica tenha sido alta.

**Revisão semântica.** Leia o trecho indicado. Verifique os dois participantes, a direção e a ação, ou o valor e a unidade. Um manifesto pode provar configuração e uma chamada bem-sucedida pode provar uso observado. Para conclusão causal ou dimensionamento, confira o caminho e a janela inteira. A leitura de um documento suporta conclusões sobre o que ele descreve. Para transferi-las à produção, abra outro recorte e obtenha evidência desse ambiente.

Os schemas usam JSON Schema Draft 7. Carregue `inventario.schema.json` com base no seu diretório local para resolver os arquivos irmãos. Além das propriedades e dependências, o esquema admite a afirmação `cache_rota`. O validador confere as referências cruzadas, as regras de decisão e os trechos de implementação conforme o [roteiro de cache](cache-api.md).
