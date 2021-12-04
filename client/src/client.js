const getClickCoordinates = (element, event) => {
  const { top, left } = element.getBoundingClientRect();
  const { clientX, clientY } = event;
  return {
    x: clientX - left,
    y: clientY - top,
  };
};

const log = (text) => {
  const parent = document.querySelector("#events");
  const el = document.createElement("li");
  el.innerHTML = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();

  const input = document.querySelector("#chat");
  const text = input.value;
  input.value = "";

  sock.emit("message", text);
};

const createBoard = (canvas, numCells = 15) => {
  const ctx = canvas.getContext("2d");

  const cellSize = Math.floor(300 / numCells);

  const fillCell = (x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, 20, 20);
  };

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawGrid = () => {
    ctx.beginPath();

    for (let i = 0; i < numCells + 1; i++) {
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, numCells * cellSize);

      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(numCells * cellSize, i * cellSize);
    }

    ctx.stroke();
  };

  const drawBoard = (board) => {
    board.forEach((row, y) => {
      row.forEach((color, x) => {
        color && fillCell(x, y, "grey");
      });
    });
  };

  const onTurn = (board, x, y) => {
    console.log("Board x, y", board, x, y);
  };

  const drawBoardWithBiggestRectangle = (board) => {
    board.forEach((row, y) => {
      row.forEach((color, x) => {
        if (!color) {
          fillCell(x, y, "white");
        } else {
          fillCell(x, y, "grey");
        }
      });
    });
  };

  const playingBoard = (board = [], one) => {
    drawGrid();
    drawBoardWithBiggestRectangle(board, one);
    drawGrid();
  };

  const reset = (game = []) => {
    clear();
    drawGrid();
    drawBoard(game.board);
  };

  const getCellCoordinates = (x, y) => ({
    x: Math.floor(x / cellSize),
    y: Math.floor(y / cellSize),
  });

  return { fillCell, reset, getCellCoordinates, playingBoard, onTurn };
};

(() => {
  // log("chat is disabled on this server");

  const sock = io();
  const canvas = document.querySelector("canvas");
  const { fillCell, reset, getCellCoordinates, playingBoard, onTurn } =
    createBoard(canvas);

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    sock.emit("turn", getCellCoordinates(x, y));
  };

  sock.on("message", log);
  sock.on("turn", ({ board, x, y, color }) => {
    onTurn(board, x, y);
    return fillCell(x, y, color);
  });
  sock.on("board", reset);
  sock.on("biggestRectangle", ({ board, biggestRectangle }) => {
    playingBoard(board, biggestRectangle);
  });

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onChatSubmitted(sock));

  canvas.addEventListener("click", onClick);
})();
