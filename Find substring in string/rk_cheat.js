const fs = require('fs');

/*
TODO list:
1. Optimize findSubstring function
2. Optimize rabinKarp function

possible solutions:


*/


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


function dedreeOfTwo(number, M = 1000003)
{
    const powersOfTwo = [1];
    for (let i = 1; i < number; i++) 
    {
        powersOfTwo.push((powersOfTwo[i - 1] * 2) % M);
    }
    return powersOfTwo;
}

// Rabin-Karp algorithm
function rabinKarp(string, substring, powersOfTwo)
{
    //const M = 1000003; // простое число для взятия остатка по модулю
    const M = 700717;
    //const M = Math.pow(10, 9) + 7;

    const subStrLen = substring.length; // длина подстроки
    const strLen = string.length; // длина строки

    let collisions = 0; // счетчик коллизий
    let substringHash = getHashRK(substring, M, powersOfTwo);
    let currentHash = getHashRK(string.slice(0, subStrLen), M, powersOfTwo);
    let currentSubstring = string.slice(0, subStrLen);
    let result = [];
    //const p = 2 ** (subStrLen - 1);
    
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
                // console.log("currentSubstring: ", currentSubstring);
                // console.log("substring: ", substring);
                // console.log("currentHash: ", currentHash);
                // console.log("substringHash: ", substringHash);
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


function getHashRK(str, M, powersOfTwo)
{
    //console.time("getHashRK");
    let hash = 0;
    const n = str.length;

    for (let i = 0; i < n; i++)
    {
        hash = (hash + (powersOfTwo[n - i - 1] * str.charCodeAt(i)) % M) % M;
    }
    //console.timeEnd("getHashRK");
    return hash;
}

// test for hash
const inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');


const substr = "Андрей Болконский";
powOfTwo = dedreeOfTwo(substr.length);

console.time("bruteForce");
const [bruteForceResult, counter1] = bruteForce(inputText, substr);
//bruteForce(inputText, substr);
console.timeEnd("bruteForce");


console.time("searchSubstringRK");
const [resultRK, collisionsRK] = rabinKarp(inputText, substr, powOfTwo);
//rabinKarp(inputText, substr);
console.timeEnd("searchSubstringRK");

console.time("searchSubstringRK1");
const [resultRK1, collisionsRK1] = rabinKarp("Hello world world word world", "world", powOfTwo);
//rabinKarp(inputText, substr);
console.timeEnd("searchSubstringRK1");

console.time("bruteForce");
bruteForce("Hello world world word world", "world");
//bruteForce(inputText, substr);
console.timeEnd("bruteForce");

console.log();
console.log("Результат поиска bruteForce:", bruteForceResult);
console.log("Количество сравнений bruteForce:", counter1);
console.log();
console.log("Результат поиска: Rabin-Karp:", resultRK);
console.log("Количество коллизий Rabin-Karp:", collisionsRK);



if (bruteForceResult.length === resultRK.length)
{
    console.log();
    console.log("Количество вхождений одинаковое");
}
