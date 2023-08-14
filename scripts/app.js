states = {
  game: null,
  score: [0, 0],
};
const gameGrid = document.querySelector("#game-grid");
const player1Info = document.querySelector("#player1-info");
const startGameBtn = document.querySelector("#start-game-btn");
const player2Info = document.querySelector("#player2-info");
const player1Score = document.querySelector("#player1-score");
const player2Score = document.querySelector("#player2-score");

class Player {
  constructor(name = "name", symbol = "X") {
    this.name = name;
    this.symbol = symbol;
  }
}

class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    (this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]),
      (this.currentPlayer = player1);
    this.gameOver = false;
    this.winner = null;
    this.renderBoard();
    this.addEventListeners();
  }

  endGame() {
    gameGrid.classList.add("game-over");
  }

  play(row, col) {
    const currentTile = this.board[row][col];
    if (currentTile == "" && !this.gameOver) {
      this.board[row][col] = this.currentPlayer.symbol;
      this.checkStatus();
      this.switchPlayer();
    }
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  addEventListeners() {
    [...gameGrid.children].forEach((cell) => {
      cell.addEventListener("click", (e) => {
        const row = e.target.getAttribute("data-row");
        const col = e.target.getAttribute("data-col");
        this.play(row, col);
        this.updateBoard();
      });
    });
  }

  renderBoard() {
    gameGrid.classList.remove("game-over");
    this.board.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        const cell = document.createElement("div");
        cell.classList.add("game-grid-tile");
        cell.setAttribute("data-row", rowIndex);
        cell.setAttribute("data-col", colIndex);
        cell.textContent = this.board[rowIndex][colIndex];
        gameGrid.appendChild(cell);
      });
    });
  }

  updateBoard() {
    [...gameGrid.children].forEach((cell) => {
      const row = cell.getAttribute("data-row");
      const col = cell.getAttribute("data-col");
      cell.textContent = this.board[row][col];
    });
  }

  checkStatus() {
    const checkHorizontal = () => {
      for (let i = 0; i < this.board.length; i++) {
        let row = this.board[i];
        if (row[0] === row[1] && row[1] === row[2] && row[0] !== "") {
          return true;
        }
      }
      return false;
    };
    const checkVertical = () => {
      for (let i = 0; i < this.board.length; i++) {
        let col = [];
        for (let j = 0; j < this.board.length; j++) {
          col.push(this.board[j][i]);
        }
        if (col[0] === col[1] && col[1] === col[2] && col[0] !== "") {
          return true;
        }
      }
    };

    const checkDiagonal = () => {
      const diagonal1 = [];
      const diagonal2 = [];
      for (let i = 0; i < this.board.length; i++) {
        diagonal1.push(this.board[i][i]);
        diagonal2.push(this.board[i][this.board.length - 1 - i]);
      }
      if (
        diagonal1[0] === diagonal1[1] &&
        diagonal1[1] === diagonal1[2] &&
        diagonal1[0] !== ""
      ) {
        return true;
      }
      if (
        diagonal2[0] === diagonal2[1] &&
        diagonal2[1] === diagonal2[2] &&
        diagonal2[0] !== ""
      ) {
        return true;
      }
      return false;
    };

    const checkDraw = () => {
      if (
        this.board.flat().every((tile) => tile !== "") &&
        !checkHorizontal() &&
        !checkVertical() &&
        !checkDiagonal()
      ) {
        return true;
      }
      return false;
    };

    if (checkHorizontal() || checkVertical() || checkDiagonal()) {
      this.gameOver = true;
      this.endGame();
      this.winner = this.currentPlayer;
      gameGrid.addEventListener("transitionend", () => {
        gameGrid.classList.remove("game-over");
        alert(`${this.currentPlayer.name} wins!`);
        this.currentPlayer === this.player1
          ? states.score[0]++
          : states.score[1]++;
        resetAndCreateNewGame();
      });
    } else if (checkDraw()) {
      this.gameOver = true;
      this.endGame();
      gameGrid.addEventListener("transitionend", () => {
        gameGrid.classList.remove("game-over");
        alert("Draw!");
        resetAndCreateNewGame();
      });
    }
  }
}

startGameBtn.addEventListener("click", () => {
  if (!states.game) {
    createNewGame();
  } else {
    alert("Game already in progress!");
  }
});

function createNewGame() {
  gameGrid.innerHTML = "";
  const player1 = new Player("Player 1", "X");
  const player2 = new Player("Player 2", "O");

  states.game = new Game(player1, player2);
}

function resetAndCreateNewGame() {
  if (states.game) {
    states.game = null; // Clear the current game instance
  }
  createNewGame(); // Create a new game
}
