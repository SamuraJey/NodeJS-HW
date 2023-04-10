const [mode, inputText1, inputText2] = process.argv.slice(2);

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

    return y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8;
}

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
        let s00 = (parseInt(stroka[0]) + parseInt(stroka[1]) + parseInt(stroka[2]) + parseInt(stroka[3]) + parseInt(stroka[4]) + parseInt(stroka[5]) + parseInt(stroka[6])) % 2;
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