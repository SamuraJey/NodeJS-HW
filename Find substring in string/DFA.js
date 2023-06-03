function makeDFA(str) // Deterministic Finite Automaton
{
    let alphabet = new Set(str.split('')); // множество символов в строке
    let table = []; // таблица смещений
    let substring = ""; 
    for (let i = 0; i <= str.length; i++) // пока не конец строки
    {
        const row = {}; // строка таблицы смещений
        symloop: for (let sym of alphabet) // для каждого символа в строке
        {
            let sub = substring + sym; // подстрока = подстрока + символ
            const L = sub.length; // длина подстроки
            for (let k = 0; k < L; k++) // пока не конец подстроки
            {
                if (sub === str.slice(0, sub.length)) // если подстрока совпала с началом строки2
                {
                    row[sym] = sub.length; // заполняем таблицу смещений
                    continue symloop; // переходим к следующему символу
                }
                sub = sub.slice(1); // иначе удаляем первый символ подстроки
            }
            row[sym] = 0;
        }
        substring += str[i]; // подстрока = подстрока + символ
        table.push(row); // добавляем строку в таблицу смещений
    }
    return table;
}

function searchWithDFA(str, substring, dfa = [])
{
    const res = []; // массив с индексами вхождений подстроки
    const strLength = str.length;
    const subLength = substring.length;

    if (dfa.length === 0)
    {
        dfa = makeDFA(substring);
    }

    if (strLength < subLength)
    {
        return [-1];
    }

    let state = 0; // начальное состояние
    let i = 0;

    while (i < strLength)
    {
        const sym = str[i]; // символ строки
        state = dfa[state][sym] || 0; // переходим в следующее состояние, если не null or undefined
        if (state === subLength) // если состояние равно длине подстроки
        {
            // Найдено совпадение
            res.push(i - subLength + 1);
        }
        i++;
    }
    return res.length > 0 ? res : [-1]; // если есть совпадения, то возвращаем массив с индексами, иначе -1
}




const fs = require('fs');
let inputText = "";
let inputSubStr = "";
//linux inputText = fs.readFileSync("C:/Users/samuraj/Documents/VisualStudioCodeProjects/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
//windows
inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
inputSubStr = "Андрей Болконский"

console.time("dfa");
const dfa = makeDFA(inputSubStr);
const index = searchWithDFA(inputText, inputSubStr, dfa);
console.timeEnd("dfa");
console.log(index); // 10