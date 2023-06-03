function searchSubstringWithHash(string, substring, M)
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
        currentHash = ((currentHash - leftChar + rightChar) % M + M) % M;
        currentSubstring = string.slice(i + 1, i + subStrLen + 1);
    }
    if (result.length === 0) // если не нашли вхождений подстроки, то возвращаем -1
    {
        result.push(-1);
        return [result, collisions];
    }
    return [result, collisions]; // возвращаем массив с результатами и количеством коллизий
}