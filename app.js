/**************** TIMER ****************/
let totalSeconds = 50 * 60;
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

typedEl.addEventListener("input", startTimer);

/**************** NORMALISATION ****************/
function normalize(text) {
  return text
    .replace(/\.\s+/g, ".")          // ignore space after full stop
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

/**************** LEVENSHTEIN ****************/
function levenshtein(a, b) {
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

/**************** HALF MISTAKE CHECK ****************/
function isHalfMistake(a, b) {
  if (a.toLowerCase() === b.toLowerCase()) return true; // case
  if (a.replace(/[^\w]/g, "") === b.replace(/[^\w]/g, "")) return true; // punctuation
  if (levenshtein(a.toLowerCase(), b.toLowerCase()) === 1) return true; // spelling
  return false;
}

/**************** CORE ANALYSIS ****************/
function analyseSteno(masterText, typedText) {
  const masterWords = normalize(masterText).split(" ");
  const typedWords = normalize(typedText).split(" ");

  let i = 0, j = 0;
  let fullMistakes = 0;
  let halfMistakes = 0;
  let additions = 0;
  let omissions = 0;

  let analysisHTML = "";

  while (i < masterWords.length && j < typedWords.length) {
    const m = masterWords[i];
    const t = typedWords[j];

    // PERFECT MATCH
    if (m === t) {
      analysisHTML += `<span style="color:green">${t} </span>`;
      i++; j++;
      continue;
    }

    // ADDITION
    if (typedWords[j + 1] === m) {
      additions++;
      fullMistakes++;
      analysisHTML += `<span style="color:red">${t} (extra) </span>`;
      j++;
      continue;
    }

    // OMISSION
    if (masterWords[i + 1] === t) {
      omissions++;
      fullMistakes++;
      analysisHTML += `<span style="color:red">∅ (${m}) </span>`;
      i++;
      continue;
    }

    // HALF MISTAKE
    if (isHalfMistake(m, t)) {
      halfMistakes++;
      analysisHTML += `<span style="color:orange">${t} (${m}) </span>`;
      i++; j++;
      continue;
    }

    // FULL SUBSTITUTION
    fullMistakes++;
    analysisHTML += `<span style="color:red">${t} (${m}) </span>`;
    i++; j++;
  }

  // REMAINING WORDS
  while (i < masterWords.length) {
    omissions++;
    fullMistakes++;
    analysisHTML += `<span style="color:red">∅ (${masterWords[i]}) </span>`;
    i++;
  }

  while (j < typedWords.length) {
    additions++;
    fullMistakes++;
    analysisHTML += `<span style="color:red">${typedWords[j]} (extra) </span>`;
    j++;
  }

  return {
    fullMistakes,
    halfMistakes,
    additions,
    omissions,
    totalMistakes: fullMistakes + halfMistakes * 0.5,
    analysisHTML
  };
}

/**************** BUTTON ACTION ****************/
function checkErrors() {
  clearInterval(timerInterval);

  // show master only now
  document.getElementById("masterPanel").classList.remove("hidden");

  const master = document.getElementById("master").value;
  const typed = document.getElementById("typed").value;

  const result = analyseSteno(master, typed);

  document.getElementById("result").innerHTML = `
    <h3>Result</h3>
    <p>Full Mistakes: <b>${result.fullMistakes}</b></p>
    <p>Half Mistakes: <b>${result.halfMistakes}</b></p>
    <p>Additions: <b>${result.additions}</b></p>
    <p>Omissions: <b>${result.omissions}</b></p>
    <p>Total Mistakes: <b>${result.totalMistakes}</b></p>
  `;

  document.getElementById("analysis").innerHTML = result.analysisHTML;
}
