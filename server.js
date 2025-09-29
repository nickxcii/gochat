const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Store active users and rooms
const users = new Map(); // socketId -> { username, roomCode }
const rooms = new Map(); // roomCode -> { name, createdAt, users: Set }

// Generate unique room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check if code already exists
    if (rooms.has(result)) {
        return generateRoomCode();
    }
    return result;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle creating a new room
    socket.on('create-room', (data) => {
        if (data.username && data.username.trim()) {
            const roomCode = generateRoomCode();
            const roomName = data.roomName ? data.roomName.trim() : `${data.username.trim()}'s Room`;
            
            // Create room
            rooms.set(roomCode, {
                name: roomName,
                createdAt: new Date(),
                users: new Set([socket.id])
            });
            
            // Store user info
            users.set(socket.id, {
                username: data.username.trim(),
                roomCode: roomCode
            });
            
            // Join the socket room
            socket.join(roomCode);
            
            // Send room created confirmation
            socket.emit('room-created', {
                roomCode: roomCode,
                roomName: roomName
            });
            
            // Send user count for this room
            socket.emit('user-count', 1);
            
            console.log(`${data.username} created room ${roomCode}: ${roomName}`);
        }
    });

    // Handle joining an existing room
    socket.on('join-room', (data) => {
        if (data.username && data.username.trim() && data.roomCode && data.roomCode.trim()) {
            const roomCode = data.roomCode.trim().toUpperCase();
            const username = data.username.trim();
            
            if (rooms.has(roomCode)) {
                // Join the room
                rooms.get(roomCode).users.add(socket.id);
                users.set(socket.id, {
                    username: username,
                    roomCode: roomCode
                });
                
                // Join the socket room
                socket.join(roomCode);
                
                // Notify others in the room
                socket.to(roomCode).emit('user-joined', username);
                
                // Send room joined confirmation
                socket.emit('room-joined', {
                    roomCode: roomCode,
                    roomName: rooms.get(roomCode).name
                });
                
                // Send updated user count to all users in room
                const roomUserCount = rooms.get(roomCode).users.size;
                io.to(roomCode).emit('user-count', roomUserCount);
                
                console.log(`${username} joined room ${roomCode}`);
            } else {
                socket.emit('room-error', 'Room not found. Please check the room code.');
            }
        }
    });

    // Handle chat messages
    socket.on('message', (data) => {
        const userInfo = users.get(socket.id);
        if (userInfo && data.message && data.message.trim()) {
            const messageData = {
                username: userInfo.username,
                message: data.message.trim(),
                timestamp: new Date().toLocaleTimeString()
            };
            
            // Broadcast message to all users in the same room
            io.to(userInfo.roomCode).emit('message', messageData);
            console.log(`${userInfo.username} in ${userInfo.roomCode}: ${data.message}`);
        }
    });

    // Handle leaving room
    socket.on('leave-room', () => {
        const userInfo = users.get(socket.id);
        if (userInfo && userInfo.roomCode) {
            leaveRoom(socket, userInfo);
            socket.emit('room-left');
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        const userInfo = users.get(socket.id);
        if (userInfo && userInfo.roomCode) {
            leaveRoom(socket, userInfo);
        }
        console.log('User disconnected:', socket.id);
    });

    // Helper function to handle leaving room
    function leaveRoom(socket, userInfo) {
        const roomCode = userInfo.roomCode;
        const username = userInfo.username;
        
        // Remove user from room
        if (rooms.has(roomCode)) {
            rooms.get(roomCode).users.delete(socket.id);
            
            // If room is empty, delete it
            if (rooms.get(roomCode).users.size === 0) {
                rooms.delete(roomCode);
                console.log(`Room ${roomCode} deleted (empty)`);
            } else {
                // Notify others in room
                socket.to(roomCode).emit('user-left', username);
                
                // Send updated user count
                const roomUserCount = rooms.get(roomCode).users.size;
                io.to(roomCode).emit('user-count', roomUserCount);
            }
        }
        
        // Leave the socket room
        socket.leave(roomCode);
        
        // Remove user info
        users.delete(socket.id);
        
        console.log(`${username} left room ${roomCode}`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});