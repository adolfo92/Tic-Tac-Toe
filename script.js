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
