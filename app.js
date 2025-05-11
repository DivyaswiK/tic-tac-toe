const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

let currentPlayer = "X"; // Human is 'X', Computer is 'O'
let gameGrid = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameGrid[a] && gameGrid[a] === gameGrid[b] && gameGrid[a] === gameGrid[c]) {
      showWinner(gameGrid[a]);
      return true;
    }
  }
  if (!gameGrid.includes("")) {
    showWinner("Draw");
    return true;
  }
  return false;
}

function showWinner(winner) {
  isGameOver = true;
  msg.innerText = winner === "Draw" ? "It's a Draw!" : `${winner} wins!`;
  msgContainer.classList.remove("hide");
}

// Function to check if a specific player can win in the next move
function checkForWinningMove(player) {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameGrid[a] === player && gameGrid[b] === player && gameGrid[c] === "") {
      return c;
    }
    if (gameGrid[a] === player && gameGrid[c] === player && gameGrid[b] === "") {
      return b;
    }
    if (gameGrid[b] === player && gameGrid[c] === player && gameGrid[a] === "") {
      return a;
    }
  }
  return null;
}

// Computer makes a smart move
function computerMove() {
  if (isGameOver) return;

  // Try to win
  let winningMove = checkForWinningMove("O");
  if (winningMove !== null) {
    gameGrid[winningMove] = "O";
    boxes[winningMove].innerText = "O";
    boxes[winningMove].disabled = true;
    if (!checkWinner()) {
      currentPlayer = "X";
    }
    return;
  }

  // Block the player from winning
  let blockingMove = checkForWinningMove("X");
  if (blockingMove !== null) {
    gameGrid[blockingMove] = "O";
    boxes[blockingMove].innerText = "O";
    boxes[blockingMove].disabled = true;
    if (!checkWinner()) {
      currentPlayer = "X";
    }
    return;
  }

  // Take center if available
  if (gameGrid[4] === "") {
    gameGrid[4] = "O";
    boxes[4].innerText = "O";
    boxes[4].disabled = true;
    if (!checkWinner()) {
      currentPlayer = "X";
    }
    return;
  }

  // Otherwise, make a random move
  let emptyIndexes = gameGrid.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  if (emptyIndexes.length === 0) return;

  let randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  gameGrid[randomIndex] = "O";
  boxes[randomIndex].innerText = "O";
  boxes[randomIndex].disabled = true;

  if (!checkWinner()) {
    currentPlayer = "X";
  }
}

function handleClick(index) {
  if (gameGrid[index] === "" && !isGameOver && currentPlayer === "X") {
    gameGrid[index] = "X";
    boxes[index].innerText = "X";
    boxes[index].disabled = true;

    if (!checkWinner()) {
      currentPlayer = "O";
      setTimeout(computerMove, 500); // delay for realism
    }
  }
}

boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleClick(index));
});

function resetGame() {
  gameGrid.fill("");
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
  });
  msgContainer.classList.add("hide");
  isGameOver = false;
  currentPlayer = "X";
}

resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
