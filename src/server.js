import express from "express";
import userRouter from "./routes/user.ruoter.js";
import roleRouter from "./routes/role.router.js";
import authRouter from "./routes/auth.router.js";
import msgRouter from "./routes/msg.router.js";

import errorHandler from "./utils/errorHandler.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import { read, write } from "./utils/index.js";

const app = express();

// parse application/json
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(process.cwd(), "src", "uploads")));
app.use(cors("*"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

// routes
app.use(authRouter);
app.use(userRouter);
app.use(roleRouter);
app.use(msgRouter);

app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://sokcet-chat-test.netlify.app",
  },
});

let messages = read("msg");
let users = read("users");
io.on("connection", (socket) => {
  console.log(socket.handshake.auth);
  socket.on("mew-message", ({ text, userId }) => {
    const time = new Date();
    let newMsg = {
      id: +messages?.at(-1).id + 1,
      userId: +userId,
      title: text,
      type: "txt",
      created_at: time.getHours() + ":" + time.getMinutes(),
    };
    messages.push(newMsg);
    messages = messages.map((i) => {
      return {
        user: users.find((user) => user.id == i.userId),
        ...i,
      };
    });
    write("msg", messages);
    socket.emit("send-message", messages)
    socket.broadcast.emit("send-message", messages)
  });
  
});

httpServer.listen(process.env.PORT || 4001, () =>
  console.log("server is running on port 4001")
);
