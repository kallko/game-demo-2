import { Game } from "../@type/Game";

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
    console.log("WINNG ", x, y);
    console.log("Board ", game.board);
    return [
      [1, 1],
      [2, 2],
    ];
  };

  const makeTurn = (x: number, y: number) => {
    setFilledCells(x, y);
    game.board[y][x] = !game.board[y][x] ? 1 : null;

    return isWinningTurn(x, y);
  };

  const setFilledCells = (x: number, y: number) => {
    if (game.board[y][x]) {
      return (game.filledCells = game.filledCells.filter(
        (cell) => !(cell.x === x && cell.y === y)
      ));
    }
    return game.filledCells.push({ x, y });
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
