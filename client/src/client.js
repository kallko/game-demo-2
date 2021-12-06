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

const onReset = (sock) => (e) => {
  e.preventDefault();
  sock.emit("reset");
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

  const drawBoardWithBiggestRectangle = (game) => {
    game.board.forEach((row, y) => {
      row.forEach((color, x) => {
        if (!color) {
          fillCell(x, y, "#FFFFFF");
        } else {
          fillCell(x, y, "#727474");
        }
      });
    });
    const topCell = game.biggestRectangleCoordinates[0];
    if (topCell) {
      const bottomCell = game.biggestRectangleCoordinates[1];
      for (let x = topCell.x; x < bottomCell.x + 1; x++) {
        for (let y = topCell.y; y < bottomCell.y + 1; y++) {
          fillCell(x, y, "#882222");
        }
      }
    }
    log("Biggest rectangle size: " + game.biggestRectangleSize);
  };

  const playingBoard = (game = []) => {
    drawBoardWithBiggestRectangle(game);
    drawGrid();
  };

  const reset = (game = []) => {
    log("let's start new GAME");
    clear();
    drawBoardWithBiggestRectangle(game);
    drawGrid();
  };

  const getCellCoordinates = (x, y) => ({
    x: Math.floor(x / cellSize),
    y: Math.floor(y / cellSize),
  });

  return { fillCell, reset, getCellCoordinates, playingBoard };
};

(() => {
  const sock = io();
  const canvas = document.querySelector("canvas");
  const { fillCell, reset, getCellCoordinates, playingBoard } =
    createBoard(canvas);

  const onClick = (e) => {
    const { x, y } = getClickCoordinates(canvas, e);
    sock.emit("turn", getCellCoordinates(x, y));
  };

  sock.on("message", log);
  sock.on("turn", ({ x, y, color }) => {
    return fillCell(x, y, color);
  });
  sock.on("board", reset);
  sock.on("biggestRectangle", ({ game }) => {
    playingBoard(game);
  });

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onReset(sock));

  canvas.addEventListener("click", onClick);
})();
