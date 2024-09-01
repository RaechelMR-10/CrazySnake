const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 40;
const canvasSize = 800;

let snake = [{ x: box * 5, y: box * 5 }];
let direction = 'RIGHT';
let food = { x: Math.floor(Math.random() * canvasSize / box) * box, y: Math.floor(Math.random() * canvasSize / box) * box };
let score = 0;

const headImage = new Image();
headImage.src = 'crazybitch.png'; 
const foodImage = new Image(); // Create a new Image object for the food
foodImage.src = 'R.png';

const bodyImages = [];

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

generateFood();

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.drawImage(headImage, part.x, part.y, box, box); 
        } else {
            ctx.drawImage(headImage, part.x, part.y, box, box);
        }
    });

    // Draw food
    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Move snake
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        generateFood();
    } else {
        snake.pop();
    }

    // Check collision with walls or itself
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        clearInterval(game);
        alert(`Game Over! Score: ${score}`);
    }
}

const game = setInterval(draw, 250);
