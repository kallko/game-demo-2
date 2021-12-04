import * as BoardController from "../src/controller/boardController";
import { expect } from "chai";

describe("Fleet Battle tests:", function () {
  let boardObject: any;
  beforeEach("board Creation", () => {
    boardObject = BoardController.board(15);
  });
  describe("init game", () => {
    it("Game Init", () => {
      const game = boardObject.getGame();
      expect(game.hasOwnProperty("board")).true;
      expect(Array.isArray(game.board)).true;
      expect(game.hasOwnProperty("filledCells")).true;
      expect(Array.isArray(game.filledCells)).true;
      expect(game.hasOwnProperty("biggestRectangleCoordinates")).true;
      expect(Array.isArray(game.biggestRectangleCoordinates)).true;
      expect(game.hasOwnProperty("biggestRectangleSize")).true;
      expect(typeof game.biggestRectangleSize).equal("number");
    });
    it("Board Init", () => {
      const board = boardObject.getBoard();
      board.forEach((row: number[]) => {
        expect(row.length).equal(15);
        row.forEach((cell: number) => expect(cell).equal(null));
      });
    });
  });
});
