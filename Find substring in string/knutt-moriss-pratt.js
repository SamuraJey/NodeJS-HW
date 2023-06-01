function findSubstring(str, substr)
{
    let res = [];
    let strLen = str.length;
    let subStrLen = substr.length;
    let prefix = prefixFunction(substr);
    let j = 0;
    for (let i = 0; i < strLen; i++)
    {
        while (j > 0 && str[i] !== substr[j])
        {
            j = prefix[j - 1];
        }
        if (str[i] === substr[j])
        {
            j++;
        }
        if (j === subStrLen)
        {
            res.push(i - subStrLen + 1);
            j = prefix[j - 1];
        }
    }
    if (res.length === 0)
    {
        //res.push(-1);
        return [-1];
    }
    return res;
}

function prefixFunction(substr)
{
    const subStrLen = substr.length;
    let prefix = new Array(subStrLen).fill(0);
    let j = 0;
    for (let i = 1; i < subStrLen; i++) // i = 1 потому что первый символ всегда 0
    {
        while (j > 0 && substr[i] !== substr[j]) // пока не совпадают символы
        {
            j = prefix[j - 1]; // сдвигаемся по таблице префиксов
        }
        if (substr[i] === substr[j]) // если символы совпали
        {
            j++; // то увеличиваем длину префикса
        }
        prefix[i] = j; // записываем длину префикса в таблицу
    }
    return prefix;
}


const fs = require('fs');

let inputText = fs.readFileSync("Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский"

let str = "hello world";
let substr = "l";
console.time("1")
let res = findSubstring(inputText, inputSubStr);
console.timeEnd("1")
console.log(res); // [2, 3, 9]