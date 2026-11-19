# Desenvolvimento local e produção remota

Abra um inventário por ambiente e plano. Use `contexto_infra: desenvolvimento-local` para a instalação de desenvolvimento e `contexto_infra: producao-remota` para a instalação remota de produção. Dê a `ambiente` um nome lógico claro. Nas evidências desse inventário, repita exatamente o nome e o plano. Guarde fontes e extratos de cada implantação na respectiva pasta de coleta.

| O que levantar | Desenvolvimento local | Produção remota |
|---|---|---|
| Execução e capacidade | Runtime local, Compose ou processo de desenvolvimento, imagem ou revisão, CPU/RAM e limites | Inventário de hosts autorizado, release implantada, imagem por digest, réplicas e recursos alocados |
| Redes, serviços e APIs | Redes e conexões entre serviços, portas lógicas, código dos handlers da revisão local | Rede e ingress da implantação, ligações entre serviços, revisão do código vinculada à release |
| Filas, modelos e armazenamento | Filas, modelos e volumes usados pelo desenvolvedor, inclusive alternativas de teste | Filas e consumidores implantados, versão do modelo, armazenamento persistente e evidência de manutenção |
| Cache por rota | Implementação e adaptador da revisão local | Implementação e adaptador da revisão de produção. Peça o identificador da release quando a implantação só puder ser associada a um branch genérico |

Comece pelos artefatos locais fornecidos. Para produção, use o inventário de implantação, o manifesto da release ou extratos de observação aos quais o usuário autorizou acesso. Registre a ligação release → revisão → código. O manifesto identifica a implantação; os campos de cache continuam exigindo prova no código. Um padrão em código pode depender de um valor externo configurado em cada ambiente. Mantenha o valor efetivo desconhecido até obter a evidência adequada, preservando o limite do que o código demonstra.

## Quando perguntar

Ao faltar acesso, revisão, arquivo, evidência vigente ou um valor solicitado, registre a lacuna e **faça a pergunta ao humano na conversa**. Indique o ambiente, o que já foi consultado e a menor informação que permite continuar. Agrupe dúvidas com a mesma origem. Quando um ambiente inteiro estiver inacessível, peça primeiro a fonte de implantação, em vez de fazer uma pergunta por componente. Prossiga com o material disponível no outro ambiente.

> Encontrei o Compose do desenvolvimento local. Qual manifesto ou registro de release identifica as imagens e o commit em produção? Um caminho autorizado ou extrato sanitizado é suficiente.

> No código de produção, o TTL desta rota vem de uma variável. Há um valor definido no código da release? Se o ajuste ocorrer apenas fora do repositório, posso registrar a duração efetiva como pendente e documentar o padrão implementado.

Guarde as lacunas específicas em `pendencias` no inventário, com `item`, `motivo` e `pergunta`. Quando o ambiente inteiro estiver indisponível, omita apenas seu argumento na geração e o índice incluirá a pergunta sobre a fonte. Revise a resposta humana, obtenha a evidência indicada e atualize o inventário. Uma confirmação verbal orienta a coleta. Para confirmar cache, verifique as linhas da implementação e o hash. Perguntas, extratos ou respostas devem usar nomes lógicos e referências sanitizadas.

## Publicação

O comando `gerar-ambientes` produz `Ambientes.md` e uma subpasta por ambiente na fotografia datada. Cada inventário aprovado tem seu próprio mapa, extratos e perguntas. Para representar configuração e observação do mesmo ambiente, repita `--local` ou `--producao`. Use IDs estáveis para o mesmo componente ao longo dos planos. No índice, a posição do recorte e a assinatura curta do inventário distinguem revisões até quando ambiente, plano, API e rota têm o mesmo nome. Um TTL confirmado em uma revisão deixa pendente o TTL sem prova nas demais. A seção de rejeições de cada ambiente identifica recortes que precisam de correção. Para a próxima coleta, use as perguntas do mapa individual ou da seção consolidada do índice.
