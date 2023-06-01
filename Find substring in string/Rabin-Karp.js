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