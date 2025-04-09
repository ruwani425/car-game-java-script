const gameArea = $("#gameArea");
const playerCar = $("#playerCar");
const scoreBoard = $("#scoreBoard");
const gameOverScreen = $("#gameOverScreen");
const levelLabel = $("#levelLabel");

let level = 1;
let carWidth = 50,
  carHeight = 100;
let carX = gameArea.width() / 2 - carWidth / 2;
let carY = gameArea.height() - carHeight - 20;
let carSpeed = 10;

let obstacles = [];
let obstacleWidth = 50,
  obstacleHeight = 50;
let obstacleSpeed = 5;

let score = 0;
let gameOver = false;

$(document).keydown(function (event) {
  if (gameOver) return;

  if (event.key === "ArrowLeft" && carX > 0) {
    carX -= carSpeed;
  } else if (event.key === "ArrowRight" && carX < gameArea.width() - carWidth) {
    carX += carSpeed;
  } else if (event.key === "ArrowUp" && carY > 0) {
    carY -= carSpeed;
    if (carY < 0) {
      carY = gameArea.height() - carHeight - 20;
    }
  }

  playerCar.css({
    left: carX + "px",
    top: carY + "px",
  });
});

function createObstacle() {
  if (gameOver) return;
  const x = Math.random() * (gameArea.width() - obstacleWidth);
  const obstacle = $('<div class="obstacle"></div>');
  obstacle.css({
    left: x + "px",
    top: "0px",
  });
  gameArea.append(obstacle);
  obstacles.push(obstacle);
}

function moveObstacles() {
  if (gameOver) return;

  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    let currentTop = parseInt(obstacle.css("top"));

    obstacle.css("top", currentTop + obstacleSpeed + "px");

    if (currentTop > $(window).height()) {
      obstacle.remove();
      obstacles.splice(i, 1);
      score++;
      scoreBoard.text(`Score: ${score}`);

      if (score === 10) {
        level = 2;
        levelLabel.text(`Level: ${level}`);
        obstacleSpeed += 2;
      } else if (score === 20) {
        level = 3;
        levelLabel.text(`Level: ${level}`);
        obstacleSpeed += 2;
      } else if (score === 30) {
        level = 4;
        levelLabel.text(`Level: ${level}`);
        obstacleSpeed += 2;
      }
    }
  }
}

function checkCollision() {
  const carRect = playerCar[0].getBoundingClientRect();

  for (let obstacle of obstacles) {
    const obstacleRect = obstacle[0].getBoundingClientRect();

    if (
      carRect.left < obstacleRect.right &&
      carRect.right > obstacleRect.left &&
      carRect.top < obstacleRect.bottom &&
      carRect.bottom > obstacleRect.top
    ) {
      gameOver = true;
    }
  }
}

function gameLoop() {
  if (gameOver) {
    gameOverScreen.css("display", "block");
    gameArea.css("animation", "none");
    return;
  }

  moveObstacles();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

setInterval(createObstacle, 1000);
gameLoop();
