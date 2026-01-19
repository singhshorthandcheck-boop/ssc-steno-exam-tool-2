function tokenize(text){
  return text.match(/\w+|[^\w\s]/g) || [];
}

function showMaster(){
  document.getElementById("masterBox").style.display = "block";
}

function isSameIgnoringCase(a,b){
  return a.toLowerCase() === b.toLowerCase();
}

function isSameIgnoringPunctuation(a,b){
  return a.replace(/[^\w]/g,"") === b.replace(/[^\w]/g,"");
}

function check(){

  const master = tokenize(document.getElementById("master").value);
  const typed  = tokenize(document.getElementById("typed").value);

  let i = 0, j = 0, out = "";

  let addition = 0,
      omission = 0,
      spelling = 0,
      capitalization = 0,
      punctuation = 0;

  while(i < master.length || j < typed.length){

    if(master[i] === typed[j]){
      out += `<span class="correct">${typed[j]}</span> `;
      i++; j++;
    }

    // ADDITION
    else if(typed[j] && master[i] === typed[j+1]){
      out += `<span class="extra">${typed[j]}</span> `;
      addition++;
      j++;
    }

    // OMISSION
    else if(master[i] && master[i+1] === typed[j]){
      out += `<span class="miss">(${master[i]})</span> `;
      omission++;
      i++;
    }

    // CAPITALIZATION
    else if(isSameIgnoringCase(master[i], typed[j])){
      out += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      capitalization++;
      i++; j++;
    }

    // PUNCTUATION
    else if(isSameIgnoringPunctuation(master[i], typed[j])){
      out += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      punctuation++;
      i++; j++;
    }

    // SPELLING
    else{
      out += `<span class="sub">${typed[j]} (${master[i]})</span> `;
      spelling++;
      i++; j++;
    }
  }

  document.getElementById("result").innerHTML = `
    <h3>Result (StenoMitra Logic)</h3>
    <p>Addition: ${addition}</p>
    <p>Omission: ${omission}</p>
    <p>Spelling: ${spelling}</p>
    <p>Capitalization: ${capitalization}</p>
    <p>Punctuation: ${punctuation}</p>
    <hr>${out}
  `;
}
