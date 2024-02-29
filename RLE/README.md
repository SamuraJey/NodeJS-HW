# Run-Length Encoding (RLE) с использованием символа Escape

`RLE_Escape.js` - это скрипт на JavaScript, который реализует алгоритм сжатия данных Run-Length Encoding (RLE) с использованием символа Escape.

## Описание

RLE - это простой алгоритм сжатия данных, который сжимает повторяющиеся символы в строке. Например, строка `"AAAABBBCC"` будет сжата как `"A4B3C2"`. В этом скрипте используется символ Escape (`#`), чтобы указать на начало сжатого блока.

## Использование

```javascript
const RLE = require('./RLE_Escape.js');

let compressed = RLE.compress("AAAABBBCC");
console.log(compressed); // Вывод: "#A4#B3#C2"

let decompressed = RLE.decompress(compressed);
console.log(decompressed); // Вывод: "AAAABBBCC"
```

## Использование
```
node RLE_Escape.js <mode> <input_file_path> <output_filepath>
```
Возможные режимы --encode \ -e и --decode \ -d

## Примечания

- Если входная строка содержит символ Escape (`#`), он будет заменен на двойной символ Escape (`##`) в сжатой строке.