function buildDFA(pattern)
{
    const dfa = [];
    const m = pattern.length;
    const alphabet = Array.from(new Set(pattern)).sort();

    for (let i = 0; i < m; i++)
    {
        const char = pattern[i];
        const state = new Array(alphabet.length).fill(0);
        const charIndex = alphabet.indexOf(char);
        state[charIndex] = i + 1;
        dfa.push(state);
    }
    console.log(dfa);
    return [dfa, alphabet];
}

function searchSubstringDFA(text, pattern)
{
    const n = text.length;
    const m = pattern.length;
    const [dfa, alphabet] = buildDFA(pattern);
    const res = [];

    let state = 0;
    let i = 0;

    while (i < n)
    {
        const char = text[i];
        const charIndex = alphabet.indexOf(char);

        if (charIndex !== -1)
        {
            state = dfa[state][charIndex];
            if (state === m)
            {
                res.push(i - m + 1);
                state = 0;
            }
            i++;
        }
        else
        {
            state = 0;
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
