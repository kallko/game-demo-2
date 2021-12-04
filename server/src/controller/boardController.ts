export const board = (size: number) => {
  // two-dimensional array filled with nulls
  let board: number[][] | null[][];

  const clear = () => {
    board = Array(size)
      // @ts-ignore
      .fill()
      .map(() => Array(size).fill(null));
  };

  const inBounds = (x: number, y: number) => {
    return y >= 0 && y < board.length && x >= 0 && x < board[y].length;
  };

  const _numMatches = (x: number, y: number, dx: number, dy: number) => {
    let i = 1;
    while (
      inBounds(x + i * dx, y + i * dy) &&
      board[y + i * dy][x + i * dx] === board[y][x]
    ) {
      i++;
    }
    return i - 1;
  };

  const isWinningTurn = (x: number, y: number) => {
    console.log("WINNG ", x, y);
    console.log("Board ", board);
    return [
      [1, 1],
      [2, 2],
    ];
  };

  const makeTurn = (x: number, y: number, _value: number | string) => {
    board[y][x] = !board[y][x] ? 1 : null;
    return isWinningTurn(x, y);
  };

  const getBoard = () => board;

  clear();
  return {
    makeTurn,
    getBoard,
    clear,
  };
};
