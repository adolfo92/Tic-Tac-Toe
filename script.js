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
    console.log(board[row][column].getValue());
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

  return { printBoard, setMark, getBoard };
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

function Controller(playerOne = "Player One", playerTwo = "Player Two") {
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
    console.log(`Es el turno de ${activePlayer.name}`);
  };

  const playRound = (column, row) => {
    board.setMark(activePlayer.token, column, row);
    switchTurn();
    newRound();
  };

  newRound();

  return { setToken, playRound, getActivePlayer };
}

const game = Controller();
