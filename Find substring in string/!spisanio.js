function makeDFA (str) 
{
    let alphabet = new Set(str.split(''));
    let table = [];
    let substring = "";
    for (let i = 0; i <= str.length; i++)
    {
        const row = {};
        symloop: for (let sym of alphabet)
        {
            let sub = substring + sym;
            const L = sub.length;
            for (let k = 0; k < L; k++)
            {
                if (sub === str.slice(0, sub.length))
                {
                    row[sym] = sub.length;
                    continue symloop;
                }
                sub = sub.slice(1);
            }
            row[sym] = 0;
        }
        substring += str[i];
        table.push(row);
    }
    return table;
}

function searchWithDFA(str, substring, dfa=[]) 
{
    let res = [];
    if (dfa.length === 0) 
    {
        dfa = makeDFA(substring);
    }
    if (str.length < substring.length) 
    {
        // Подстрока не найдена
        return [-1];
    }
    let state = 0;
    for (let i = 0; i < str.length; i++) 
    {
        const sym = str[i];
        if (dfa[state][sym]) 
        {
            state = dfa[state][sym];
            console.log("state first if " + state);
        } 
        else 
        {
            state = 0;
            console.log("state second if " + state);
        }
        if (state === substring.length) {
            // Найдено совпадение
            res.push(i - substring.length + 1);
        }
    }
    if (res.length > 0)
    {
        return res;
    }
    // Подстрока не найдена
    return [-1];
}

const str = "ahaasananas";
const substring = "ananas";
console.time("dfa");
const dfa = makeDFA(substring);
const index = searchWithDFA(str, substring, dfa);
console.timeEnd("dfa");
console.log(index); // 10

// const fs = require('fs');

// let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
// //inputText = "anananasasaananas"
// let inputSubStr = "Андрей Болконский"

// console.time("dfa");
// const dfa1 = make_dfa(inputSubStr);
// const index1 = search_substring(inputText, inputSubStr, dfa1);
// console.timeEnd("dfa");
// console.log(dfa1);
// console.log(index1); // 10