const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let gameInterval = setInterval(game, 1000 / 5);

window.addEventListener("load", () => {
  document.addEventListener("keydown", keyDown);
});

let playableBlock = [];
let playableColor = "";

let placedBlock = [];
let blockFallSpeed = 0;
let currentScore = 0;
let highScore = 0;

let startingPositionX = 5;
let startingPositionY = 3;

let squareSize = 45;
let boardWidth = 10;
let boardHeight = 20;

let canSpawnBlock = true;
let gameStarted = false;

function game() {
  if (canSpawnBlock && gameStarted) {
    spawnBlock();
    canSpawnBlock = false;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = playableColor;
  playableBlock.forEach(element => {
    ctx.fillRect(element.x * squareSize, element.y * squareSize, squareSize - 2, squareSize - 2);
  })

  linesChecking();

  ctx.fillStyle = "grey";
  placedBlock.forEach(element => {
    ctx.fillRect(element.x * squareSize, element.y * squareSize, squareSize - 2, squareSize - 2);
  })

  if (canFall()) {
    playableBlock.forEach(element => element.y = element.y + blockFallSpeed);
  } else {
    playableBlock.forEach(element2 => placedBlock.push(element2));
    playableBlock.length = [];
    canSpawnBlock = true;
  }

  if (isGameOver()) {
    gameOver();
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnBlock() {
  switch (getRandomInt(1, 7)) {
    case 1: spawnLBlock();
      break;
    case 2: spawnIBlock();
      break;
    case 3: spawnOBlock();
      break;
    case 4: spawnJBlock();
      break;
    case 5: spawnSBlock();
      break;
    case 6: spawnTBlock();
      break;
  }
}

function spawnOBlock() {
  playableColor = "green";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX - 1, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX - 1, y: startingPositionY });
}

function spawnLBlock() {
  playableColor = "lime";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 2 });
  playableBlock.push({ x: startingPositionX + 1, y: startingPositionY });
}

function spawnIBlock() {
  playableColor = "red";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 2 });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 3 });
}

function spawnJBlock() {
  playableColor = "blue";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX, y: startingPositionY - 2 });
  playableBlock.push({ x: startingPositionX - 1, y: startingPositionY });
}

function spawnSBlock() {
  playableColor = "pink";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX + 1, y: startingPositionY });
  playableBlock.push({ x: startingPositionX + 1, y: startingPositionY - 1 });
  playableBlock.push({ x: startingPositionX + 2, y: startingPositionY - 1 });
}

function spawnTBlock() {
  playableColor = "orange";
  playableBlock.push({ x: startingPositionX, y: startingPositionY });
  playableBlock.push({ x: startingPositionX + -1, y: startingPositionY });
  playableBlock.push({ x: startingPositionX + 1, y: startingPositionY });
  playableBlock.push({ x: startingPositionX, y: startingPositionY + 1 });
}

function keyDown(e) {
  gameStarted = true;
  switch (e.keyCode) {
    case 37:
      if (canBeMovedLeft()) {
        playableBlock.forEach(element => {
          element.x = --element.x;
        })
      }
      blockFallSpeed = 1;
      break;
    case 39:
      if (canBeMovedRight()) {
        playableBlock.forEach(element => {
          element.x = ++element.x;
        })
      }
      blockFallSpeed = 1;
      break;
    case 82:
      resetGame();
      break;
    default:
      break;
  }
}

function canBeMovedLeft() {
  return playableBlock.filter(element => element.x < 1 || isStickedLeftSide(element.x, element.y)).length == 0;
}

function canBeMovedRight() {
  return playableBlock.filter(element => element.x > boardWidth - 2 || isStickedRightSide(element.x, element.y)).length == 0;
}

function canFall() {
  return playableBlock.filter(element => element.y > boardHeight - 2 || isStickedUpperSide(element.x, element.y)).length == 0;
}

function isStickedUpperSide(x, y) {
  return placedBlock.filter(element => element.x == x && element.y == y + 1).length != 0;
}

function isStickedLeftSide(x, y) {
  return placedBlock.filter(element => element.y == y && (element.x) == x - 1).length != 0;
}

function isStickedRightSide(x, y) {
  return placedBlock.filter(element => element.y == y && (element.x) == x + 1).length != 0;
}

function linesChecking() {
  for (i = 0; i < boardHeight; i++) {
    if (isLineFull(i)) {
      lineClearing(i);
    }
  }
}

function lineClearing(y) {
  let lowerBlocks = placedBlock.filter(element => element.y > y);
  let higherBlocks = placedBlock.filter(element => element.y < y)
  higherBlocks.forEach(element => element.y = ++element.y);

  placedBlock = [...lowerBlocks, ...higherBlocks];

  currentScore++;
  updateScore();
}

function isLineFull(y) {
  return placedBlock.filter(element => element.y == y).length == boardWidth;
}

function resetGame() {
  placedBlock = [];
  playableBlock = [];
  currentScore = 0;
  updateScore();
  blockFallSpeed = 0;
  gameStarted = false;
  canSpawnBlock = true;
}

function isGameOver() {
  return placedBlock.filter(element => element.y < startingPositionY).length != 0;
}

function gameOver() {
  if (currentScore > highScore) {
    highScore = currentScore;
    updateHighScore();
  }
  resetGame();
}

function updateScore() {
  document.getElementById("score").innerText = "Current score: " + currentScore;
}

function updateHighScore() {
  document.getElementById("highScore").innerText = "High score: " + highScore;
}