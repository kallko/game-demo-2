import { Coordinate, Game } from "../@type/Game";
import {
  getPotentialMaximumForCell,
  getPotentialMaximumForRectangleToBottom,
  getPotentialMaximumForRectangleToRight,
  setStartSearch,
  sortByDistanceToLeftTop,
} from "../helper/gameControllerHelper";

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
    game.filledCells = [];
    game.biggestRectangleCoordinates = [];
    game.biggestRectangleSize = 0;
  };

  const makeTurn = (x: number, y: number) => {
    setFilledCells(x, y);
    game.board[y][x] = !game.board[y][x] ? 1 : null;
    return getBiggestRectangle();
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
      setStartSearch(game, cell);
      if (getPotentialMaximumForCell(cell) > game.biggestRectangleSize) {
        let currentDiagonal = 1;
        let isCurrentDiagonalMaximal = false;

        while (!isCurrentDiagonalMaximal) {
          const potentialMaximumToRight =
            getPotentialMaximumForRectangleToRight(cell, currentDiagonal);
          const potentialMaximumToBottom =
            getPotentialMaximumForRectangleToBottom(cell, currentDiagonal);
          if (
            potentialMaximumToRight > game.biggestRectangleSize ||
            potentialMaximumToBottom > game.biggestRectangleSize
          ) {
            if (potentialMaximumToRight > potentialMaximumToBottom) {
              checkToRight(cell, currentDiagonal);
              checkToBottom(cell, currentDiagonal);
            } else {
              checkToBottom(cell, currentDiagonal);
              checkToRight(cell, currentDiagonal);
            }
          }

          if (currentDiagonal === getNextDiagonal(cell, currentDiagonal)) {
            isCurrentDiagonalMaximal = true;
          } else {
            currentDiagonal++;
          }
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
      cornerCoordinates: [
        cell,
        { x: checkNextColumn ? 14 : x - 2, y: cell.y + diagonal - 1 },
      ],
      size: diagonal * (x - 1 - cell.x + checkNextColumn),
    };
  };

  const getMaximumRectangleToBottom = (cell: Coordinate, diagonal: number) => {
    let checkNextRow = 1;
    let y;
    for (y = cell.y; y < 15 && checkNextRow; y++) {
      for (let x = cell.x; x < cell.x + diagonal; x++) {
        checkNextRow *= Number(game.board[y][x]);
      }
    }
    return {
      cornerCoordinates: [
        cell,
        { y: checkNextRow ? 14 : y - 2, x: cell.x + diagonal - 1 },
      ],
      size: diagonal * (y - 1 - cell.y + checkNextRow),
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

  const setNewMaximum = (rectangle: {
    cornerCoordinates: Coordinate[];
    size: number;
  }) => {
    game.biggestRectangleSize = rectangle.size;
    game.biggestRectangleCoordinates = [
      rectangle.cornerCoordinates[0],
      rectangle.cornerCoordinates[1],
    ];
  };

  const checkToRight = (cell: Coordinate, currentDiagonal: number) => {
    if (
      getPotentialMaximumForRectangleToRight(cell, currentDiagonal) >
      game.biggestRectangleSize
    ) {
      const rectangleToRight = getMaximumRectangleToRight(
        cell,
        currentDiagonal
      );
      if (rectangleToRight.size > game.biggestRectangleSize) {
        setNewMaximum(rectangleToRight);
      }
    }
  };

  const checkToBottom = (cell: Coordinate, currentDiagonal: number) => {
    if (
      getPotentialMaximumForRectangleToBottom(cell, currentDiagonal) >
      game.biggestRectangleSize
    ) {
      const rectangleToBottom = getMaximumRectangleToBottom(
        cell,
        currentDiagonal
      );
      if (rectangleToBottom.size > game.biggestRectangleSize) {
        setNewMaximum(rectangleToBottom);
      }
    }
  };

  const getBoard = () => game.board;
  const getGame = (): Game => game;

  clear();

  return {
    makeTurn,
    getBoard,
    clear,
    getGame,
  };
};
