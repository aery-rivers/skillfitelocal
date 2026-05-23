# Skillfite Local Server Setup Guide

This guide will help you set up and run your own **private Skillfite server** that works independently from skillfite.io.

## What This Does

- **Standalone Server**: A completely independent multiplayer server running on your local machine
- **No External Dependencies**: Works even if skillfite.io is down
- **Private Access**: Only you can connect (by default, from localhost)
- **Real-time Multiplayer**: WebSocket support for live player interactions
- **RESTful API**: Full game API for player management, game state, and actions

## Requirements

- **Node.js** 14.x or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **express**: Web framework for the REST API
- **ws**: WebSocket library for real-time multiplayer
- **cors**: Enable cross-origin requests
- **nodemon**: Auto-reload server during development (optional)

### 2. Start the Server

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   Skillfite Local Server Running       ║
╚════════════════════════════════════════╝

Server: http://localhost:3000
WebSocket: ws://localhost:3000
```

### 3. Connect Your Game Client

The game client (`index.html`) needs to be updated to connect to your local server instead of skillfite.io.

#### Option A: Use the provided connector library

Add this to your `index.html` or game script:

```html
<script src="local-client-connector.js"></script>
<script>
  // Initialize local server connection
  const connector = new SkillfiteLocalConnector({
    serverUrl: 'http://localhost:3000',
    wsUrl: 'ws://localhost:3000',
    playerName: 'YourPlayerName'
  });

  connector.init().then(() => {
    console.log('Connected to local server!');
    
    // Listen for events
    connector.on('playerMoved', (message) => {
      console.log('Player moved:', message);
    });

    connector.on('chat', (message) => {
      console.log(`${message.playerName}: ${message.message}`);
    });
  });
</script>
```

#### Option B: Manual API Integration

Update your game code to make requests to `http://localhost:3000` instead of `https://skillfite.io`.

## API Endpoints

### Health Check
```
GET /api/health
```

Returns server status and player count.

### Game State
```
GET /api/gamestate
```

Returns all players, entities, and world information.

### Create Player
```
POST /api/players
Content-Type: application/json

{
  "name": "PlayerName"
}
```

### Get Player
```
GET /api/players/{playerId}
```

### Update Player
```
PUT /api/players/{playerId}
Content-Type: application/json

{
  "position": { "x": 100, "y": 200, "z": 0 },
  "health": 95
}
```

## WebSocket Events

The WebSocket server handles real-time multiplayer communication.

### Client → Server

**Join Game**
```json
{
  "type": "join",
  "playerId": "player_xxx",
  "data": { "playerId": "player_xxx" }
}
```

**Player Movement**
```json
{
  "type": "playerMove",
  "data": {
    "playerId": "player_xxx",
    "position": { "x": 100, "y": 200, "z": 0 },
    "rotation": { "x": 0, "y": 0, "z": 0 }
  }
}
```

**Player Action**
```json
{
  "type": "playerAction",
  "data": {
    "playerId": "player_xxx",
    "action": "attack",
    "target": "player_yyy"
  }
}
```

**Chat Message**
```json
{
  "type": "chat",
  "data": {
    "playerId": "player_xxx",
    "message": "Hello everyone!"
  }
}
```

### Server → Client

**Join Acknowledged**
```json
{
  "type": "joinAck",
  "playerId": "player_xxx",
  "player": { /* player object */ },
  "gameState": { /* full game state */ }
}
```

**Player Moved**
```json
{
  "type": "playerMoved",
  "playerId": "player_xxx",
  "position": { "x": 100, "y": 200, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0 }
}
```

**Player Joined**
```json
{
  "type": "playerJoined",
  "player": { /* player object */ }
}
```

**Player Disconnected**
```json
{
  "type": "playerDisconnected",
  "playerId": "player_xxx"
}
```

**Chat Message**
```json
{
  "type": "chat",
  "playerId": "player_xxx",
  "playerName": "PlayerName",
  "message": "Hello!",
  "timestamp": 1234567890000
}
```

## Configuration

Edit `server.js` to customize:

```javascript
const PORT = 3000;                    // Server port
const MAX_PLAYERS = 100;              // Maximum concurrent players
const GAME_STATE_UPDATE_INTERVAL = 100; // Game tick rate (ms)
```

## Connecting from Other Machines

By default, the server only accepts connections from `localhost` (your own machine).

### To allow other machines on your local network:

1. Find your machine's local IP:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` (look for inet address)

2. Other machines can connect to: `http://YOUR_IP:3000`

### To allow internet access (not recommended for security):

1. Use port forwarding on your router
2. Or use a tunneling service like [ngrok](https://ngrok.com/)

```bash
ngrok http 3000
```

Then use the provided URL to connect.

## Troubleshooting

### Port Already in Use
```bash
# Windows: Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### WebSocket Connection Failed
- Verify server is running
- Check firewall settings
- Ensure you're using the correct URL (`ws://` not `http://`)

### Players Not Seeing Each Other
- Verify all clients are connected to the same server
- Check WebSocket messages in browser DevTools (Network tab)

## Development Notes

### Adding Features

1. Add new API endpoints in `server.js`
2. Add WebSocket message handlers in `handleWebSocketMessage()`
3. Update `local-client-connector.js` with corresponding client methods

### Example: Add a new action

```javascript
// server.js
case 'playerSpeak':
  if (gameState.players.has(data.playerId)) {
    broadcastToAll({
      type: 'playerSpoke',
      playerId: data.playerId,
      message: data.message,
    });
  }
  break;
```

```javascript
// local-client-connector.js
sendSpeak(message) {
  this.send({
    type: 'playerSpeak',
    data: {
      playerId: this.playerId,
      message,
    },
  });
}
```

## Next Steps

1. ✅ Start the server (`npm start`)
2. ✅ Include `local-client-connector.js` in your game
3. ✅ Update game client to use the connector
4. ✅ Test with multiple players
5. ✅ Customize game rules and features

## Support

For issues or questions, check:
- Server console logs (terminal where you ran `npm start`)
- Browser DevTools Console (F12 → Console)
- Browser Network tab (WebSocket connections)

## License

MIT
