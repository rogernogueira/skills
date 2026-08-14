(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = document.querySelector(".dot-nav");
  const announcer = document.querySelector("[data-announcer]");

  function goTo(index) {
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
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
    if (dots) {
      dots.querySelectorAll("button").forEach((button, key) => {
        button.classList.toggle("active", key === index);
        button.setAttribute("aria-current", key === index ? "true" : "false");
      });
    }
    if (announcer && slides[index]) {
      const heading = slides[index].querySelector("h1,h2");
      announcer.textContent = `Slide ${index + 1} de ${slides.length}${heading ? `: ${heading.textContent.trim()}` : ""}`;
    }
  }

  if ("IntersectionObserver" in window) {
    const slideObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) mark(slides.indexOf(entry.target));
      });
    }, { threshold: 0.6 });
    slides.forEach(slide => slideObserver.observe(slide));

    const animationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
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
    return Boolean(element && element.closest("a,button,input,textarea,select,[contenteditable]"));
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

  document.querySelectorAll("[data-quiz]").forEach(quiz => {
    const feedback = quiz.querySelector("[data-feedback]");
    quiz.querySelectorAll("[data-answer]").forEach(option => {
      option.addEventListener("click", () => {
        const correct = option.hasAttribute("data-correct");
        quiz.querySelectorAll("[data-answer]").forEach(answer => answer.classList.remove("correct", "incorrect"));
        option.classList.add(correct ? "correct" : "incorrect");
        if (feedback) feedback.textContent = correct ? option.dataset.correctFeedback : option.dataset.incorrectFeedback;
      });
    });
  });

  const storageKey = document.body.dataset.storageKey || `lesson:${location.pathname}`;
  const fields = Array.from(document.querySelectorAll("[data-save]"));
  const savedNotice = document.querySelector("[data-saved-notice]");
  let noticeTimer;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    fields.forEach(field => {
      if (!(field.id in saved)) return;
      if (field.type === "checkbox" || field.type === "radio") field.checked = Boolean(saved[field.id]);
      else field.value = saved[field.id];
    });
  } catch (error) {}

  function saveFields() {
    const values = {};
    fields.forEach(field => {
      values[field.id] = field.type === "checkbox" || field.type === "radio" ? field.checked : field.value;
    });
    localStorage.setItem(storageKey, JSON.stringify(values));
    if (savedNotice) {
      savedNotice.classList.add("visible");
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => savedNotice.classList.remove("visible"), 1200);
    }
  }

  fields.forEach(field => field.addEventListener("input", saveFields));
  document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-reset]").forEach(button => button.addEventListener("click", () => {
    if (!confirm("Limpar as respostas salvas desta lição?")) return;
    fields.forEach(field => {
      if (field.type === "checkbox" || field.type === "radio") field.checked = false;
      else field.value = "";
    });
    localStorage.removeItem(storageKey);
  }));

  mark(0);
}());
