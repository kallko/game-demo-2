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
    it("after first turn size of filled cells should be 1", () => {
      gameController.makeTurn(1, 2);
      const game = gameController.getGame();
      expect(game.filledCells.length).equal(1);
    });
    it("after two turns size of filled cells should be 2", () => {
      gameController.makeTurn(1, 2);
      gameController.makeTurn(2, 2);
      const game = gameController.getGame();
      expect(game.filledCells.length).equal(2);
    });
    it("after three turns (one in the same cell) size of filled cells should be 1", () => {
      gameController.makeTurn(1, 2);
      gameController.makeTurn(2, 2);
      gameController.makeTurn(1, 2);
      const game = gameController.getGame();
      expect(game.filledCells.length).equal(1);
    });
    it("after three turns (one in the same cell) filled cells should has 1 element x: 2, y: 2", () => {
      gameController.makeTurn(1, 2);
      gameController.makeTurn(2, 2);
      gameController.makeTurn(1, 2);
      const game = gameController.getGame();
      expect(game.filledCells[0]).deep.equal({ x: 2, y: 2 });
    });
    it("filled cells should be sorted", () => {
      gameController.makeTurn(1, 1);
      gameController.makeTurn(2, 2);
      gameController.makeTurn(5, 5);
      const game = gameController.getGame();
      expect(game.filledCells).deep.equal([
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 5, y: 5 },
      ]);
    });
    it("filled cells should be sorted with different turns", () => {
      gameController.makeTurn(5, 5);
      gameController.makeTurn(2, 2);
      gameController.makeTurn(1, 1);
      const game = gameController.getGame();
      expect(game.filledCells).deep.equal([
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 5, y: 5 },
      ]);
    });
  });
});
