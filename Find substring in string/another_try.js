const fs = require('fs');

//need to output all chars by their code
/*
for (let i = 0; i <= 16000; i++) 
{
    console.log(i + " " + String.fromCharCode(i));
}
*/


const inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');

const substr = "Андрей Болконский";


function rabinKarp(string, substring, powerOfTwo)
{
    //const M = 1000003; // простое число для взятия остатка по модулю
    const M = 9973;
    //const M = Math.pow(10, 9) + 7;

    const subStrLen = substring.length; // длина подстроки
    const strLen = string.length; // длина строки

    let collisions = 0; // счетчик коллизий
    let substringHash = getHashRK(substring, M);
    let currentHash = getHashRK(string.slice(0, subStrLen), M);
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
                collisions++;
            }
        }
        let rcurrentHash = currentHash;
        let KcurrentHash = currentHash;
        // оптимизация двигающегося окна
        //currentHash = ((currentHash - (2 ** (substring.length - 1) * string.charCodeAt(i)) % M + M) % M * 2 + string.charCodeAt(i + substring.length)) % M;
        //currentHash = ((currentHash - (massiv[substring.length - 1] * string.charCodeAt(i)) % M + M) % M * 2 + string.charCodeAt(i + substring.length)) % M;
        
        
        currentHash -= (2 ** (substring.length - 1) * string.charCodeAt(i)) % M;
        currentHash += M;
        currentHash %= M;
        currentHash *= 2;
        currentHash += string.charCodeAt(i + substring.length);
        currentHash %= M;
        //console.log(currentHash);


        //currentHash = ((currentHash - (p * string.charCodeAt(i)) % M + M) % M * 2 + string.charCodeAt(i + subStrLen)) % M;
        currentSubstring = string.slice(i + 1, i + subStrLen + 1);
    }
    
    if (result.length === 0)
    {
        result.push(-1);
        return [result, collisions];
    }

    return [result, collisions];
}

function getHashRK(str, M)
{
    //console.time("getHashRK");
    let hash = 0;
    const n = str.length;

    for (let i = 0; i < n; i++)
    {
        //hash = (hash + (2 ** (n - i - 1) * str.charCodeAt(i)) % M) % M;
        hash += (2 ** (n - i - 1) * str.charCodeAt(i)) % M;
        hash %= M;
    }
    //console.timeEnd("getHashRK");
    return hash;
}















console.time("searchSubstringRK");
const [resultRK, collisionsRK] = rabinKarp(inputText, substr);
//rabinKarp(inputText, substr);
console.timeEnd("searchSubstringRK");

console.log(resultRK);