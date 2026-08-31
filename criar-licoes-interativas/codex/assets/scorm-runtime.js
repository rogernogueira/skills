(function () {
  "use strict";

  let api = null;
  let finished = false;
  const startedAt = Date.now();

  function findApi(start) {
    let current = start;
    for (let attempts = 0; current && attempts < 20; attempts += 1) {
      try {
        if (current.API) return current.API;
        if (current.parent === current) break;
        current = current.parent;
      } catch (error) { break; }
    }
    return null;
  }

  try { api = findApi(window) || (window.opener ? findApi(window.opener) : null); }
  catch (error) {}

  function call(name, ...args) {
    try { return api && typeof api[name] === "function" ? api[name](...args) : null; }
    catch (error) { return null; }
  }
  function succeeded(value) { return value === true || String(value).toLowerCase() === "true"; }
  function setValue(key, value) { return call("LMSSetValue", key, String(value)); }
  function getValue(key) { return call("LMSGetValue", key) || ""; }
  function commit() { return api ? succeeded(call("LMSCommit", "")) : false; }
  function parseState() {
    try { return JSON.parse(getValue("cmi.suspend_data") || "{}"); }
    catch (error) { return {}; }
  }

  if (api && call("LMSInitialize", "") === "false") api = null;

  const defaults = { visited: [], fields: {}, exploration: {}, quizzes: {} };
  const state = Object.assign({}, defaults, api ? parseState() : {});
  if (!Array.isArray(state.visited)) state.visited = [];
  for (const key of ["fields", "exploration", "quizzes"]) {
    if (!state[key] || typeof state[key] !== "object") state[key] = {};
  }

  const locationValue = api ? getValue("cmi.core.lesson_location") : "";
  const locationMatch = /^slide-(\d+)$/.exec(locationValue);
  const resumeLocation = locationMatch ? Number(locationMatch[1]) : 1;
  let persistenceConfirmed = false;
  let completedStatus = api ? getValue("cmi.core.lesson_status").toLowerCase() === "completed" : false;

  if (api) {
    const status = getValue("cmi.core.lesson_status");
    if (!status || status === "not attempted") setValue("cmi.core.lesson_status", "incomplete");
    setValue("cmi.core.exit", "suspend");
    commit();
  }

  function persist() {
    if (!api) return false;
    const serialized = JSON.stringify(state);
    if (!succeeded(setValue("cmi.suspend_data", serialized)) || !commit()) {
      persistenceConfirmed = false;
      return false;
    }
    const restored = parseState();
    persistenceConfirmed = JSON.stringify(restored) === serialized;
    return persistenceConfirmed;
  }

  function saveLearnerWork(snapshot) {
    state.fields = Object.assign({}, snapshot?.fields || {});
    state.exploration = Object.assign({}, snapshot?.exploration || {});
    state.quizzes = Object.assign({}, snapshot?.quizzes || {});
    if (Array.isArray(snapshot?.visited)) state.visited = [...snapshot.visited];
    return persist();
  }

  function recordSlide(number) {
    if (!state.visited.includes(number)) state.visited.push(number);
    if (!api) return false;
    setValue("cmi.core.lesson_location", `slide-${number}`);
    return persist();
  }

  function recordQuiz({ id, selected, correctResponse, correct, index }) {
    state.quizzes[id] = { selected, correct: Boolean(correct), attempted: true };
    if (!api) return false;
    const prefix = `cmi.interactions.${index}`;
    setValue(`${prefix}.id`, id);
    setValue(`${prefix}.type`, "choice");
    setValue(`${prefix}.student_response`, selected);
    setValue(`${prefix}.correct_responses.0.pattern`, correctResponse);
    setValue(`${prefix}.result`, correct ? "correct" : "wrong");
    return persist();
  }

  function complete() {
    if (!api || !persist()) return false;
    const statusOk = succeeded(setValue("cmi.core.lesson_status", "completed"));
    const locationOk = succeeded(setValue("cmi.core.lesson_location", "completed"));
    const exitOk = succeeded(setValue("cmi.core.exit", ""));
    completedStatus = statusOk && locationOk && exitOk && commit();
    return completedStatus;
  }

  function clearLearnerWork() {
    state.visited = [];
    state.fields = {};
    state.exploration = {};
    state.quizzes = {};
    completedStatus = false;
    if (!api) return false;
    setValue("cmi.core.lesson_status", "incomplete");
    setValue("cmi.core.lesson_location", "slide-1");
    return persist();
  }

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const hours = String(Math.floor(total / 3600)).padStart(4, "0");
    const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const seconds = String(total % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}.00`;
  }

  function finish() {
    if (finished || !api) return;
    finished = true;
    setValue("cmi.core.session_time", formatTime(Date.now() - startedAt));
    persist();
    call("LMSFinish", "");
  }

  window.CourseScorm = {
    connected: Boolean(api),
    state,
    resumeLocation,
    saveLearnerWork,
    recordSlide,
    recordQuiz,
    complete,
    clearLearnerWork,
    get persistenceConfirmed() { return persistenceConfirmed; },
    get completed() { return completedStatus; }
  };

  addEventListener("pagehide", finish);
  addEventListener("beforeunload", finish);
}());
