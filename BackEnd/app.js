require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 8000;

/* =========================
   SOCKET.IO SETUP
========================= */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

/* Make io accessible in controllers if needed */
app.set("io", io);

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   DATABASE
========================= */
mongoose
  .connect("mongodb://localhost:27017/Chatting")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

/* =========================
   ROUTES
========================= */
app.use("/user", require("./routes/LoginRoute"));
app.use("/message", require("./routes/MessageRoutes"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server running");
});

/* =========================
   SOCKET LOGIC
========================= */
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // Join personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  // Real-time send message
  socket.on("sendMessage", async (data) => {
    try {
      const { sender, receiver, message } = data;

      const Message = require("./models/MessageModel");

      // Save message in DB
      const newMessage = await Message.create({
        sender,
        receiver,
        message
      });

      // Send to receiver
      io.to(receiver).emit("receiveMessage", newMessage);

      // Send back to sender (for instant UI update)
      io.to(sender).emit("receiveMessage", newMessage);

    } catch (err) {
      console.log("Socket Error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});