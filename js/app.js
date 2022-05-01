const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";

const PAWN = "pawn";
const QUEEN = "queen";
const CHECKERS_BOARD_ID = "checkers-board";

let game;
let table;
let selectedPiece;

function tryUpdateSelectedPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("possible-move");
      table.rows[i].cells[j].classList.remove("selected");
    }
  }

  // Show possible moves
  const piece = game.boardData.getPiece(row, col);
  if (piece !== undefined) {
    let possibleMoves = game.getPossibleMoves(piece);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add("possible-move");
    }
  }

  table.rows[row].cells[col].classList.add("selected");
  selectedPiece = piece;
}

function onCellClick(row, col) {
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    selectedPiece = undefined;
    // Recreate whole board - this is not efficient, but doesn't affect user experience
    createCheckersBoard(game.boardData);
  } else {
    tryUpdateSelectedPiece(row, col);
  }
}

// Adds an image to cell with the piece's image
function addImage(cell, player, name) {
  const image = document.createElement("img");
  image.src = "images/" + player + "/" + name + ".png";
  image.draggable = false;
  cell.appendChild(image);
}

function createCheckersBoard(boardData) {
  table = document.getElementById(CHECKERS_BOARD_ID);

  if (table !== null) {
    table.remove();
  }

  // Create empty checkers board HTML:
  table = document.createElement("table");
  table.id = CHECKERS_BOARD_ID;
  document.body.appendChild(table);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = "light-cell";
      } else {
        cell.className = "dark-cell";
      }
      cell.addEventListener("click", () => onCellClick(row, col));
    }
  }

  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }

  if (game.winner !== undefined) {
    const winnerPopup = document.createElement("div");
    const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
    winnerPopup.textContent = winner + " player wins!";
    winnerPopup.classList.add("winner-dialog");
    table.appendChild(winnerPopup);
  }
}

function initGame() {
  game = new Game(WHITE_PLAYER);
  createCheckersBoard(game.boardData);
}

window.addEventListener("load", initGame);
