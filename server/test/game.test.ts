import * as GameController from "../src/controller/GameController";
import { expect } from "chai";

describe("Game tests:", function () {
  let gameController: any;
  beforeEach("game init", () => {
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
    describe("getBiggestRectangle", () => {
      it("after first turn, biggestRectangle has size 1 and same coordinates for lft-top and bottom-right", () => {
        gameController.makeTurn(5, 5);
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(1);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 5, y: 5 },
          { x: 5, y: 5 },
        ]);
      });
    });
    describe("check mat helpers ", () => {
      it("get potential maximum for cell 0 0", () => {
        const result = gameController.getPotentialMaximumForCell({
          x: 0,
          y: 0,
        });
        expect(result).equal(225);
      });
      it("get potential maximum for cell 4 4", () => {
        const result = gameController.getPotentialMaximumForCell({
          x: 5,
          y: 5,
        });
        expect(result).equal(100);
      });
      it("get potential maximum for cell 14 14", () => {
        const result = gameController.getPotentialMaximumForCell({
          x: 14,
          y: 14,
        });
        expect(result).equal(1);
      });
      it("get rectangle to right potential maximum for cell 0 0 and diagonal 1", () => {
        const result = gameController.getPotentialMaximumForRectangleToRight(
          {
            x: 0,
            y: 0,
          },
          1
        );
        expect(result).equal(15);
      });
      it("get rectangle to right potential maximum for cell 0 14 and diagonal 1", () => {
        const result = gameController.getPotentialMaximumForRectangleToRight(
          {
            x: 14,
            y: 0,
          },
          1
        );
        expect(result).equal(1);
      });
      it("get rectangle to right potential maximum for cell 12 12 and diagonal 3", () => {
        const result = gameController.getPotentialMaximumForRectangleToRight(
          {
            x: 12,
            y: 12,
          },
          3
        );
        expect(result).equal(9);
      });
      it("get rectangle to right potential maximum for cell 0 1 and diagonal 3", () => {
        const result = gameController.getPotentialMaximumForRectangleToRight(
          {
            x: 0,
            y: 1,
          },
          3
        );
        expect(result).equal(45);
      });
      it("get rectangle to bottom potential maximum for cell 0 0 and diagonal 3", () => {
        const result = gameController.getPotentialMaximumForRectangleToBottom(
          {
            x: 0,
            y: 0,
          },
          3
        );
        expect(result).equal(45);
      });
      it("get rectangle to bottom potential maximum for cell 10 10 and diagonal 4", () => {
        const result = gameController.getPotentialMaximumForRectangleToBottom(
          {
            x: 10,
            y: 10,
          },
          4
        );
        expect(result).equal(20);
      });
    });
    describe("Check best rectangle findings", () => {
      it("Check Rectangle from 1 cell", () => {
        const turns = [{ x: 0, y: 0 }];
        turns.forEach((turn) => gameController.makeTurn(turn.x, turn.y));
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(1);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ]);
      });
      it("Check Rectangle from 4 cell", () => {
        const turns = [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ];
        turns.forEach((turn) => gameController.makeTurn(turn.x, turn.y));
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(4);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ]);
      });
      it("Check Rectangle from 9 cell (square 3x3)", () => {
        const turns = [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
          { x: 2, y: 0 },
          { x: 2, y: 1 },
          { x: 2, y: 2 },
        ];
        turns.forEach((turn) => gameController.makeTurn(turn.x, turn.y));
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(9);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 0, y: 0 },
          { x: 2, y: 2 },
        ]);
      });
      it("Check Rectangle from 9 cell (square 3x3) with margin", () => {
        const turns = [
          { x: 5, y: 0 },
          { x: 5, y: 1 },
          { x: 5, y: 2 },
          { x: 6, y: 0 },
          { x: 6, y: 1 },
          { x: 6, y: 2 },
          { x: 7, y: 0 },
          { x: 7, y: 1 },
          { x: 7, y: 2 },
        ];
        turns.forEach((turn) => gameController.makeTurn(turn.x, turn.y));
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(9);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 5, y: 0 },
          { x: 7, y: 2 },
        ]);
      });
      it("Check Rectangle from 8 cell l-forma", () => {
        const turns = [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 0, y: 3 },
          { x: 1, y: 3 },
          { x: 2, y: 2 },
          { x: 2, y: 3 },
        ];
        turns.forEach((turn) => gameController.makeTurn(turn.x, turn.y));
        const game = gameController.getGame();
        expect(game.biggestRectangleSize).equal(8);
        expect(game.biggestRectangleCoordinates).deep.equal([
          { x: 0, y: 0 },
          { x: 1, y: 3 },
        ]);
      });
    });
  });
});
