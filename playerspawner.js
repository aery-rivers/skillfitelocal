var PlayerSpawner = pc.createScript('playerSpawner');

// Safe spawn zone settings
PlayerSpawner.attributes.add('spawnRadiusX', { type: 'number', default: 50, description: 'Safe spawn zone radius on X axis' });
PlayerSpawner.attributes.add('spawnRadiusZ', { type: 'number', default: 50, description: 'Safe spawn zone radius on Z axis' });
PlayerSpawner.attributes.add('spawnCenterX', { type: 'number', default: 0, description: 'Center of spawn zone (X)' });
PlayerSpawner.attributes.add('spawnCenterZ', { type: 'number', default: 0, description: 'Center of spawn zone (Z)' });
PlayerSpawner.attributes.add('spawnHeight', { type: 'number', default: 5, description: 'Y position to spawn at' });

PlayerSpawner.prototype.initialize = function () {
    // Called when script loads
};

// Get a random valid spawn position
PlayerSpawner.prototype.getSpawnPosition = function () {
    var x = this.spawnCenterX + pc.math.random(-this.spawnRadiusX, this.spawnRadiusX);
    var z = this.spawnCenterZ + pc.math.random(-this.spawnRadiusZ, this.spawnRadiusZ);
    var y = this.spawnHeight;
    
    console.log('Spawning player at:', x, y, z);
    return new pc.Vec3(x, y, z);
};

// Spawn the player at a safe location
PlayerSpawner.prototype.spawnPlayer = function (playerEntity) {
    if (!playerEntity) {
        console.error('No player entity provided to spawn');
        return;
    }
    
    var spawnPos = this.getSpawnPosition();
    playerEntity.setPosition(spawnPos);
    
    // Reset rigidbody if it exists
    if (playerEntity.rigidbody) {
        playerEntity.rigidbody.linearVelocity = pc.Vec3.ZERO;
        playerEntity.rigidbody.angularVelocity = pc.Vec3.ZERO;
    }
};

// Force respawn if player goes out of bounds
PlayerSpawner.prototype.update = function (dt) {
    // Optional: Check if player is out of bounds and respawn
};
