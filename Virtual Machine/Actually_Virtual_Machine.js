/*
Пример запуска программы  (text for test commit, sorry)
  1               2                 3
node Actually_Virtual_Machine.js nod.sasm
1) говорим терминалу что запускать надо через nodejs
2) говорим где лежит файл со скриптом
3) говорим где лежит файл с кодом на sASM
*/

const fs = require('fs'); // Node.js модуль файловой системы позволяет вам работать с файловой системой на вашем компьютере.
let arg = process.argv; // Переменная в которую попадут аргументы введенные пользователя
const readsync = require('readline-sync'); // требуем наличие модуля readline-sync для ввода данных с консоли

//let mem = new Array(); 
let mem = []; // создаем массив
let ip = 0; // положение инстракшен поинтер
let flag = true; // булевый флаг для цикла while
inputFilename = arg[2].toString()
if (!(fs.existsSync(inputFilename))) // Проверяем, существует ли входной файл
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
let inputCode = fs.readFileSync(arg[2]).toString(); //из аргументов пользователя берем второй, переводим его в строку - это имя файла в котором должны лежать инструкции на нашем ЯП
mem = inputCode.split(/\s+/); // записываем в mem инструкции из файла разделяя их по любым пробелам (табы, новые лиеи в т.ч.) 


//todo внедрить комменты

while (flag) // начало цикал
{
    switch(mem[ip])
    {
        case 'inp': //инстуркция инпут записывает в указанную ячейку ввод с клаивиатуры
            let number = readsync.question('Enter number: ')
            if (isNaN(number)) // дурацкая защита от дурака
            {
                console.log('Error: Not a Number');
                break;
            }
            mem[mem[ip + 1]] = parseFloat(number); // преобразуем введенное пользователем во флоат потому что вдруг надо будет делить хзз
            ip += 2; // ip +2 потому что инструкция состоит из 2 "слов" input и №ячейки
            break;

        case 'set':
            mem[mem[ip + 1]] = parseFloat(mem[ip+2]);
            ip += 3;
            break;

        case 'add':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]]
            ip += 4;
            break;

        case 'sub':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] - mem[mem[ip + 2]]
            ip += 4;
            break;

        case 'mul':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]]
            ip += 4;
            break;

        case 'div':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] / mem[mem[ip + 2]]
            ip += 4;
            break;

        case 'cmp': // сравнивает значения двух ячеек. Если они равны, возвращает 0, если нет, возвращает 1. Результат записывается в третью ячейку. 
            if (mem[mem[ip + 1]] == mem[mem[ip + 2]])
                
                mem[mem[ip + 3]] = 0;
            else
                mem[mem[ip + 3]] = 1;
            ip += 4;
            break;

        case 'cmpm': // сравнивает значения двух ячеек. Если значение перовой больше значения втторой, возвращает 0, если нет, возвращает 1. Результат записывает в третью
            if (mem[mem[ip + 1]] > mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 0;
            else
                mem[mem[ip + 3]] = 1;
            ip += 4;
            break;

        case 'jmp':
            ip = parseFloat(mem[ip + 1]);
            break;

        case 'jz':
            if (mem[mem[ip+1]] == 0)
                ip = parseFloat(mem[ip + 2]);
            else
                ip += 3;
            break;

        case 'jnz':
            if (mem[mem[ip + 1]] != 0)
                ip = parseFloat(mem[ip + 2]);
            else
                ip += 3;
            break;

        case 'copy':
            mem[[mem[ip + 2]]] = mem[[mem[ip + 1]]];
            ip += 3;
            break;

        case 'out':
            console.log(mem[mem[ip + 1]]);
            ip += 2;
            break;

        case 'exit':
            flag = false;
            break;

        default:
            console.log('Syntax error!');
            flag = false;
    }
}