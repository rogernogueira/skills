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
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:=["']([^"']*)["'])?/g)].map(match => [match[1].toLowerCase(), match[2] ?? ""]));
}

requirePattern(/<!doctype html>/i, "Adicionar <!doctype html>.");
requirePattern(/<html[^>]+lang=["']pt-BR["']/i, "Definir lang=\"pt-BR\".");
requirePattern(/<meta[^>]+name=["']viewport["']/i, "Adicionar meta viewport.");
requirePattern(/<title>[^<]+<\/title>/i, "Adicionar título de página.");
requirePattern(/<h1\b/i, "Adicionar um h1.");
requirePattern(/class=["'][^"']*\bslide\b/i, "Adicionar pelo menos um slide.");

if (/\{\{[A-Z0-9_]+\}\}/.test(html)) errors.push("Substituir todos os marcadores {{...}} do template.");
if (/carga\s+hor[aá]ria|dura[cç][aã]o\s+estimada|tempo\s+estimado/i.test(html)) {
  errors.push("Remover carga horária, duração estimada e promessas de tempo.");
}
if (!/data-quiz|data-check|data-save|data-answer|class=["'][^"']*(?:simulator|sorting|mission|checklist)/i.test(html)) {
  warnings.push("Incluir ao menos uma prática interativa observável.");
}
if (!/data-scenario/i.test(html)) warnings.push("Se houver problema aplicado, reservar apresentação explícita do cenário com data-scenario.");
if (!/data-vocabulary/i.test(html)) warnings.push("Se houver termos abstratos, incluir vocabulário contextual com data-vocabulary.");
if (!/aria-live/i.test(html)) warnings.push("Adicionar região aria-live para feedback ou navegação.");
if (!/prefers-reduced-motion/i.test(html) && !/estilo-slides\.css/i.test(html)) warnings.push("Respeitar prefers-reduced-motion.");
if (!/@media\s+print/i.test(html) && !/estilo-slides\.css/i.test(html)) warnings.push("Adicionar estilo de impressão.");
if (!/https?:\/\//i.test(html)) warnings.push("Registrar ao menos uma fonte principal com link.");

const slides = [...html.matchAll(/<section\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>/gi)];
if (slides.length < 5) warnings.push("A sequência tem menos de cinco slides; verifique se contexto, conceito, prática, feedback e síntese estão suficientemente separados.");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) errors.push(`IDs duplicados: ${duplicates.join(", ")}.`);

for (const match of html.matchAll(/<(?:input|textarea|select)\b[^>]*data-save[^>]*>/gi)) {
  if (!/\bid=["'][^"']+["']/i.test(match[0])) errors.push("Todo controle com data-save deve possuir ID estável.");
}
for (const match of html.matchAll(/<(?:input|textarea|select|div|section|fieldset|form|ul|ol|table)\b[^>]*data-required[^>]*>/gi)) {
  if (!/data-requirement-label=["'][^"']+["']/i.test(match[0])) warnings.push("Adicionar data-requirement-label legível a cada requisito de conclusão.");
}
for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
  if (!/\balt=["'][^"']*["']/i.test(match[1])) errors.push("Toda imagem <img> deve possuir atributo alt.");
}

const quizStarts = [...html.matchAll(/<[^>]+data-quiz[^>]*>/gi)];
quizStarts.forEach((start, index) => {
  const sectionEnd = html.indexOf("</section>", start.index);
  const nextQuiz = quizStarts[index + 1]?.index ?? html.length;
  const end = sectionEnd >= 0 ? Math.min(sectionEnd, nextQuiz) : nextQuiz;
  const block = html.slice(start.index, end);
  const quizAttrs = attributes(start[0]);
  const options = [...block.matchAll(/<button\b[^>]*data-answer[^>]*>/gi)].map(match => ({ tag: match[0], attrs: attributes(match[0]) }));
  const correct = options.filter(option => Object.hasOwn(option.attrs, "data-correct"));
  if (options.length < 2) errors.push(`Quiz ${index + 1}: incluir ao menos duas alternativas.`);
  if (correct.length !== 1) errors.push(`Quiz ${index + 1}: deve existir exatamente uma alternativa data-correct.`);
  options.forEach((option, optionIndex) => {
    if (!option.attrs["data-answer"]) errors.push(`Quiz ${index + 1}, alternativa ${optionIndex + 1}: adicionar identificador curto em data-answer.`);
    const feedbackKey = Object.hasOwn(option.attrs, "data-correct") ? "data-correct-feedback" : "data-incorrect-feedback";
    if (!option.attrs[feedbackKey] && !option.attrs["data-feedback-text"]) {
      errors.push(`Quiz ${index + 1}, alternativa ${optionIndex + 1}: adicionar feedback explicativo específico.`);
    }
  });
  if (correct.length === 1 && quizAttrs["data-correct-response"] && correct[0].attrs["data-answer"] !== quizAttrs["data-correct-response"]) {
    errors.push(`Quiz ${index + 1}: data-correct-response não coincide com a alternativa marcada como correta.`);
  }
});

const completionButtons = [...html.matchAll(/<button\b[^>]*data-complete[^>]*>/gi)];
completionButtons.forEach(button => {
  if (!/\bdisabled\b/i.test(button[0])) errors.push("O botão data-complete deve iniciar desabilitado.");
});
if (completionButtons.length) {
  const messageTag = /<[^>]*\bdata-completion-message\b[^>]*>/i.exec(html);
  if (!messageTag) errors.push("Adicionar mensagem acessível com data-completion-message.");
  else if (!/role=["']status["']/i.test(messageTag[0]) && !/aria-live=/i.test(messageTag[0])) {
    errors.push("O elemento data-completion-message precisa de role=\"status\" e aria-live=\"polite\".");
  }

  const checksTag = /<ul\b[^>]*\bdata-completion-checks\b[^>]*>([\s\S]*?)<\/ul>/i.exec(html);
  if (!checksTag) errors.push("Adicionar a lista data-completion-checks do checklist vivo.");
  else if (/<li\b/i.test(checksTag[1])) errors.push("Os itens de data-completion-checks devem ser gerados pelo runtime; remover os <li> fixos do HTML.");

  const persistenceTag = /<[^>]*\bdata-persistence-status\b[^>]*>/i.exec(html);
  if (!persistenceTag) errors.push("Adicionar linha visível de estado da gravação com data-persistence-status.");
  else if (!/role=["']status["']/i.test(persistenceTag[0]) && !/aria-live=/i.test(persistenceTag[0])) {
    errors.push("O elemento data-persistence-status precisa de role=\"status\" e aria-live=\"polite\".");
  }

  const hasPractice = /data-quiz|data-save|data-answer/i.test(html);
  if (hasPractice && !/\bdata-required\b/i.test(html)) {
    errors.push("Conclusão liberada sem evidência de prática: marcar as interações obrigatórias com data-required.");
  }
  if (!/\bdata-print\b/i.test(html)) warnings.push("Incluir botão Imprimir com data-print no painel de conclusão.");
  if (!/\bdata-reset\b/i.test(html)) warnings.push("Incluir botão de limpeza com data-reset no painel de conclusão.");
}

if (/data-completion-mode=["']scorm["']/i.test(html)) {
  requirePattern(/scorm-runtime\.js/i, "Lição em modo SCORM deve carregar scorm-runtime.js.");
  if (html.indexOf("scorm-runtime.js") > html.indexOf("licao-runtime.js")) errors.push("Carregar scorm-runtime.js antes de licao-runtime.js.");
}

for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
  const reference = match[1];
  if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(reference)) continue;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  const resolved = path.resolve(base, clean);
  if (!fs.existsSync(resolved)) {
    errors.push(`Referência local ausente: ${reference}.`);
    continue;
  }
  if (/\.csv$/i.test(clean)) {
    const lines = fs.readFileSync(resolved, "utf8").split(/\r?\n/).filter(line => line.trim());
    const records = Math.max(0, lines.length - 1);
    if (records <= 30) errors.push(`Dataset aplicado ${reference}: usar mais de 30 registros; encontrados ${records}.`);
  }
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
