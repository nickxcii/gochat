# GoChat 💬

A simple, elegant real-time chatroom application built with Node.js and Socket.IO. Create private rooms with unique codes and chat with friends in a minimal, dark-themed interface.

## ✨ Features

### 🏠 **Room Management**
- **Create Rooms**: Generate private chatrooms with unique 6-character codes
- **Join Rooms**: Enter any room using its code to join the conversation
- **Leave Rooms**: Easily switch between different rooms
- **Room Isolation**: Messages are only visible to users in the same room

### 💬 **Real-time Messaging**
- **Instant Delivery**: Messages appear immediately for all room participants
- **User Presence**: See when users join or leave your room
- **Online Counter**: Live count of active users in each room
- **Message Timestamps**: Every message shows when it was sent

### 🎨 **User Interface**
- **Minimal Design**: Clean, distraction-free black theme
- **No Registration**: Just pick a username and start chatting
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Simple flow from username → room selection → chat

### 🔧 **Technical Features**
- **Auto-reconnection**: Handles network interruptions gracefully
- **Input Validation**: Username (20 chars) and message (500 chars) limits
- **XSS Protection**: Messages are safely escaped to prevent code injection
- **Room Cleanup**: Empty rooms are automatically deleted

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nickxcii/gochat.git
   cd gochat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Creating a Room
1. Enter your username
2. Click "Create Room"
3. Optionally enter a custom room name
4. Share the generated room code with friends

### Joining a Room
1. Enter your username
2. Enter the 6-character room code
3. Click "Join Room"
4. Start chatting!

### Room Codes
- Room codes are **6 characters long** (e.g., `ABC123`)
- They contain **uppercase letters and numbers**
- Each code is **unique** and automatically generated
- Codes are **case-insensitive** when entering

## 🛠️ Project Structure

```
gochat/
├── server.js              # Express + Socket.IO server
├── package.json           # Dependencies and scripts
├── public/
│   ├── index.html        # Main HTML interface
│   ├── style.css         # Minimal dark theme styles
│   └── script.js         # Client-side Socket.IO logic
└── README.md             # This file
```

## 🔌 API Events

### Client → Server
- `create-room` - Create a new chatroom
- `join-room` - Join an existing room by code
- `message` - Send a chat message
- `leave-room` - Leave the current room

### Server → Client
- `room-created` - Room successfully created
- `room-joined` - Successfully joined a room
- `room-error` - Error joining room (invalid code)
- `message` - Incoming chat message
- `user-joined` - User joined the room
- `user-left` - User left the room
- `user-count` - Updated count of online users

## 🎯 Use Cases

- **Friend Groups**: Create private rooms for casual conversations
- **Study Groups**: Collaborate on projects with dedicated chat rooms
- **Gaming**: Coordinate with teammates in private channels
- **Events**: Set up temporary chat rooms for specific occasions
- **Teams**: Quick communication without account setup

## 🔒 Privacy & Security

- **No Data Storage**: Messages are not saved to any database
- **Temporary Rooms**: Rooms are deleted when all users leave
- **No Personal Info**: Only usernames are required (no email/phone)
- **Local Hosting**: Run on your own server for complete privacy

## 🌐 Browser Support

GoChat works on all modern browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛡️ Technical Details

- **Backend**: Node.js with Express.js framework
- **Real-time**: Socket.IO for WebSocket communication
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Pure CSS with CSS Grid/Flexbox
- **Port**: Default port 3000 (configurable via PORT env variable)

## 📱 Mobile Features

- Responsive design adapts to all screen sizes
- Touch-friendly buttons and inputs
- Optimized chat interface for mobile typing
- Swipe-friendly navigation

## 🔧 Customization

### Change the Port
```bash
PORT=8080 npm start
```

### Modify Room Code Length
Edit the `generateRoomCode()` function in `server.js`:
```javascript
for (let i = 0; i < 6; i++) { // Change 6 to desired length
```

### Customize Styling
Edit `public/style.css` to change colors, fonts, or layout.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/nickxcii/gochat/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide clear steps to reproduce any bugs

---

**Made with ❤️ using Node.js and Socket.IO**

*GoChat - Simple, private, real-time chat rooms for everyone.*