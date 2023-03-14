const path = require("path");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");

const app = express();
const httpServer = createServer(app); // create a server with app
const io = new Server(httpServer);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatbay bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to chatbay"));

    // Broadcast when a user connects(except the user everyone will know that a nee user is connected)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //send users and room info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //io.emit(); ---> This is for all users in general

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // This is when a user disconnects, ironic that this is inside a connection!!!
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const PORT = process.env.port || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
