class JogoDaVelha {
  constructor() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;
    this.currentTheme = "classic";
    this.scores = {
      X: 0,
      O: 0,
      draw: 0,
    };

    this.themes = {
      classic: {
        player1: "X",
        player2: "O",
        player1Name: "Jogador X",
        player2Name: "Jogador O",
        player1Style: "color: #e74c3c; font-size: 3rem; font-weight: bold;",
        player2Style: "color: #3498db; font-size: 3rem; font-weight: bold;",
      },
      naruto: {
        player1: "Naruto",
        player2: "Sasuke",
        player1Name: "Naruto",
        player2Name: "Sasuke",
        player1Style:
          "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%25' x='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%23FFAA00'%3E☯%3C/text%3E%3C/svg%3E\");",
        player2Style:
          "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%25' x='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%237940BF'%3E⚡%3C/text%3E%3C/svg%3E\");",
      },
      dragonball: {
        player1: "Goku",
        player2: "Vegeta",
        player1Name: "Goku",
        player2Name: "Vegeta",
        player1Style: "color: #ff3e3e; font-size: 3rem;",
        player2Style: "color: #0072D4; font-size: 3rem;",
      },
      pokemon: {
        player1: "Charmander",
        player2: "Squirtle",
        player1Name: "Charmander",
        player2Name: "Squirtle",
        player1Style: "charmander",
        player2Style: "squirtle",
      },
    };

    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // linhas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // colunas
      [0, 4, 8],
      [2, 4, 6], // diagonais
    ];

    this.initializeGame();
  }

  initializeGame() {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-btn");
    const resetScoreButton = document.getElementById("reset-score-btn");
    const themeButtons = document.querySelectorAll(".theme-btn");

    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => this.handleCellClick(e));
    });

    resetButton.addEventListener("click", () => this.resetGame());
    resetScoreButton.addEventListener("click", () => this.resetScore());

    themeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const theme = e.target.getAttribute("data-theme");
        this.changeTheme(theme);

        // Atualizar a classe active
        themeButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    this.updateStatus();
    this.updateScoreDisplay();
  }

  handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute("data-cell-index"));

    if (this.board[cellIndex] !== "" || !this.gameActive) {
      return;
    }

    this.board[cellIndex] = this.currentPlayer;

    // Aplicar o estilo do jogador atual
    if (this.currentTheme === "classic") {
      cell.textContent = this.currentPlayer;
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    } else if (this.currentTheme === "pokemon") {
      cell.textContent = "";
      cell.innerHTML =
        this.currentPlayer === "X"
          ? '<div class="pokemon-icon charmander-icon">🔥</div>'
          : '<div class="pokemon-icon squirtle-icon">💧</div>';
    } else if (this.currentTheme === "naruto") {
      cell.textContent = "";
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    } else {
      cell.textContent = this.currentPlayer === "X" ? "☆" : "★";
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    }

    if (this.checkWinner()) {
      this.scores[this.currentPlayer]++;
      this.updateScoreDisplay();
      this.handleGameEnd(
        `${
          this.currentPlayer === "X"
            ? this.themes[this.currentTheme].player1Name
            : this.themes[this.currentTheme].player2Name
        } venceu!`
      );
      this.highlightWinningCells();
      return;
    }

    if (this.checkDraw()) {
      this.scores["draw"]++;
      this.updateScoreDisplay();
      this.handleGameEnd("Empate!");
      return;
    }

    this.switchPlayer();
    this.updateStatus();
  }

  checkWinner() {
    return this.winningCombinations.some((combination) => {
      return combination.every((index) => {
        return this.board[index] === this.currentPlayer;
      });
    });
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  }

  updateStatus() {
    const playerTurn = document.getElementById("player-turn");
    playerTurn.textContent = `Vez de: ${
      this.currentPlayer === "X"
        ? this.themes[this.currentTheme].player1Name
        : this.themes[this.currentTheme].player2Name
    }`;
  }

  updateScoreDisplay() {
    document.getElementById("score-x").textContent = this.scores["X"];
    document.getElementById("score-o").textContent = this.scores["O"];
    document.getElementById("score-draw").textContent = this.scores["draw"];
  }

  handleGameEnd(message) {
    this.gameActive = false;
    const resultMessage = document.getElementById("result-message");
    resultMessage.textContent = message;
    resultMessage.style.color =
      this.currentPlayer === "X" ? "#e74c3c" : "#3498db";
  }

  highlightWinningCells() {
    const winningCombination = this.winningCombinations.find((combination) => {
      return combination.every(
        (index) => this.board[index] === this.currentPlayer
      );
    });

    if (winningCombination) {
      winningCombination.forEach((index) => {
        const cell = document.querySelector(`[data-cell-index="${index}"]`);
        cell.classList.add("winning-cell");
      });
    }
  }

  resetGame() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.gameActive = true;

    const cells = document.querySelectorAll(".cell");
    const resultMessage = document.getElementById("result-message");

    cells.forEach((cell) => {
      cell.textContent = "";
      cell.innerHTML = "";
      cell.className = "cell";
      cell.style = "";
    });

    resultMessage.textContent = "";
    this.updateStatus();
  }

  resetScore() {
    this.scores = {
      X: 0,
      O: 0,
      draw: 0,
    };
    this.updateScoreDisplay();

    // Mostrar mensagem de confirmação
    const resultMessage = document.getElementById("result-message");
    resultMessage.textContent = "Placar zerado!";
    resultMessage.style.color = "#7f8c8d";

    // Remover a mensagem após 2 segundos
    setTimeout(() => {
      if (resultMessage.textContent === "Placar zerado!") {
        resultMessage.textContent = "";
      }
    }, 2000);
  }

  changeTheme(theme) {
    this.currentTheme = theme;

    // Atualizar nomes dos jogadores
    document.getElementById("player1-name").textContent =
      this.themes[theme].player1Name;
    document.getElementById("player2-name").textContent =
      this.themes[theme].player2Name;

    // Reiniciar o jogo com o novo tema
    this.resetGame();
  }
}

// Inicializar o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new JogoDaVelha();
});
