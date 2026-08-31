#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const runtime = fs.readFileSync(new URL("../assets/scorm-runtime.js", import.meta.url), "utf8");
const values = {
  "cmi.core.lesson_status": "incomplete",
  "cmi.core.lesson_location": "slide-1",
  "cmi.suspend_data": "{}"
};
const calls = [];
const API = {
  LMSInitialize: value => { calls.push(["LMSInitialize", value]); return "true"; },
  LMSGetValue: key => values[key] || "",
  LMSSetValue: (key, value) => { values[key] = value; return "true"; },
  LMSCommit: value => { calls.push(["LMSCommit", value]); return "true"; },
  LMSFinish: value => { calls.push(["LMSFinish", value]); return "true"; }
};

function createSession(activeApi = API) {
  const listeners = {};
  const window = { API: activeApi };
  window.parent = window;
  window.opener = null;
  const context = {
    window,
    document: {},
    Date,
    JSON,
    Math,
    Number,
    String,
    Boolean,
    console,
    addEventListener: (name, fn) => { (listeners[name] ??= []).push(fn); }
  };
  vm.runInNewContext(runtime, context);
  return { window, listeners };
}

const first = createSession();
const snapshot = {
  visited: [1, 2],
  fields: { resposta: "Análise registrada", criterio: true, faixa: "25" },
  exploration: { faixa: ["eq:25", "eq:50", "lte:15"] },
  quizzes: { "q-1": { selected: "B", correct: true, attempted: true } }
};
assert.equal(first.window.CourseScorm.saveLearnerWork(snapshot), true);
assert.equal(first.window.CourseScorm.recordSlide(3), true);
assert.equal(first.window.CourseScorm.recordQuiz({ id: "q-1", selected: "B", correctResponse: "B", correct: true, index: 0 }), true);
assert.equal(first.window.CourseScorm.complete(), true);
for (const finish of first.listeners.beforeunload) finish();

const second = createSession();
assert.deepEqual({ ...second.window.CourseScorm.state.fields }, snapshot.fields);
assert.deepEqual(JSON.parse(JSON.stringify(second.window.CourseScorm.state.exploration)), snapshot.exploration);
assert.equal(second.window.CourseScorm.state.quizzes["q-1"].correct, true);
assert.ok(second.window.CourseScorm.state.visited.includes(3));
assert.equal(values["cmi.core.lesson_status"], "completed");
assert.equal(second.window.CourseScorm.completed, true, "a retomada deve reconhecer a unidade já concluída");
assert.ok(calls.some(call => call[0] === "LMSCommit"));
assert.ok(calls.some(call => call[0] === "LMSFinish"));

// Falha de commit não pode gravar nem concluir.
const failValues = {
  "cmi.core.lesson_status": "incomplete",
  "cmi.core.lesson_location": "slide-1",
  "cmi.suspend_data": "{}"
};
const failApi = {
  LMSInitialize: () => "true",
  LMSGetValue: key => failValues[key] || "",
  LMSSetValue: (key, value) => { failValues[key] = value; return "true"; },
  LMSCommit: () => "false",
  LMSFinish: () => "true"
};
const third = createSession(failApi);
assert.equal(third.window.CourseScorm.saveLearnerWork(snapshot), false, "sem commit não há gravação confirmada");
assert.equal(third.window.CourseScorm.complete(), false, "sem gravação confirmada não há conclusão");
assert.equal(third.window.CourseScorm.completed, false);
assert.notEqual(failValues["cmi.core.lesson_status"], "completed");

console.log("SCORM: persistência, conclusão, retomada em nova sessão e bloqueio por falha de commit OK.");
