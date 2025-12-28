const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;


const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-reset");


const modal = document.querySelector(".modal");
const startModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timerElement = document.querySelector("#time");

let currentScore = 0;
let time = `00:00`;
let [min, sec] = time.split(":").map(Number);

let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = `${highScore}`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);


let intervalId = null;
let timerIntervalId = null;
let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
};

const blocks = [];
let snake = [
    { x: 1, y: 4 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
];

let direction = "down";

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        // block.textContent=`${row}-${col}`;
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}


function generateFood() {
    let newFood;

    while (true) {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols),
        };

        // check collision with snake
        const isOnSnake = snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y
        );

        if (!isOnSnake) break;
    }

    return newFood;
}


function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    // movement logic {head calculation}
    if (direction === "left") {
        head = {
            x: snake[0].x,
            y: snake[0].y - 1
        }
    } else if (direction === "right") {
        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        }
    } else if (direction === "down") {
        head = {
            x: snake[0].x + 1,
            y: snake[0].y
        }
    }
    else if (direction === "up") {
        head = {
            x: snake[0].x - 1,
            y: snake[0].y
        }
    }

    // game over logic {wall collision}
    let displayScore = document.querySelector("#result");

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        displayScore.textContent = `${currentScore}`;
        currentScore = 0;

        let reason = document.getElementById("reason");
        reason.textContent = "Collided with the wall"


        time = `00:00`;
        min = 0;
        sec = 0;
        clearInterval(timerIntervalId);
        timerElement.textContent = time;

        modal.style.display = "flex";
        startModal.style.display = "none";
        gameOverModal.style.display = "flex";

        return;
    }

    // game over logic {body collision}
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            // game over
            clearInterval(intervalId);
            displayScore.textContent = `${currentScore}`;
            currentScore = 0;

            let reason = document.getElementById("reason");
            reason.textContent = "Bitted your own body";

            time = `00:00`;
            min = 0;
            sec = 0;
            clearInterval(timerIntervalId);
            timerElement.textContent = time;

            modal.style.display = "flex";
            startModal.style.display = "none";
            gameOverModal.style.display = "flex";

            return;
        }
    }

    // food consumption and score logic
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");

        food = generateFood();

        blocks[`${food.x}-${food.y}`].classList.add("food");

        snake.unshift(head);
        currentScore++;
        // scoreElement.textContent = `${currentScore}`;

        if (currentScore >= highScore) {
            highScore = currentScore;
            localStorage.setItem("highScore", highScore.toString());
            highScoreElement.textContent = `${highScore}`;
        }
    }
    scoreElement.textContent = `${currentScore}`;



    // snake movement
    // clear old snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill', 'head');
    });

    // move snake
    snake.unshift(head);
    snake.pop();

    // draw snake
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });

    // mark head
    const headSegment = snake[0];
    blocks[`${headSegment.x}-${headSegment.y}`].classList.add('head');

}

const timerFunction = () => {

    if (sec === 59) {
        min = min + 1;
        sec = 0;
    } else {
        sec = sec + 1;
    }

    time = `${min}:${sec}`;
    timerElement.textContent = time;
}

startButton.addEventListener("click", () => {
    modal.style.display = "none"
    intervalId = setInterval(() => {
        render()
    }, 200);

    timerIntervalId = setInterval(timerFunction, 1000);
})

restartButton.addEventListener("click", () => {

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill", "head");
    });
    direction = "down";

    modal.style.display = "none";

    snake = [
        { x: 1, y: 4 },
        { x: 1, y: 5 },
        { x: 1, y: 6 },
    ];

    timerIntervalId = setInterval(timerFunction, 1000);

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols),
    };

    min = 0;
    sec = 0;
    // clearInterval(timerIntervalId);

    intervalId = setInterval(() => {
        render()
    }, 200);
})

const setDirection = (event) => {
    // console.log(event.key);
    if (event.key === "ArrowUp") {
        if (direction === "down") {
            return;
        }
        direction = "up";
    }
    else if (event.key === "ArrowLeft") {
        if (direction === "right") {
            return;
        }
        direction = "left";
    }
    else if (event.key === "ArrowDown") {
        if (direction === "up") {
            return;
        }
        direction = "down";
    }
    else if (event.key === "ArrowRight") {
        if (direction === "left") {
            return;
        }
        direction = "right";
    }
};

addEventListener("keydown", setDirection);