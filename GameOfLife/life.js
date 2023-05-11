// Получаем ссылку на элементы DOM
const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');

const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
let cellStates = createEmptyGrid(rows, cols);
let generationCount = 0; // Счетчик поколений
let liveCellCount = 0; // Счетчик живых клеток
drawGrid();

let isRunning = false;

// Функция создания пустой сетки
function createEmptyGrid(rows, cols)
{
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++)
    {
        grid[i] = new Array(cols).fill(false);
    }
    return grid;
}

// Функция отрисовки сетки на канвасе
function drawGrid()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (cellStates[row][col])
            {
                ctx.fillStyle = 'black';
                ctx.fill();
            }
            else
            {
                ctx.strokeStyle = '#aaa';
                ctx.stroke();
            }
        }
    }
    // Обновляем счетчики на странице
    const generationCountElement = document.querySelector('#generationCount');
    generationCountElement.textContent = `Поколение: ${generationCount}`;

    const liveCellCountElement = document.querySelector('#liveCellCount');
    liveCellCountElement.textContent = `Живые клетки: ${liveCellCount}`;
}

// Функция обновления состояния клеток
function updateCells()
{
    const newCellStates = createEmptyGrid(rows, cols);

    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            const neighbors = countNeighbors(row, col);

            if (cellStates[row][col])
            {
                // Клетка жива
                if (neighbors === 2 || neighbors === 3)
                {
                    newCellStates[row][col] = true; // Клетка остается живой
                }
            }
            else
            {
                // Клетка мертва
                if (neighbors === 3)
                {
                    newCellStates[row][col] = true; // Клетка оживает
                }
            }
        }
    }
    // Обновляем счетчик поколений
    generationCount++;
    const generationCountElement = document.querySelector('#generationCount');
    generationCountElement.textContent = `Поколение: ${generationCount}`;

    // Обновляем счетчик живых клеток
    liveCellCount = 0;
    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            if (cellStates[row][col])
            {
                liveCellCount++;
            }
        }
    }
    const liveCellCountElement = document.querySelector('#liveCellCount');
    liveCellCountElement.textContent = `Живые клетки: ${liveCellCount}`;

    cellStates.splice(0, cellStates.length, ...newCellStates);
}

// Функция подсчета количества соседей для клетки
function countNeighbors(row, col)
{
    let count = 0;
    // Проверяем восемь соседних клеток
    const neighbors = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];

    for (const [dx, dy] of neighbors)
    {
        let newRow = row + dy;
        let newCol = col + dx;

        // Обработка зацикливания клеток при достижении границ поля
        if (newRow < 0) newRow = rows - 1;
        if (newRow >= rows) newRow = 0;
        if (newCol < 0) newCol = cols - 1;
        if (newCol >= cols) newCol = 0;

        if (cellStates[newRow][newCol])
        {
            count++;
        }
    }

    return count;
}

function randomizeCells()
{
    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            cellStates[row][col] = Math.random() < 0.5; // Живая клетка с вероятностью 0.5
        }
    }
    drawGrid();
}

const speedButtons = document.querySelectorAll('.speed-button');
let speed = 1;

function setSpeed(newSpeed)
{
    speed = newSpeed;
    updateSpeedButtons();
}

function updateSpeedButtons()
{
    speedButtons.forEach(button =>
    {
        button.disabled = false;
        if (button.dataset.speed === speed.toString())
        {
            button.disabled = true;
        }
    });
}

function startGame()
{
    isRunning = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости
    gameLoop();
}

function pauseGame()
{
    isRunning = false;
    pauseButton.textContent = 'Продолжить';
    pauseButton.removeEventListener('click', pauseGame);
    pauseButton.addEventListener('click', continueGame);
    updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости
}

function continueGame()
{
    isRunning = true;
    pauseButton.textContent = 'Пауза';
    pauseButton.removeEventListener('click', continueGame);
    pauseButton.addEventListener('click', pauseGame);
    updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости
    gameLoop(); // Добавляем вызов функции gameLoop()
}

let lastFrameTime = performance.now();

function gameLoop(currentTime)
{
    if (!isRunning)
    {
        return;
    }

    const timeSinceLastFrame = currentTime - lastFrameTime;
    const framesPerSecond = 30; // Количество кадров в секунду
    const frameDuration = 1000 / framesPerSecond;

    if (timeSinceLastFrame >= frameDuration / speed)
    {
        lastFrameTime = currentTime;
        updateCells();
        drawGrid();
        currentTime++;
    }
    requestAnimationFrame(gameLoop);
}

function step()
{
    updateCells();
    drawGrid();
}

function handleCanvasMouseDown(event)
{
    // Вычисляем координаты клика мыши на canvas
    const x = event.offsetX;
    const y = event.offsetY;

    // Вычисляем координаты клетки, в которую был произведен клик мыши
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Меняем состояние клетки на противоположное
    cellStates[row][col] = !cellStates[row][col];

    // Перерисовываем поле
    drawGrid();

    // Добавляем обработчик события mousemove
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
}

function handleCanvasMouseMove(event)
{
    // Вычисляем координаты клика мыши на canvas
    const x = event.offsetX;
    const y = event.offsetY;

    // Вычисляем координаты клетки, в которую был произведен клик мыши
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    // Меняем состояние клетки на противоположное
    cellStates[row][col] = !cellStates[row][col];

    // Перерисовываем поле
    drawGrid();
}

function handleCanvasMouseUp(event)
{
    // Удаляем обработчик события mousemove
    canvas.removeEventListener('mousemove', handleCanvasMouseMove);
}

// Обработчики событий для кнопок "Начать" и "Пауза"
startButton.addEventListener('click', function()
{
    startGame();
});

pauseButton.addEventListener('click', pauseGame);
const stepButton = document.getElementById('stepButton');
stepButton.addEventListener('click', step);

speedButtons.forEach(button =>
{
    button.addEventListener('click', () =>
    {
        setSpeed(parseFloat(button.dataset.speed));
    });
});
// Обработчик событий для canvas
canvas.addEventListener('mousedown', handleCanvasMouseDown);
canvas.addEventListener('mouseup', handleCanvasMouseUp);

const randomButton = document.querySelector('#randomButton');

// Обработчик события для кнопки "Случайная карта"
randomButton.addEventListener('click', function()
{
    randomizeCells();
});

function createStaticMap()
{
    const centerX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2) - 5;
    const endY = Math.floor(rows / 2) + 4;
    for (let row = startY; row <= endY; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            cellStates[row][col] = (col === centerX);
        }
    }
    // Перерисовываем поле
    drawGrid();
}

const staticButton = document.querySelector('#staticButton');

// Обработчик события для кнопки "Статическая карта"
staticButton.addEventListener('click', function()
{
    createStaticMap();
});

const clearButton = document.querySelector('#clearButton');

// Обработчик события для кнопки "Clear"
clearButton.addEventListener('click', function()
{
    // Сбрасываем состояние клеток и обновляем счетчики
    cellStates = createEmptyGrid(rows, cols);
    drawGrid();
    generationCount = 0;
    liveCellCount = 0;

    // Перерисовываем поле
    drawGrid();
});

function createGlider()
{
    const startX = Math.floor(cols / 2) - 1;
    const startY = Math.floor(rows / 2) - 1;
    cellStates[startY][startX + 1] = true;
    cellStates[startY + 1][startX + 2] = true;
    cellStates[startY + 2][startX] = true;
    cellStates[startY + 2][startX + 1] = true;
    cellStates[startY + 2][startX + 2] = true;
    // Перерисовываем поле
    drawGrid();
}

const gliderButton = document.querySelector('#gliderButton');

// Обработчик события для кнопки "gliderButton"
gliderButton.addEventListener('click', function()
{
    createGlider();
});

function createPulsar()
{
    const pulsarArr = [
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 8],
        [0, 9],
        [0, 10],
        [2, 0],
        [2, 5],
        [2, 7],
        [2, 12],
        [3, 0],
        [3, 5],
        [3, 7],
        [3, 12],
        [4, 0],
        [4, 5],
        [4, 7],
        [4, 12],
        [5, 2],
        [5, 3],
        [5, 4],
        [5, 8],
        [5, 9],
        [5, 10],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 8],
        [7, 9],
        [7, 10],
        [8, 0],
        [8, 5],
        [8, 7],
        [8, 12],
        [9, 0],
        [9, 5],
        [9, 7],
        [9, 12],
        [10, 0],
        [10, 5],
        [10, 7],
        [10, 12],
        [12, 2],
        [12, 3],
        [12, 4],
        [12, 8],
        [12, 9],
        [12, 10]
    ];
    const startX = Math.floor(cols / 2) - 10;
    const startY = Math.floor(rows / 2) - 4;

    for (let i = 0; i < pulsarArr.length; i++)
    {
        cellStates[startY + pulsarArr[i][0]][startX + pulsarArr[i][1]] = true;
    }
    drawGrid();
}

const pulsarButton = document.querySelector('#pulsarButton');

// Обработчик события для кнопки "pulsarButton"
pulsarButton.addEventListener('click', function()
{
    createPulsar();
});

function createCanoe()
{
    const startX = Math.floor(cols / 2) - 2;
    const startY = Math.floor(rows / 2) - 2;
    cellStates[startY][startX + 1] = true;
    cellStates[startY][startX + 2] = true;
    cellStates[startY + 1][startX] = true;
    cellStates[startY + 1][startX + 3] = true;
    cellStates[startY + 2][startX] = true;
    cellStates[startY + 2][startX + 3] = true;
    cellStates[startY + 3][startX + 1] = true;
    // Перерисовываем поле
    drawGrid();
}

const canoeButton = document.querySelector('#canoeButton');

// Обработчик события для кнопки "canoeButton"
canoeButton.addEventListener('click', function()
{
    createCanoe();
});

function createBlinker()
{
    const startX = Math.floor(cols / 2) - 1;
    const startY = Math.floor(rows / 2) - 1;
    cellStates[startY][startX] = true;
    cellStates[startY][startX + 1] = true;
    cellStates[startY][startX + 2] = true;
    // Перерисовываем поле
    drawGrid();
}

const blinkerButton = document.querySelector('#blinkerButton');

// Обработчик события для кнопки "blinkerButton"
blinkerButton.addEventListener('click', function()
{
    createBlinker();
});

function createExploder()
{
    // координаты точек взрыва
    // 'Exploder': [[-1, -1], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 1], [2, 0]]
    let exloder = [
        [-1, -1],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 1],
        [2, 0]
    ];

    // координаты центра поля
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);

    // заполняем поле
    for (let i = 0; i < exloder.length; i++)
    {
        cellStates[startY + exloder[i][0]][startX + exloder[i][1]] = true;
    }
    drawGrid();
}

const exploderButton = document.querySelector('#exploderButton');

// Обработчик события для кнопки "exploderButton"
exploderButton.addEventListener('click', function()
{
    createExploder();
});

function createGliderGun()
{
    let gliderggun = [
        [0, -18],
        [0, -17],
        [1, -18],
        [1, -17],
        [0, -8],
        [1, -8],
        [2, -8],
        [-1, -7],
        [-2, -6],
        [-2, -5],
        [3, -7],
        [4, -6],
        [4, -5],
        [1, -4],
        [-1, -3],
        [0, -2],
        [1, -2],
        [2, -2],
        [1, -1],
        [3, -3],
        [-2, 2],
        [-1, 2],
        [0, 2],
        [-2, 3],
        [-1, 3],
        [0, 3],
        [-3, 4],
        [1, 4],
        [-4, 6],
        [-3, 6],
        [1, 6],
        [2, 6],
        [-2, 16],
        [-1, 16],
        [-2, 17],
        [-1, 17]
    ];

    const startX = Math.floor(cols / 2) - 20;
    const startY = Math.floor(rows / 2) - 10;

    for (let i = 0; i < gliderggun.length; i++)
    {
        cellStates[startY + gliderggun[i][0]][startX + gliderggun[i][1]] = true;
    }

    // Перерисовываем поле
    drawGrid();
}

const gliderGunButton = document.querySelector('#gliderGunButton');

// Обработчик события для кнопки "gliderGunButton"
gliderGunButton.addEventListener('click', function()
{
    createGliderGun();
});

const fileInput = document.querySelector('#fileInput');
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event)
{
    const file = event.target.files[0]; // Получаем выбранный файл
    const reader = new FileReader(); // Создаем объект FileReader

    // Определяем, что делать после загрузки файла
    reader.onload = function(event)
    {
        const contents = event.target.result; // Получаем содержимое файла
        updateCellStatesFromContents(contents); // Обновляем состояние клеток
        drawGrid(); // Перерисовываем поле
    };

    // Читаем содержимое файла
    reader.readAsText(file);
}

function updateCellStatesFromContents(contents)
{
    const lines = contents.split('\n'); // Разбиваем содержимое файла на строки
    for (let i = 0; i < lines.length; i++)
    {
        const line = lines[i].trim();
        if (line)
        {
            const [x, y] = line.split(',').map(Number); // Разбиваем строку на координаты
            cellStates[y][x] = true; // Обновляем состояние клетки
        }
    }
}

const loadFileButton = document.querySelector('#loadFileButton');
loadFileButton.addEventListener('click', function()
{
    fileInput.click();
});

updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости при загрузке страницы
