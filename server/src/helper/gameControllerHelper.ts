import { Coordinate, Game } from "../@type/Game";

export function sortByDistanceToLeftTop(
  coordinateA: Coordinate,
  coordinateB: Coordinate
) {
  return coordinateA.x + coordinateA.y - coordinateB.x - coordinateB.y;
}

export function setStartSearch(game: Game, cell: Coordinate): Game {
  if (game.biggestRectangleSize === 0) {
    game.biggestRectangleSize = 1;
    game.biggestRectangleCoordinates = [cell, cell];
  }
  return game;
}
