// Инициализация игры
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const numRows = canvas.height / cellSize;
const numCols = canvas.width / cellSize;
let cells = createCells();

// Создание начальной популяции случайных клеток
function createCells() {
  let arr = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    arr[i] = new Array(numCols);
    for (let j = 0; j < numCols; j++) {
      arr[i][j] = Math.round(Math.random());
    }
  }
  return arr;
}

// Отрисовка клеток на поле
function drawCells() {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      ctx.fillStyle = cells[i][j] === 1 ? 'black' : 'white';
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

// Обновление состояния клеток
function updateCells() {
  let nextCells = createCells();
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let neighbors = countNeighbors(i, j);
      if (cells[i][j] === 1 && (neighbors === 2 || neighbors === 3)) {
        nextCells[i][j] = 1;
      } else if (cells[i][j] === 0 && neighbors === 3) {
        nextCells[i][j] = 1;
      }
    }
  }
  cells = nextCells;
}

// Подсчет количества соседей для клетки
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let r = (row + i + numRows) % numRows;
      let c = (col + j + numCols) % numCols;
      count += cells[r][c];
    }
  }
  count -= cells[row][col];
  return count;
}

// Обновление состояния игры
function update() 
{

    let isPaused = true;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', function() 
    {
        isPaused = !isPaused;
    });

if (!isPaused) 
{
  updateCells();
  drawCells();
}

}

// Запуск игры
setInterval(update, 100);