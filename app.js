let timeLeft = 50 * 60;
let timerStarted = false;
let timer;

// ---------- TIMER ----------
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timer = setInterval(() => {
    timeLeft--;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    document.getElementById("timer").innerText =
      `${m}:${s.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishTyping();
    }
  }, 1000);
}

document.getElementById("typed").addEventListener("keydown", startTimer);

// ---------- FINISH TYPING ----------
function finishTyping() {
  clearInterval(timer);
  document.getElementById("masterSection").style.display = "block";
}

// ---------- CLEAN TEXT (IMPORTANT FIX HERE) ----------
function clean(text) {
  return text
    .toLowerCase()
    // remove punctuation including full stop
    .replace(/[.,!?;:]/g, "")
    // normalize spaces (prevents space-after-full-stop error)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
}

// ---------- HELPERS ----------
function isNumber(word) {
  return /^\d+$/.test(word);
}

function isSpellingError(a, b) {
  if (!a || !b) return false;
  if (a[0] !== b[0]) return false;
  return Math.abs(a.length - b.length) <= 2;
}

// ---------- ANALYSIS ----------
function analyse() {
  const typed = clean(document.getElementById("typed").value);
  const master = clean(document.getElementById("master").value);

  let i = 0, j = 0;
  let full = 0, half = 0;
  let html = "";

  while (i < master.length || j < typed.length) {

    // Extra word
    if (i >= master.length) {
      html += `<span class="add">${typed[j]}</span> `;
      full++; j++;
      continue;
    }

    // Missing word
    if (j >= typed.length) {
      html += `<span class="miss">(${master[i]})</span> `;
      full++; i++;
      continue;
    }

    // Correct word
    if (typed[j] === master[i]) {
      html += `<span class="ok">${typed[j]}</span> `;
      i++; j++;
      continue;
    }

    // Number mismatch → full mistake
    if (isNumber(typed[j]) || isNumber(master[i])) {
      html += `<span class="full">${typed[j]} (${master[i]})</span> `;
      full++; i++; j++;
      continue;
    }

    // Spelling error → half mistake
    if (isSpellingError(typed[j], master[i])) {
      html += `<span class="half">${typed[j]} (${master[i]})</span> `;
      half++; i++; j++;
      continue;
    }

    // Wrong word → full mistake
    html += `<span class="full">${typed[j]} (${master[i]})</span> `;
    full++; i++; j++;
  }

  document.getElementById("result").innerHTML = `
    <h3>Result</h3>
    <p>Full Mistakes: ${full}</p>
    <p>Half Mistakes: ${half}</p>
    <p><b>Total Mistakes:</b> ${full + half / 2}</p>
    <hr>
    ${html}
  `;
}
