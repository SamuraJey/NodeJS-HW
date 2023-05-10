// Получаем ссылку на элементы DOM
const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');

const ctx = canvas.getContext('2d');
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);
const cellStates = createEmptyGrid(rows, cols);
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

function handleCanvasClick(event)
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

// Обработчики событий для кнопок "Начать" и "Пауза"
startButton.addEventListener('click', function()
{
    startGame();
    // if (startingCells.includes(true))
    // {
    //     cellStates = startingCells;
    //     startGame();
    //     console.log("cellStates.includes(true)");
    // }
    // else
    // {
    //     randomizeCells();
    //     startGame();
    //     console.log("randomizeCells");
    // }
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
canvas.addEventListener('mousedown', handleCanvasClick);

const randomButton = document.querySelector('#randomButton');

// Обработчик события для кнопки "Случайная карта"
randomButton.addEventListener('click', function() {
    randomizeCells();
    // Копируем состояние клеток в начальный массив
    // startingCellStates = JSON.parse(JSON.stringify(cellStates));
});

updateSpeedButtons(); // Обновляем состояние кнопок выбора скорости при загрузке страницы
