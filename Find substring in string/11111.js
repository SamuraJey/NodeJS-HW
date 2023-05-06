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
  
  function buildDFA(pattern) {
    const dfa = [];
    const m = pattern.length;
    const alphabet = Array.from(new Set(pattern)).sort();

    for (let i = 0; i <= m; i++) {
        dfa[i] = {};
        for (const char of alphabet) {
            dfa[i][char] = 0;
        }
    }

    for (let i = 0; i < m; i++) {
        const char = pattern[i];
        const nextState = i + 1;
        dfa[i][char] = nextState;
        const prefix = pattern.substring(0, i);
        for (const char of alphabet) {
            const suffix = prefix + char;
            let j = Math.min(i + 1, m);
            while (!suffix.endsWith(pattern.substring(0, j))) {
                j--;
            }
            dfa[i][char] = j;
        }
    }

    return [dfa, alphabet];
}

function searchSubstringDFA(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const [dfa, alphabet] = buildDFA(pattern);
    const res = [];

    let state = 0;
    let i = 0;

    while (i < n) {
        const char = text[i];

        if (alphabet.includes(char) && dfa[state][char] !== undefined) {
            state = dfa[state][char];
            if (state === m) {
                res.push(i - m + 1);
                continue;
                //state = dfa[state][char]; // продолжаем поиск без возврата к нулевому состоянию
            }
            i++;
        } else {
            state = dfa[state][pattern[0]] || 0;
            i++;
        }
    }

    return res;
}




  
const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский"

console.time("1")
let res = searchSubstringDFA(inputText, inputSubStr);
console.timeEnd("1")
console.log(res);
