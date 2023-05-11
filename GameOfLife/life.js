// Получаем ссылку на элементы DOM
const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');

const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
let cellStates = createEmptyGrid(rows, cols);
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
        [1, 1]];

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
randomButton.addEventListener('click', function() {
    randomizeCells();
});

function createStaticMap() 
{
    const centerX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2) - 5;
    const endY = Math.floor(rows / 2) + 4;
    for (let row = startY; row <= endY; row++) {
        for (let col = 0; col < cols; col++) {
            cellStates[row][col] = (col === centerX);
        }
    }
    // Перерисовываем поле
    drawGrid();
}

const staticButton = document.querySelector('#staticButton');

// Обработчик события для кнопки "Статическая карта"
staticButton.addEventListener('click', function() {
    createStaticMap();
});

const clearButton = document.querySelector('#clearButton');

// Обработчик события для кнопки "Статическая карта"
clearButton.addEventListener('click', function() {
    cellStates = createEmptyGrid(rows, cols);
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
gliderButton.addEventListener('click', function() {
    createGlider();
});


function createPulsar()
{
    const startX = Math.floor(cols / 2) - 2;
    const startY = Math.floor(rows / 2) - 2;
    cellStates[startY][startX + 2] = true;
    cellStates[startY][startX + 3] = true;
    cellStates[startY][startX + 4] = true;
    cellStates[startY][startX + 8] = true;
    cellStates[startY][startX + 9] = true;
    cellStates[startY][startX + 10] = true;
    cellStates[startY + 5][startX + 2] = true;
    cellStates[startY + 5][startX + 3] = true;
    cellStates[startY + 5][startX + 4] = true;
    cellStates[startY + 5][startX + 8] = true;
    cellStates[startY + 5][startX + 9] = true;
    cellStates[startY + 5][startX + 10] = true;
    cellStates[startY + 7][startX + 2] = true;
    cellStates[startY + 7][startX + 3] = true;
    cellStates[startY + 7][startX + 4] = true;
    cellStates[startY + 7][startX + 8] = true;
    cellStates[startY + 7][startX + 9] = true;
    cellStates[startY + 7][startX + 10] = true;
    cellStates[startY + 12][startX + 2] = true;
    cellStates[startY + 12][startX + 3] = true;
    cellStates[startY + 12][startX + 4] = true;
    cellStates[startY + 12][startX + 8] = true;
    cellStates[startY + 12][startX + 9] = true;
    cellStates[startY + 12][startX + 10] = true;
    cellStates[startY + 2][startX] = true;
    cellStates[startY + 3][startX] = true;
    cellStates[startY + 4][startX] = true;
    cellStates[startY + 8][startX] = true;
    cellStates[startY + 9][startX] = true;
    cellStates[startY + 10][startX] = true;
    cellStates[startY + 2][startX + 5] = true;
    cellStates[startY + 3][startX + 5] = true;
    cellStates[startY + 4][startX + 5] = true;
    cellStates[startY + 8][startX + 5] = true;
    cellStates[startY + 9][startX + 5] = true;
    cellStates[startY + 10][startX + 5] = true;
    cellStates[startY + 2][startX + 7] = true;
    cellStates[startY + 3][startX + 7] = true;
    cellStates[startY + 4][startX + 7] = true;
    cellStates[startY + 8][startX + 7] = true;
    cellStates[startY + 9][startX + 7] = true;
    cellStates[startY + 10][startX + 7] = true;
    cellStates[startY + 2][startX + 12] = true;
    cellStates[startY + 3][startX + 12] = true;
    cellStates[startY + 4][startX + 12] = true;
    cellStates[startY + 8][startX + 12] = true;
    cellStates[startY + 9][startX + 12] = true;
    cellStates[startY + 10][startX + 12] = true;
    // Перерисовываем поле
    drawGrid();
}

const pulsarButton = document.querySelector('#pulsarButton');

// Обработчик события для кнопки "pulsarButton"
pulsarButton.addEventListener('click', function() {
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
canoeButton.addEventListener('click', function() {
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
blinkerButton.addEventListener('click', function() {
    createBlinker();
});


function createExploder()
{
    // координаты точек взрыва
    // 'Exploder': [[-1, -1], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 1], [2, 0]]
    let exloder = [[-1, -1], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 1], [2, 0]];

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
exploderButton.addEventListener('click', function() {
    createExploder();
});

function createGliderGun()
{
    let gliderggun =  [[0, -18], [0, -17], [1, -18], [1, -17], [0, -8], [1, -8], [2, -8], [-1, -7],
    [-2, -6], [-2, -5], [3, -7], [4, -6], [4, -5], [1, -4], [-1, -3], [0, -2], [1, -2],
    [2, -2], [1, -1], [3, -3], [-2, 2], [-1, 2], [0, 2], [-2, 3], [-1, 3], [0, 3], [-3, 4],
    [1, 4], [-4, 6], [-3, 6], [1, 6], [2, 6], [-2, 16], [-1, 16], [-2, 17], [-1, 17]];

    const startX = Math.floor(cols / 2) - 20;
    const startY = Math.floor(rows / 2) - 10;

    for (let i = 0; i < gliderggun.length; i++) {
        cellStates[startY + gliderggun[i][0]][startX + gliderggun[i][1]] = true;
    }

    // Перерисовываем поле
    drawGrid();
}

const gliderGunButton = document.querySelector('#gliderGunButton');

// Обработчик события для кнопки "gliderGunButton"
gliderGunButton.addEventListener('click', function() {
    createGliderGun();
});


updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости при загрузке страницы
