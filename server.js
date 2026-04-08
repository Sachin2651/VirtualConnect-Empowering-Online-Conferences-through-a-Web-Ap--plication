// Improved server.js for Virtual Connect (Video Meeting App)

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname));

// Static files
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Create new meeting (secure UUID)
app.get("/new", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// Room route
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", (roomId, userId, username) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId, username);

    console.log(`${username} joined room ${roomId}`);

    // Chat message
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, username);
    });

    // Disconnect
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
      console.log(`${username} left room ${roomId}`);
    });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

