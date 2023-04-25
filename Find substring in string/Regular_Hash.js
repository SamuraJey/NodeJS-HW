const fs = require('fs');
let [mode, inputFile, inpSubStrFile, outFile] = process.argv.slice(2);
// console.log(mode, inputFile, outFile, inpSubStr);

const allowedModes = ['-b', '-r', '--brute-force', '--hash','--rabin-karp'];

const EM = 16411;
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
        currentHash = (currentHash - leftChar + rightChar) % M;
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
    //fs.writeFileSync(outFile, ""); // очищаем файл
    inputText = fs.readFileSync(inputFile, 'utf8');
    inputSubStr = fs.readFileSync(inpSubStrFile, 'utf8')
    var start = 0;
    var end = 0;
    var time = 0;
    var powOfTwo = dedreeOfTwo(inputSubStr.length, EM);
}

switch (mode) 
{
    case "-b" || "--bruteForce":
        // console.time("bruteForce");
        start = Date.now();
        let brutForceRes = bruteForce(inputText, inputSubStr);
        end = Date.now();
        time = end - start;

        fs.appendFileSync(outFile, `Результат поиска bruteForce за ${time} ms:\n`, err => {
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

            start = Date.now();
            let hashRes = searchSubstring(inputText, inputSubStr, 101); //4099 4327
            end = Date.now();
            time = end - start;
            fs.appendFileSync(outFile, `Результат поиска обычных хэш за ${time} ms с ${hashRes[1]} коллизиями:\n`, err => {
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
                    if (err) {
                        throw err;
                    }
                });
                //console.log(hashRes[0][i]);
            }
            break;

        case "-r" || "--rabinKarp":
            start = Date.now();
            // let rabinKarpRes = rabinKarp(inputText, inpSubStr, powOfTwo, EM);
            let rabinKarpRes = rabinKarp(inputText, inputSubStr, powOfTwo, EM);
            end = Date.now();
            time = end - start;
            const check1 = bruteForce(inputText, inputSubStr);
            // if (check1[0].length !== rabinKarpRes[0].length)
            // {
            //     console.log("Количество вхождений не совпадает");
            // }
            // else
            // {
            //     console.log("Количество вхождений совпадает");
            // }

            fs.appendFileSync(outFile, `Результат поиска Rabin-Karp за ${time} ms c ${rabinKarpRes[1]} коллизиями:\n`, err => {
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
                //console.log(rabinKarpRes[0][i]);
            }
            break;

    default:
        break;
}