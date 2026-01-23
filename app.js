let timerStarted = false;
let totalSeconds = 50 * 60;
let timerInterval;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("typed").addEventListener("keydown", startTimer);
});

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      return;
    }
    totalSeconds--;
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    document.getElementById("timer").textContent = `${min}:${sec}`;
  }, 1000);
}

/* ---------- NORMALIZATION (PDF LOGIC) ---------- */
function normalize(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\.\s+/g, ".") // ignore space after full stop
    .trim();
}

/* ---------- MAIN CHECKER ---------- */
function checkErrors() {
  clearInterval(timerInterval);

  const master = normalize(document.getElementById("master").value);
  const typed = normalize(document.getElementById("typed").value);

  const mWords = master.split(" ");
  const tWords = typed.split(" ");

  let fullMistakes = 0;
  let halfMistakes = 0;
  let output = "";

  const maxLen = Math.max(mWords.length, tWords.length);

  for (let i = 0; i < maxLen; i++) {
    const mw = mWords[i] || "";
    const tw = tWords[i] || "";

    if (mw === tw) {
      output += `<span class="correct">${mw}</span> `;
    } 
    else if (
      mw.toLowerCase() === tw.toLowerCase() ||
      mw.replace(/[.,]/g,"") === tw.replace(/[.,]/g,"")
    ) {
      halfMistakes++;
      output += `<span class="half">${tw} (${mw})</span> `;
    } 
    else {
      fullMistakes++;
      output += `<span class="wrong">${tw || "_"} (${mw})</span> `;
    }
  }

  const totalMistakes = fullMistakes + Math.floor(halfMistakes / 2);

  document.getElementById("result").innerHTML = `
    Full Mistakes: ${fullMistakes}<br>
    Half Mistakes: ${halfMistakes}<br>
    <strong>Total Mistakes: ${totalMistakes}</strong>
  `;

  document.getElementById("analysis").innerHTML = output;
}
