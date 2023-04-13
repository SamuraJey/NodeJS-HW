// Based on: https://spravochnick.ru/informatika/kod_hemminga/
// http://phg.su/basis2/X160.HTM
// http://opds.spbsut.ru/data/_uploaded/mu/motpuk-lect-05.pdf


const [mode, inputText1, inputText2] = process.argv.slice(2);

const syndromeErrorPosMap = // таблица синдромов для 7-битного кода
{
    '000': 0,
    '101' : 1,
    '111' : 2,
    '110' : 3,
    '011' : 4,
    '100' : 5,
    '010' : 6,
    '001' : 7,
};

const validModes = ["-e", "--encode", "-c", "--correct", "-tc", "--test-correct", "-te", "--test-encode", "--help", "-h", ]; // допустимые режимы работы программы

function encodeHamming(msg) // кодирование сообщения по алгоритму Хэмминга (8,4)
{   
    // формат сообщения d1, d2, d3, d4, p1, p2, p3, p4
    const [y1, y2, y3, y4] = msg.toString(); // берём 4 бита данных
    const y5 = (y1 ^ y2 ^ y3).toString(); // вычисляем первый бит чётности по формуле p1 = d1 + d2 + d3
    const y6 = (y2 ^ y3 ^ y4).toString(); // вычисляем второй бит чётности по формуле p2 = d2 + d3 + d4
    const y7 = (y1 ^ y2 ^ y4).toString(); // вычисляем третий бит чётности по формуле p3 = d1 + d2 + d4

    const y8 = ((parseInt(y1) + parseInt(y2) + parseInt(y3) + parseInt(y4) + parseInt(y5) + parseInt(y6) + parseInt(y7)) % 2).toString(); // вычисляем четвёртый бит чётности по формуле p4 = d1 + d2 + d3 + d4 + p1 + p2 + p3
    return (y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8).toString();
}

function findSyndrome(inp) // счиатем синдром для 7-битного кода
{
    const [y1, y2, y3, y4, y5, y6, y7] = inp.toString();
    let s1 = y1 ^ y2 ^ y3 ^ y5; // вычисляем первый бит синдрома по формуле s1 = d1 + d2 + d3 + p1
    let s2 = y2 ^ y3 ^ y4 ^ y6; // вычисляем второй бит синдрома по формуле s2 = d2 + d3 + d4 + p2
    let s3 = y1 ^ y2 ^ y4 ^ y7; // вычисляем третий бит синдрома по формуле s3 = d1 + d2 + d4 + p3
    let s = s1.toString() + s2.toString() + s3.toString();
    return s;
}

function correctHamming(message)
{
    const [y1, y2, y3, y4, y5, y6, y7, y8] = message.toString();

    let result =
    {
        errorBitNum: null,
        notCorrectedCode: null,
        correctedCode: null,
        decoded: null
    };

    let res_stroka = "";

    let s0 = (parseInt(y1) + parseInt(y2) + parseInt(y3) + parseInt(y4) + parseInt(y5) + parseInt(y6) + parseInt(y7) + parseInt(y8)) % 2; // вычисляем четвёртый бит чётности по формуле p4 = d1 + d2 + d3 + d4 + p1 + p2 + p3
    
    if (s0 == "0" && findSyndrome(message) == "000") // если синдром равен 000 и четвёртый бит чётности равен 0, то код корректен
    {
        result = 
            {
                errorBitNum: -1,
                notCorrectedCode: message,
                correctedCode: message,
                decoded: message.slice(0, 4)
            };
            return result;
    }
    else if (s0 == "1") // если четвёртый бит чётности равен 1, то код, возможно, некорректен
    {
        var errorPos = syndromeErrorPosMap[findSyndrome(message)] - 1; // находим позицию ошибочного бита по синдрому
        if (errorPos == -1) // синдром = 000, то errorPos = -1, значит код корректен
        {
            res_stroka = message.slice(0, 7) + (message[7] ^ 1).toString() + message.slice(7 + 1);
            result = 
            {
                errorBitNum: 8,
                notCorrectedCode: message,
                correctedCode: res_stroka,
                decoded: res_stroka.slice(0, 4)
            };
            return result;
        }

        res_stroka = message.slice(0, errorPos) + (message[errorPos] ^ 1).toString() + message.slice(errorPos + 1); // записываем исправленую строку если errorpos != -1
        result =
        {
            errorBitNum: errorPos + 1,
            notCorrectedCode: message,
            correctedCode: res_stroka,
            decoded: res_stroka.slice(0, 4)
        };
        message = res_stroka;
        let s00 = (parseInt(message[0]) + parseInt(message[1]) + parseInt(message[2]) + parseInt(message[3]) + parseInt(message[4]) + parseInt(message[5]) + parseInt(message[6])) % 2; // вычисляем четвёртый бит чётности для "исправленной строки" по формуле p4 = d1 + d2 + d3 + d4 + p1 + p2 + p3
        if (s00 != message[7]) // если вычисленный четвёртый бит чётности не равен четвёртому биту чётности в "исправленной строке", то код имеет ошибку в p4
        {
            res_stroka = message.slice(0, 7) + (message[7] ^ 1).toString() + message.slice(7 + 1);
            
            result =
            {
                errorBitNum: 8,
                notCorrectedCode: message,
                correctedCode: res_stroka,
                decoded: res_stroka.slice(0, 4)
            };
            //console.log(result);
           return result;
        }
        return result;
    }
    else
    {
        if (s0 == 0 && findSyndrome(message) != "000") // если четвёртый бит чётности равен 0, а синдром не равен 000, то код имеет две ошибки
        {
            //console.log("Double error, can't correct1111111");
            result =
            {
                errorBitNum: null,
                notCorrectedCode: message,
                correctedCode: "Double error, can't correct",
                decoded: "Double error, can't correct"
            };
            console.log(result.correctedCode);
            return result;
        }
    }
}

function corruptRandomBit(str)
{
    // Преобразуем строку в массив символов
    let chars = str.split("");
    
    // Генерируем случайный индекс в диапазоне от 0 до (длины строки - 1)
    let randomIndex = Math.floor(Math.random() * chars.length);
    
    // Меняем символ на противоположный, используя тернарный оператор
    chars[randomIndex] = chars[randomIndex] === "0" ? "1" : "0";
    
    // Преобразуем массив символов обратно в строку и возвращаем ее
    return chars.join("");
}
  

let arr = ["00000000", "10001011", "01001110", "11000101", "00101101", "10100110", "01100011", "11101000", "00010111", "10011100", "01011001", "11010010", "00111010", "10110001", "01110100", "11111111"];
let arr2 = ["0000", "1000", "0100", "1100", "0010", "1010", "0110", "1110", "0001", "1001", "0101", "1101", "0011", "1011", "0111", "1111"];
function testCorrection2()
{
    console.log("start testCorrection2");
    console.log();
    for (let i = 0; i < 16; i++)
    {

        let check = correctHamming(corruptRandomBit(corruptRandomBit(arr[i])))
        console.log(check.notCorrectedCode);
        console.log();
        console.log(`original arr[${i}] = ${arr[i]}`)
        console.log(`not corrected code = ${check.notCorrectedCode}`);
        console.log(`error in bit ${check.errorBitNum}`);
        console.log(`corrected code = ${check.correctedCode}`);
        console.log();
        /*
        //console.log(correctSmh(arr[i]));
        //console.log();
        console.log(`original arr[${i}] = ${arr[i]}`)
        //console.log(correctSmh(corruptRandomBit(arr[i])));
        console.log(correctHamming(corruptRandomBit(corruptRandomBit(arr[i]))));
        console.log();
        */
    } 
    console.log();
    console.log("end testCorrection2");
}
function testCorrection1()
{
    console.log("start testCorrection1");
    for (let i = 0; i < 16; i++)
    {
        let check = correctHamming(corruptRandomBit(arr[i]))
        console.log(`original arr[${i}] = ${arr[i]}`)
        console.log(`not corrected code = ${check.notCorrectedCode}`);
        console.log(`error in bit ${check.errorBitNum}`);
        console.log(`corrected code = ${check.correctedCode}`);
        console.log(check.correctedCode == arr[i] ? "OK" : "ERROR");
        //console.log(correctHamming(corruptRandomBit(arr[i])));
        console.log();
    } 
    console.log();
    console.log("end testCorrection1");
}
//testCorrection();

function testEncoding()
{
    console.log("start testEncoding");
    for (let i = 0; i < 16; i++)
    {
        if (encodeHamming(arr2[i]) == arr[i])
        {
            console.log("OK");
        }
        else
        {
            console.log("ERROR");
        }
    }
    console.log(`end testEncoding`);
}

if (mode.toLowerCase() == "-te" || mode.toLowerCase() == "--test-encoding")
{
    testEncoding();
    return;
}

if (mode.toLowerCase() == "-tc" || mode.toLowerCase() == "--test-correction")
{
    if (inputText1 == "1")
    {
        console.log("testCorrection with 1 bit error started");
        testCorrection1();
    }
    else if (inputText1 == "2")
    {
        console.log("testCorrection with 2 bit error started");
        testCorrection2();
    }
    return;
}

if (!validModes.includes(mode.toLowerCase())) // Проверка на то, что введенный режим является одним из допустимых. Если нет, то возвращает true и выполняется код внутри if
{
    const errorMessage = `\x1b[31mInvalid mode: ${mode.toLowerCase()}\nUse -h or --help for instructions\x1b[0m`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}

if (mode.toLowerCase() === "-h" || mode.toLowerCase() === "--help")
{
    console.log(`\x1b[32mHamming code encoder/decoder(correcter)\x1b[0m`);
    console.log(`Note: it uses (8,4) Hamming code (4 data bits, 4 parity bits) with 1-bit error correction and 2-bit error detection`);
    console.log(`Usage:\x1b[32m node hamming.js [mode] [input]\x1b[0m`);
    console.log();
    console.log(`Modes:`);
    console.log(`\x1b[32m-h, --help\x1b[0m             — show this message`);
    console.log(`\x1b[32m-e, --encode\x1b[0m           — encode input`);
    console.log(`\x1b[32m-d, --decode\x1b[0m           — decode input`);
    console.log(`\x1b[32m-tc, --test-correction\x1b[0m — test correction`);
    console.log(`\x1b[32m-te, --test-encoding\x1b[0m   — test encoding`);
    console.log();
    console.log(`Example: \x1b[32mnode hamming.js -e 1010\x1b[0m`);
    return;
}

if (mode.toLowerCase() === "-e" || mode.toLowerCase() === "--encode")
{
    
    if (inputText1.length != 4)
    {
        errorMessage = `\x1b[31mWrong lenght given. Recived ${inputText1.length}, should be 4\x1b[0m`;
        throw new Error(errorMessage);
    }

    if (inputText1.match(/[^01]/g)) // Проверка на то, что в строке отсутсвуют символы, отличные от 0 и 1. Если есть, то возвращает true и выполняется код внутри if
    {
        errorMessage = `\x1b[31mWrong input. Only 1 and 0 allowed\x1b[0m`;
        throw new Error(errorMessage);
    }

    console.log(`Encoding ${inputText1}`);
    console.log(`Hamming code: ${encodeHamming(inputText1)}`);
}

if (mode.toLowerCase() === "-c" || mode.toLowerCase() === "--correct")
{
    if (inputText1.length != 8)
    {
        errorMessage = `\x1b[31mWrong lenght given. Recived ${inputText1.length}, should be 8\x1b[0m`;
        throw new Error(errorMessage);
    }

    if (inputText1.match(/[^01]/g)) // Проверка на то, что в строке отсутсвуют символы, отличные от 0 и 1. Если есть, то возвращает true и выполняется код внутри if
    {
        errorMessage = `\x1b[31mWrong input. Only 1 and 0 chars allowed\x1b[0m`;
        throw new Error(errorMessage);
    }

    console.log(`Correcting:\x1b[31m ${inputText1} \x1b[0m`);

    if (correctHamming(inputText1).errorBitNum == -1) 
    {
        console.log(`No errors found in: \x1b[32m${inputText1}\x1b[0m`);
        return;
    }
    else if(correctHamming(inputText1).errorBitNum == null)
    {
        console.log(`\x1b[31mDouble error, can't correct\x1b[0m`);
        return;
    }
    else
    {
        console.log(`Original message was: \x1b[32m${correctHamming(inputText1).correctedCode}\x1b[0m\nError was in \x1b[31m${correctHamming(inputText1).errorBitNum}\x1b[0m bit\nDecoded message is: \x1b[32m${correctHamming(inputText1).decoded}\x1b[0m`);
    }
}

/*
old test
function test1() 
{
console.log(correctSmh('11000101')); // no error
console.log();
console.log(correctSmh('01000101')); // error in 1th bit
console.log();
console.log(correctSmh('10000101')); // error in 2th bit
console.log();
console.log(correctSmh('11100101')); // error in 3th bit
console.log();
console.log(correctSmh('11010101')); // error in 4th bit
console.log();
console.log(correctSmh('11001101')); // error in 5th bit
console.log();
console.log(correctSmh('11000001')); // error in 6th bit
console.log();
console.log(correctSmh('11000111')); // error in 7th bit
console.log();
console.log(correctSmh('11000100')); // error in 8th bit
console.log();
console.log(correctSmh('00000101')); // 2 errors in 1th and 2th bits, should be 11000101
console.log();
console.log(correctSmh('00000000')); // no errors but zeroes
}
test1();
*/