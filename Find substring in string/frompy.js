


const fs = require('fs');
let t = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
//let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
let inputSubStr = "Андрей Болконский";

// Этап 1: формирование таблицы смещений

let S = new Set();  // уникальные символы в образе
let M = t.length; // число символов в образе
let d = {};     // словарь смещений

for (let i = M - 2; i >= 0; i--) { // итерации с предпоследнего символа
    if (!S.has(t[i])) {        // если символ еще не добавлен в таблицу
        d[t[i]] = M - i - 1;
        S.add(t[i]);
    }
}

if (!S.has(t[M - 1])) {     // отдельно формируем последний символ
    d[t[M - 1]] = M;
}

d['*'] = M;              // смещения для прочих символов

console.log(d);

// Этап 2: поиск образа в строке

let a = "Андрей Болконский";
let N = a.length;

if (N >= M) {
    let i = M - 1;       // счетчик проверяемого символа в строке

    while (i < N) {
        let k = 0;
        let j = 0;
        let flBreak = false;
        for (j = M - 1; j >= 0; j--) {
            if (a[i - k] !== t[j]) {
                let off;
                if (j === M - 1) {
                    off = d[a[i]] || d['*'];  // смещение, если не равен последний символ образа
                } else {
                    off = d[t[j]];   // смещение, если не равен не последний символ образа
                }

                i += off;    // смещение счетчика строки
                flBreak = true;  // если несовпадение символа, то flBreak = true
                break;
            }

            k += 1;          // смещение для сравниваемого символа в строке
        }

        if (!flBreak) {          // если дошли до начала образа, значит, все его символы совпали
            console.log(`образ найден по индексу ${i - k + 1}`);
            break;
        }
    }

    if (i >= N) {
        console.log("образ не найден");
    }
} else {
    console.log("образ не найден");
}
