// Initialize Socket.IO connection
const socket = io();

// DOM elements
const usernameScreen = document.getElementById('username-screen');
const roomScreen = document.getElementById('room-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const continueBtn = document.getElementById('continue-btn');
const roomNameInput = document.getElementById('room-name-input');
const roomCodeInput = document.getElementById('room-code-input');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const backToUsernameBtn = document.getElementById('back-to-username-btn');
const currentUsernameSpan = document.getElementById('current-username');
const userCountSpan = document.getElementById('user-count');
const roomNameSpan = document.getElementById('room-name');
const roomCodeDisplay = document.getElementById('room-code-display');
const leaveRoomBtn = document.getElementById('leave-room-btn');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

let currentUsername = '';
let currentRoomCode = '';
let currentRoomName = '';

// Username screen functionality
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        continueToRoomScreen();
    }
});

continueBtn.addEventListener('click', continueToRoomScreen);

function continueToRoomScreen() {
    const username = usernameInput.value.trim();
    
    if (username.length === 0) {
        alert('Please enter a username');
        return;
    }
    
    if (username.length > 20) {
        alert('Username must be 20 characters or less');
        return;
    }
    
    currentUsername = username;
    currentUsernameSpan.textContent = username;
    
    // Switch to room screen
    usernameScreen.classList.add('hidden');
    roomScreen.classList.remove('hidden');
    
    // Focus on room name input
    roomNameInput.focus();
}

// Room screen functionality
roomNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createRoom();
    }
});

roomCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

createRoomBtn.addEventListener('click', createRoom);
joinRoomBtn.addEventListener('click', joinRoom);
backToUsernameBtn.addEventListener('click', backToUsername);

// Auto-uppercase room code input
roomCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});

function createRoom() {
    const roomName = roomNameInput.value.trim();
    
    if (!currentUsername) {
        alert('Please enter a username first');
        return;
    }
    
    // Send create room event to server
    socket.emit('create-room', {
        username: currentUsername,
        roomName: roomName || `${currentUsername}'s Room`
    });
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!currentUsername) {
        alert('Please enter a username first');
        return;
    }
    
    if (roomCode.length !== 6) {
        alert('Please enter a valid 6-character room code');
        return;
    }
    
    // Send join room event to server
    socket.emit('join-room', {
        username: currentUsername,
        roomCode: roomCode
    });
}

function backToUsername() {
    roomScreen.classList.add('hidden');
    usernameScreen.classList.remove('hidden');
    usernameInput.focus();
}

// Chat functionality
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);
leaveRoomBtn.addEventListener('click', leaveRoom);

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message.length === 0) return;
    
    if (message.length > 500) {
        alert('Message must be 500 characters or less');
        return;
    }
    
    // Send message to server
    socket.emit('message', { message: message });
    
    // Clear input
    messageInput.value = '';
}

function leaveRoom() {
    if (confirm('Are you sure you want to leave this room?')) {
        socket.emit('leave-room');
    }
}

function switchToChat(roomCode, roomName) {
    currentRoomCode = roomCode;
    currentRoomName = roomName;
    
    // Update UI
    roomNameSpan.textContent = roomName;
    roomCodeDisplay.textContent = `Room Code: ${roomCode}`;
    
    // Clear messages
    messagesContainer.innerHTML = '';
    
    // Switch to chat screen
    roomScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    
    // Focus on message input
    messageInput.focus();
    
    // Add welcome message
    addSystemMessage(`Welcome to ${roomName}!`);
    addSystemMessage(`Share room code "${roomCode}" with others to invite them.`);
}

// Socket event listeners
socket.on('room-created', (data) => {
    switchToChat(data.roomCode, data.roomName);
});

socket.on('room-joined', (data) => {
    switchToChat(data.roomCode, data.roomName);
});

socket.on('room-error', (errorMessage) => {
    alert(errorMessage);
});

socket.on('room-left', () => {
    // Reset room info
    currentRoomCode = '';
    currentRoomName = '';
    
    // Clear form inputs
    roomNameInput.value = '';
    roomCodeInput.value = '';
    
    // Switch back to room screen
    chatScreen.classList.add('hidden');
    roomScreen.classList.remove('hidden');
    
    // Focus on room name input
    roomNameInput.focus();
});

socket.on('message', (data) => {
    addMessage(data.username, data.message, data.timestamp, data.username === currentUsername);
});

socket.on('user-joined', (username) => {
    addSystemMessage(`${username} joined the room`);
});

socket.on('user-left', (username) => {
    addSystemMessage(`${username} left the room`);
});

socket.on('user-count', (count) => {
    const userText = count === 1 ? 'user' : 'users';
    userCountSpan.textContent = `${count} ${userText} online`;
});

// Message display functions
function addMessage(username, message, timestamp, isCurrentUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    if (isCurrentUser) {
        messageDiv.style.alignSelf = 'flex-end';
    }
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(username)}</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    container.scrollTop = container.scrollHeight;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    addSystemMessage('Disconnected from server. Attempting to reconnect...');
});

socket.on('reconnect', () => {
    addSystemMessage('Reconnected to server!');
    if (currentUsername && currentRoomCode) {
        socket.emit('join-room', {
            username: currentUsername,
            roomCode: currentRoomCode
        });
    }
});

// Focus on username input when page loads
window.addEventListener('load', () => {
    usernameInput.focus();
});