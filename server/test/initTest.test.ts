import * as BoardController from "../src/controller/boardController";
import { expect } from "chai";

describe("Fleet Battle tests:", function () {
  let boardObject: any;
  beforeEach("board Creation", () => {
    boardObject = BoardController.board(15);
  });
  it("Board Init", () => {
    const board = boardObject.getBoard();
    board.forEach((row: number[]) => {
      expect(row.length).equal(15);
      row.forEach((cell: number) => expect(cell).equal(null));
    });
  });
});
