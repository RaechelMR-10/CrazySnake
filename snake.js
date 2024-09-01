const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 40;
const canvasSize = 800;

let snake;
let direction;
let food;
let score;
let gameInterval;
let isPaused = false; // Track pause state

const headImage = new Image();
headImage.src = 'crazybitch.png'; 
const foodImage = new Image(); 
foodImage.src = 'R.png';

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (keyPressed === 38 && direction !== 'DOWN') direction = 'UP';
    if (keyPressed === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (keyPressed === 40 && direction !== 'UP') direction = 'DOWN';
}

function generateFood() {
    let newFood;
    let isFoodOnSnake;
    
    do {
        isFoodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * canvasSize / box) * box,
            y: Math.floor(Math.random() * canvasSize / box) * box
        };

        snake.forEach(part => {
            if (part.x === newFood.x && part.y === newFood.y) {
                isFoodOnSnake = true;
            }
        });

    } while (isFoodOnSnake);

    food = newFood;
}

function resetGame() {
    clearInterval(gameInterval);
    gameInterval = null;

    // Reset game state
    snake = [{ x: box * 5, y: box * 5 }];
    direction = 'RIGHT';
    score = 0;
    generateFood();
    
    // Show start button if hidden
    document.getElementById('startButton').style.display = 'block';
    // Reset pause button text
    document.getElementById('pauseButton').textContent = 'Pause';
    isPaused = false;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.drawImage(headImage, part.x, part.y, box, box); 
        } else {
            ctx.fillStyle = 'lime';
            ctx.fillRect(part.x, part.y, box, box);
        }
    });

    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Move snake
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        generateFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        clearInterval(gameInterval);
        gameInterval = null; 
        alert(`Game Over! Score: ${score}`);
        
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('pauseButton').textContent = 'Pause';
        isPaused = false;
    }
}

document.getElementById('startButton').addEventListener('click', function() {
    if (!gameInterval) {
        resetGame();
        gameInterval = setInterval(draw, 250);
        document.getElementById('startButton').style.display = 'none';
    }
});

document.getElementById('pauseButton').addEventListener('click', function() {
    if (gameInterval) {
        if (isPaused) {
            gameInterval = setInterval(draw, 250);
            document.getElementById('pauseButton').textContent = 'Pause';
        } else {
            clearInterval(gameInterval);
            gameInterval = null;
            document.getElementById('pauseButton').textContent = 'Unpause';
        }
        isPaused = !isPaused;
    }
});

document.getElementById('restartButton').addEventListener('click', function() {
    resetGame();
    gameInterval = setInterval(draw, 250);
});
