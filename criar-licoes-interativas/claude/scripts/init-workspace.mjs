#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const force = args.includes("--force");
const targetArg = args.find(arg => arg !== "--force");

if (!targetArg) {
  console.error("Uso: node init-workspace.mjs <diretorio-destino> [--force]");
  process.exit(2);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.dirname(scriptDir);
const sourceAssets = path.join(skillDir, "assets");
const target = path.resolve(targetArg);

const directories = [
  target,
  path.join(target, "assets"),
  path.join(target, "assets", "illustrations"),
  path.join(target, "lessons"),
  path.join(target, "references")
];
directories.forEach(directory => fs.mkdirSync(directory, { recursive: true }));

const assetFiles = [
  "estilo-slides.css",
  "componentes-interativos.css",
  "scorm-runtime.js",
  "licao-runtime.js",
  "licao-modelo.html"
];

function copyAsset(name) {
  const source = path.join(sourceAssets, name);
  const destination = path.join(target, "assets", name);
  if (fs.existsSync(destination) && !force) {
    console.log(`[mantido] ${path.relative(target, destination)}`);
    return;
  }
  fs.copyFileSync(source, destination);
  console.log(`[copiado] ${path.relative(target, destination)}`);
}

function createIfMissing(name, content) {
  const destination = path.join(target, name);
  if (fs.existsSync(destination)) {
    console.log(`[mantido] ${name}`);
    return;
  }
  fs.writeFileSync(destination, content, "utf8");
  console.log(`[criado] ${name}`);
}

assetFiles.forEach(copyAsset);

createIfMissing("MISSION.md", `# Missão: {tema}\n\n## Por quê\n{resultado concreto}\n\n## Sucesso significa\n- {ação observável}\n\n## Restrições\n- {restrição}\n\n## Fora do escopo\n- {assunto}\n`);
createIfMissing("MAPA-PEDAGOGICO.md", `# Mapa pedagógico\n\nMissão:\nPúblico e contexto:\nConhecimento prévio presumido:\nVitória observável:\nPergunta-guia:\nProblema concreto:\nOrganização, personagens e papéis fictícios:\nProcesso atual e gargalo:\nDecisão que receberá apoio:\nConsequências, salvaguardas e condição de não uso:\nAncoragem (o que o estudante já viu e o que esta lição faz de diferente):\nMetáfora central e segunda metáfora, se houver:\nVocabulário que precisa ser explicado (slide da primeira ocorrência):\nConceitos essenciais e apelido de cada um:\nErros conceituais comuns que os quizzes vão atacar:\nCaso real que quebra o modelo limpo:\nLimite da técnica e como será demonstrado:\nCaixas-pretas declaradas e onde serão aprofundadas:\nDesafio de transferência (contexto novo):\nExemplo resolvido:\nDataset, quantidade de registros e regra do alvo:\nContas e gabaritos que precisam ser reproduzidos:\nPrática e feedback:\nEvidências exigidas para conclusão:\nComo cada evidência será verificada no código:\nInterações que precisam persistir:\nComportamento esperado na retomada:\nFonte principal:\nIlustrações didáticas em HTML/CSS/SVG/JS (uma por slide conceitual, com função e dados de origem):\nCodificação visual estável (forma, cor e rótulo de cada classe):\nQuantidade e função dos slides (mapear para o arco de references/arco-didatico.md):\nDestino: arquivo local, pacote SCORM ou Artifact:\n`);
createIfMissing("RESOURCES.md", `# Fontes de {tema}\n\n## Conhecimento\n- [{fonte}]({url})\n  Abrange: {escopo}. Usar para: {decisão}.\n\n## Prática e comunidade\n- {recurso ou comunidade}\n\n## Lacunas\n- {questão sem fonte}\n`);
createIfMissing("NOTES.md", `# Notas\n\n- Preferências do público e decisões de autoria.\n`);

console.log(`Workspace preparado em: ${target}`);
console.log("Próximo passo: copie assets/licao-modelo.html para lessons/0001-<slug>.html e substitua os marcadores.");
