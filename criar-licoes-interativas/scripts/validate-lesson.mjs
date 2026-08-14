#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const targetArg = process.argv[2];
if (!targetArg) {
  console.error("Uso: node validate-lesson.mjs <arquivo.html>");
  process.exit(2);
}

const file = path.resolve(targetArg);
if (!fs.existsSync(file)) {
  console.error(`Arquivo não encontrado: ${file}`);
  process.exit(2);
}

const html = fs.readFileSync(file, "utf8");
const base = path.dirname(file);
const errors = [];
const warnings = [];

function requirePattern(pattern, message) {
  if (!pattern.test(html)) errors.push(message);
}

requirePattern(/<!doctype html>/i, "Adicionar <!doctype html>.");
requirePattern(/<html[^>]+lang=["']pt-BR["']/i, "Definir lang=\"pt-BR\".");
requirePattern(/<meta[^>]+name=["']viewport["']/i, "Adicionar meta viewport.");
requirePattern(/<title>[^<]+<\/title>/i, "Adicionar título de página.");
requirePattern(/<h1\b/i, "Adicionar um h1.");
requirePattern(/class=["'][^"']*\bslide\b/i, "Adicionar pelo menos um slide.");

if (/\{\{[A-Z0-9_]+\}\}/.test(html)) errors.push("Substituir todos os marcadores {{...}} do template.");
if (!/data-quiz|data-check|data-save|data-answer|class=["'][^"']*(?:simulator|sorting|mission|checklist)/i.test(html)) {
  warnings.push("Incluir ao menos uma prática interativa observável.");
}
if (!/aria-live/i.test(html)) warnings.push("Adicionar região aria-live para feedback ou navegação.");
if (!/prefers-reduced-motion/i.test(html) && !/estilo-slides\.css/i.test(html)) warnings.push("Respeitar prefers-reduced-motion.");
if (!/@media\s+print/i.test(html) && !/estilo-slides\.css/i.test(html)) warnings.push("Adicionar estilo de impressão.");
if (!/https?:\/\//i.test(html)) warnings.push("Registrar ao menos uma fonte principal com link.");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) errors.push(`IDs duplicados: ${duplicates.join(", ")}.`);

for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
  if (!/\balt=["'][^"']*["']/i.test(match[1])) errors.push("Toda imagem <img> deve possuir atributo alt.");
}

for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const reference = match[1];
  if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(reference)) continue;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  const resolved = path.resolve(base, clean);
  if (!fs.existsSync(resolved)) errors.push(`Referência local ausente: ${reference}.`);
}

for (const match of html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)) {
  try { new Function(match[1]); }
  catch (error) { errors.push(`JavaScript inline inválido: ${error.message}`); }
}

console.log(`Validação: ${file}`);
errors.forEach(message => console.error(`[erro] ${message}`));
warnings.forEach(message => console.warn(`[alerta] ${message}`));

if (!errors.length) console.log(`[ok] Sem erros estruturais. ${warnings.length} alerta(s).`);
process.exit(errors.length ? 1 : 0);
