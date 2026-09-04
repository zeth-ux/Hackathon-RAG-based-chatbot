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