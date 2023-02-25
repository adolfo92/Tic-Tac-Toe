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

  const playRound = (column, row) => {
    board.setMark(activePlayer.token, column, row);
    if (board.checkForWinning(activePlayer.token)) {
      board.printBoard();
      console.log(`Jugador [${activePlayer.name}] gano la partida`);
      return;
    }
    switchTurn();
    newRound();
  };

  newRound();

  return { setToken, playRound, getActivePlayer, getBoard: board.printBoard };
}

const game = Controller();

game.playRound(0, 0);
game.playRound(1, 2);
game.playRound(0, 1);
game.playRound(2, 2);
game.playRound(0, 2);
game.playRound(2, 1);
