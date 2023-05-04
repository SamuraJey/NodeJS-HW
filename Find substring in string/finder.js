const fs = require('fs');
let [mode, inputFile, inpSubStrFile, outFile] = process.argv.slice(2);
// console.log(mode, inputFile, outFile, inpSubStr);

const allowedModes = ['-b', '-r', '--brute-force', '--hash','--rabin-karp', '-h', '--help', '-bm', '-kmp'];

const EM = 16411;
// const EM = Math.pow(10, 9) + 7;
//console.log(EM);

function dedreeOfTwo(number, M = 9973)
{
    const powersOfTwo = [1];
    for (let i = 1; i < number; i++) 
    {
        powersOfTwo.push((powersOfTwo[i - 1] * 2) % M);
    }
    return powersOfTwo;
}

function buildBadMatchTable(text) 
{
    const table = {};
    const strLen = text.length;
    for (let i = 0; i < strLen - 1; i++) 
    {
        table[text[i]] = strLen - i - 1;
    }
    if (table[text[strLen - 1]] === undefined)
    {
        table[text[strLen - 1]] = strLen;
    }
    return table;
}

function boyerMoore(text, pattern)
{
    const badMatchTable = buildBadMatchTable(pattern) // Создаем таблицу смещейний
    let offset = 0 // Смещение
    let res = []; 
    const patternLastIndex = pattern.length - 1; // Индекс последнего символа подстроки
    const maxOffset = text.length - pattern.length; // Максимальное смещение
    if (maxOffset < 0) return -1 // Если длина подстроки больше длины строки, то нет смысла искать
    while (offset <= maxOffset) 
    {
        let scanIndex = 0;
        while (pattern[scanIndex] === text[scanIndex + offset]) 
        {
            if (scanIndex === patternLastIndex) // Если вся подстрока совпала, то добавляем индекс вхождения в массив
            {
                res.push(offset);
            }
            scanIndex++;
        }
        const badMatchString = text[offset + patternLastIndex];
        if (badMatchTable[badMatchString]) 
        {
            offset += badMatchTable[badMatchString];
        } 
        else 
        {
            offset++;
        }
    }
    if (res.length != 0) 
    {
        return res;
    }
    else 
    {
        res.push(-1);
        return res;
    }

}

function bruteForce(str, substr)
{
    let result = [];
    let counter = 0;
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
    return [result, counter];
}

function searchSubstring(string, substring, M)
{
    //const M = 11047; // простое число для взятия остатка по модулю //11383 fine //11071 better // 11047 smallest working with warandpeace.txt
    //const M = Math.pow(10, 9) + 7;
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
        const leftChar = string.charCodeAt(i);
        const rightChar = string.charCodeAt(i + subStrLen);
        //currentHash = (currentHash - leftChar + rightChar + M) % M; // DONE!!! TODO: убрать отрицательные значения
        currentHash = ((currentHash - leftChar + rightChar) % M + M) % M;
        //console.log(currentHash);
        currentSubstring = string.slice(i + 1, i + subStrLen + 1);
    }
    if (result.length === 0) // если не нашли вхождений подстроки, то возвращаем -1
    {
        result.push(-1);
        return [result, collisions];
    }
    return [result, collisions]; // возвращаем массив с результатами и количеством коллизий
}


// Rabin-Karp algorithm
function rabinKarp(string, substring, powersOfTwo, M = 9973)
{
    //const M = 1000003; // простое число для взятия остатка по модулю
    //const M = 9973;
    //const M = Math.pow(10, 9) + 7;

    const subStrLen = substring.length; // длина подстроки
    const strLen = string.length; // длина строки

    let collisions = 0; // счетчик коллизий
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



//inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";


//funtion to print substrings with context
function printSubstringWithContext(inputText, result, substr, context = 10)
{
    console.log(result);
    for (let i = 0; i < result.length; i++)
    {
        const startIndex = result[i];
        const endIndex = startIndex + substr.length;
        const fullSubstring = inputText.slice(startIndex, endIndex + context);
        console.log(fullSubstring);
    }
}


if (!allowedModes.includes(mode.toLowerCase())) // Проверка на то, что введенный режим является одним из допустимых. Если нет, то возвращает true и выполняется код внутри if
{
    const errorMessage = `\x1b[31mInvalid mode: ${mode.toLowerCase()}\nUse -h or --help for instructions\x1b[0m`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}
else
{
    if(mode === "-h" || mode === "--help")
    {
            console.log(`\x1b[32m
            Usage: node index.js [options]
            Options:
            -b, --bruteForce    Brute force search
            --hash              Hash search
            -r, --rabinKarp     Rabin-Karp search
            -h, --help          Show help
            \x1b[0m`);
            return 0;
    }
    //fs.writeFileSync(outFile, ""); // очищаем файл
    inputText = fs.readFileSync(inputFile, 'utf8');
    inputSubStr = fs.readFileSync(inpSubStrFile, 'utf8')
    var start = 0;
    var end = 0;
    var time = 0;
    var powOfTwo = dedreeOfTwo(inputSubStr.length, EM);
    var count = 0;
}

switch (mode) 
{
    case "-b" || "--bruteForce":
        // console.time("bruteForce");
        start = performance.now();
        let brutForceRes = bruteForce(inputText, inputSubStr);
        end = performance.now();
        time = (end - start).toFixed(3);
        count = (brutForceRes[0]).length;
        if(brutForceRes[0][0] === -1)
        {
            count = 0;
        }
        //console.log(count);
        fs.appendFileSync(outFile, `Результат поиска bruteForce за ${time} ms c ${count} вхождениями:\n`, err => {
            if (err) {
              throw err;
            }
        });
        for (let i = 0; i < brutForceRes[0].length; i++)
        {
            if (i === 10)
            {
                break;
            }
            fs.appendFileSync(outFile, brutForceRes[0][i] + "\n", err => {
                if (err) {
                  throw err;
                }
            });
            //console.log(brutForceRes[0][i]);
        }
        break;

        case "--hash":
            start = performance.now();
            let hashRes = searchSubstring(inputText, inputSubStr, EM); //4099 4327 101
            end = performance.now();
            time = (end - start).toFixed(3);
            count = (hashRes[0]).length;
            if(hashRes[0][0] === -1)
            {
                count = 0;
            }
            fs.appendFileSync(outFile, `Результат поиска обычных хэш за ${time} ms с ${hashRes[1]} коллизиями и ${count} вхождениями:\n`, err => {
                if (err) {
                    throw err;
                }
            });

            const check = bruteForce(inputText, inputSubStr);
            if (check[0].length !== hashRes[0].length && ! (check[0] === hashRes[0][0]))
            {
                console.log("Количество вхождений не совпадает");
            }
            else
            {
                console.log("Количество вхождений совпадает");
            }
            for (let i = 0; i < hashRes[0].length; i++)
            {
                if (i === 10)
                {
                    break;
                }
                fs.appendFileSync(outFile, hashRes[0][i] + "\n", err => {
                    if (err) 
                    {
                        throw err;
                    }
                });
                //console.log(hashRes[0][i]);
            }
            break;

        case "-r" || "--rabinKarp":
            start = performance.now();
            // let rabinKarpRes = rabinKarp(inputText, inpSubStr, powOfTwo, EM);
            let rabinKarpRes = rabinKarp(inputText, inputSubStr, powOfTwo, EM);
            end = performance.now();
            time = (end - start).toFixed(3);
            count = (rabinKarpRes[0]).length;
            if (rabinKarpRes[0][0] === -1)
            {
                count = 0;
            }
            const check1 = bruteForce(inputText, inputSubStr);
            if (check1[0].length !== rabinKarpRes[0].length)
            {
                console.log("Количество вхождений не совпадает");
            }
            else
            {
                console.log("Количество вхождений совпадает");
            }

            fs.appendFileSync(outFile, `Результат поиска Rabin-Karp за ${time} ms c ${rabinKarpRes[1]} коллизиями и ${count} вхождениями:\n`, err => {
                if (err) {
                    throw err;
                }
            });
            for (let i = 0; i < rabinKarpRes[0].length; i++)
            {
                if (i === 10)
                {
                    break;
                }
                fs.appendFileSync(outFile, rabinKarpRes[0][i] + "\n", err => {
                    if (err) {
                        throw err;
                    }
                });
            }
            break;
            
            case '-bm' || '--boyerMoore':
                start = performance.now();
                let boyerMooreRes = boyerMoore(inputText, inputSubStr);
                end = performance.now();

                time = (end - start).toFixed(3);
                count = (boyerMooreRes).length;

                if (boyerMooreRes[0] === -1)
                {
                    count = 0;
                }
                const check2 = bruteForce(inputText, inputSubStr);
                if (check2[0].length !== boyerMooreRes.length)
                {
                    console.log("Количество вхождений не совпадает");
                }
                else
                {
                    console.log("Количество вхождений совпадает");
                }

                fs.appendFileSync(outFile, `Результат поиска boyerMoorHorspool за ${time} ms c ${count} вхождениями:\n`, err => {
                    if (err) {
                        throw err;
                    }
                });
                for (let i = 0; i < boyerMooreRes.length; i++)
                {
                if (i === 10)
                {
                    break;
                }
                fs.appendFileSync(outFile, boyerMooreRes[i] + "\n", err => {
                    if (err) {
                        throw err;
                    }
                });
            }
            break;

    default:
        break;
}