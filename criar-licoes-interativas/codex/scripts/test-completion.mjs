#!/usr/bin/env node
// Exercita a conclusão verificável de assets/licao-runtime.js sem dependências externas:
// um DOM mínimo (só o que o runtime usa) mais um fixture com quiz, checklist, texto e simulador.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const TOKEN = /([a-zA-Z][\w-]*)|\.([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']*)["']?)?\]/g;

function matchesOne(element, selector) {
  TOKEN.lastIndex = 0;
  let token;
  let matched = false;
  while ((token = TOKEN.exec(selector))) {
    matched = true;
    const [, tag, className, attribute, value] = token;
    if (tag && element.tagName !== tag.toUpperCase()) return false;
    if (className && !element.classList.contains(className)) return false;
    if (attribute) {
      if (!element.hasAttribute(attribute)) return false;
      if (value !== undefined && element.getAttribute(attribute) !== value) return false;
    }
  }
  return matched;
}
function matchesSelector(element, selector) {
  return selector.split(",").map(part => part.trim()).filter(Boolean).some(part => matchesOne(element, part));
}

function camel(name) {
  return name.replace(/^data-/, "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
function kebab(name) {
  return `data-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
}

class El {
  constructor(tag) {
    this.tagName = String(tag).toUpperCase();
    this.attributes = new Map();
    this.childNodes = [];
    this.parentElement = null;
    this.listeners = new Map();
    this.text = "";
    this.top = 0;
    if (this.tagName === "INPUT" || this.tagName === "TEXTAREA" || this.tagName === "SELECT") this.value = "";
    const element = this;
    this.classList = {
      contains: name => element.getAttribute("class").split(/\s+/).includes(name),
      add: (...names) => element.setClasses([...new Set([...element.classes(), ...names])]),
      remove: (...names) => element.setClasses(element.classes().filter(name => !names.includes(name))),
      toggle: (name, force) => {
        const on = force === undefined ? !element.classList.contains(name) : Boolean(force);
        return on ? element.classList.add(name) : element.classList.remove(name);
      }
    };
    this.dataset = new Proxy({}, {
      get: (_, key) => (element.attributes.has(kebab(key)) ? element.attributes.get(kebab(key)) : undefined),
      set: (_, key, value) => { element.attributes.set(kebab(key), String(value)); return true; },
      has: (_, key) => element.attributes.has(kebab(key)),
      deleteProperty: (_, key) => element.attributes.delete(kebab(key))
    });
  }
  get type() {
    if (this.tagName === "TEXTAREA") return "textarea";
    return this.tagName === "INPUT" ? this.getAttribute("type") || "text" : this.getAttribute("type") || undefined;
  }
  set type(value) { this.setAttribute("type", value); }
  classes() { return this.getAttribute("class").split(/\s+/).filter(Boolean); }
  setClasses(list) { this.attributes.set("class", list.join(" ")); }
  set className(value) { this.attributes.set("class", value); }
  get className() { return this.getAttribute("class"); }
  setAttribute(name, value) { this.attributes.set(name.toLowerCase(), String(value)); }
  getAttribute(name) { return this.attributes.has(name.toLowerCase()) ? this.attributes.get(name.toLowerCase()) : ""; }
  hasAttribute(name) { return this.attributes.has(name.toLowerCase()); }
  removeAttribute(name) { this.attributes.delete(name.toLowerCase()); }
  get id() { return this.getAttribute("id"); }
  set id(value) { this.setAttribute("id", value); }
  append(...nodes) { nodes.forEach(node => { node.parentElement = this; this.childNodes.push(node); }); }
  appendChild(node) { this.append(node); return node; }
  replaceChildren(...nodes) { this.childNodes = []; this.append(...nodes); }
  insertAdjacentElement(position, node) {
    const parent = this.parentElement;
    if (!parent) return node;
    const index = parent.childNodes.indexOf(this);
    parent.childNodes.splice(position === "afterend" ? index + 1 : index, 0, node);
    node.parentElement = parent;
    return node;
  }
  get textContent() {
    return this.text + this.childNodes.map(node => node.textContent).join("");
  }
  set textContent(value) { this.childNodes = []; this.text = String(value); }
  descendants() {
    return this.childNodes.flatMap(node => [node, ...node.descendants()]);
  }
  querySelectorAll(selector) { return this.descendants().filter(node => matchesSelector(node, selector)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  matches(selector) { return matchesSelector(this, selector); }
  closest(selector) {
    let node = this;
    while (node) {
      if (matchesSelector(node, selector)) return node;
      node = node.parentElement;
    }
    return null;
  }
  addEventListener(name, handler) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name).push(handler);
  }
  dispatchEvent(event) {
    let node = this;
    while (node) {
      (node.listeners.get(event.type) || []).forEach(handler => handler.call(node, event));
      node = event.bubbles ? node.parentElement : null;
    }
    return true;
  }
  click() { this.dispatchEvent({ type: "click", bubbles: true }); }
  input() { this.dispatchEvent({ type: "input", bubbles: true }); }
  getBoundingClientRect() { return { top: this.top, left: 0 }; }
  scrollIntoView() {}
}

function h(tag, attributes = {}, children = []) {
  const element = new El(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === true) element.setAttribute(name, "");
    else if (value !== false && value !== undefined && value !== null) element.setAttribute(name, value);
  }
  if (typeof children === "string") element.textContent = children;
  else children.forEach(child => element.append(child));
  return element;
}

function buildFixture() {
  const slide = (number, inner = []) => h("section", { class: "slide", "data-slide": number }, [h("h2", {}, `Slide ${number}`), ...inner]);

  const quiz = h("div", {
    class: "quiz-options",
    "data-quiz": true,
    "data-required": true,
    "data-interaction-id": "q-final",
    "data-requirement-label": "Responder corretamente ao desafio final"
  }, [
    h("button", { type: "button", "data-answer": "A", "data-incorrect-feedback": "Errado porque A." }, "A"),
    h("button", { type: "button", "data-answer": "B", "data-correct": true, "data-correct-feedback": "Certo porque B." }, "B"),
    h("div", { class: "quiz-feedback", "data-feedback": true }, "Escolha uma alternativa.")
  ]);

  const checkbox = h("input", {
    id: "passo-1", type: "checkbox", "data-save": true, "data-required": true,
    "data-requirement-label": "Marcar o passo obrigatório"
  });
  const textarea = h("textarea", {
    id: "bilhete", "data-save": true, "data-required": true, "data-min-words": "5",
    "data-requirement-label": "Escrever o bilhete com pelo menos 5 palavras"
  });
  const range = h("input", {
    id: "carga", type: "range", "data-save": true, "data-required": true,
    "data-explore-rules": "lte:10,gte:90",
    "data-requirement-label": "Explorar os dois cenários do simulador"
  });
  range.value = "50";
  range.defaultValue = "50";

  const button = h("button", { type: "button", class: "btn", "data-complete": true, disabled: true }, "Concluir unidade");
  const message = h("p", { "data-completion-message": true, role: "status", "aria-live": "polite" }, "Verificando os requisitos…");
  const checks = h("ul", { class: "completion-checks", "data-completion-checks": true });
  const persistence = h("p", { class: "persistence-status", "data-persistence-status": true, role: "status" });
  const reset = h("button", { type: "button", "data-reset": true }, "Limpar respostas e progresso");
  const print = h("button", { type: "button", "data-print": true }, "Imprimir");

  const body = h("body", { "data-storage-key": "teste-conclusao", "data-completion-mode": "local", "data-require-all-slides": true }, [
    h("nav", { class: "dot-nav" }),
    h("div", { "data-announcer": true }),
    h("div", { class: "salvo", "data-saved-notice": true }),
    h("main", {}, [
      slide(1),
      slide(2, [quiz]),
      slide(3, [checkbox, textarea, range]),
      slide(4, [h("section", { class: "completion-panel" }, [message, checks, persistence, h("div", {}, [button, print, reset])])])
    ])
  ]);

  return { body, quiz, checkbox, textarea, range, button, message, checks, persistence, reset, print,
           options: quiz.querySelectorAll("[data-answer]"), feedback: quiz.querySelector("[data-feedback]") };
}

const runtimeSource = fs.readFileSync(new URL("../assets/licao-runtime.js", import.meta.url), "utf8");

function fakeScorm({ connected = true, commitOk = true, completeOk = true } = {}) {
  const state = { visited: [], fields: {}, exploration: {}, quizzes: {} };
  let completed = false;
  return {
    connected,
    state,
    resumeLocation: 1,
    get completed() { return completed; },
    saveLearnerWork(snapshot) { Object.assign(state, JSON.parse(JSON.stringify(snapshot))); return commitOk; },
    recordSlide() { return commitOk; },
    recordQuiz() { return commitOk; },
    complete() { if (!completeOk) return false; completed = true; return true; },
    clearLearnerWork() { return commitOk; }
  };
}

function startRuntime(store, { answerConfirm = true, scorm = null, completionMode = "local" } = {}) {
  const dom = buildFixture();
  dom.body.setAttribute("data-completion-mode", completionMode);
  const timers = new Map();
  let timerId = 0;
  const observers = [];
  const document = {
    body: dom.body,
    createElement: tag => new El(tag),
    querySelector: selector => dom.body.querySelector(selector),
    querySelectorAll: selector => dom.body.querySelectorAll(selector),
    addEventListener: () => {},
    activeElement: null
  };
  const localStorage = {
    getItem: key => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: key => { delete store[key]; }
  };
  const confirmCalls = [];
  const printCalls = [];
  const window = {
    document,
    localStorage,
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; this.targets = []; observers.push(this); }
      observe(target) { this.targets.push(target); }
      unobserve(target) { this.targets = this.targets.filter(item => item !== target); }
    },
    confirm: text => { confirmCalls.push(text); return answerConfirm; },
    print: () => printCalls.push(true),
    requestAnimationFrame: callback => callback(),
    location: { pathname: "/teste" }
  };
  window.window = window;
  if (scorm) window.CourseScorm = scorm;
  const context = Object.assign(window, {
    setTimeout: (callback, delay) => { timerId += 1; timers.set(timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
    Event: class { constructor(type, options = {}) { this.type = type; this.bubbles = Boolean(options.bubbles); } },
    console, JSON, Object, Array, Set, Map, Boolean, Number, String, Math, Date, RegExp
  });
  vm.runInNewContext(runtimeSource, context);

  const flush = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); };
  const visit = number => {
    observers[0].callback([{ isIntersecting: true, target: dom.body.querySelectorAll(".slide")[number - 1] }]);
  };
  const labels = () => dom.checks.childNodes.map(item => item.textContent);
  const pending = () => dom.checks.childNodes.filter(item => item.classList.contains("completion-pending")).map(item => item.textContent);

  return { ...dom, flush, visit, labels, pending, store, confirmCalls, printCalls };
}

// ---------------------------------------------------------------- estado inicial
const store = {};
let app = startRuntime(store);
assert.equal(app.button.hasAttribute("disabled") || app.button.disabled, true, "botão deve começar desabilitado");
assert.equal(app.labels().length, 5, "cinco requisitos derivados do fixture");
assert.match(app.message.textContent, /5 requisitos ainda pendentes\. Confira a lista abaixo\./, "mensagem conta as pendências");
assert.equal(app.persistence.textContent, "Salvo apenas neste navegador.");

// -------------------------------------------- visitar todos os slides não conclui
[2, 3, 4].forEach(app.visit);
app.flush();
assert.ok(app.labels().some(label => /Cumprido: Visitar os 4 slides/.test(label)), "visita registrada");
assert.equal(app.button.disabled, true, "visita a todos os slides não libera a conclusão");
assert.equal(app.pending().length, 4);

// ------------------------------------------------- tentativa não é acerto no quiz
app.options[0].click();
app.flush();
assert.match(app.feedback.textContent, /Errado porque A/);
assert.ok(app.pending().some(label => /desafio final/.test(label)), "resposta incorreta mantém o requisito pendente");
app.options[1].click();
app.flush();
assert.ok(app.labels().some(label => /Cumprido: Responder corretamente/.test(label)), "acerto cumpre o requisito");
assert.equal(app.button.disabled, true, "ainda faltam outros requisitos");

// ------------------------------------------------------- completude e exploração
app.checkbox.checked = true;
app.checkbox.input();
app.textarea.value = "quatro palavras ainda faltam";
app.textarea.input();
app.flush();
assert.ok(app.pending().some(label => /bilhete/.test(label)), "texto abaixo do mínimo continua pendente");
app.textarea.value = "agora o bilhete tem seis palavras";
app.textarea.input();
app.range.value = "5";
app.range.input();
app.flush();
assert.ok(app.pending().some(label => /simulador/.test(label)), "uma única condição não conta como exploração");
app.range.value = "95";
app.range.input();
app.flush();

// -------------------------------------------------------------- liberação total
assert.deepEqual(app.pending(), [], "sem pendências");
assert.equal(app.button.disabled, false, "botão liberado");
assert.equal(app.message.textContent, "Todos os requisitos cumpridos. A unidade pode ser concluída.");
assert.ok(app.labels().every(label => label.startsWith("✓")), "todos os itens marcados com ✓");
assert.ok(app.labels().every(label => /Cumprido: /.test(label)), "estado também em texto, não apenas por cor");

// ------------------------------------------- desfazer uma resposta volta a bloquear
app.options[0].click();
app.flush();
assert.equal(app.button.disabled, true, "resposta alterada para incorreta bloqueia de novo");
assert.equal(app.pending().length, 1);
app.options[1].click();
app.flush();
assert.equal(app.button.disabled, false);

// ---------------------------------- revalidação no clique final ignora botão viciado
app.checkbox.checked = false;
app.checkbox.input();
app.flush();
app.button.disabled = false; // estado viciado, como se o CSS/DOM tivesse sido forçado
app.button.click();
app.flush();
assert.notEqual(app.button.textContent, "Lição concluída", "clique com pendência não conclui");
assert.equal(app.button.disabled, true, "a revalidação devolve o botão ao estado bloqueado");
app.checkbox.checked = true;
app.checkbox.input();
app.flush();

// -------------------------------------------------------------- conclusão local
app.button.click();
app.flush();
assert.equal(app.button.textContent, "Lição concluída");
assert.equal(app.button.disabled, true);
assert.match(app.message.textContent, /Conclusão registrada neste navegador/);
assert.equal(JSON.parse(store["teste-conclusao"]).completed, true, "conclusão local precisa persistir");

// ---------------------------------------------------- retomada em nova sessão
const resumed = startRuntime(store);
assert.equal(resumed.checkbox.checked, true, "checkbox restaurado");
assert.equal(resumed.textarea.value, "agora o bilhete tem seis palavras", "texto restaurado");
assert.match(resumed.feedback.textContent, /Certo porque B.*Resposta restaurada/, "feedback do quiz restaurado");
assert.equal(resumed.button.textContent, "Lição concluída", "conclusão local sobrevive ao recarregamento");
assert.deepEqual(resumed.pending(), [], "checklist recalculado na retomada");

// --------------------------------------------------------- limpeza das respostas
resumed.reset.click();
resumed.flush();
assert.match(resumed.confirmCalls[0], /apaga respostas.*neste navegador/, "a confirmação nomeia o alcance da limpeza");
assert.equal(resumed.checkbox.checked, false);
assert.equal(resumed.textarea.value, "");
assert.equal(resumed.feedback.textContent, "Escolha uma alternativa.", "feedback volta ao texto inicial");
assert.equal(resumed.button.disabled, true, "limpeza volta a bloquear a conclusão");
assert.equal(resumed.button.textContent, "Concluir unidade", "rótulo do botão volta ao original");
assert.equal(store["teste-conclusao"], undefined, "estado local removido");
assert.equal(resumed.pending().length, 5, "todos os requisitos voltam a pendentes, inclusive as visitas");

// ------------------------------------------------- imprimir não altera progresso
const printing = startRuntime({});
printing.checkbox.checked = true;
printing.checkbox.input();
printing.flush();
const before = printing.labels().join("|");
printing.print.click();
printing.flush();
assert.equal(printing.printCalls.length, 1);
assert.equal(printing.labels().join("|"), before, "imprimir não muda o checklist");

// ----------------------------------------------- limpeza cancelada não apaga nada
const kept = startRuntime({}, { answerConfirm: false });
kept.checkbox.checked = true;
kept.checkbox.input();
kept.flush();
kept.reset.click();
kept.flush();
assert.equal(kept.checkbox.checked, true, "cancelar a confirmação preserva as respostas");

// ------------------------------------------------------------------- modo SCORM
function satisfyAll(session) {
  [2, 3, 4].forEach(session.visit);
  session.options[1].click();
  session.checkbox.checked = true;
  session.checkbox.input();
  session.textarea.value = "agora o bilhete tem seis palavras";
  session.textarea.input();
  session.range.value = "5";
  session.range.input();
  session.range.value = "95";
  session.range.input();
  session.flush();
}

const offline = startRuntime({}, { completionMode: "scorm", scorm: fakeScorm({ connected: false }) });
satisfyAll(offline);
assert.ok(offline.pending().some(label => /Abrir a lição pelo LMS/.test(label)), "fora do LMS o requisito de abertura fica pendente");
assert.equal(offline.button.disabled, true, "lição SCORM não conclui fora do LMS");

const inLms = startRuntime({}, { completionMode: "scorm", scorm: fakeScorm() });
satisfyAll(inLms);
assert.equal(inLms.persistence.textContent, "Respostas salvas no LMS.");
assert.deepEqual(inLms.pending(), [], "no LMS, com gravação confirmada, nada fica pendente");
inLms.button.click();
inLms.flush();
assert.equal(inLms.button.textContent, "Lição concluída");
assert.match(inLms.message.textContent, /confirmada pelo LMS/);

const brokenCommit = startRuntime({}, { completionMode: "scorm", scorm: fakeScorm({ commitOk: false }) });
satisfyAll(brokenCommit);
assert.ok(brokenCommit.pending().some(label => /Confirmar a gravação no LMS/.test(label)), "sem confirmação de gravação o requisito fica pendente");
assert.match(brokenCommit.persistence.textContent, /não confirmou a gravação/);
brokenCommit.button.disabled = false;
brokenCommit.button.click();
brokenCommit.flush();
assert.notEqual(brokenCommit.button.textContent, "Lição concluída", "falha de gravação impede a conclusão");
assert.match(brokenCommit.message.textContent, /não foi concluída. Tente novamente/);

const brokenComplete = startRuntime({}, { completionMode: "scorm", scorm: fakeScorm({ completeOk: false }) });
satisfyAll(brokenComplete);
assert.equal(brokenComplete.button.disabled, false);
brokenComplete.button.click();
brokenComplete.flush();
assert.notEqual(brokenComplete.button.textContent, "Lição concluída", "falha no commit final impede a conclusão");
assert.match(brokenComplete.message.textContent, /não foi concluída. Tente novamente/);
assert.equal(brokenComplete.button.disabled, true, "após a falha o botão volta a bloquear");

console.log("Conclusão: checklist vivo, bloqueio por evidência, revalidação, retomada, limpeza e modo SCORM OK.");
