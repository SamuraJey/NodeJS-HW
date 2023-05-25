function boyerMoore(text, pattern)
{
    let res = [];
    const strLength = text.length;
    const subStrLength = pattern.length;
    if (subStrLength === 0 || strLength === 0 || subStrLength > strLength) // если подстрока пустая или текст пустой или подстрока длиннее текста
    {
        res.push(-1); // невозможно найти подстроку
        return res;
    }

    let badCharTable = makeBadCharTable(pattern); // таблица смещений для каждого символа
    let goodSuffixTable = makeGoodSuffixTable(pattern); // таблица смещений для каждого суффикса

    for (let i = subStrLength - 1, j; i < strLength;) // пока не конец текста
    {
        for (j = subStrLength - 1; pattern[j] === text[i]; i--, j--) // пока символы совпадают
        {
            if (j === 0) // если вся подстрока совпала, то добавляем индекс вхождения в массив
            {
                res.push(i);
                break;
            }
        }
        const charCode = text.charCodeAt(i); // получаем код символа
        i += Math.max(goodSuffixTable[subStrLength - 1 - j], badCharTable[charCode]); // смещаемся на максимум из смещений по таблицам
    }

    if (res.length === 0) // если ничего не нашли
    {
        res.push(-1); // -1
        return res;
    }
    return res;
}


function makeBadCharTable(pattern) // таблица смещений для каждого символа utf-8
{
    const patternLength = pattern.length;
    let table = new Array(32768).fill(patternLength); // создаем таблицу смещений, 32768 - максимальное значение кода символа utf-8
    for (let i = 0; i < patternLength - 1; i++) // заполняем таблицу смещениями
    {
        const charCode = pattern.charCodeAt(i); // получаем код символа
        table[charCode] = patternLength - i - 1; // смещение равно длине подстроки минус индекс символа
    }
    return table;
}


function makeGoodSuffixTable(pattern) 
{
    const patternLength = pattern.length;
    let table = new Array(patternLength);
    let lastPrefixPosition = patternLength;

    for (let i = patternLength; i > 0; i--) 
    {
        if (pattern.startsWith(pattern.slice(i))) // если подстрока совпала с суффиксом
        {
            lastPrefixPosition = i;
        }
        table[patternLength - i] = lastPrefixPosition - 1 + patternLength; // заполняем таблицу смещений
    }

    for (let i = 0; i < patternLength - 1; i++) 
    {
        const slen = suffixLength(pattern, i);
        table[slen] = patternLength - 1 - i + slen;
    }
    return table;
}

function suffixLength(pattern, pos) 
{
    let len = 0;
    for (let i = pos, j = pattern.length - 1; i >= 0 && pattern[i] == pattern[j]; i--, j--) // пока символ с pos и конца совпдают то длина суфикса растет
    {
        len += 1;
    }
    return len;
}













class BoyerMoore 
{
    constructor(pattern) // конструктор класса
    {
        this.pattern = pattern; // говорим что для этого экземпляра класса pattern = pattern
        this.badCharTable = this.makeBadCharTable(); // создаем таблицу смещений для каждого символа
        this.goodSuffixTable = this.makeGoodSuffixTable(); // создаем таблицу смещений для каждого суффикса
    }
  
    search(text) // функция поиска подстроки в строке
    { 
      const res = []; // массив с индексами вхождения подстроки
      const strLength = text.length; // длина строки
      const subStrLength = this.pattern.length; // длина подстроки
      
      // если подстрока пустая или текст пустой или подстрока длиннее текста
      if (subStrLength === 0 || strLength === 0 || subStrLength > strLength) 
      {
        res.push(-1);
        return res;
      }
      
      // это по сути брутфорс, но с учетом таблиц смещений
      for (let i = subStrLength - 1, j; i < strLength;) // пока не конец текста
      {
        for (j = subStrLength - 1; this.pattern[j] === text[i]; i--, j--)  // пока символы совпадают
        {
          if (j === 0) // если вся подстрока совпала, то добавляем индекс вхождения в массив
          {
            res.push(i);
            break;
          }
        }

        const charCode = text.charCodeAt(i); // получаем код символа на месте i
        i += Math.max(this.goodSuffixTable[subStrLength - 1 - j], this.badCharTable[charCode]); // смещаемся на максимум из смещений по таблицам
      }
  
      if (res.length === 0) // если ничего не нашли то -1
      {
        res.push(-1);
        return [res];
      }
      return res;
    }
  
    makeBadCharTable() // таблица смещений для каждого символа 
    {
      const patternLength = this.pattern.length; // длина подстроки
      const table = new Array(32768).fill(patternLength); // создаем таблицу смещений, 32768 - максимальное значение кода символа utf-8
      // судя по замерам скорости, это происходит менее чем за 1мс, поэтому так можно
      // заполняем таблицу смещениями
      for (let i = 0; i < patternLength - 1; i++) 
      {
        const charCode = this.pattern.charCodeAt(i);
        table[charCode] = patternLength - i - 1;
      }
  
      return table;
    }
  
    makeGoodSuffixTable() // таблица смещений для каждого суффикса
    {
      const patternLength = this.pattern.length; // длина подстроки
      const table = new Array(patternLength); // создаем пустую таблицу смещений
      let lastPrefixPosition = patternLength; // переменная для хранения последней позиции префикса, который совпадает с суффиксом.
  
      for (let i = patternLength; i > 0; i--) 
      {
        if (this.pattern.startsWith(this.pattern.slice(i))) // если подстрока совпала с суффиксом
        {
          lastPrefixPosition = i; // то запоминаем индекс
        }
        table[patternLength - i] = lastPrefixPosition - 1 + patternLength; // заполняем таблицу смещений
      }
  
      for (let i = 0; i < patternLength - 1; i++) // заполняем таблицу смещений для каждого суффикса
      {
        const slen = this.suffixLength(i); // длина суффикса
        table[slen] = patternLength - 1 - i + slen; //
      }
  
      return table;
    }
  
    suffixLength(pos) // поиск длины суффикса
    {
        let len = 0;
        for (let i = pos, j = this.pattern.length - 1; i >= 0 && this.pattern[i] == this.pattern[j]; i--, j--) 
        {
            len += 1;
        }
  
        return len;
    }
}


const fs = require('fs');
let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский";
let strt = performance.now();
const bm = new BoyerMoore(inputSubStr);            
let boyerMooreRes = bm.search(inputText)
let end = performance.now();
console.log(end - strt);
console.log(boyerMooreRes);