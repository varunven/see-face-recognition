const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("see-request", (data) => {
    console.log('Received data:', data);
    io.emit("see-request", data);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
