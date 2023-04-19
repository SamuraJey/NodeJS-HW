function compareText(text, index, pattern) 
{
    for (let i = 0; i < pattern.length; i++) 
    {
        if (pattern[i] !== text[index + i]) 
        {
            return false;
        }
    }
    return true;
}

function bruteForce(str, substr) 
{
    for (let i = 0; i < str.length; i++) 
    {
        let j = 0;
        while (j < substr.length && str[i + j] === substr[j]) 
        {
            j++;
        }
        if (j === substr.length)
        {
            return i;
        }
    }
    return -1;
}


function hashFind(str, substr) 
{
    let substrHash = 0;
    let collisions = 0;
    let hash = 0;

    for (let i = 0; i < substr.length; i++) 
    {
        substrHash += substr.charCodeAt(i);
    }

    for (let i = 0; i < str.length; i++) 
    {
        hash += str.charCodeAt(i);
        //console.log(`Just hash: ${hash}`);

        /* 
        Если больше или равно длины подстроки
        то мы можем вычесть первый символ из хеша и добавить новый.
        Таким образом, мы можем вычислять хеш-функцию только для каждой новой подстроки,
        добавляя в нее только новый символ и вычитая старый символ
        из предыдущей подстроки. Это существенно ускоряет вычисления
        для длинных строк и подстрок.
        */
        if (i >= substr.length) 
        {
            hash -= str.charCodeAt(i - substr.length);
            //console.log(`In if hash: ${hash}`);
        }
        if (i >= substr.length - 1)  // Если собрали достаточно символов для проверки хэша
        {
            if (hash === substrHash) 
            {
                let j = 0;
                while (j < substr.length && str[i - substr.length + 1 + j] === substr[j]) // Проверяем на совпадение
                {
                    j++;
                }
                if (j === substr.length) // Если совпадение найдено
                {
                    return [i - substr.length + 1, collisions];
                    return { index: i - substr.length + 1, collisions: collisions };
                }
            }
            collisions++; // Если прошлый ретёрн не сработал - совпадение не найдено, а хеш одинаковый - значит коллизия
        }
    }
    return [-1, collisions];
}

function rabinKarp(str, template) {
    const answer = [];
    const n = str.length;
    const m = template.length;
    const p = 31; // простое число для вычисления хэша
    //const p = 31; // простое число для вычисления хэша
    //const r = Math.pow(10, 9) + 9; // большое простое число
    const r = Math.pow(10, 9) + 7;
    const hashW = getHashforRK(template, p, r);
    let hashS = getHashforRK(str.slice(0, m), p, r);
    let collisions = 0;
  
    for (let i = 0; i <= n - m; i++) {
        console.log(`Hashes are: ${hashS} != ${hashW}`);
      if (hashS === hashW) 
      {
        console.log(`Hashes are equal: ${hashS} = ${hashW}`);
        if (str.slice(i, i + m) === template) 
        {
          answer.push(i);
        }
      }
      
      collisions++; // увеличиваем счетчик коллизий при каждой итерации цикла
      hashS = (p * (hashS - str.charCodeAt(i) * Math.pow(p, m - 1)) + str.charCodeAt(i + m)) % r;
      console.log(`Hash dry: ${hashS}`);
    }
    return [answer, collisions];
  }
  
  
function getHashforRK(str, p, r)
{
    let hash = 0;
    for (let i = 0; i < str.length; i++) 
    {
        hash = (hash * p + str.charCodeAt(i)) % r;
        console.log(`Hash: ${hash}`);
    }
    return hash;
}
  
  
  
  

    
    console.time('Time for bruteForce');
    //console.log(bruteForce('Hello, world!', 'world'));
    console.timeEnd('Time for bruteForce');

    console.time('Time for hashFind');
    tmp = hashFind('Hello, world!', 'world');
    console.log(tmp);
    //console.log(`Index: ${tmp['index']}\nCollisions: ${tmp['collisions']}`);
    console.timeEnd('Time for hashFind');

    console.time('Time for rabinKarp');
    console.log(rabinKarp('Hello, world!', 'world'));
    console.timeEnd('Time for rabinKarp');





