const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const User = require('./models/User');
const Message = require('./models/Message');

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined room ${chatId}`);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left room ${chatId}`);
  });

  socket.on("chat message", async (msg) => {
    try {
      const saved = await Message.create(msg);
      // FIXED: Use socket.to() instead of io.to() to broadcast only to other clients
      // This prevents the sender from receiving their own message again
      socket.to(msg.chatId).emit("chat message", saved);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle typing events
  socket.on("typing", (data) => {
    console.log(`User ${data.userId} is typing in ${data.chatId}`);
    // Broadcast to other users in the room
    socket.to(data.chatId).emit("user typing", data);
  });

  socket.on("stopped typing", (data) => {
    console.log(`User ${data.userId} stopped typing in ${data.chatId}`);
    // Broadcast to other users in the room
    socket.to(data.chatId).emit("user stopped typing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collablearn';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('📴 MongoDB disconnected'));

// APIs
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id name avatar email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/messages/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ time: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/skills', require('./routes/skills'));

app.get('/', (req, res) => {
  res.json({ message: 'CollabLearn API Running!' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});