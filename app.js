const typedText = document.getElementById("typedText");
const masterText = document.getElementById("masterText");
const submitBtn = document.getElementById("submitBtn");
const checkBtn = document.getElementById("checkBtn");
const masterSection = document.getElementById("masterSection");
const resultDiv = document.getElementById("result");
const comparisonDiv = document.getElementById("comparison");
const timerDiv = document.getElementById("timer");

let timerStarted = false;
let timeLeft = 50 * 60;
let timerInterval;

/* ---------------- TIMER ---------------- */

typedText.addEventListener("input", () => {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }
});

function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    return;
  }
  timeLeft--;
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerDiv.textContent =
    String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

/* ----------- SHOW MASTER AFTER SUBMIT ----------- */

submitBtn.onclick = () => {
  masterSection.classList.remove("hidden");
  submitBtn.disabled = true;
};

/* -------------- TEXT NORMALIZATION -------------- */

function normalize(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/([.?!])\s+/g, "$1") // ignore space after punctuation
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter(Boolean);
}

/* ----------- WORD COMPARISON HELPERS ----------- */

function isExact(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function isNear(a, b) {
  if (!a || !b) return false;
  const diff = Math.abs(a.length - b.length);
  if (diff > 2) return false;

  let mismatch = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i].toLowerCase() !== b[i].toLowerCase()) mismatch++;
  }
  return mismatch <= 2;
}

/* ---------------- MAIN CHECK ---------------- */

checkBtn.onclick = () => {
  clearInterval(timerInterval);

  const typedWords = tokenize(typedText.value);
  const masterWords = tokenize(masterText.value);

  let i = 0, j = 0;
  let full = 0, half = 0;
  let output = [];

  while (i < typedWords.length && j < masterWords.length) {
    const t = typedWords[i];
    const m = masterWords[j];

    if (isExact(t, m)) {
      output.push(`<span class="correct">${t}</span>`);
      i++; j++;
    }
    else if (isNear(t, m)) {
      half++;
      output.push(`<span class="half">${t} (${m})</span>`);
      i++; j++;
    }
    else if (typedWords[i + 1] && isExact(typedWords[i + 1], m)) {
      full++;
      output.push(`<span class="full">${t}</span>`);
      i++;
    }
    else if (masterWords[j + 1] && isExact(t, masterWords[j + 1])) {
      full++;
      output.push(`<span class="full">[missing ${m}]</span>`);
      j++;
    }
    else {
      full++;
      output.push(`<span class="full">${t} (${m})</span>`);
      i++; j++;
    }
  }

  // remaining words
  full += (typedWords.length - i) + (masterWords.length - j);

  resultDiv.innerHTML = `
    Full Mistakes: ${full}<br>
    Half Mistakes: ${half}<br>
    <b>Total Mistakes: ${full + half}</b>
  `;

  comparisonDiv.innerHTML = output.join(" ");
};
