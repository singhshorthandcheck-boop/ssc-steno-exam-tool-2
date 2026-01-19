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

function clean(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function analyse() {
  const master = clean(document.getElementById("master").value);
  const typed  = clean(document.getElementById("typed").value);

  let i = 0, j = 0;
  let full = 0, half = 0;
  let view = "";

  while (i < master.length || j < typed.length) {

    if (master[i] === typed[j]) {
      view += `<span class="ok">${typed[j]}</span> `;
      i++; j++;
    }

    // ADDITION
    else if (typed[j] && master[i] === typed[j + 1]) {
      view += `<span class="add">${typed[j]}</span> `;
      full++; j++;
    }

    // OMISSION
    else if (master[i] && master[i + 1] === typed[j]) {
      view += `<span class="miss">(${master[i]})</span> `;
      full++; i++;
    }

    // SPELLING / MINOR ERROR
    else if (master[i] && typed[j]) {
      view += `<span class="half">${typed[j]}(${master[i]})</span> `;
      half++; i++; j++;
    }

    else {
      if (typed[j]) { full++; j++; }
      else { full++; i++; }
    }
  }

  const total = full + half / 2;

  document.getElementById("result").innerHTML = `
    <h3>Result</h3>
    <p>Full Mistakes: ${full}</p>
    <p>Half Mistakes: ${half}</p>
    <p><b>Total Mistakes:</b> ${total}</p>
    <hr>${view}
  `;
}
