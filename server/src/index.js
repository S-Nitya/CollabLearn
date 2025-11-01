const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
require('dotenv').config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 5000;

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// --- Models (ensure paths are correct) ---
const User = require('./models/User');
const Message = require('./models/Message');

// --- Socket.IO Real-time Logic ---
// Track online users
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  // Handle user going online
  socket.on("user_online", (userId) => {
    if (!userId) {
      return;
    }

    // Remove any existing entry for this user (in case of reconnection)
    for (const [existingUserId, existingSocketId] of onlineUsers.entries()) {
      if (existingUserId === userId && existingSocketId !== socket.id) {
        onlineUsers.delete(existingUserId);
      }
    }

    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Send current online users list to the newly connected user
    const currentOnlineUsers = Array.from(onlineUsers.keys());
    socket.emit("online_users_list", { onlineUsers: currentOnlineUsers });
    
    // Broadcast to all OTHER connected clients that this user is online
    socket.broadcast.emit("user_status_change", { userId, isOnline: true });
  });

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("chat message", async (msg) => {
    try {
      const saved = await Message.create(msg);
      // Emit to everyone in the room EXCEPT the sender to avoid duplication
      socket.to(msg.chatId).emit("chat message", saved);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("typing", (data) => {
    socket.to(data.chatId).emit("user typing", data);
  });

  socket.on("stopped typing", (data) => {
    socket.to(data.chatId).emit("user stopped typing", data);
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      // Broadcast to all connected clients that this user is offline
      socket.broadcast.emit("user_status_change", { userId: socket.userId, isOnline: false });
    }
  });
});

// --- Middleware ---
// Simple and robust CORS configuration
app.use((req, res, next) => {
  // Set CORS headers for all requests
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Enable gzip compression to reduce payload size
app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collablearn';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('📴 MongoDB disconnected'));

// --- API Routes ---

// Chat-specific routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '_id name email');
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

// Existing application routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts')); // Corrected path to match convention
app.use('/api/skills', require('./routes/skills'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));

console.log('✅ All routes loaded, including /api/admin routes');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'CollabLearn API Running!' });
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

