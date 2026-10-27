const MIN_NUMBER = 1;
const MAX_NUMBER = 20;
const STARTING_LIVES = 3;
const ZERO = 0;
const STEP = 1;

const livesText = document.getElementById("lives");
const streakText = document.getElementById("streak");
const bestStreakText = document.getElementById("best-streak");
const previousNumberText = document.getElementById("previous-number");
const currentNumberText = document.getElementById("current-number");
const gameMessage = document.getElementById("game-message");
const gamePanel = document.getElementById("game-panel");
const higherButton = document.getElementById("higher-button");
const lowerButton = document.getElementById("lower-button");
const restartButton = document.getElementById("restart-button");

let currentNumber = randomNumber();
let previousNumber = null;
let lives = STARTING_LIVES;
let streak = ZERO;
let bestStreak = ZERO;

document.getElementById("number-range").textContent = MIN_NUMBER + " to " + MAX_NUMBER;
document.getElementById("starting-lives").textContent = STARTING_LIVES;

function randomNumber() {
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + STEP)) + MIN_NUMBER;
}

function showMessage(text, state) {
  gameMessage.textContent = text;
  gameMessage.classList.remove("is-success", "is-error", "is-neutral");
  gameMessage.classList.add(state);
}

function renderGame() {
  livesText.textContent = lives;
  streakText.textContent = streak;
  bestStreakText.textContent = bestStreak;
  currentNumberText.textContent = currentNumber;
  previousNumberText.textContent = previousNumber === null ? "-" : previousNumber;

  const gameOver = lives === ZERO;
  higherButton.disabled = gameOver;
  lowerButton.disabled = gameOver;
  gamePanel.classList.toggle("is-game-over", gameOver);
}

function makeGuess(direction) {
  // Reject a move before changing any game values.
  if (!(direction === "higher" || direction === "lower")) {
    showMessage("Choose Higher or Lower to make a guess.", "is-error");
    return;
  }

  if (lives === ZERO) {
    showMessage("The game is over. Press Restart to play again.", "is-error");
    return;
  }

  const nextNumber = randomNumber();
  const correctGuess = (direction === "higher" && nextNumber > currentNumber)
    || (direction === "lower" && nextNumber < currentNumber);

  if (nextNumber === currentNumber) {
    streak += STEP;
    showMessage("Both numbers are " + nextNumber + ". An equal number counts as correct.", "is-success");
  } else if (correctGuess) {
    streak += STEP;
    showMessage("Correct! " + nextNumber + " is " + direction + " than " + currentNumber + ".", "is-success");
  } else {
    lives -= STEP;
    streak = ZERO;
    showMessage("Wrong guess. The next number was " + nextNumber + ". You lost one life.", "is-error");
  }

  if (streak > bestStreak) {
    bestStreak = streak;
  }

  previousNumber = currentNumber;
  currentNumber = nextNumber;

  if (lives === ZERO) {
    showMessage("Game over! The next number was " + nextNumber + ". Press Restart to try again.", "is-error");
  }

  renderGame();
}

function restartGame() {
  currentNumber = randomNumber();
  previousNumber = null;
  lives = STARTING_LIVES;
  streak = ZERO;
  showMessage("New game. Will the next number be higher or lower?", "is-neutral");
  renderGame();
}

higherButton.addEventListener("click", function () {
  makeGuess("higher");
});

lowerButton.addEventListener("click", function () {
  makeGuess("lower");
});

restartButton.addEventListener("click", restartGame);

showMessage("Choose Higher or Lower to begin.", "is-neutral");
renderGame();
