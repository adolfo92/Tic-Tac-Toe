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

function Controller() {
  // Cosas inherentes a interaccion
}

GameBoard().setMark("x", 1, 1);
GameBoard().setMark("O", 2, 1);
GameBoard().setMark("O", 1, 1);
GameBoard().printBoard();
