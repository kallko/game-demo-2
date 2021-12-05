import { Coordinate, Game } from "../@type/Game";

export const game = (size: number) => {
  // two-dimensional array filled with nulls
  let game: Game = {
    board: [],
    filledCells: [],
    biggestRectangleCoordinates: [],
    biggestRectangleSize: 0,
  };

  const clear = () => {
    game.board = Array(size)
      // @ts-ignore
      .fill()
      .map(() => Array(size).fill(null));
  };

  const inBounds = (x: number, y: number) => {
    return (
      y >= 0 && y < game.board.length && x >= 0 && x < game.board[y].length
    );
  };

  const _numMatches = (x: number, y: number, dx: number, dy: number) => {
    let i = 1;
    while (
      inBounds(x + i * dx, y + i * dy) &&
      game.board[y + i * dy][x + i * dx] === game.board[y][x]
    ) {
      i++;
    }
    return i - 1;
  };

  const isWinningTurn = (x: number, y: number) => {
    return [
      [1, 1],
      [2, 2],
    ];
  };

  const makeTurn = (x: number, y: number) => {
    setFilledCells(x, y);
    game.board[y][x] = !game.board[y][x] ? 1 : null;
    getBiggestRectangle();
    return isWinningTurn(x, y);
  };

  const setFilledCells = (x: number, y: number) => {
    if (game.board[y][x]) {
      game.filledCells = game.filledCells.filter(
        (cell) => !(cell.x === x && cell.y === y)
      );
    } else {
      game.filledCells.push({ x, y });
    }
    return game.filledCells.sort(sortByDistanceToLeftTop);
  };

  const getBiggestRectangle = () => {
    game.biggestRectangleSize = 0;
    game.biggestRectangleCoordinates = [];
    game.filledCells.forEach((cell) => {
      if (game.biggestRectangleSize === 0) {
        game.biggestRectangleSize = 1;
        game.biggestRectangleCoordinates = [cell, cell];
      }
      let currentDiagonal = 1;
      let isCurrentDiagonalMaximal = false;
      let i = 0;
      while (!isCurrentDiagonalMaximal && i < 14) {
        i++;
        const rectangleToRight = getMaximumRectangleToRight(
          cell,
          currentDiagonal
        );
        if (rectangleToRight.size > game.biggestRectangleSize) {
          game.biggestRectangleSize = rectangleToRight.size;
          game.biggestRectangleCoordinates = [
            rectangleToRight.cornerCoordinates[0],
            rectangleToRight.cornerCoordinates[1],
          ];
        }

        const rectangleToBottom = getMaximumRectangleToBottom(
          cell,
          currentDiagonal
        );
        if (rectangleToBottom.size > game.biggestRectangleSize) {
          game.biggestRectangleSize = rectangleToBottom.size;
          game.biggestRectangleCoordinates = [
            rectangleToBottom.cornerCoordinates[0],
            rectangleToBottom.cornerCoordinates[1],
          ];
        }

        const nextDiagonal = getNextDiagonal(cell, currentDiagonal);
        if (currentDiagonal === nextDiagonal) {
          isCurrentDiagonalMaximal = true;
        } else {
          currentDiagonal = nextDiagonal;
        }
      }
    });
  };

  const getMaximumRectangleToRight = (cell: Coordinate, diagonal: number) => {
    let checkNextColumn = 1;
    let x;
    for (x = cell.x; x < 15 && checkNextColumn; x++) {
      for (let y = cell.y; y < cell.y + diagonal; y++) {
        checkNextColumn *= Number(game.board[y][x]);
      }
    }
    return {
      cornerCoordinates: [cell, { x: x - 2, y: cell.y + diagonal - 1 }],
      size: diagonal * (x - 1 - cell.x),
    };
  };

  const getMaximumRectangleToBottom = (cell: Coordinate, diagonal: number) => {
    let checkNextColumn = 1;
    let y;
    for (y = cell.y; y < 15 && checkNextColumn; y++) {
      for (let x = cell.x; x < cell.x + diagonal; x++) {
        checkNextColumn *= Number(game.board[y][x]);
      }
    }
    return {
      cornerCoordinates: [cell, { y: y - 2, x: cell.x + diagonal - 1 }],
      size: diagonal * (y - 1 - cell.y),
    };
  };

  const getNextDiagonal = (
    cell: Coordinate,
    currentDiagonal: number
  ): number => {
    if (cell.x + currentDiagonal <= 14 && cell.y + currentDiagonal <= 14) {
      for (let y = cell.y; y <= cell.y + currentDiagonal; y++) {
        for (let x = cell.x; x <= cell.x + currentDiagonal; x++) {
          if (!game.board[y][x]) {
            return currentDiagonal;
          }
        }
      }
      return currentDiagonal + 1;
    } else {
      return currentDiagonal;
    }
  };

  const getPotentialMaximumForCell = (cell: Coordinate): number => {
    return (15 - cell.x) * (15 - cell.y);
  };

  const getPotentialMaximumForRectangleToRight = (
    cell: Coordinate,
    diagonal: number
  ): number => {
    return diagonal * (15 - cell.x);
  };

  const getPotentialMaximumForRectangleToBottom = (
    cell: Coordinate,
    diagonal: number
  ): number => {
    return (15 - cell.y) * diagonal;
  };
  const getBoard = () => game.board;
  const getGame = (): Game => game;
  clear();
  return {
    makeTurn,
    getBoard,
    clear,
    getGame,
    getPotentialMaximumForCell,
    getPotentialMaximumForRectangleToRight,
    getPotentialMaximumForRectangleToBottom,
  };
};

function sortByDistanceToLeftTop(
  coordinateA: Coordinate,
  coordinateB: Coordinate
) {
  return coordinateA.x + coordinateA.y - coordinateB.x - coordinateB.y;
}
