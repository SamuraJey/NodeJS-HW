function make_dfa (str, substr) 
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

function search_substring(str, substring, dfa=[]) 
{
    let res = [];
    if (dfa.length === 0) 
    {
        dfa = make_dfa(substring);
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
        } 
        else 
        {
            state = 0;
        }
        if (state === substring.length) {
            // Найдено совпадение
            res.push(i - substring.length + 1);
            //return i - substring.length + 1;
        }
    }
    if (res.length > 0)
    {
        return res;
    }
    // Подстрока не найдена
    return [-1];
}

const str = "ananasas";
const substring = "as";
console.time("dfa");
const dfa = make_dfa(substring);
const index = search_substring(str, substring, dfa);
console.timeEnd("dfa");
console.log(index); // 10