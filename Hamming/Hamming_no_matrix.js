//кажется ну почти готово, осталось только сделать что бы оно работало с дополнительным битом четности

const [mode, inputText1, inputText2] = process.argv.slice(2);
//console.log(`mode ${mode} inputText1 ${inputText1} inputText2 ${inputText2}`);

const syndromeErrorPosMap = 
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
  

function encodeHamming(msg)
{   
    // формат сообщения d1, d2, d3, d4, p1, p2, p3, p4
    const y1 = msg[0];
    const y2 = msg[1];
    const y3 = msg[2];
    const y4 = msg[3];
    const y5 = msg[0] ^ msg[1] ^ msg[2];
    const y6 = msg[1] ^ msg[2] ^ msg[3];
    const y7 = msg[0] ^ msg[1] ^ msg[3];
    const y8 = (parseInt(y1) + parseInt(y2) + parseInt(y3) + parseInt(y4) + parseInt(y5) + parseInt(y6) + parseInt(y7)) % 2;
    //const y8 = (y1 + y2 + y3 + y4 + y5 + y6 + y7) % 2;
    //console.log(`y1 ${y1} y2 ${y2} y3 ${y3} y4 ${y4} y5 ${y5} y6 ${y6} y7 ${y7}`);
    //console.log(`y8 ${y8}`);

    return y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8;
}

/*
function decodeHamming(msg)
{
    const y1 = msg[0];
    const y2 = msg[1];
    const y3 = msg[2];
    const y4 = msg[3];
    const y5 = msg[4];
    const y6 = msg[5];
    const y7 = msg[6];
    const y8 = msg[7];

    const s1 = y1 ^ y2 ^ y3 ^ y5;
    const s2 = y2 ^ y3 ^ y4 ^ y6;
    const s3 = y1 ^ y2 ^ y4 ^ y7;
    const s4 = (parseInt(y1) + parseInt(y2) + parseInt(y3) + parseInt(y4) + parseInt(y5) + parseInt(y6) + parseInt(y7) + parseInt(y8)) % 2;
    //const s4 = y1 ^ y2 ^ y3 ^ y4 ^ y5 ^ y6 ^ y7;
    const s = s4.toString() + s1.toString() + s2.toString() + s3.toString();
    syndrome = s1.toString() + s2.toString() + s3.toString();
    console.log("y1 " + y1 + " y2 " + y2 + " y3 " + y3 + " y4 " + y4 + " y5 " + y5 + " y6 " + y6 + " y7 " + y7 + " y8 " + y8);
    console.log(`s4 ${s4}`);
    if (s4 == 0)
    {
        //надо проверить синдром для 7 битного кода
    }

    switch(s.slice(1, 3))
    {
        case '000':
            console.log(`no error`);
            console.log(`s ${s}`);
            let dcd = y1.toString() + y2.toString() + y3.toString() + y4.toString();
            let corrected = y1 + y2 + y3 + y4 + y5 + y6 + y7;
            return `Original message: ${dcd}\nCorrected Hamming code: ${corrected}`;

        case '1101':
            console.log(`error in first bit y1`);
            console.log(`s ${s}`);
            let dcd1 = (y1 ^ 1).toString() + y2.toString() + y3.toString() + y4.toString();
            let corrected1 = (y1 ^ 1).toString() + y2.toString() + y3.toString() + y4.toString() + y5.toString() + y6.toString() + y7.toString();
            //let dcd1 = y1 ^ 1 + y2 + y3 + y4;
            //let corrected1 = y1 ^ 1 + y2 + y3 + y4 + y5 + y6 + y7;
            return `Original message: ${dcd1}\nCorrected Hamming code: ${corrected1}`;

        case "1111":
            console.log(`error in second bit y2`);
            console.log(`s ${s}`);
            let dcd2 = y1.toString() + (y2 ^ 1).toString() + y3.toString() + y4.toString();
            let corrected2 = y1.toString() + (y2 ^ 1).toString() + y3.toString() + y4.toString() + y5.toString() + y6.toString() + y7.toString();
            //let dcd2 = y1 + y2 ^ 1 + y3 + y4;
            //let corrected2 = y1 + y2 ^ 1 + y3 + y4 + y5 + y6 + y7;
            return `Original message: ${dcd2}\nCorrected Hamming code: ${corrected2}`;

        case "1110":
            console.log(`error in third bit y3`);
            console.log(`s ${s}`);
            let dcd3 = y1.toString() + y2.toString() + (y3 ^ 1).toString() + y4.toString();
            //let dcd3 = y1 + y2 + y3 ^ 1 + y4;
            let corrected3 = y1.toString() + y2.toString() + (y3 ^ 1).toString() + y4.toString() + y5.toString() + y6.toString() + y7.toString();
            //let corrected3 = y1 + y2 + y3 ^ 1 + y4 + y5 + y6 + y7;
            return `Original message: ${dcd3}\nCorrected Hamming code: ${corrected3}`;

        case "1011":
            console.log(`error in fourth bit y4`);
            console.log(`s ${s}`);
            let dcd4 = y1.toString() + y2.toString() + y3.toString() + (y4 ^ 1).toString();
            let corrected4 = y1.toString() + y2.toString() + y3.toString() + (y4 ^ 1).toString() + y5.toString() + y6.toString() + y7.toString();
            //let dcd4 = y1 + y2 + y3 + y4 ^ 1;
            //let corrected4 = y1 + y2 + y3 + y4 ^ 1 + y5 + y6 + y7;
            return `Original message: ${dcd4}\nCorrected Hamming code: ${corrected4}`;

        case "1100":
            console.log(`error in fifth bit y5`);
            console.log(`s ${s}`);
            let dcd5 = y1.toString() + y2.toString() + y3.toString() + y4.toString();
            let corrected5 = y1.toString() + y2.toString() + y3.toString() + y4.toString() + (y5 ^ 1).toString() + y6.toString() + y7.toString();
            //let dcd5 = y1 + y2 + y3 + y4;
            //let corrected5 = y1 + y2 + y3 + y4 + y5 ^ 1 + y6 + y7;
            return `Original message: ${dcd5}\nCorrected Hamming code: ${corrected5}`;

        case "1010":
            console.log(`s ${s}`);
            console.log(`error in sixth bit y6`);
            let dcd6 = y1.toString() + y2.toString() + y3.toString() + y4.toString();
            let corrected6 = y1.toString() + y2.toString() + y3.toString() + y4.toString() + y5.toString() + (y6 ^ 1).toString() + y7.toString();
            //let dcd6 = y1 + y2 + y3 + y4;
            //let corrected6 = y1 + y2 + y3 + y4 + y5 + y6 ^ 1 + y7;
            return `Original message: ${dcd6}\nCorrected Hamming code: ${corrected6}`;

        case "1001":
            console.log(`s ${s}`);
            console.log(`error in seventh bit y7`);
            let dcd7 = y1.toString() + y2.toString() + y3.toString() + y4.toString();
            let corrected7 = y1.toString() + y2.toString() + y3.toString() + y4.toString() + y5.toString() + y6.toString() + (y7 ^ 1).toString();
            //let dcd7 = y1 + y2 + y3 + y4;
            //let corrected7 = y1 + y2 + y3 + y4 + y5 + y6 + y7 ^ 1;
            return `Original message: ${dcd7}\nCorrected Hamming code: ${corrected7}`;
    }

}
*/

function findSyndrome(inp) // счиатем синдром для 7-битного кода
{
    let y1 = inp[0];
    let y2 = inp[1];
    let y3 = inp[2];
    let y4 = inp[3];
    let y5 = inp[4];
    let y6 = inp[5];
    let y7 = inp[6];

    let s1 = y1 ^ y2 ^ y3 ^ y5;
    let s2 = y2 ^ y3 ^ y4 ^ y6;
    let s3 = y1 ^ y2 ^ y4 ^ y7;
    let s = s1.toString() + s2.toString() + s3.toString();
    return s;
}

function correctSmh(stroka)
{
    let y1 = stroka[0];
    let y2 = stroka[1];
    let y3 = stroka[2];
    let y4 = stroka[3];
    let y5 = stroka[4];
    let y6 = stroka[5];
    let y7 = stroka[6];
    let y8 = stroka[7];
    let result = {};
    let res_stroka = "";

    let s0 = (parseInt(y1) + parseInt(y2) + parseInt(y3) + parseInt(y4) + parseInt(y5) + parseInt(y6) + parseInt(y7) + parseInt(y8)) % 2;
    //let s0 = (stroka[0] + stroka [1] + stroka[2] + stroka [3] + stroka[4] + stroka [5] + stroka[6] + stroka[7]) % 2;
    //console.log(`storka[0] ${stroka[0]} storka[1] ${stroka[1]} storka[2] ${stroka[2]} storka[3] ${stroka[3]} storka[4] ${stroka[4]} storka[5] ${stroka[5]} storka[6] ${stroka[6]} storka[7] ${stroka[7]}`);
    //console.log(`s0 ${s0}`);
    if (s0 == "0" && findSyndrome(stroka) == "000")
    {
        result = 
            {
                errorBitNum: null,
                notCorrectedCode: stroka,
                correctedCode: stroka,
                decoded: stroka.substr(0, 4)
            };
            return result;
        /*
        console.log("No error");
        console.log(`Not corrected hamming code ${stroka}`);
        console.log(`Corrected hamming code ${stroka}`);
        return stroka;
        */
    }
    else if (s0 == "1")
    {
        var errorPos = syndromeErrorPosMap[findSyndrome(stroka)] - 1;
        if (errorPos == -1)
        {
            res_stroka = stroka.substr(0, 7) + (stroka[7] ^ 1).toString() + stroka.substr(7 + 1);
            result = 
            {
                errorBitNum: 8,
                notCorrectedCode: stroka,
                correctedCode: res_stroka,
                decoded: res_stroka.substr(0, 4)
            };

            /*
            console.log(`Error in eighth bit y8`);
            console.log(`not corrected Hamming code: ${stroka}`);
            stroka = stroka.substr(0, 7) + (stroka[7] ^ 1).toString() + stroka.substr(7 + 1);
            console.log(`Corrected Hamming code: ${stroka}`);
            */
            return result;
        }

        
        res_stroka = stroka.substr(0, errorPos) + (stroka[errorPos] ^ 1).toString() + stroka.substr(errorPos + 1);
        result =
        {
            errorBitNum: errorPos + 1,
            notCorrectedCode: stroka,
            correctedCode: res_stroka,
            decoded: res_stroka.substr(0, 4)
        };
        stroka = res_stroka;
        /*
        console.log(`Error in ${errorPos + 1} bit`);
        console.log(`not corrected Hamming code: ${stroka}`);
        stroka = stroka.substr(0, errorPos) + (stroka[errorPos] ^ 1).toString() + stroka.substr(errorPos + 1);
        console.log(`Corrected Hamming code: ${stroka}`);
        */
        let s00 = (parseInt(stroka[0]) + parseInt(stroka[1]) + parseInt(stroka[2]) + parseInt(stroka[3]) + parseInt(stroka[4]) + parseInt(stroka[5]) + parseInt(stroka[6])) % 2;
        //console.log(`storka[0] ${stroka[0]} storka[1] ${stroka[1]} storka[2] ${stroka[2]} storka[3] ${stroka[3]} storka[4] ${stroka[4]} storka[5] ${stroka[5]} storka[6] ${stroka[6]} storka[7] ${stroka[7]}`);
        //console.log(`s00 ${s00}`);
        if (s00 != stroka[7])
        {
            res_stroka = stroka.substr(0, 7) + (stroka[7] ^ 1).toString() + stroka.substr(7 + 1);

            result =
            {
                errorBitNum: 8,
                notCorrectedCode: stroka,
                correctedCode: res_stroka,
                decoded: res_stroka.substr(0, 4)
            };
            /*
            console.log(`Error in eighth bit y8`);
            console.log(`not corrected Hamming code: ${stroka}`);
            stroka = stroka.substr(0, 7) + (stroka[7] ^ 1).toString() + stroka.substr(7 + 1);
            console.log(`Corrected Hamming code: ${stroka}`);
            console.log("VIPOLNYAETSYA");
            return stroka;
            */
           return result;
        }
        return result;
    }
    else
    {
        if (s0 == 0 && findSyndrome(stroka) != "000")
        {
            //console.log("Double error, can't correct");
            return "Double error, can't correct";
        }
    }
}


//console.log(correctSmh('11000100')); // no error 11000101 11000101
//return;
function flipRandomChar(str)
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
for (let i = 0; i < 16; i++)
{
    
    //console.log(correctSmh(arr[i]));
    //console.log();
    
    console.log(correctSmh(flipRandomChar(arr[i])));
    
}

function test() 
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
console.log(correctSmh('00000101')); // 2 errors in 1th and 2th bits
console.log();
console.log(correctSmh('00000000')); // no errors but zeroes
}
//test()
return;

if (mode !== "-e" && mode !== "-c")
{
    const errorMessage = `Invalid mode: ${mode}\nUse -e for encoding or -c for decoding`;
    console.error(errorMessage);
    throw new Error(errorMessage);
}
  
if (mode === "-e")
{
    console.log(`Encoding ${inputText1}`);
    console.log(`Hamming code: ${encodeHamming(inputText1)}`);
}
if (mode === "-c")
{
    console.log(`Correcting ${inputText1}`);
    console.log(`Original message: ${correctSmh(inputText1)}`);
}







function variousTest3()
{
    var cnt = 0;
    cnt += 1;
    const received = "11011011"; // 11011010
    const corrected = correctSmh(received);
    const expected = "11010010"; // 11010010
    console.log(corrected === expected); // true
    console.log("cnt " + cnt);

}

function variousTest5()
{
    const received = "00000000";
    const corrected = correctSmh(received);
    const expected = "00000000";
    console.log(corrected === expected); // true
}

//variousTest1();
//variousTest2();
//variousTest3();
//variousTest4();
//variousTest5();

