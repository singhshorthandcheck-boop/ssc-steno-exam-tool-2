let started = false;
let timeLeft = 50 * 60;
let timerId = null;

document.getElementById("typed").addEventListener("keydown", () => {
  if (!started) {
    started = true;
    timerId = setInterval(runTimer, 1000);
  }
});

function runTimer() {
  if (timeLeft <= 0) {
    clearInterval(timerId);
    return;
  }
  timeLeft--;
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  document.getElementById("timer").innerText =
    `Time Left: ${m}:${s.toString().padStart(2, "0")}`;
}

function finish() {
  document.getElementById("masterBox").style.display = "block";
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// Levenshtein Distance
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function analyse() {
  const master = normalize(document.getElementById("master").value);
  const typed  = normalize(document.getElementById("typed").value);

  let i = 0, j = 0;
  let full = 0, half = 0;
  let view = "";

  while (i < master.length) {

    // TYPED TEXT FINISHED → ALL OMISSIONS
    if (j >= typed.length) {
      view += `<span class="miss">(${master[i]})</span> `;
      full++;
      i++;
      continue;
    }

    if (typed[j] === master[i]) {
      view += `<span class="ok">${typed[j]}</span> `;
      i++; j++;
      continue;
    }

    // ADDITION
    if (j + 1 < typed.length && typed[j + 1] === master[i]) {
      view += `<span class="add">${typed[j]}</span> `;
      full++;
      j++;
      continue;
    }

    // OMISSION
    if (i + 1 < master.length && master[i + 1] === typed[j]) {
      view += `<span class="miss">(${master[i]})</span> `;
      full++;
      i++;
      continue;
    }

    // SPELLING → HALF
    if (
      typed[j][0] === master[i][0] &&
      distance(typed[j], master[i]) <= 2
    ) {
      view += `<span class="half">${typed[j]} (${master[i]})</span> `;
      half++;
      i++; j++;
      continue;
    }

    // WRONG WORD → FULL
    view += `<span class="add">${typed[j]} (${master[i]})</span> `;
    full++;
    i++; j++;
  }

  const total = full + half / 2;

  document.getElementById("result").innerHTML = `
    <h3>Result (PDF-Accurate)</h3>
    <p>Total Words: ${master.length}</p>
    <p>Full Mistakes: ${full}</p>
    <p>Half Mistakes: ${half}</p>
    <p><b>Total Mistakes:</b> ${total}</p>
    <hr>${view}
  `;
}
