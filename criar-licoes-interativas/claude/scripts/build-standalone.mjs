#!/usr/bin/env node
// Gera uma versão de arquivo único da lição, com CSS e JS embutidos,
// para publicação como Artifact ou envio por e-mail.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const [sourceArg, outputArg] = args.filter(arg => !arg.startsWith("--"));

if (!sourceArg) {
  console.error("Uso: node build-standalone.mjs <licao.html> [saida.html]");
  process.exit(2);
}

const source = path.resolve(sourceArg);
if (!fs.existsSync(source)) {
  console.error(`Arquivo não encontrado: ${source}`);
  process.exit(2);
}

const base = path.dirname(source);
const output = path.resolve(outputArg || source.replace(/(\.html)$/i, "-standalone$1"));
if (output === source) {
  console.error("A saída não pode sobrescrever o arquivo original.");
  process.exit(2);
}

let html = fs.readFileSync(source, "utf8");
const inlined = [];
const pending = [];

function isLocal(reference) {
  return !/^(?:https?:|mailto:|tel:|#|data:|javascript:|\/\/)/i.test(reference);
}
function readLocal(reference) {
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  const resolved = path.resolve(base, clean);
  return fs.existsSync(resolved) ? fs.readFileSync(resolved, "utf8") : null;
}
function protect(code) {
  // Impede que o conteúdo embutido feche a tag hospedeira antes do tempo.
  return code.replace(/<\/(script|style)/gi, "<\\/$1");
}

html = html.replace(/[ \t]*<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, tag => {
  const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
  if (!href || !isLocal(href)) return tag;
  const css = readLocal(href);
  if (css === null) {
    pending.push(`CSS ausente, mantido como link: ${href}`);
    return tag;
  }
  inlined.push(href);
  return `  <style>\n${protect(css.trim())}\n  </style>\n`;
});

html = html.replace(/[ \t]*<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>\s*/gi, (tag, src) => {
  if (!isLocal(src)) return tag;
  const js = readLocal(src);
  if (js === null) {
    pending.push(`JS ausente, mantido como src: ${src}`);
    return tag;
  }
  inlined.push(src);
  return `  <script>\n${protect(js.trim())}\n  </script>\n`;
});

for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const reference = match[1];
  if (!isLocal(reference) || reference.startsWith("#")) continue;
  pending.push(`Referência local remanescente: ${reference}`);
}

fs.writeFileSync(output, html, "utf8");

console.log(`Arquivo único: ${output}`);
inlined.forEach(reference => console.log(`[embutido] ${reference}`));
[...new Set(pending)].forEach(message => console.warn(`[alerta] ${message}`));

if (/data-completion-mode=["']scorm["']/i.test(html)) {
  console.warn("[alerta] Lição em modo SCORM: em Artifact a conclusão não é registrada no LMS. Publicar em modo local.");
}
console.log("Antes de publicar como Artifact, remover <!doctype>, <html>, <head> e <body>, mantendo <title>, <style> e <script>.");
