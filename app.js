function tokenize(text){
  return text.match(/\w+|[^\w\s]/g) || [];
}

function showMaster(){
  document.getElementById("masterBox").style.display = "block";
}

function sameIgnoreCase(a,b){
  return a.toLowerCase() === b.toLowerCase();
}

function sameIgnorePunc(a,b){
  return a.replace(/[^\w]/g,"") === b.replace(/[^\w]/g,"");
}

function check(){

  const masterText = document.getElementById("master").value.trim();
  const typedText  = document.getElementById("typed").value.trim();

  if(!masterText || !typedText){
    alert("Please type dictation and paste master passage");
    return;
  }

  const master = tokenize(masterText);
  const typed  = tokenize(typedText);

  let i = 0, j = 0, html = "";

  let addition = 0;
  let omission = 0;
  let spelling = 0;
  let capitalization = 0;
  let punctuation = 0;

  while(i < master.length || j < typed.length){

    if(master[i] === typed[j]){
      html += `<span class="correct">${typed[j]}</span> `;
      i++; j++;
    }

    else if(typed[j] && master[i] === typed[j+1]){
      html += `<span class="extra">${typed[j]}</span> `;
      addition++; j++;
    }

    else if(master[i] && master[i+1] === typed[j]){
      html += `<span class="miss">(${master[i]})</span> `;
      omission++; i++;
    }

    else if(master[i] && typed[j] && sameIgnoreCase(master[i], typed[j])){
      html += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      capitalization++; i++; j++;
    }

    else if(master[i] && typed[j] && sameIgnorePunc(master[i], typed[j])){
      html += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      punctuation++; i++; j++;
    }

    else if(master[i] && typed[j]){
      html += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      spelling++; i++; j++;
    }

    else if(typed[j]){
      html += `<span class="extra">${typed[j]}</span> `;
      addition++; j++;
    }

    else{
      html += `<span class="miss">(${master[i]})</span> `;
      omission++; i++;
    }
  }

  document.getElementById("result").innerHTML = `
    <h3>Result (StenoMitra Method)</h3>
    <table border="1" cellpadding="6">
      <tr><td>Addition</td><td>${addition}</td></tr>
      <tr><td>Omission</td><td>${omission}</td></tr>
      <tr><td>Spelling</td><td>${spelling}</td></tr>
      <tr><td>Capitalization</td><td>${capitalization}</td></tr>
      <tr><td>Punctuation</td><td>${punctuation}</td></tr>
    </table>
    <hr>
    <div>${html}</div>
  `;
}
