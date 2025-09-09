class JogoDaVelha {
  constructor() {
    // Array que representa o estado do tabuleiro (9 posições)
    this.board = Array(9).fill("");
    // Controla qual jogador tem a vez atualmente (X ou O)
    this.currentPlayer = "X";
    // Indica se o jogo está ativo (true) ou se terminou (false)
    this.gameActive = true;
    // Define o tema visual atual do jogo
    this.currentTheme = "classic";
    // Objeto que armazena a pontuação dos jogadores e empates
    this.scores = {
      X: 0,
      O: 0,
      draw: 0,
    };

    // Configurações específicas de cada tema disponível no jogo
    this.themes = {
      classic: {
        player1: "X",
        player2: "O",
        player1Name: "Jogador X",
        player2Name: "Jogador O",
        // Estilo CSS aplicado às células do jogador 1
        player1Style: "color: #e74c3c; font-size: 3rem; font-weight: bold;",
        // Estilo CSS aplicado às células do jogador 2
        player2Style: "color: #3498db; font-size: 3rem; font-weight: bold;",
      },
      naruto: {
        player1: "Naruto",
        player2: "Sasuke",
        player1Name: "Naruto",
        player2Name: "Sasuke",
        // Imagem SVG codificada em data URI para o símbolo do Naruto
        player1Style:
          "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%25' x='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%23FFAA00'%3E☯%3C/text%3E%3C/svg%3E\");",
        // Imagem SVG codificada em data URI para o símbolo do Sasuke
        player2Style:
          "background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50%25' x='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='%237940BF'%3E⚡%3C/text%3E%3C/svg%3E\");",
      },
      dragonball: {
        player1: "Goku",
        player2: "Vegeta",
        player1Name: "Goku",
        player2Name: "Vegeta",
        // Estilo com cor e tamanho de fonte para o Goku
        player1Style: "color: #ff3e3e; font-size: 3rem;",
        // Estilo com cor e tamanho de fonte para o Vegeta
        player2Style: "color: #0072D4; font-size: 3rem;",
      },
      pokemon: {
        player1: "Charmander",
        player2: "Squirtle",
        player1Name: "Charmander",
        player2Name: "Squirtle",
        // Identificador especial para o Charmander (tratado de forma diferente no código)
        player1Style: "charmander",
        // Identificador especial para o Squirtle (tratado de forma diferente no código)
        player2Style: "squirtle",
      },
    };

    // Todas as combinações possíveis de vitória no jogo da velha
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // linhas horizontais
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // linhas verticais
      [0, 4, 8],
      [2, 4, 6], // diagonais
    ];

    // Inicializa o jogo configurando os event listeners
    this.initializeGame();
  }

  // Configura os event listeners para as células e botões
  initializeGame() {
    // Seleciona todas as células do tabuleiro
    const cells = document.querySelectorAll(".cell");
    // Seleciona o botão de reiniciar jogo
    const resetButton = document.getElementById("reset-btn");
    // Seleciona o botão de zerar placar
    const resetScoreButton = document.getElementById("reset-score-btn");
    // Seleciona todos os botões de tema
    const themeButtons = document.querySelectorAll(".theme-btn");

    // Adiciona um event listener de clique para cada célula
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => this.handleCellClick(e));
    });

    // Configura o botão de reiniciar para chamar o método resetGame
    resetButton.addEventListener("click", () => this.resetGame());
    // Configura o botão de zerar placar para chamar o método resetScore
    resetScoreButton.addEventListener("click", () => this.resetScore());

    // Adiciona event listeners para os botões de tema
    themeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Obtém o tema do atributo data-theme do botão clicado
        const theme = e.target.getAttribute("data-theme");
        // Altera para o tema selecionado
        this.changeTheme(theme);

        // Remove a classe 'active' de todos os botões de tema
        themeButtons.forEach((btn) => btn.classList.remove("active"));
        // Adiciona a classe 'active' apenas ao botão clicado
        e.target.classList.add("active");
      });
    });

    // Atualiza a interface com o status atual do jogo
    this.updateStatus();
    // Atualiza a exibição do placar
    this.updateScoreDisplay();
  }

  // Manipula o clique em uma célula do tabuleiro
  handleCellClick(e) {
    // Obtém a célula que foi clicada
    const cell = e.target;
    // Obtém o índice da célula a partir do atributo data-cell-index
    const cellIndex = parseInt(cell.getAttribute("data-cell-index"));

    // Verifica se a célula já está preenchida ou se o jogo não está ativo
    if (this.board[cellIndex] !== "" || !this.gameActive) {
      // Sai da função se a célula não estiver vazia ou o jogo não estiver ativo
      return;
    }

    // Preenche a posição no array board com o jogador atual
    this.board[cellIndex] = this.currentPlayer;

    // Aplica o estilo visual apropriado baseado no tema atual
    if (this.currentTheme === "classic") {
      // Para o tema clássico, mostra X ou O com estilos diferentes
      cell.textContent = this.currentPlayer;
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    } else if (this.currentTheme === "pokemon") {
      // Para o tema Pokémon, usa emojis estilizados
      cell.textContent = "";
      cell.innerHTML =
        this.currentPlayer === "X"
          ? '<div class="pokemon-icon charmander-icon">🔥</div>'
          : '<div class="pokemon-icon squirtle-icon">💧</div>';
    } else if (this.currentTheme === "naruto") {
      // Para o tema Naruto, usa imagens de fundo SVG
      cell.textContent = "";
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    } else {
      // Para outros temas (Dragon Ball), usa estrelas com estilos diferentes
      cell.textContent = this.currentPlayer === "X" ? "☆" : "★";
      cell.style =
        this.currentPlayer === "X"
          ? this.themes[this.currentTheme].player1Style
          : this.themes[this.currentTheme].player2Style;
    }

    // Verifica se o jogador atual venceu após esta jogada
    if (this.checkWinner()) {
      // Incrementa a pontuação do jogador vencedor
      this.scores[this.currentPlayer]++;
      // Atualiza a exibição do placar
      this.updateScoreDisplay();
      // Exibe mensagem de vitória
      this.handleGameEnd(
        `${
          this.currentPlayer === "X"
            ? this.themes[this.currentTheme].player1Name
            : this.themes[this.currentTheme].player2Name
        } venceu!`
      );
      // Destaca as células que formaram a combinação vencedora
      this.highlightWinningCells();
      return;
    }

    // Verifica se o jogo terminou em empate
    if (this.checkDraw()) {
      // Incrementa o contador de empates
      this.scores["draw"]++;
      // Atualiza a exibição do placar
      this.updateScoreDisplay();
      // Exibe mensagem de empate
      this.handleGameEnd("Empate!");
      return;
    }

    // Passa a vez para o próximo jogador
    this.switchPlayer();
    // Atualiza a interface com o jogador atual
    this.updateStatus();
  }

  // Verifica se o jogador atual venceu o jogo
  checkWinner() {
    // Verifica se alguma das combinações vencedoras está completa
    return this.winningCombinations.some((combination) => {
      // Retorna true se todas as posições da combinação forem do jogador atual
      return combination.every((index) => {
        return this.board[index] === this.currentPlayer;
      });
    });
  }

  // Verifica se o jogo terminou em empate
  checkDraw() {
    // Retorna true se todas as células estiverem preenchidas
    return this.board.every((cell) => cell !== "");
  }

  // Alterna para o próximo jogador
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  }

  // Atualiza a interface para mostrar de quem é a vez
  updateStatus() {
    const playerTurn = document.getElementById("player-turn");
    playerTurn.textContent = `Vez de: ${
      this.currentPlayer === "X"
        ? this.themes[this.currentTheme].player1Name
        : this.themes[this.currentTheme].player2Name
    }`;
  }

  // Atualiza a exibição dos valores do placar
  updateScoreDisplay() {
    document.getElementById("score-x").textContent = this.scores["X"];
    document.getElementById("score-o").textContent = this.scores["O"];
    document.getElementById("score-draw").textContent = this.scores["draw"];
  }

  // Manipula o final do jogo (vitória ou empate)
  handleGameEnd(message) {
    // Desativa o jogo para impedir mais jogadas
    this.gameActive = false;
    // Obtém o elemento onde a mensagem será exibida
    const resultMessage = document.getElementById("result-message");
    // Define a mensagem de resultado
    resultMessage.textContent = message;
    // Aplica cor baseada no jogador vencedor (ou cinza para empate)
    resultMessage.style.color =
      this.currentPlayer === "X" ? "#e74c3c" : "#3498db";
  }

  // Destaca visualmente as células que formaram a combinação vencedora
  highlightWinningCells() {
    // Encontra a combinação vencedora
    const winningCombination = this.winningCombinations.find((combination) => {
      return combination.every(
        (index) => this.board[index] === this.currentPlayer
      );
    });

    // Se encontrou uma combinação vencedora
    if (winningCombination) {
      // Para cada índice na combinação vencedora
      winningCombination.forEach((index) => {
        // Seleciona a célula correspondente no DOM
        const cell = document.querySelector(`[data-cell-index="${index}"]`);
        // Adiciona a classe que aplica o efeito visual de destaque
        cell.classList.add("winning-cell");
      });
    }
  }

  // Reinicia o jogo para um novo estado
  resetGame() {
    // Limpa o tabuleiro (array)
    this.board = Array(9).fill("");
    // Define o jogador inicial como X
    this.currentPlayer = "X";
    // Reativa o jogo
    this.gameActive = true;

    // Seleciona todas as células e a mensagem de resultado
    const cells = document.querySelectorAll(".cell");
    const resultMessage = document.getElementById("result-message");

    // Limpa o conteúdo e estilos de cada célula
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.innerHTML = "";
      cell.className = "cell";
      cell.style = "";
    });

    // Limpa a mensagem de resultado
    resultMessage.textContent = "";
    // Atualiza a interface com o jogador atual
    this.updateStatus();
  }

  // Zera todas as pontuações do placar
  resetScore() {
    this.scores = {
      X: 0,
      O: 0,
      draw: 0,
    };
    // Atualiza a exibição do placar
    this.updateScoreDisplay();

    // Mostrar mensagem de confirmação
    const resultMessage = document.getElementById("result-message");
    resultMessage.textContent = "Placar zerado!";
    resultMessage.style.color = "#7f8c8d";

    // Remove a mensagem após 2 segundos
    setTimeout(() => {
      if (resultMessage.textContent === "Placar zerado!") {
        resultMessage.textContent = "";
      }
    }, 2000);
  }

  // Altera o tema visual do jogo
  changeTheme(theme) {
    this.currentTheme = theme;

    // Atualiza os nomes dos jogadores na interface
    document.getElementById("player1-name").textContent =
      this.themes[theme].player1Name;
    document.getElementById("player2-name").textContent =
      this.themes[theme].player2Name;

    // Reinicia o jogo para aplicar o novo tema
    this.resetGame();
  }
}

// Inicializar o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new JogoDaVelha();
});
