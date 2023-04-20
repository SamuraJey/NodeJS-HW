const { log } = require('console');
const fs = require('fs');


function bruteForce(str, substr) 
{
    let result = [];
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
        }
    }
    if (result.length === 0)
    {
        result.push(-1);
    }
    return result;
}

function searchSubstring(string, substring)
{
    const M = 1000003; // простое число для взятия остатка по модулю
    let collisions = 0; // счетчик коллизий
    const substringHash = getHash(substring, M); // хеш-значение подстроки
    const result = []; // массив с результатами

    // вычисляем хеш первой подстроки
    let currentSubstring = string.slice(0, substring.length);
    let currentHash = getHash(currentSubstring, M);

    for (let i = 0; i <= string.length - substring.length; i++)
    {
        if (currentHash === substringHash) // если хеши совпали, проверяем равенство строк
        {
            if (currentSubstring === substring) // если строки равны, то нашли вхождение подстроки
            {
                result.push(i); // добавляем индекс начала подстроки в массив результатов

                if (result.length === 10) // если нашли 10 вхождений, то выходим из цикла
                {
                    break;
                }
            }
            else
            {
                collisions++; // иначе увеличиваем счетчик коллизий
            }
        }

        // вычисляем хеш следующей подстроки с помощью оптимизации двигающегося окна
        currentHash = (currentHash - string.charCodeAt(i) + string.charCodeAt(i + substring.length)) % M;
        currentSubstring = string.slice(i + 1, i + substring.length + 1);
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
function rabinKarp(string, substring)
{
    const M = 1000003;
    const n = string.length;
    const m = substring.length;
    let collisions = 0; // счетчик коллизий
    let substringHash = getHashRK(substring, M);
    let currentHash = getHashRK(string.slice(0, m), M);
    let currentSubstring = string.slice(0, substring.length);
    console.log("currentSubstring: ", currentSubstring);
    let result = [];

    for (let i = 0; i <= string.length - substring.length; i++)
    {
        //console.log("currentSubstring: ", currentSubstring);
        if (currentHash === substringHash)
        {
            if (currentSubstring === substring)
            {
                result.push(i);

                if (result.length === 10)
                {
                    break;
                }
            }
            else
            {
                collisions++;
            }
        }
        // оптимизация двигающегося окна
            currentHash = ((currentHash - (2 ** (m - 1) * string.charCodeAt(i)) % M + M) % M * 2 + string.charCodeAt(i + m)) % M;
            currentSubstring = string.slice(i + 1, i + substring.length + 1);
    }

    return [result, collisions];
}

function getHashRK(str, M)
{
    let hash = 0;
    const n = str.length;

    for (let i = 0; i < n; i++)
    {
        hash = (hash + (2 ** (n - i - 1) * str.charCodeAt(i)) % M) % M;
    }

    return hash;
}



// test for hash

const inputText = fs.readFileSync("warandpeace.txt", 'utf8');
const substr = "Андрей Болконский";

console.time("bruteForce");
const bruteForceResult = bruteForce(inputText, substr);
console.timeEnd("bruteForce");


console.time("searchSubstring");
const [result, collisions] = searchSubstring(inputText, substr);
console.timeEnd("searchSubstring");

console.time("searchSubstringRK");
const [resultRK, collisionsRK] = rabinKarp(inputText, substr);
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

console.log("Результат поиска bruteForce:", bruteForceResult);
console.log();
console.log("Результат поиска: обычных хэш:", result);
console.log("Количество коллизий обычных хэш:", collisions);
console.log();
console.log("Результат поиска: Rabin-Karp:", resultRK);
console.log("Количество коллизий Rabin-Karp:", collisionsRK);
