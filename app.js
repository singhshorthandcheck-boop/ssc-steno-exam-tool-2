let timerStarted = false;
let timeLeft = 50 * 60;
let timerInterval = null;

const typedTextArea = document.getElementById("typedText");
const timerDisplay = document.getElementById("timer");
const finishBtn = document.getElementById("finishBtn");
const masterSection = document.getElementById("masterSection");

typedTextArea.addEventListener("input", () => {
    if (!timerStarted && typedTextArea.value.length > 0) {
        startTimer();
        timerStarted = true;
    }
});

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            endTyping();
            alert("Time is up! 50 minutes completed.");
            return;
        }
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
}

finishBtn.addEventListener("click", endTyping);

function endTyping() {
    clearInterval(timerInterval);
    typedTextArea.disabled = true;
    finishBtn.disabled = true;
    masterSection.style.display = "block";
}

document.getElementById("checkBtn").addEventListener("click", evaluate);

function evaluate() {
    const master = document.getElementById("masterText").value.trim();
    const typed = typedTextArea.value.trim();

    if (!master || !typed) {
        alert("Please paste master passage!");
        return;
    }

    const masterWords = master.split(/\s+/);
    const typedWords = typed.split(/\s+/);

    let fullMistakes = 0;
    let halfMistakes = 0;
    let comparisonHTML = "";
    let i = 0;

    while (i < masterWords.length || i < typedWords.length) {
        const m = masterWords[i] || "";
        const t = typedWords[i] || "";

        if (!t) {
            comparisonHTML += `<span class='missing'>${m} (missing)</span> `;
            fullMistakes++;
        } else if (!m) {
            comparisonHTML += `<span class='extra'>${t} (extra)</span> `;
            fullMistakes++;
        } else if (m.toLowerCase() === t.toLowerCase()) {
            comparisonHTML += `<span class='correct'>${t}</span> `;
        } else if (isSpellingMistake(m, t)) {
            comparisonHTML += `<span class='half-mistake'>${t} (spelling)</span> `;
            halfMistakes++;
        } else {
            comparisonHTML += `<span class='full-mistake'>${t} (wrong)</span> `;
            fullMistakes++;
        }
        i++;
    }

    const errorPercent = ((fullMistakes + halfMistakes / 2) * 100 / masterWords.length).toFixed(2);

    document.getElementById("summaryBox").innerHTML = `
        <p><b>Total Words:</b> ${masterWords.length}</p>
        <p><b>Full Mistakes:</b> ${fullMistakes}</p>
        <p><b>Half Mistakes:</b> ${halfMistakes}</p>
        <p><b>Error Percentage:</b> ${errorPercent}%</p>
    `;

    document.getElementById("comparison").innerHTML = comparisonHTML;
}

function isSpellingMistake(a, b) {
    return levenshtein(a.toLowerCase(), b.toLowerCase()) <= 2;
}

function levenshtein(a, b) {
    const dp = [];
    for (let i = 0; i <= a.length; i++) {
        dp[i] = [i];
        for (let j = 1; j <= b.length; j++) {
            if (i === 0) dp[0][j] = j;
            else if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
}
