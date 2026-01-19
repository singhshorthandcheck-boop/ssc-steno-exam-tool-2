function words(t){
  return t.trim().split(/\s+/);
}

function showMaster(){
  document.getElementById('masterBox').style.display = 'block';
}

function check(){
  const master = words(document.getElementById('master').value);
  const typed  = words(document.getElementById('typed').value);

  let i = 0, j = 0, out = "";

  while(i < master.length || j < typed.length){

    if(master[i] === typed[j]){
      out += `<span class="correct">${typed[j]}</span> `;
      i++; j++;
    }
    else if(typed[j] && master[i] === typed[j+1]){
      out += `<span class="extra">${typed[j]}</span> `;
      j++;
    }
    else if(master[i] && master[i+1] === typed[j]){
      out += `<span class="miss">(${master[i]})</span> `;
      i++;
    }
    else if(typed[j] && master[i]){
      out += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      i++; j++;
    }
    else{
      if(typed[j]){
        out += `<span class="extra">${typed[j]}</span> `;
        j++;
      } else {
        out += `<span class="miss">(${master[i]})</span> `;
        i++;
      }
    }
  }

  document.getElementById('result').innerHTML = out;
}

