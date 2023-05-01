function rabinKarp(str, substr)
{
    const M = 1000003;
    const n = str.length;
    const m = substr.length;
    let count = 0; // счетчик коллизий
    let substrHash = getHashRK(substr, M);
    let currentHash = getHashRK(str.slice(0, m), M);

    let occurrences = [];

    for (let i = 0; i <= n - m; i++)
    {
        if (substrHash === currentHash)
        {
            let found = true;
            for (let j = 0; j < m; j++)
            {
                if (str[i + j] !== substr[j])
                {
                    found = false;
                    break;
                }
            }
            if (found)
            {
                occurrences.push(i);
            }
            count++;
        }
        // оптимизация двигающегося окна
        if (i < n - m)
        {
            currentHash = ((currentHash - (2 ** (m - 1) * str.charCodeAt(i)) % M + M) % M * 2 + str.charCodeAt(i + m)) % M;
        }
    }

    return [occurrences, count];
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


const str = "The quick brown fox jumps over the lazy dog";
const substr = "fox";

console.time("Rabin-Karp");
const [occurrences, count] = rabinKarp(str, substr);
console.timeEnd("Rabin-Karp");

console.log("Occurrences: ", occurrences); // [16]
console.log("Number of collisions: ", count); // 16
