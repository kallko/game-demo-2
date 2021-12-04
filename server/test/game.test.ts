import * as GameController from "../src/controller/GameController";
import { expect } from "chai";

describe("Fleet Battle tests:", function () {
  let gameController: any;
  beforeEach("board Creation", () => {
    gameController = GameController.game(15);
  });
  describe("init game", () => {
    it("Game Init", () => {
      const game = gameController.getGame();
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
      const board = gameController.getBoard();
      board.forEach((row: number[]) => {
        expect(row.length).equal(15);
        row.forEach((cell: number) => expect(cell).equal(null));
      });
    });
  });
  describe("turn test", () => {
    it("after turn cell should change value", () => {
      gameController.makeTurn(1, 2);
      const board = gameController.getBoard();
      expect(board[2][1]).equal(1);
    });
    it("after 2 turn in one cell should not change value", () => {
      gameController.makeTurn(1, 2);
      gameController.makeTurn(1, 2);
      const board = gameController.getBoard();
      expect(board[2][1]).equal(null);
    });
  });
});
