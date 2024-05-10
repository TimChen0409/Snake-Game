const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // getContext() return canvas drawing context.  have a 2D rendering context for canvas and draw within it.
const unit = 20;
const row = canvas.height / unit; // 360 / 20 = 18
const column = canvas.width / unit; // 360 / 20 = 18

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  setFruitLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    //check fruit can not set on the snake's position
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        }
        overlapping = false;
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

let snake;
let myFruit = new Fruit();
let score = 0;
let highestScore = 0;
let direction = "Right";

function initGame() {
  createSnake();
  loadHighestScore();
  updateScoreUI();
  window.addEventListener("keydown", changeDirection);
}

function createSnake() {
  //initialize snake's body position
  snake = [
    { x: unit * 4, y: 0 },
    { x: unit * 3, y: 0 },
    { x: unit * 2, y: 0 },
    { x: unit, y: 0 },
  ];
}

function changeDirection(e) {
  if (e.key == "ArrowRight" && direction != "Left") {
    direction = "Right";
  } else if (e.key == "ArrowDown" && direction != "Up") {
    direction = "Down";
  } else if (e.key == "ArrowLeft" && direction != "Right") {
    direction = "Left";
  } else if (e.key == "ArrowUp" && direction != "Down") {
    direction = "Up";
  }

  // After pressing the arrow keys, no keydown events are accepted until the next frame is drawn.
  // This prevents the snake from logically committing suicide due to continuous key presses.
  window.removeEventListener("keydown", changeDirection);
}

function draw() {
  checkCollision();
  clearDrawing();
  myFruit.drawFruit();
  drawSnake();
  drawNewSnakeHead();

  // Check if the snake has eaten the fruit.
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.setFruitLocation();
    score++;
    setHighestScore(score);
    updateScoreUI();
  } else {
    snake.pop();
  }

  window.addEventListener("keydown", changeDirection);
}

function checkCollision() {
  // Check if the snake has bitten itself Before each drawing.
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
}

function clearDrawing() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "rebeccapurple";
    } else {
      ctx.fillStyle = "wheat";
    }
    ctx.strokeStyle = "white";

    //update snake's position then let snake can pass walls
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
}

function drawNewSnakeHead() {
  // determine the coordinates where the next frame of the snake should be placed based on the current direction variable, d.
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  } else if (direction == "Right") {
    snakeX += unit;
  } else if (direction == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  snake.unshift(newHead);
}

function loadHighestScore() {
  highestScore = localStorage.getItem("highestScore")
    ? Number(localStorage.getItem("highestScore"))
    : 0;
}

function updateScoreUI() {
  document.getElementById("currentScore").innerText = "Current Score:" + score;
  document.getElementById("highestScore").innerText =
    "Highest Score:" + highestScore;
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

let myGame = setInterval(draw, 100);
initGame();
