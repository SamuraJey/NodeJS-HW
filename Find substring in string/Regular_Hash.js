const fs = require('fs');

/*
TODO list:
1. Optimize findSubstring function
2. Optimize rabinKarp function

possible solutions:


*/

function dedreeOfTwo(number, M = 9973)
{
    const powersOfTwo = [1];
    for (let i = 1; i < number; i++) 
    {
        powersOfTwo.push((powersOfTwo[i - 1] * 2) % M);
    }
    return powersOfTwo;
}

var massiv = []
for(let i = 0; i <= 200; i++)
{
    massiv.push(Math.pow(2, i));
}

function bruteForce(str, substr)
{
    let result = [];
    let counter = 0; // счетчик сравнений
    for (let i = 0; i < str.length; i++)
    {
        let j = 0;
        while (j < substr.length && str[i + j] === substr[j])
        {
            j++;
        }
        if (j === substr.length)
        {
            result.push(i);
            counter++;
            if (result.length === 10 && false)
            {
                break;
            }
        }
    }
    if (result.length === 0)
    {
        result.push(-1);
    }
    return [result, counter];
}

function searchSubstring(string, substring)
{
    //const M = 11047; // простое число для взятия остатка по модулю //11383 fine //11071 better // 11047 smallest working with warandpeace.txt
    const M = Math.pow(10, 9) + 7;
    let collisions = 0; // счетчик коллизий
    
    const result = []; // массив с результатами
    const subStrLen = substring.length; // длина подстроки
    const strLen = string.length; // длина строки

    // вычисляем хеш первой подстроки
    let currentSubstring = string.slice(0, subStrLen);
    let currentHash = 0;
    let substringHash = 0;

    for (let k = 0; k < subStrLen; k++) // вычисляем хеш подстроки и хеш первой подстроки в строке
    {
        substringHash = (substringHash + substring.charCodeAt(k)) % M;
        currentHash = (currentHash + string.charCodeAt(k)) % M;
    }

    for (let i = 0; i <= strLen - subStrLen; i++)
    {
        if (currentHash === substringHash) // если хеши совпали, проверяем равенство строк
        {
            if (currentSubstring === substring) // если строки равны, то нашли вхождение подстроки
            {
                result.push(i); // добавляем индекс начала подстроки в массив результатов
            }
            else
            {
                collisions++; // иначе увеличиваем счетчик коллизий
            }
        }
        currentHash = (currentHash - string.charCodeAt(i) + string.charCodeAt(i + subStrLen)) % M;
        currentSubstring = string.slice(i + 1, i + subStrLen + 1);
    }
    if (result.length === 0) // если не нашли вхождений подстроки, то возвращаем -1
    {
        result.push(-1);
        return [result, collisions];
    }
    return [result, collisions]; // возвращаем массив с результатами и количеством коллизий
}

// функция для вычисления хеш-значения строки
function getHash(string, M)
{
    let hash = 0;
    for (let i = 0; i < string.length; i++)
    {
        hash = (hash + string.charCodeAt(i)) % M;
    }
    return hash;
}

// Rabin-Karp algorithm
function rabinKarp(string, substring, powersOfTwo)
{
    //const M = 1000003; // простое число для взятия остатка по модулю
    const M = 9973;
    //const M = Math.pow(10, 9) + 7;

    const subStrLen = substring.length; // длина подстроки
    const strLen = string.length; // длина строки

    let collisions = 0; // счетчик коллизий
    // let substringHash = getHashRK(substring, M, powersOfTwo);
    // let currentHash = getHashRK(string.slice(0, subStrLen), M, powersOfTwo);
    let currentSubstring = string.slice(0, subStrLen);
    let result = [];

    let substringHash = 0;
    let currentHash = 0;

    for (let i = 0; i < subStrLen; i++)
    {
        currentHash = (currentHash + (powersOfTwo[subStrLen - i - 1] * string.charCodeAt(i)) % M) % M;
        substringHash = (substringHash + (powersOfTwo[subStrLen - i - 1] * substring.charCodeAt(i)) % M) % M;
    }

    for (let i = 0; i <= strLen - subStrLen; i++)
    {
        if (currentHash === substringHash)
        {
            if (currentSubstring === substring)
            {
                result.push(i);
            }
            else
            {
                collisions++;
            }
        }
        const leftChar = string.charCodeAt(i);
        const rightChar = string.charCodeAt(i + subStrLen);
        currentHash = ((currentHash - (powersOfTwo[subStrLen - 1] * leftChar) % M + M) % M * 2 + rightChar) % M;
        currentSubstring = string.slice(i + 1, i + subStrLen + 1);
    }
    
    if (result.length === 0)
    {
        result.push(-1);
        return [result, collisions];
    }
    return [result, collisions];
}


// function getHashRK(str, M, powersOfTwo)
// {
//     //console.time("getHashRK");
//     let hash = 0;
//     const n = str.length;
//     for (let i = 0; i < n; i++)
//     {
//         hash = (hash + (powersOfTwo[n - i - 1] * str.charCodeAt(i)) % M) % M;
//     }
//     //console.timeEnd("getHashRK");
//     return hash;
// }

// test for hash
const inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');

const substr = "Андрей Болконский";
powOfTwo = dedreeOfTwo(substr.length, 9973);

console.time("bruteForce");
const [bruteForceResult, counter1] = bruteForce(inputText, substr);
//bruteForce(inputText, substr);
console.timeEnd("bruteForce");

console.time("searchSubstring");
const [result, collisions, counter2] = searchSubstring(inputText, substr);
//searchSubstring(inputText, substr);
console.timeEnd("searchSubstring");

console.time("searchSubstringRK");
const [resultRK, collisionsRK] = rabinKarp(inputText, substr, powOfTwo);
//rabinKarp(inputText, substr);
console.timeEnd("searchSubstringRK");

//funtion to print substrings with context
function printSubstringWithContext(inputText, result, substr, context = 10)
{
    for (let i = 0; i < result.length; i++)
    {
        const startIndex = result[i];
        const endIndex = startIndex + substr.length;
        const fullSubstring = inputText.slice(startIndex, endIndex + context);
        console.log(fullSubstring);
    }
}

//printSubstringWithContext(inputText, result, substr, 30);
//console.log();
//printSubstringWithContext(inputText, bruteForceResult, substr, 30);
console.log();
console.log("Результат поиска bruteForce:", bruteForceResult);
console.log("Количество сравнений bruteForce:", counter1);
console.log();
console.log("Результат поиска: обычных хэш:", result);
console.log("Количество коллизий обычных хэш:", collisions);

console.log();
console.log("Результат поиска: Rabin-Karp:", resultRK);
console.log("Количество коллизий Rabin-Karp:", collisionsRK);



if (bruteForceResult.length === result.length && bruteForceResult.length === resultRK.length)
{
    console.log();
    console.log("Количество вхождений одинаковое");
}
