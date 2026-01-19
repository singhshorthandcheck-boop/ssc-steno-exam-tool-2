function words(t){
  return t.trim().split(/\s+/);
}

function showMaster(){
  document.getElementById('masterBox').style.display = 'block';
}

function check(){
  const master = words(document.getElementById('master').value);
  const typed  = words(document.getElementById('typed').value);

  let i = 0, j = 0;
  let out = "";

  let fullMistake = 0;
  let halfMistake = 0;

  while(i < master.length || j < typed.length){

    if(master[i] === typed[j]){
      out += `<span class="correct">${typed[j]}</span> `;
      i++; j++;
    }

    // EXTRA WORD → FULL MISTAKE
    else if(typed[j] && master[i] === typed[j+1]){
      out += `<span class="extra">${typed[j]}</span> `;
      fullMistake++;
      j++;
    }

    // MISSING WORD → FULL MISTAKE
    else if(master[i] && master[i+1] === typed[j]){
      out += `<span class="miss">(${master[i]})</span> `;
      fullMistake++;
      i++;
    }

    // WRONG WORD → HALF MISTAKE
    else if(typed[j] && master[i]){
      out += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      halfMistake++;
      i++; j++;
    }

    else{
      if(typed[j]){
        out += `<span class="extra">${typed[j]}</span> `;
        fullMistake++;
        j++;
      } else {
        out += `<span class="miss">(${master[i]})</span> `;
        fullMistake++;
        i++;
      }
    }
  }

  const totalMistake = fullMistake + (halfMistake / 2);

  document.getElementById('result').innerHTML =
    `<h3>Result</h3>
     <p><b>Full Mistakes:</b> ${fullMistake}</p>
     <p><b>Half Mistakes:</b> ${halfMistake}</p>
     <p><b>Total Mistakes:</b> ${totalMistake}</p>
     <hr>${out}`;
}

