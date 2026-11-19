# Como usar a skill

Para instalar esta edição no Claude.ai ou no Claude Code, comece pelo [guia para Claude](CLAUDE-USO.md). Os comandos abaixo se aplicam a um vault local acessível ou à pasta temporária criada para entregar os arquivos pelo chat.

## Publicar no seu second brain

Para inventariar o projeto, abra **Ambientes** na fotografia datada. O índice apresenta desenvolvimento local, produção remota, cobertura por classe e perguntas ao responsável. Para experimentar com os dois cenários **simulados** do pacote, execute:

```text
python scripts/vault.py gerar-ambientes --local references/examples/cache/inventario.json --producao references/examples/laboratorio/inventario.json --vault "caminho/do/Second Brain" --data 2026-11-19
```

Na coleta real, substitua os inventários e indique os checkouts com `--fontes-local` e `--fontes-producao` quando necessário. Se só houver dados locais, omita `--producao`. A seção de produção ficará pendente e o agente perguntará ao humano pela fonte. Consulte o [roteiro de coleta e perguntas](references/ambientes.md).

### Publicar um único recorte

Use `Project/EvidencIA/` como raiz do projeto no vault que você já abre no Obsidian. O argumento `--vault` recebe a pasta **que contém** `Project`. O comando cria as subpastas necessárias. Execute a partir da pasta da skill, com Python 3.9 ou superior. Substitua o caminho entre aspas pelo do seu vault.

```text
python scripts/vault.py gerar references/examples/manual/inventario.json --vault "caminho/do/Second Brain" --data 2026-11-19
```

No explorador de arquivos do Obsidian, abra **Project → EvidencIA → Arquitetura → 2026-11-19 → Mapa**. Nessa pasta ficam as notas de componentes, afirmações e evidências e a subpasta `provas/`. Tanto `gerar` quanto `gerar-ambientes` mostram o caminho da nota de entrada e as perguntas ao responsável. O mapa individual e o índice conjunto incluem as perguntas registradas no inventário e as lacunas identificadas pelo gerador. O índice conserva a origem de cada pergunta com um link ao recorte.

### Repetição, revisão intencional e publicação parcial

O gerador revalida os extratos e fontes a cada chamada. Quando o modo, a data, o conteúdo dos inventários, a ordem dos recortes, o diagnóstico de rejeições e a versão dos recursos de geração coincidem, ele reaproveita a fotografia íntegra mais recente que corresponde a essas entradas. Os hashes do inventário incluem as versões e os hashes das evidências. O manifesto local `.publicacao.json` identifica a fotografia e seus arquivos gerados. Notas pessoais adicionais podem coexistir com ela.

Se um arquivo gerado tiver sido editado ou removido, ele é preservado e a publicação no vault procura outra fotografia íntegra ou cria uma revisão. Fotografias de versões antigas sem manifesto também são preservadas. Para registrar outra revisão intencionalmente, acrescente `--nova-revisao` ao comando com `--vault`. Para exportação em pasta avulsa, um destino íntegro e idêntico é reutilizado. Caso o destino esteja ocupado por outro conteúdo, informe uma pasta nova.

Publicadores no mesmo computador usam uma reserva SQLite local na pasta de publicações, `.evidencia-publicacao.sqlite3`. Ela é liberada pelo sistema quando o processo termina. A escolha da revisão e a publicação final são serializadas. Em vaults sincronizados, execute as publicações a partir de um só computador.

Em `gerar-ambientes`, uma fonte ausente, uma referência incompatível ou um hash divergente rejeita apenas aquele inventário. O índice parcial identifica o ambiente, a posição do recorte, o motivo e a evidência requerida. Nenhuma nota ou aresta do recorte rejeitado entra no vault. Corrija esse inventário com `validar` e repita a publicação. Omitir um ambiente desde o início produz uma pergunta de coleta. Se todos os inventários fornecidos forem rejeitados, os diagnósticos são exibidos e nenhuma fotografia é criada.

## Abrir o exemplo como vault independente

No Obsidian, escolha **Abrir pasta como vault** e selecione `references/examples/manual/vault`. Abra **Mapa**. A seta mostra a direção da dependência. A lista sob o diagrama leva à afirmação e ao trecho do manual que a sustenta. O exemplo de laboratório fica em `references/examples/laboratorio/vault`. Cada fotografia identifica a própria data de corte.

## Reproduzir a partir dos dados

Use Python 3.9 ou superior, com a biblioteca padrão. Execute os comandos na pasta que contém `SKILL.md`. Se o seu sistema disponibiliza Python como `python3` ou `py -3`, substitua `python` pelo comando correspondente.

```text
python scripts/vault.py validar references/examples/manual/inventario.json --data 2026-11-19
python scripts/vault.py gerar references/examples/manual/inventario.json meu-vault --data 2026-11-19
```

Abra `meu-vault` no Obsidian. O mapa Mermaid contém somente relações confirmadas vigentes. O **Grafo local** de uma nota de afirmação permite navegar entre origem, destino e provas pelos links internos. O grafo nativo reúne também links de navegação. Use **Mapa** para ler os tipos das arestas. [Grafo do Obsidian](https://help.obsidian.md/plugins/graph)

## Consultar a ficha de uma API ou serviço

Para ver a documentação completa do artefato, abra **Mapa → Inventário de componentes** e selecione uma API ou um serviço. A seção **Ficha técnica** agrupa as informações e leva às afirmações e evidências. O [roteiro de preenchimento](references/apis-servicos.md) explica cada campo. No [exemplo sintético de FastAPI](references/examples/ficha/vault/cmp-api-coletas.md), o número de workers configurados pode ser conferido no Procfile. A contagem de workers ativos fica a verificar.

Para reproduzir a ficha, use `references/examples/ficha/inventario.json` como argumento de `gerar` ou de `gerar-ambientes --local`, com `--data 2026-11-19`.

### Política de cache por operação

Abra **Cache por rota** a partir do mapa. O [exemplo simulado da API de coletas](references/examples/cache/vault/Cache%20por%20rota.md) inclui o código-fonte que sustenta as leituras. Para reproduzir a publicação dentro do second brain:

```text
python scripts/vault.py gerar references/examples/cache/inventario.json --vault "caminho/do/Second Brain" --data 2026-11-19
```

Com um inventário real, acrescente `--fontes "pasta/dos/repositorios"` aos comandos `validar` e `gerar`. A pasta deve conter o checkout indicado em cada referência de código. O [roteiro de cache](references/cache-api.md) descreve a coleta de estratégia, TTL e invalidação e a marcação de pendências.

## Usar no projeto

1. Crie uma pasta de coleta. Use uma cópia de um exemplo como molde. Substitua ambiente, plano e natureza e esvazie as três listas antes do levantamento. Componha seu inventário com os modelos e o checklist. Colete apenas extratos que possam ser compartilhados nesse vault.
2. Coloque cada extrato em `provas/`, ao lado de `inventario.json`. Guarde texto UTF-8. Para obter o hash dos bytes finais, execute `python scripts/vault.py hash caminho/do/extrato.txt`. Registre também a versão da fonte e o localizador na origem.
3. Execute `validar` seguido de `gerar` com seu inventário e `--vault "caminho/do/Second Brain"`. A data padrão é o dia corrente em UTC. Use `--data AAAA-MM-DD` para reproduzir uma revisão. A geração copia os trechos citados para a pasta do projeto, com notas e anexos verificáveis offline. Para atualizar, edite o inventário e gere outra fotografia.
4. Em uso manual, copie os modelos e substitua seus campos. O gerador lê o JSON como fonte de verdade. Transcreva alterações de notas para o inventário antes de gerar outra versão. As propriedades YAML são planas para facilitar sua leitura no Obsidian. [Propriedades](https://help.obsidian.md/properties)

**Exemplo de pedido ao agente**

> Use a skill evidencia-architecture-vault. No ambiente de homologação, descubra de quais serviços a coleta depende. Use os manifestos aprovados e os extratos fornecidos. Gere o vault, cite a prova de cada seta e identifique as coletas pendentes.

**Perguntas para experimentar**

- No exemplo documental, de onde vêm os registros apresentados no painel? Abra a afirmação sobre o Harvester e confira o plano da resposta.
- No laboratório, quais serviços podem ser afetados se a fila parar? Parta das setas que terminam na fila e siga as ligações para as provas.
- Qual profundidade de fila foi medida? Confira janela e unidade. Uma medida vencida serve para relatar o histórico. Uma estimativa de capacidade exige taxa de chegada, vazão e janela comparáveis.
- Após trocar a versão do modelo, que relações precisam de nova coleta? Confira hipóteses e a data de revisão antes de propor a ordem de manutenção.

A validação retorna código zero para um conjunto consistente e um resumo por estado efetivo. Em `gerar-ambientes`, código 0 indica execução sem recorte rejeitado (ainda pode haver perguntas), 3 indica fotografia parcial publicada ou reutilizada, e 1 indica falha sem publicação. A avaliação semântica do trecho e a autenticação da fonte cabem ao revisor identificado na afirmação.
