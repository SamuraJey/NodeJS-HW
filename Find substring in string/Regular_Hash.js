const fs = require('fs');

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
        else
        {
            collisions++; // если хеши не совпали, увеличиваем счетчик коллизий
        }

        // вычисляем хеш следующей подстроки с помощью оптимизации двигающегося окна
        currentHash = (currentHash - string.charCodeAt(i) + string.charCodeAt(i + substring.length)) % M;
        currentSubstring = string.slice(i + 1, i + substring.length + 1);
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

// test for hash

const inputText = fs.readFileSync("warandpeace.txt", 'utf8');
const substr = "Андрей Болконский";

console.time("searchSubstring");
const [result, collisions] = searchSubstring(inputText, substr);
console.timeEnd("searchSubstring");

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

printSubstringWithContext(inputText, result, substr, 30);

console.log("Результат поиска:", result); // [7]
console.log("Количество коллизий:", collisions); // 10
