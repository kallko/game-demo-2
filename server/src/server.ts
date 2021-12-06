import express from "express";
import http from "http";
// @ts-ignore
import socketIo from "socket.io";
import { game } from "./controller/gameController";

const app = express();
const clientPath = `${__dirname}/../../client`;

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketIo(server);
const { makeTurn, clear, getBoard, getGame } = game(15);

io.on("connection", (sock: socketIo) => {
  const onTurn = ({ x, y }: { x: number; y: number }) => {
    makeTurn(x, y);
    io.emit("turn", { game: getGame(), x, y });
    io.emit("biggestRectangle", {
      board: getBoard(),
      game: getGame(),
    });
  };

  const onRreset = () => {
    clear();
    io.emit("message", "Let's play another Game");
    io.emit("biggestRectangle", {
      board: getBoard(),
      game: getGame(),
    });
  };
  sock.on("turn", onTurn);
  sock.on("reset", onRreset);
  sock.emit("board", getGame());
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(8090, () => {
  console.log("server started on 8090");
});
