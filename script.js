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
      // console.log(rowValues);
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
      // console.log(win);
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

    // Tabla llena empate
    const arrayDeTabla = board.flat();
    if (arrayDeTabla.every((cell) => cell.getValue() !== "")) return "draw";

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

function Controller(playerOne = "Player", playerTwo = "Machine") {
  // Cosas inherentes a interaccion
  const board = GameBoard();

  // Funcion para seleccion de token aun sin implementacion
  const setToken = (token) => {
    players[0].token = token;

    players[0].token === "X"
      ? (player[1].token = "O")
      : (player[1].token = "X");
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
    // console.log(`Es el turno de [${activePlayer.name}]`);
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

    // Revisa si hay empate o ganador y exportalo
    if (board.checkForWinning() === "draw") {
      winner = "nadie";
      console.log("nadie");
      return;
    }
    if (board.checkForWinning(activePlayer.token)) {
      board.printBoard();
      // console.log(`Jugador [${activePlayer.name}] gano la partida`);
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

      if (cellValue === "X") marker.style.color = "blue";
      else marker.style.color = "#c71515";

      celda.appendChild(marker);
    };

    const getRow = () => row;
    const getColumn = () => column;

    return { getRow, getColumn, marcaCelda };
  };
  const displayWinner = (player) => {
    const wrapper = document.querySelector(".wrapper");

    const coverDiv = document.createElement("div");
    coverDiv.classList.add("coverDiv");
    wrapper.appendChild(coverDiv);

    const winnerContainer = document.createElement("div");
    winnerContainer.classList.add("winnerContainer");
    coverDiv.appendChild(winnerContainer);

    const replayButton = document.createElement("button");
    replayButton.classList.add("replayButton");
    replayButton.textContent = "Volver a jugar";
    replayButton.addEventListener("click", () => newGame());

    const textDisplay = document.createElement("p");
    textDisplay.classList.add("winnerText");
    textDisplay.textContent = `El jugador [${player}] ha ganado esta partida`;

    if (player === "nadie")
      textDisplay.textContent = "Nadie gana, es un empate.";

    winnerContainer.appendChild(textDisplay);
    winnerContainer.appendChild(replayButton);
  };

  let celdas = document.querySelectorAll(".cell");
  let turnDiv = document.querySelector(".turnoTexto");
  let displayTurno = (activePlayer) => {
    turnDiv.textContent = `Es el turno de ${activePlayer}`;
  };

  displayTurno(game.getActivePlayer().name);

  celdas.forEach((celda) =>
    celda.addEventListener("click", () => {
      // Juega ronda
      game.playRound(
        detonaCelda(celda).getRow(),
        detonaCelda(celda).getColumn()
      );
      // Marca la celda con el token
      detonaCelda(celda).marcaCelda();

      // Cambia el display del jugador activo
      displayTurno(game.getActivePlayer().name);
      // --------------------------------------------------------------------------Dime como va el position map
      roadScorer(2, game.boardArray(), "O", "X");

      // Chequea si hay un ganador
      if (game.getWinner()) {
        if (game.getWinner() === "nadie") {
          displayWinner("nadie");
          return;
        }
        const winner = game.getWinner();
        displayWinner(winner.name);
      }
    })
  );
}

function newGame() {
  const wrapper = document.querySelector(".wrapper");
  const coverDiv = document.querySelector(".coverDiv");
  const container = document.querySelector(".container");

  const currentBoard = document.querySelector(".board");
  const newboard = document.createElement("div");
  newboard.classList.add("board");

  wrapper.removeChild(coverDiv);
  container.removeChild(currentBoard);

  container.appendChild(newboard);

  GUI();
}

function machineEyes(currentBoard, playerMark) {
  console.log("machineEyes");
  let board = currentBoard;

  // Posiciones para ganar
  const winPositions = [
    // Rows
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    // Diagonals
    [1, 5, 9],
    [3, 5, 7],
    // columns
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  // Mapa para asignar valor del 1 al 9 a cada posicion
  const positionMap = {};
  const valueMap = {};
  let position = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      position += 1;
      positionMap[String(position)] = board[i][j];
      valueMap[String(position)] = board[i][j].getValue();
    }
  }

  const getPositionMap = () => positionMap;
  const getValueMap = () => valueMap;
  const getWinPositions = () => winPositions;

  return { getPositionMap, getValueMap, getWinPositions };
}

function roadScorer(position, board, machineToken, playerToken) {
  const currentBoard = machineEyes(board);
  const currentState = currentBoard.getValueMap();
  const boardValues = currentBoard.getPositionMap();

  const possibleRoads = currentBoard
    .getWinPositions()
    .filter((array) => array.includes(position));

  // Funcion de evaluacion estatica (Meto camino, me escupe score)
  const evaluator = (road) => {
    let result = 0;
    road.forEach((item) => {
      let value = currentState[item];
      if (value === machineToken) result += 1;
      if (value === playerToken) result -= 1;
    });
    console.log("evaluator output: \n" + result + "\n" + road);

    return [result, road];
  };

  // Funcion de evaluacion de caminos (Meto array de caminos posibles, me escupe cual camino es y su score)
  let maxEval;
  const roadChecker = (Eval) => {
    maxEval = Eval;
    let bestRoad;
    possibleRoads.forEach((road) => {
      let roadScore = evaluator(road)[0];

      if (roadScore > maxEval) {
        maxEval = roadScore;
        bestRoad = road;
      }
    });
    console.log(
      `road checker output: \nBest score: ${maxEval} \nOn road: ${bestRoad} `
    );
    return [maxEval, road];
  };

  console.log(roadChecker(-Infinity));
}

GUI();
