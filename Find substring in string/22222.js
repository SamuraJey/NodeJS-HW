function buildDFA(pattern) {
    const dfa = [];
    const m = pattern.length;
    const alphabet = Array.from(new Set(pattern)).sort();
  
    let state = 0;
  
    for (let i = 0; i < m; i++) {
      const char = pattern[i];
      const charIndex = alphabet.indexOf(char);
  
      if (!dfa[state]) {
        dfa[state] = new Array(alphabet.length).fill(0);
      }
  
      dfa[state][charIndex] = i + 1;
  
      if (charIndex !== -1) {
        state = dfa[state][charIndex];
      } else {
        state = 0;
      }
    }
  
    return [dfa, alphabet];
  }
  
  function searchSubstringDFA(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    if (m === "" || n === "" || m > n) return [-1];
    const [dfa, alphabet] = buildDFA(pattern);
    const res = [];
  
    let state = 0;
  
    for (let i = 0; i < n; i++) {
      const char = text[i];
      const charIndex = alphabet.indexOf(char);
  
      if (charIndex !== -1) 
      {
        state = dfa[state][charIndex];
      } else 
      {
        state = 0;
      }
  
      if (state === m) {
        res.push(i - m + 1);
        state = 0;
      }
    }
  
    return res;
  }
  
const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "banana"

console.time("1")
let res = searchSubstringDFA(inputText, inputSubStr);
console.timeEnd("1")
console.log(res);
