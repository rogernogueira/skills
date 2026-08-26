(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = document.querySelector(".dot-nav");
  const announcer = document.querySelector("[data-announcer]");
  const savedNotice = document.querySelector("[data-saved-notice]");
  const scorm = window.CourseScorm;
  const completionMode = document.body.dataset.completionMode || "local";
  const storageKey = document.body.dataset.storageKey || `lesson:${location.pathname}`;
  const fields = Array.from(document.querySelectorAll("[data-save]"));
  let saveTimer = 0;
  let noticeTimer = 0;

  fields.forEach((field, index) => {
    if (!field.id) field.id = `saved-field-${index + 1}`;
  });

  let localState = {};
  try { localState = JSON.parse(localStorage.getItem(storageKey) || "{}"); }
  catch (error) {}

  const sourceState = scorm?.connected ? scorm.state : localState;
  const state = {
    visited: Array.isArray(sourceState?.visited) ? [...sourceState.visited] : [],
    fields: Object.assign({}, sourceState?.fields || {}),
    exploration: Object.assign({}, sourceState?.exploration || {}),
    quizzes: Object.assign({}, sourceState?.quizzes || {})
  };
  const visited = new Set(state.visited);
  let persistenceConfirmed = completionMode !== "scorm" || Boolean(scorm?.connected);

  function fieldValue(field) {
    if (field.type === "checkbox" || field.type === "radio") return field.checked;
    return field.value;
  }
  function restoreField(field, value) {
    if (field.type === "checkbox" || field.type === "radio") field.checked = value === true || value === "true";
    else field.value = value;
  }
  fields.forEach(field => {
    if (field.id in state.fields) restoreField(field, state.fields[field.id]);
  });

  function snapshot() {
    state.visited = [...visited];
    state.fields = Object.fromEntries(fields.map(field => [field.id, fieldValue(field)]));
    return state;
  }
  function saveLocal() {
    try { localStorage.setItem(storageKey, JSON.stringify(snapshot())); }
    catch (error) {}
  }
  function showSaveNotice(text) {
    if (!savedNotice) return;
    savedNotice.textContent = text;
    savedNotice.classList.add("visible");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => savedNotice.classList.remove("visible"), 1200);
  }
  function saveNow(showNotice = true) {
    clearTimeout(saveTimer);
    const current = snapshot();
    saveLocal();
    if (scorm?.connected) {
      persistenceConfirmed = Boolean(scorm.saveLearnerWork(current));
      if (showNotice) showSaveNotice(persistenceConfirmed ? "Salvo no LMS" : "O LMS não confirmou a gravação");
    } else {
      persistenceConfirmed = completionMode !== "scorm";
      if (showNotice) showSaveNotice("Salvo apenas neste navegador");
    }
    updateCompletion();
    return persistenceConfirmed;
  }
  function scheduleSave() {
    persistenceConfirmed = completionMode !== "scorm";
    updateCompletion();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveNow(true), 350);
  }

  function goTo(index, behavior = "smooth") {
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
    if (target) target.scrollIntoView({ behavior, block: "start" });
  }

  if (dots) {
    slides.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Ir para o slide ${index + 1}`);
      button.addEventListener("click", () => goTo(index));
      dots.appendChild(button);
    });
  }

  function mark(index) {
    if (index < 0) return;
    const number = index + 1;
    const isNew = !visited.has(number);
    visited.add(number);
    dots?.querySelectorAll("button").forEach((button, key) => {
      button.classList.toggle("active", key === index);
      button.setAttribute("aria-current", key === index ? "true" : "false");
    });
    const heading = slides[index]?.querySelector("h1,h2");
    if (announcer) announcer.textContent = `Slide ${number} de ${slides.length}${heading ? `: ${heading.textContent.trim()}` : ""}`;
    if (isNew) {
      saveLocal();
      if (scorm?.connected) persistenceConfirmed = Boolean(scorm.recordSlide(number));
    }
    updateCompletion();
  }

  if ("IntersectionObserver" in window) {
    const slideObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) mark(slides.indexOf(entry.target));
    }), { threshold: 0.6 });
    slides.forEach(slide => slideObserver.observe(slide));

    const animationObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      animationObserver.unobserve(entry.target);
    }), { threshold: 0.15 });
    document.querySelectorAll(".animate").forEach(element => animationObserver.observe(element));
  } else {
    document.querySelectorAll(".animate").forEach(element => element.classList.add("in"));
  }

  function currentSlide() {
    let best = 0;
    let distance = Infinity;
    slides.forEach((slide, index) => {
      const value = Math.abs(slide.getBoundingClientRect().top);
      if (value < distance) { distance = value; best = index; }
    });
    return best;
  }
  function isInteractive(element) {
    return Boolean(element?.closest("a,button,input,textarea,select,[contenteditable]"));
  }
  document.addEventListener("keydown", event => {
    if (event.metaKey || event.ctrlKey || event.altKey || isInteractive(document.activeElement)) return;
    const index = currentSlide();
    let destination = null;
    if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) destination = index + 1;
    if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) destination = index - 1;
    if (event.key === "Home") destination = 0;
    if (event.key === "End") destination = slides.length - 1;
    if (destination !== null) { event.preventDefault(); goTo(destination); }
  });

  document.querySelectorAll("[data-example]").forEach(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.dataset.example);
      if (!panel) return;
      const open = !panel.classList.contains("open");
      panel.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "Ocultar exemplo" : "Ver exemplo";
    });
  });

  document.querySelectorAll("[data-quiz]").forEach((quiz, quizIndex) => {
    const id = quiz.dataset.interactionId || `quiz-${quizIndex + 1}`;
    const feedback = quiz.querySelector("[data-feedback]");
    const options = Array.from(quiz.querySelectorAll("[data-answer]"));

    function render(option, restored = false) {
      const correct = option.hasAttribute("data-correct");
      options.forEach(answer => answer.classList.remove("correct", "incorrect"));
      option.classList.add(correct ? "correct" : "incorrect");
      if (feedback) {
        feedback.textContent = correct
          ? option.dataset.correctFeedback || option.dataset.feedbackText || "Resposta correta."
          : option.dataset.incorrectFeedback || option.dataset.feedbackText || "Resposta incorreta. Revise e tente novamente.";
        if (restored) feedback.textContent += " Resposta restaurada.";
      }
      return correct;
    }

    options.forEach(option => option.addEventListener("click", () => {
      const correct = render(option);
      const selected = option.dataset.answer || option.textContent.trim();
      state.quizzes[id] = { selected, correct, attempted: true };
      if (scorm?.connected) scorm.recordQuiz({
        id,
        selected,
        correctResponse: quiz.dataset.correctResponse || "",
        correct,
        index: quizIndex
      });
      saveNow(false);
    }));

    const restored = state.quizzes[id];
    const restoredOption = restored && options.find(option => (option.dataset.answer || option.textContent.trim()) === restored.selected);
    if (restoredOption) render(restoredOption, true);
  });

  function matchesRule(value, rule) {
    const [operator, rawExpected] = rule.split(":");
    const actual = Number(value);
    const expected = Number(rawExpected);
    if (operator === "eq") return actual === expected;
    if (operator === "lte") return actual <= expected;
    if (operator === "gte") return actual >= expected;
    return false;
  }
  document.querySelectorAll("input[type=range][data-explore-rules]").forEach(field => {
    const rules = field.dataset.exploreRules.split(",").map(value => value.trim()).filter(Boolean);
    const completed = new Set(state.exploration[field.id] || []);
    field.addEventListener("input", () => {
      rules.forEach(rule => { if (matchesRule(field.value, rule)) completed.add(rule); });
      state.exploration[field.id] = [...completed];
    });
  });
  document.querySelectorAll("input[type=range]:not([data-explore-rules])").forEach(field => {
    field.addEventListener("input", () => { state.exploration[field.id] = ["touched"]; });
  });

  document.querySelectorAll("[data-min-words]").forEach(field => {
    const minimum = Number(field.dataset.minWords) || 1;
    const status = document.createElement("span");
    status.className = "field-status";
    status.id = `${field.id}-status`;
    field.insertAdjacentElement("afterend", status);
    field.setAttribute("aria-describedby", [field.getAttribute("aria-describedby"), status.id].filter(Boolean).join(" "));
    const render = () => {
      const words = (field.value.trim().match(/\S+/g) || []).length;
      const ready = words >= minimum;
      status.classList.toggle("complete", ready);
      status.textContent = ready ? `✓ ${words} palavras.` : `▲ ${words} de ${minimum} palavras.`;
    };
    field.addEventListener("input", render);
    render();
  });

  function fieldRequirement(field) {
    const label = field.dataset.requirementLabel || field.closest("label")?.textContent.trim() || field.id;
    if (field.type === "checkbox" || field.type === "radio") return [field.checked, label];
    if (field.type === "range") {
      const rules = (field.dataset.exploreRules || "").split(",").map(value => value.trim()).filter(Boolean);
      const completed = state.exploration[field.id] || [];
      return [rules.length ? rules.every(rule => completed.includes(rule)) : completed.includes("touched"), label];
    }
    if (field.dataset.correctValue !== undefined) return [field.value === field.dataset.correctValue, label];
    if (field.dataset.minWords) {
      const words = (field.value.trim().match(/\S+/g) || []).length;
      return [words >= Number(field.dataset.minWords), label];
    }
    return [Boolean(field.value.trim()), label];
  }

  function updateCompletion() {
    const button = document.querySelector("[data-complete]");
    const message = document.querySelector("[data-completion-message]");
    if (!button || !message) return;
    const requirements = [];
    if (document.body.hasAttribute("data-require-all-slides")) {
      requirements.push([visited.size >= slides.length, `Visitar os ${slides.length} slides`]);
    }
    document.querySelectorAll("[data-required]").forEach(element => {
      if (element.matches("[data-quiz]")) {
        const index = Array.from(document.querySelectorAll("[data-quiz]")).indexOf(element);
        const id = element.dataset.interactionId || `quiz-${index + 1}`;
        requirements.push([Boolean(state.quizzes[id]?.correct), element.dataset.requirementLabel || "Responder corretamente ao quiz"]);
      } else if (element.matches("input,textarea,select")) {
        requirements.push(fieldRequirement(element));
      }
    });
    if (completionMode === "scorm") {
      requirements.push([Boolean(scorm?.connected), "Abrir a lição pelo LMS"]);
      requirements.push([persistenceConfirmed, "Confirmar a gravação no LMS"]);
    }

    let list = document.querySelector("[data-completion-checks]");
    if (!list) {
      list = document.createElement("ul");
      list.className = "completion-checks";
      list.setAttribute("data-completion-checks", "");
      message.insertAdjacentElement("afterend", list);
    }
    list.replaceChildren(...requirements.map(([done, label]) => {
      const item = document.createElement("li");
      item.className = done ? "completion-ok" : "completion-pending";
      item.textContent = `${done ? "✓" : "○"} ${label}`;
      return item;
    }));
    const pending = requirements.filter(([done]) => !done).length;
    button.disabled = pending > 0;
    message.textContent = pending ? `${pending} requisito(s) pendente(s).` : "Tudo pronto para concluir.";
  }

  fields.forEach(field => {
    field.addEventListener("input", () => {
      scheduleSave();
    });
    field.addEventListener("change", scheduleSave);
  });

  document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-reset]").forEach(button => button.addEventListener("click", () => {
    if (!confirm("Limpar as respostas salvas desta lição?")) return;
    fields.forEach(field => {
      if (field.type === "checkbox" || field.type === "radio") field.checked = false;
      else if (field.type === "range") field.value = field.defaultValue;
      else field.value = "";
      field.dispatchEvent(new Event("input", { bubbles: true }));
    });
    visited.clear();
    state.exploration = {};
    state.quizzes = {};
    document.querySelectorAll("[data-answer]").forEach(option => option.classList.remove("correct", "incorrect"));
    document.querySelectorAll("[data-feedback]").forEach(feedback => { feedback.textContent = "Escolha uma alternativa para receber feedback."; });
    try { localStorage.removeItem(storageKey); } catch (error) {}
    persistenceConfirmed = completionMode !== "scorm" || Boolean(scorm?.clearLearnerWork());
    updateCompletion();
  }));

  document.querySelectorAll("[data-complete]").forEach(button => button.addEventListener("click", () => {
    if (!saveNow(false)) return;
    const completed = completionMode === "scorm" ? Boolean(scorm?.complete()) : true;
    if (!completed) { persistenceConfirmed = false; updateCompletion(); return; }
    button.textContent = "Lição concluída";
    button.disabled = true;
    document.querySelector("[data-completion-message]").textContent = completionMode === "scorm"
      ? "Conclusão registrada e confirmada pelo LMS."
      : "Conclusão registrada neste navegador.";
  }));

  mark(0);
  updateCompletion();
  const resume = scorm?.resumeLocation || 1;
  if (resume > 1 && resume <= slides.length) requestAnimationFrame(() => goTo(resume - 1, "auto"));
}());
