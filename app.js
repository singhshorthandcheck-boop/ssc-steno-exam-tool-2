let started = false;
let timeLeft = 50 * 60;

document.getElementById("typed").addEventListener("keydown", () => {
  if (!started) {
    started = true;
    setInterval(timer, 1000);
  }
});

function timer() {
  if (timeLeft <= 0) return;
  timeLeft--;
  let m = Math.floor(timeLeft / 60);
  let s = timeLeft % 60;
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

// simple spelling similarity
function similar(a, b) {
  if (!a || !b) return false;
  let diff = Math.abs(a.length - b.length);
  let same = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) same++;
  }
  return same >= Math.min(a.length, b.length) - 2 && diff <= 2;
}

function analyse() {
  const master = normalize(document.getElementById("master").value);
  const typed  = normalize(document.getElementById("typed").value);

  let i = 0, j = 0;
  let full = 0, half = 0;
  let view = "";

  while (i < master.length) {

    if (typed[j] === master[i]) {
      view += `<span class="ok">${typed[j]}</span> `;
      i++; j++;
    }

    // ADDITION
    else if (typed[j+1] === master[i]) {
      view += `<span class="add">${typed[j]}</span> `;
      full++;
      j++;
    }

    // OMISSION
    else if (master[i+1] === typed[j]) {
      view += `<span class="miss">(${master[i]})</span> `;
      full++;
      i++;
    }

    // SPELLING / MINOR
    else if (similar(typed[j], master[i])) {
      view += `<span class="half">${typed[j]} (${master[i]})</span> `;
      half++;
      i++; j++;
    }

    // WRONG WORD
    else {
      view += `<span class="add">${typed[j] || "—"} (${master[i]})</span> `;
      full++;
      i++; j++;
    }
  }

  const total = full + half / 2;

  document.getElementById("result").innerHTML = `
    <h3>Result (PDF Method)</h3>
    <p>Total Words: ${master.length}</p>
    <p>Full Mistakes: ${full}</p>
    <p>Half Mistakes: ${half}</p>
    <p><b>Total Mistakes:</b> ${total}</p>
    <hr>${view}
  `;
}
