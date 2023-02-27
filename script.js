function GameBoard() {
  // Cosas inherentes a la tabla

  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const setMark = (player, row, column) => {
    if (board[row][column].getValue() !== "") return;

    board[row][column].setValue(player);
  };

  const printBoard = () => {
    board.forEach((row) => {
      let rowValues = [];
      row.forEach((column) => {
        rowValues.push(column.getValue());
      });
      console.log(rowValues);
    });
  };

  const checkForWinning = (playerToken) => {
    let win = false;

    let inverseBoard = [[], [], []];

    // Creo tabla inversa para poder filtrar en un solo forEach()
    board.forEach((row) => {
      for (let i = 0; i < 3; i++) {
        inverseBoard[i].push(row[i]);
      }
    });

    board.forEach((row) => {
      // Logica para columnas llenas
      const Line = row.filter((cell) => cell.getValue() === playerToken);
      if (Line.length === 3) {
        win = true;
      }
    });

    inverseBoard.forEach((row) => {
      // Logica para filas llenas
      const Line = row.filter((cell) => cell.getValue() === playerToken);
      if (Line.length === 3) {
        win = true;
      }
      console.log(win);
    });

    // Logica para diagonales

    const midValue = board[1][1].getValue();

    if (midValue !== "") {
      // Diagonal principal
      if (
        board[0][0].getValue() === midValue &&
        board[2][2].getValue() === midValue
      ) {
        win = true;
      }
      // Diagonal secundaria
      if (
        board[0][2].getValue() === midValue &&
        board[2][0].getValue() === midValue
      ) {
        win = true;
      }
    }

    return win;
  };

  return { printBoard, setMark, getBoard, checkForWinning };
}

function Cell() {
  // Manejo de las celdas

  let value = "";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { setValue, getValue };
}

function Controller(playerOne = "Player One", playerTwo = "Machine") {
  // Cosas inherentes a interaccion
  const board = GameBoard();

  // Funcion para seleccion de token aun sin implementacion
  const setToken = (token) => {
    players[0].token = token;

    players[0].token === "X"
      ? (playerTwo.token = "O")
      : (playerTwo.token = "X");
  };

  const players = [
    {
      name: playerOne,
      token: "X",
    },
    {
      name: playerTwo,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const newRound = () => {
    board.printBoard();
    console.log(`Es el turno de [${activePlayer.name}]`);
  };

  let winner;
  let getWinner = () => winner;

  const playRound = (row, column) => {
    // Revisa si la casilla ya esta ocupada
    const boardArray = board.getBoard();
    const currentCellValue = boardArray[row][column].getValue();
    if (currentCellValue === "X" || currentCellValue === "O") return;

    // Coloca marcador del jugador
    board.setMark(activePlayer.token, row, column);

    // Revisa si hay ganador y exportalo

    if (board.checkForWinning(activePlayer.token)) {
      board.printBoard();
      console.log(`Jugador [${activePlayer.name}] gano la partida`);
      winner = activePlayer;
      return;
    }

    // Siguiente turno
    switchTurn();
    newRound();
  };

  newRound();

  return {
    setToken,
    playRound,
    getActivePlayer,
    getWinner,
    getBoard: board.printBoard,
    boardArray: board.getBoard,
  };
}

function GUI() {
  const board = document.querySelector(".board");
  const game = Controller();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let button = document.createElement("button");
      button.classList.add(`row-${i}`);
      button.classList.add(`column-${j}`);
      button.classList.add("cell");
      board.appendChild(button);
    }
  }

  const detonaCelda = (celda) => {
    const clasesDeCelda = celda.classList;
    const rowClass = clasesDeCelda[0];
    const columnClass = clasesDeCelda[1];

    const columnSeparator = columnClass.split("-");
    const rowSeparator = rowClass.split("-");

    const row = rowSeparator[rowSeparator.length - 1];
    const column = columnSeparator[columnSeparator.length - 1];

    const marcaCelda = () => {
      const boardArray = game.boardArray();
      const marker = document.createElement("p");
      const cellValue = `${boardArray[row][column].getValue()}`;
      if (celda.textContent !== "") return;
      marker.textContent = cellValue;
      celda.appendChild(marker);
    };

    const getRow = () => row;
    const getColumn = () => column;

    return { getRow, getColumn, marcaCelda };
  };
  const displayWinner = (player) => {
    const body = document.querySelector("body");

    const coverDiv = document.createElement("div");
    coverDiv.classList.add("coverDiv");
    body.appendChild(coverDiv);

    const winnerContainer = document.createElement("div");
    winnerContainer.classList.add("winnerContainer");
    coverDiv.appendChild(winnerContainer);

    const textDisplay = document.createElement("p");
    textDisplay.classList.add("winnerText");
    textDisplay.textContent = `El jugador [${player}] ha ganado esta partida`;

    winnerContainer.appendChild(textDisplay);
  };

  let celdas = document.querySelectorAll(".cell");

  celdas.forEach((celda) =>
    celda.addEventListener("click", () => {
      game.playRound(
        detonaCelda(celda).getRow(),
        detonaCelda(celda).getColumn()
      );
      detonaCelda(celda).marcaCelda();
      if (game.getWinner()) {
        const winner = game.getWinner();
        displayWinner(winner.name);
      }
    })
  );
}

GUI();
