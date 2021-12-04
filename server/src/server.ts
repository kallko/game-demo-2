import express from "express";
import http from "http";
// @ts-ignore
import socketIo from "socket.io";
import { board } from "./controller/boardController";
const createCoolDown = require("./create-cooldown");

const app = express();
const clientPath = `${__dirname}/../../client`;

console.log(`serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketIo(server);
const { makeTurn, clear, getBoard, getGame } = board(15);

io.on("connection", (sock: socketIo) => {
  const color = 1;

  // increase number to have cooldown between turns
  const coolDown = createCoolDown(10);

  const onTurn = ({ x, y }: { x: number; y: number }) => {
    if (coolDown()) {
      io.emit("turn", { game: getGame(), x, y, color });
      const biggestRectangle = makeTurn(x, y, color);
      io.emit("biggestRectangle", {
        board: getBoard(),
        biggestRectangle: [
          [0, 0],
          [1, 1],
        ],
      });
      // if (!playerWin) {
      //   sock.emit("message", "YOU WIN");
      //   io.emit("message", "new round");
      //   clear();
      //   io.emit("board");
      // }
    }
  };

  sock.on("message", (text: string) => io.emit("message", text));
  sock.on("turn", onTurn);

  sock.emit("board", getGame());
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(8090, () => {
  console.log("server started on 8090");
});
