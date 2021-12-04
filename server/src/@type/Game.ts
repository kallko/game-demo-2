export interface Game {
  board: (number | null)[][];
  filledCells: Coordinate[];
  biggestRectangleCoordinates: [Coordinate, Coordinate] | [];
  biggestRectangleSize: number;
}

export interface Coordinate {
  x: number;
  y: number;
}
