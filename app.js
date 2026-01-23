// ================= TIMER LOGIC =================
let totalSeconds = 50 * 60; // 50 minutes
let timerStarted = false;
let timerInterval = null;

const timerEl = document.getElementById("timer");
const typedEl = document.getElementById("typed");

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "TIME UP";
      typedEl.disabled = true;
      return;
    }

    totalSeconds--;
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const sec = String(totalSeconds % 60).padStart(2, "0");
    timerEl.textContent = `${min}:${sec}`;
  }, 1000);
}

// Start timer when user types first character
typedEl.addEventListener("input", startTimer);

// ================= NORMALIZATION =================
function normalizeText(text) {
  return text
    .replace(/\.\s+/g, ".")     // IGNORE space after full stop
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// ================= ERROR CHECKING =================
function checkErrors() {
  // SHOW MASTER ONLY NOW (IMPORTANT FIX)
  document.getElementById("masterPanel").classList.remove("hidden");

  clearInterval(timerInterval);

  const typed = normalizeText(document.getElementById("typed").value);
  const master = normalizeText(document.getElementById("master").value);

  const typedWords = typed.split(" ");
  const masterWords = master.split(" ");

  let fullMistakes = 0;
  let halfMistakes = 0;

  let analysisHTML = "";

  const maxLen = Math.max(typedWords.length, masterWords.length);

  for (let i = 0; i < maxLen; i++) {
    const t = typedWords[i] || "";
    const m = masterWords[i] || "";

    if (t === m) {
      analysisHTML += `<span style="color:green">${t} </span>`;
    } 
    else if (t && m && t[0] === m[0]) {
      halfMistakes++;
      analysisHTML += `<span style="color:orange">${t} (${m}) </span>`;
    } 
    else {
      fullMistakes++;
      analysisHTML += `<span style="color:red">${t || "∅"} (${m || "∅"}) </span>`;
    }
  }

  const totalMistakes = fullMistakes + halfMistakes * 0.5;

  document.getElementById("result").innerHTML = `
    <h3>Result</h3>
    <p>Full Mistakes: <b>${fullMistakes}</b></p>
    <p>Half Mistakes: <b>${halfMistakes}</b></p>
    <p>Total Mistakes: <b>${totalMistakes}</b></p>
  `;

  document.getElementById("analysis").innerHTML = analysisHTML;
}
