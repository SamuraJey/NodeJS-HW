function buildDFA(pattern) {
  const dfa = [];
  const m = pattern.length;
  const alphabet = Array.from(new Set(pattern)).sort();

  for (let i = 0; i < m; i++) {
    const char = pattern[i];
    const state = {};

    alphabet.forEach((symbol) => {
      if (symbol === char) {
        state[symbol] = i + 1;
      } else {
        state[symbol] = 0;
      }
    });

    dfa.push(state);
  }
  return dfa;
}

function searchSubstringDFA(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const dfa = buildDFA(pattern);
  const res = [];

  let state = 0;
  for (let i = 0; i < n; i++) {
    const char = text[i];
    if (dfa[state]) {
      if (char in dfa[state]) {
        state = dfa[state][char];
        if (state === m) {
          res.push(i - m + 1);
        }
      } else {
        state = 0;
      }
    } else {
      state = 0;
    }
  }

  return res;
}




// // Пример использования:
// const text = 'anananasbananabananabananas';
// const pattern = 'anana';
// const occurrences = searchSubstringDFA(text, pattern);
// console.log(occurrences);


const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский"


console.time("1")
let res = searchSubstringDFA(inputText, inputSubStr);
console.timeEnd("1")
console.log(res); 