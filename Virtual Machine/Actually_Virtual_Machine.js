/*
Пример запуска программы
  1               2                 3
node Actually_Virtual_Machine.js nod.sasm
1) говорим терминалу что запускать надо через nodejs
2) говорим где лежит файл со скриптом
3) говорим где лежит файл с кодом на sASM
*/

const fs = require('fs'); // Node.js модуль файловой системы позволяет вам работать с файловой системой на вашем компьютере.
let arg = process.argv; // Переменная в которую попадут аргументы введенные пользователя
const readsync = require('readline-sync'); // требуем наличие модуля readline-sync для ввода данных с консоли

let mem = []; // создаем массив для хранения инструкций и данных по Фон-Нейману (Принстонская архитектура)
let ip = 0; // положение инстракшен поинтер
let flag = true; // булевый флаг для цикла while
inputFilename = arg[2].toString()


const commands =
{
    'inp': '0000',
    'set': '0001',
    'add': '0010',
    'sub': '0011',
    'mul': '0100',
    'div': '0101',
    'cmp': '0110',
    'cmpm': '0111',
    'jmp': '1000',
    'jz': '1001',
    'jnz': '1010',
    'copy': '1011',
    'out': '1100',
    'exit': '1111',
};

if (!(fs.existsSync(inputFilename))) // Проверяем, существует ли входной файл
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }

let inputCode = fs.readFileSync(arg[2]).toString(); //из аргументов пользователя берем второй, переводим его в строку - это имя файла в котором должны лежать инструкции на нашем ЯП
mem = inputCode.split(/\s+/); // записываем в mem инструкции из файла разделяя их по любым пробелам (табы, новые линии в т.ч.) 

while (flag) // начало цикла
{
    
    switch(commands[mem[ip]])
    {
        case '0000': //инстуркция инпут записывает в указанную ячейку ввод с клаивиатуры
            let number = readsync.question('Enter number: ')
            if (isNaN(number)) // защита от ввода не числа
            {
                console.log('Error: Not a Number');
                break;
            }
            mem[mem[ip + 1]] = parseInt(number); // преобразуем введенное пользователем во число и записываем в ячейку
            ip += 2; // ip +2 потому что инструкция состоит из 2 "слов" input и №ячейки
            break;

        case '0001':
            mem[mem[ip + 1]] = parseInt(mem[ip+2]); // mem[mem[ip + 1]] - ячейка в которую записываем значение, mem[ip+2] - значение которое записываем
            ip += 3;
            break;

        case '0010':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]] // mem[mem[ip + 3]] - ячейка в которую записываем значение, mem[mem[ip + 1]] - первое слагаемое, mem[mem[ip + 2]] - второе слагаемое
            ip += 4; // то есть мем в меме это значение индекса
            break;

        case '0011':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] - mem[mem[ip + 2]]
            ip += 4;
            break;

        case '0100':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]]
            ip += 4;
            break;

        case '0101':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] / mem[mem[ip + 2]]
            ip += 4;
            break;

        case '0110': // сравнивает значения двух ячеек. Если они равны, возвращает 0, если нет, возвращает 1. Результат записывается в третью ячейку. 
            if (mem[mem[ip + 1]] == mem[mem[ip + 2]])
                
                mem[mem[ip + 3]] = 0;
            else
                mem[mem[ip + 3]] = 1;
            ip += 4;
            break;

        case '0111': // сравнивает значения двух ячеек. Если значение перовой больше значения втторой, возвращает 0, если нет, возвращает 1. Результат записывает в третью
            if (mem[mem[ip + 1]] > mem[mem[ip + 2]])
                mem[mem[ip + 3]] = 0;
            else
                mem[mem[ip + 3]] = 1;
            ip += 4;
            break;

        case '1000':
            ip = parseInt(mem[ip + 1]);
            break;

        case '1001':
            if (mem[mem[ip+1]] == 0)
                ip = parseInt(mem[ip + 2]);
            else
                ip += 3;
            break;

        case '1010':
            if (mem[mem[ip + 1]] != 0)
                ip = parseInt(mem[ip + 2]);
            else
                ip += 3;
            break;

        case '1011':
            mem[[mem[ip + 2]]] = mem[[mem[ip + 1]]];
            ip += 3;
            break;

        case '1100':
            console.log(mem[mem[ip + 1]]);
            ip += 2;
            break;

        case '1111':
            flag = false;
            break;

        default:
            console.log('Syntax error!');
            flag = false;
    }
}