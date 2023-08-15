states = {
  game: null,
  score: [0, 0],
};
const gameGrid = document.querySelector("#game-grid");
const player1Info = document.querySelector("#player1");
const startGameBtn = document.querySelector("#start-game-btn");
const player2Info = document.querySelector("#player2");
const player1Score = document.querySelector("#player1-score");
const player2Score = document.querySelector("#player2-score");
let symbols = {};

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
      (this.currentPlayer = player1.symbol == "X" ? player1 : player2);
    this.gameOver = false;
    this.winner = null;
    this.renderBoard();
    this.addEventListeners();

    let root = document.documentElement;
    root.style.setProperty(
      "--current-player",
      `'${this.currentPlayer.symbol}'`
    );
  }

  endGame() {
    const root = document.documentElement;
    const gameOverText = this.winner ? `${this.winner.name} wins!` : "Draw!";
    root.style.setProperty("--winner", `'${gameOverText}'`);
    gameGrid.classList.add("game-over");
  }

  play(row, col) {
    console.log(this.currentPlayer);
    const currentTile = this.board[row][col];
    if (currentTile == "" && !this.gameOver) {
      this.board[row][col] = this.currentPlayer.symbol;
      this.checkStatus();
      this.switchPlayer();
    }
  }

  switchPlayer() {
    let root = document.documentElement;
    this.currentPlayer =
      this.currentPlayer == this.player1 ? this.player2 : this.player1;
    root.style.setProperty(
      "--current-player",
      `'${this.currentPlayer.symbol}'`
    );
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
      this.winner = this.currentPlayer;

      gameGrid.addEventListener("transitionend", (e) => {
        if (e.target !== gameGrid) return;
        console.log("transitionend");
        gameGrid.classList.remove("game-over");
        this.winner === this.player1 ? states.score[0]++ : states.score[1]++;
        resetAndCreateNewGame();
      });
      this.endGame();
    } else if (checkDraw()) {
      this.gameOver = true;
      gameGrid.addEventListener("transitionend", (e) => {
        if (e.target !== gameGrid) return;
        console.log(e);
        console.log("transitionend");
        gameGrid.classList.remove("game-over");
        resetAndCreateNewGame();
      });
      this.endGame();
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

function swapSymbols(symbol) {
  return symbol == "X" ? "O" : "X";
}

function updateScores() {
  player1Score.textContent = states.score[0];
  player2Score.textContent = states.score[1];
}

function createNewGame(symbols) {
  gameGrid.innerHTML = "";
  if (!symbols) {
    symbols = {
      p1: "O",
      p2: "X", // will be swapped so p1 always starts with X
    };
  }
  const player1 = new Player(player1Info.textContent, swapSymbols(symbols?.p1));
  const player2 = new Player(player2Info.textContent, swapSymbols(symbols?.p2));

  states.game = new Game(player1, player2);
}

function resetAndCreateNewGame() {
  updateScores();
  symbols = {
    p1: states.game?.player1.symbol ?? "X",
    p2: states.game?.player2.symbol ?? "O",
  };
  if (states.game) {
    states.game = null; // Clear the current game instance
  }
  createNewGame(symbols); // Create a new game
}
