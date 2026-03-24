require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy: origin not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ─── REST Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

// Track active rooms: roomId → { userId, adminId }
const rooms = {};

io.on('connection', (socket) => {
    console.log('[Socket] Connected:', socket.id);

    // ── User requests a human agent ──────────────────────────────────────────
    // Payload: { name, email, mood, urgency, summary }
    socket.on('live_chat_request', (data) => {
        console.log('[Socket] live_chat_request from', data.name);
        // Broadcast to all admin sockets (they listen to 'admin_channel')
        socket.join('admin_channel');
        io.to('admin_channel').emit('incoming_chat_request', {
            userId: socket.id,
            ...data,
        });
    });

    // ── Admin accepts a chat request ─────────────────────────────────────────
    // Payload: { userId }
    socket.on('admin_accept', ({ userId }) => {
        const roomId = `room_${userId}_${socket.id}`;
        rooms[roomId] = { userId, adminId: socket.id };

        socket.join(roomId);
        // Tell the user which room they joined + who accepted
        io.to(userId).emit('chat_accepted', { roomId, adminId: socket.id });
        socket.emit('chat_accepted', { roomId, userId });

        console.log(`[Socket] Room created: ${roomId}`);
    });

    // ── Admin joins admin_channel to receive requests ─────────────────────────
    socket.on('admin_join', () => {
        socket.join('admin_channel');
        console.log('[Socket] Admin joined admin_channel:', socket.id);
    });

    // ── User joins a room (after receiving chat_accepted) ─────────────────────
    socket.on('join_room', ({ roomId }) => {
        socket.join(roomId);
        console.log(`[Socket] ${socket.id} joined room ${roomId}`);
    });

    // ── Bidirectional chat message ─────────────────────────────────────────────
    // Payload: { roomId, sender ('user'|'admin'), text }
    socket.on('chat_message', ({ roomId, sender, text }) => {
        io.to(roomId).emit('chat_message', { sender, text, timestamp: Date.now() });
    });

    // ── End session ────────────────────────────────────────────────────────────
    socket.on('chat_end', ({ roomId }) => {
        io.to(roomId).emit('chat_ended');
        delete rooms[roomId];
        console.log(`[Socket] Room ended: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('[Socket] Disconnected:', socket.id);
    });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
