function compressRLE(input)
{
    let compressed = '';
    let count = 1;
    let isReshetka = false;

    for (let i = 0; i < input.length; i++)
    {
        if (input[i] === '#')
        {
            isReshetka = true;
        }
        if (input[i] === input[i + 1])
        {
            count++;
        }
        else
        {
            if (isReshetka)
            {
                if (count > 32001)
                {
                    let remainingLength = count - 32000;
                    while (remainingLength > 0)
                    {
                        let chunkLength = Math.min(remainingLength, 32000);
                        compressed += `#${String.fromCharCode(32000)}${inputText[i]}`;
                        remainingLength -= chunkLength;
                    }
                }
                compressed += `#${count}#`;
                isReshetka = false;
            }
            else
            {
                if (count >= 4)
                {
                    if (count > 32001)
                    {
                        let remainingLength = count - 32000;
                        while (remainingLength > 0)
                        {
                            let chunkLength = Math.min(remainingLength, 32000);
                            compressed += `#${String.fromCharCode(32000)}${inputText[i]}`;
                            remainingLength -= chunkLength;
                        }
                    }
                    compressed += `#${count}${input[i]}`;
                }
                else
                {
                    compressed += input[i].repeat(count);
                }
            }
            count = 1;
        }
    }
    return compressed;
}

function decompressRLE(input)
{
    let decompressed = '';
    let count = 1;
    let howMany = 0;
    let char = '';
    let intcounter = 0;
    let intStr = '';

    for (let i = 0; i < input.length; i++)
    {
        console.log("i ", i);
        if (input[i] === '#' && i + 1 < input.length)
        {
            let idx = i + 1;
            while (Number.isInteger(Number(input[idx])))
            {
                intStr += input[idx];
                intcounter++;
                idx++;
            }
            console.log("intStr " + intStr);
            //console.log("ibwe" + intcounter);
            howMany = Number(intStr);
            console.log("howMany " + howMany);
            char = input[idx];
            console.log("char " + char);
            decompressed += char.repeat(howMany);
            i += Number(String(howMany).length + 1);
            intStr = '';
            intcounter = 0;
        }
        else
        {
            decompressed += input[i];
        }

    }
    console.log(decompressed);
}

  

  

// Пример использования
const input = 'AAAA##B#';
let compressedOutput = compressRLE(input);
compressedOutput = "#10A#2B#2#"
console.log(compressedOutput); // Выводит: #4A#2#B#1# #4A#2#B#1# 
decompressRLE(compressedOutput);


/*

          let encodedSequence = `#${String.fromCharCode(sequenceLength - 4)}${inputText[i]}`;
          if (sequenceLength > 65534) // Если длина последовательности больше 65534 символов, разбиваем ее на блоки
          {
              let remainingLength = sequenceLength - 65532;
              while (remainingLength > 0)
              {
              let chunkLength = Math.min(remainingLength, 65532);
              encodedSequence += `#${String.fromCharCode(65532)}${inputText[i]}`;
              remainingLength -= chunkLength;
              }
          }
          */
