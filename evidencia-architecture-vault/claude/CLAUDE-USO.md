# Usar a skill no Claude

Esta edição usa o gerador EvidencIA 1.5.0 e seus modelos do Obsidian. A instalação e a entrega dependem de onde o Claude está rodando.

## Claude.ai

Em **Customize → Skills**, escolha **+ → Create skill → Upload a skill**, envie `evidencia-architecture-vault-claude.zip` e ative a skill. A geração de arquivos requer execução de código e criação de arquivos habilitadas. Em uma organização, a política da equipe também se aplica. [Ajuda oficial do Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)

Faça um primeiro teste com o exemplo do pacote:

> Use a skill evidencia-architecture-vault. Gere a documentação do exemplo simulado de cache local e do exemplo simulado de produção. Use a data de corte 2026-11-19. Entregue o ZIP do Obsidian e as perguntas que ficaram abertas.

Para usar dados reais, anexe inventários ou as fontes autorizadas necessárias à sua elaboração. Para um inventário pronto, mantenha `inventario.json`, os extratos em `provas/` e, quando houver afirmações de cache, a estrutura `fontes/<repositorio>/<arquivo>`. Se o código não puder ser compartilhado, use Claude Code no ambiente que dispõe do checkout. Uma coleta parcial pode seguir com o material disponível.

**Fluxo de entrega pelo chat.** O Claude cria uma pasta vazia de trabalho para o vault, identifica a pasta da skill e executa os comandos a partir dela. No exemplo abaixo, `VAULT_TEMP` representa o caminho dessa pasta existente, e `NOTA_GERADA` é o caminho exato de `Ambientes.md` ou `Mapa.md` informado pelo gerador.

```text
python scripts/vault.py gerar-ambientes --local references/examples/cache/inventario.json --producao references/examples/laboratorio/inventario.json --vault "VAULT_TEMP" --data 2026-11-19
python scripts/exportar_obsidian.py "NOTA_GERADA" "EvidencIA-Obsidian.zip"
```

O Claude entrega o segundo ZIP como arquivo baixável da conversa. O exportador verifica os hashes e inclui os arquivos gerados, os extratos citados e o manifesto da fotografia. O caminho começa em `Project/EvidencIA/Arquitetura/`. Extraia na raiz do seu vault e abra a nota de entrada. Se a pasta datada já existir, preserve-a. Informe ao Claude quais nomes de revisão dessa data estão ocupados. Ele pode reservar esses nomes com pastas vazias em seu vault temporário **antes de gerar** a próxima edição, para que os links apontem para a revisão certa.

## Claude Code no computador

Extraia a pasta `evidencia-architecture-vault` para `.claude/skills/` do projeto. O caminho final é `.claude/skills/evidencia-architecture-vault/SKILL.md`. Para disponibilizar a skill nos seus projetos locais, use a pasta pessoal `~/.claude/skills/`. O comando de invocação é `/evidencia-architecture-vault`. [Documentação do Claude Code](https://code.claude.com/docs/en/skills)

> /evidencia-architecture-vault Documente a API de coletas em desenvolvimento local e produção remota. Use os repositórios e manifestos indicados nesta sessão e publique em Project/EvidencIA no meu vault. Para informações ausentes, pergunte qual fonte posso fornecer.

O Claude Code pode publicar diretamente quando sua sessão tem acesso ao destino indicado. Python 3.9+ com SQLite é suficiente. Consulte o [guia de operação](USO.md) para seleção de inventários, revisões intencionais e publicação parcial.

## Como conferir a entrega

Abra uma afirmação a partir do mapa, siga a evidência até o arquivo e confira o trecho citado. No exemplo de cache, o GET identifica o prazo na implementação, e o POST identifica a remoção da chave. No exemplo FastAPI, o Procfile sustenta o número de workers configurados. A contagem de processos ativos exige evidência do ambiente. A seção **Perguntas ao responsável** lista essas lacunas por recorte. O código de retorno 3 indica uma publicação parcial utilizável; o Claude deve entregar seu índice e destacar os recortes rejeitados.
