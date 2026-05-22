/**
 * Configuration for Skillfite Game
 * Update these values to match your backend setup
 */

const SKILLFITE_CONFIG = {
    // Backend server URL - Change this to your server address
    // Local development: http://localhost:3000
    // Production: https://api.skillfite.io
    API_URL: process.env.SKILLFITE_API_URL || 'http://localhost:3000',
    
    // WebSocket URL for real-time multiplayer (if using WebSockets)
    // Example: ws://localhost:3000 or wss://api.skillfite.io
    WS_URL: process.env.SKILLFITE_WS_URL || 'ws://localhost:3000',
    
    // Game settings
    GAME_VERSION: '0.1.0',
    GAME_NAME: 'Skillfite',
    
    // Timeout for API requests (milliseconds)
    REQUEST_TIMEOUT: 10000,
    
    // Enable debug logging
    DEBUG_MODE: true,
    
    // Player settings
    DEFAULT_PLAYER_SPAWN: { x: 0, y: 0, z: 0 },
    MAX_PLAYERS_PER_GAME: 100,
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SKILLFITE_CONFIG;
}
