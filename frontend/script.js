const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://YOUR-RENDER-SERVICE.onrender.com";

const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const messages = document.getElementById("messages");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");

function addMessage(role, html, extraClass) {
  const el = document.createElement("article");
  el.className = `msg ${role}${extraClass ? " " + extraClass : ""}`;
  el.innerHTML = html;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;
  const question = input.value.trim();
  if (!question) {
    formError.textContent = "Please enter a question.";
    formError.hidden = false;
    return;
  }

  addMessage("user", escapeHtml(question));
  input.value = "";
  submitBtn.disabled = true;
  const loading = addMessage(
    "assistant",
    "Retrieving sources and writing an answer… First request after idle may take 30–60 seconds.",
    "loading"
  );

  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json().catch(() => ({}));
    loading.remove();

    if (!response.ok) {
      const detail = data.detail || "The assistant could not answer right now.";
      addMessage("assistant", escapeHtml(String(detail)), "error");
      return;
    }

    const sources = Array.isArray(data.sources) ? data.sources : [];
    const sourceHtml =
      sources.length > 0
        ? `<div class="sources"><h3>Sources</h3><ul>${sources
            .map((src) => `<li>${escapeHtml(src)}</li>`)
            .join("")}</ul></div>`
        : `<div class="sources"><h3>Sources</h3><p>No matching excerpts were used.</p></div>`;

    addMessage("assistant", `${escapeHtml(data.answer || "")}${sourceHtml}`);
  } catch (error) {
    loading.remove();
    addMessage(
      "assistant",
      "Could not reach the API. Check that the backend is running and that the API URL in script.js is correct.",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    input.focus();
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
// --- Timeline: renders cards from TIMELINE (timeline-data.js) and reuses
// the existing question form + /ask flow. No new endpoint — clicking a
// card pre-fills and submits the same form above for the full, cited answer.
function renderTimeline() {
  const track = document.getElementById("timeline-track");
  if (!track || typeof TIMELINE === "undefined") return;

  TIMELINE.forEach((event, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "timeline-card";
    card.innerHTML = `
      <span class="step">${index + 1} · ${escapeHtml(event.period)}</span>
      <div class="title">${escapeHtml(event.title)}</div>
      <p class="blurb">${escapeHtml(event.summary)}</p>
    `;
    card.addEventListener("click", () => {
      input.value = event.question;
      document.querySelector(".chat-panel").scrollIntoView({ behavior: "smooth", block: "start" });
      form.requestSubmit();
    });
    track.appendChild(card);
  });
}

renderTimeline();
// --- Quiz: simple state machine over QUIZ (quiz-data.js). No backend
// calls — purely local, since correctness is fixed and pre-verified
// against the source files, unlike the open-ended /ask flow above.
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function renderQuiz() {
  const body = document.getElementById("quiz-body");
  if (!body || typeof QUIZ === "undefined") return;

  if (quizIndex >= QUIZ.length) {
    body.innerHTML = `
      <div class="quiz-card">
        <p class="quiz-score">You scored ${quizScore} / ${QUIZ.length}</p>
        <button type="button" class="quiz-option quiz-next" id="quiz-restart">Try again</button>
      </div>
    `;
    document.getElementById("quiz-restart").addEventListener("click", () => {
      quizIndex = 0;
      quizScore = 0;
      quizAnswered = false;
      renderQuiz();
    });
    return;
  }

  const q = QUIZ[quizIndex];
  quizAnswered = false;

  const optionsHtml = q.options
    .map((opt, i) => `<button type="button" class="quiz-option" data-index="${i}">${escapeHtml(opt)}</button>`)
    .join("");

  body.innerHTML = `
    <div class="quiz-card">
      <p class="quiz-progress">Question ${quizIndex + 1} of ${QUIZ.length}</p>
      <p class="quiz-prompt">${escapeHtml(q.prompt)}</p>
      <div class="quiz-options">${optionsHtml}</div>
      <div id="quiz-feedback"></div>
    </div>
  `;

  body.querySelectorAll(".quiz-option[data-index]").forEach((btn) => {
    btn.addEventListener("click", () => handleQuizAnswer(Number(btn.dataset.index)));
  });
}

function handleQuizAnswer(chosenIndex) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = QUIZ[quizIndex];
  const buttons = document.querySelectorAll(".quiz-option[data-index]");
  buttons.forEach((btn) => {
    btn.disabled = true;
    const i = Number(btn.dataset.index);
    if (i === q.correctIndex) btn.classList.add("correct");
    else if (i === chosenIndex) btn.classList.add("incorrect");
  });

  if (chosenIndex === q.correctIndex) quizScore += 1;

  const feedback = document.getElementById("quiz-feedback");
  feedback.innerHTML = `
    <div class="quiz-explanation">
      ${escapeHtml(q.explanation)}
      <span class="source-label">Source: ${escapeHtml(q.source)}</span>
    </div>
    <button type="button" class="quiz-option quiz-next" id="quiz-next-btn">
      ${quizIndex + 1 < QUIZ.length ? "Next question" : "See score"}
    </button>
  `;
  document.getElementById("quiz-next-btn").addEventListener("click", () => {
    quizIndex += 1;
    renderQuiz();
  });
}

renderQuiz();

// --- Scroll reveal: watch every .reveal element, add .in-view once it
// enters the viewport. Pure CSS transition handles the actual animation.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// --- Nav shadow once the page is scrolled ---
const siteNav = document.querySelector(".site-nav");
if (siteNav) {
  window.addEventListener("scroll", () => {
    siteNav.classList.toggle("scrolled", window.scrollY > 8);
  });
}