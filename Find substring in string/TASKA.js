function make_dfa(substring)
    {
        let alphabet = new Set(subStr.split(""));
        let table = [];
        let substring = "";
        for (let i = 0; i <= subStr.length; i++)
        {
            const row = {};
            symloop: for (let sym of alphabet)
            {
                let sub = substring + sym;
                const L = sub.length;
                for (let k = 0; k < L; k++)
                {
                    if (sub === subStr.slice(0, sub.length))
                    {
                        row[sym] = sub.length;
                        continue symloop;
                    }
                    sub = sub.slice(1);
                }
                row[sym] = 0;
            }
            substring += subStr[i];
            table.push(row);
        }
        return table;
    }

    function find_all_matches(text, pattern, table) 
    {
        let matches = [];
        let state = 0; // начальное состояние автомата
        
        for (let i = 0; i < text.length; i++) 
        {
          const sym = text[i];
          state = table[state][sym] || 0;
          if (state === pattern.length) { // подстрока найдена
            matches.push(i - pattern.length + 1);
          }
        }
        return matches;
    }


const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
//inputText = "anananasasaananas"
let inputSubStr = "Андрей Болконский"

let dfa = make_dfa(inputSubStr, inputText);
console.log(dfa);
let state = 0;
const FINAL = dfa.length - 1;
let result = [];




let strt = performance.now();
const matches = find_all_matches(inputText, inputSubStr, dfa);
let nd = performance.now();
time = (nd - strt).toFixed(3);
console.log(time);
console.log(matches);

// console.time("kmp");
// const index = kmp(inputText, inputSubStr);
// console.timeEnd("kmp");
// console.log(index);