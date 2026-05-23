var SpawnValidator = pc.createScript('spawnValidator');

// Map boundaries (adjust these based on your map)
SpawnValidator.attributes.add('mapMinX', { type: 'number', default: -150 });
SpawnValidator.attributes.add('mapMaxX', { type: 'number', default: 150 });
SpawnValidator.attributes.add('mapMinZ', { type: 'number', default: -150 });
SpawnValidator.attributes.add('mapMaxZ', { type: 'number', default: 150 });

// Safe spawn zone (center area - where you want players to spawn)
SpawnValidator.attributes.add('spawnMinX', { type: 'number', default: -50 });
SpawnValidator.attributes.add('spawnMaxX', { type: 'number', default: 50 });
SpawnValidator.attributes.add('spawnMinZ', { type: 'number', default: -50 });
SpawnValidator.attributes.add('spawnMaxZ', { type: 'number', default: 50 });

SpawnValidator.attributes.add('spawnEntity', { type: 'entity', description: 'The entity to spawn (your player)' });

SpawnValidator.prototype.initialize = function () {
    // If there's a spawn entity, validate and position it
    if (this.spawnEntity) {
        var validPos = this.getValidSpawnPosition();
        this.spawnEntity.setPosition(validPos);
        console.log('Player spawned at valid position:', validPos);
    }
};

// Get a random valid spawn position within the safe zone
SpawnValidator.prototype.getValidSpawnPosition = function() {
    var x = pc.math.random(this.spawnMinX, this.spawnMaxX);
    var z = pc.math.random(this.spawnMinZ, this.spawnMaxZ);
    var y = 5; // Adjust Y based on your terrain height
    return new pc.Vec3(x, y, z);
};

// Check if a position is valid (within safe spawn zone)
SpawnValidator.prototype.isValidSpawn = function(position) {
    return position.x >= this.spawnMinX && position.x <= this.spawnMaxX &&
           position.z >= this.spawnMinZ && position.z <= this.spawnMaxZ;
};

// Clamp a position to be within valid bounds
SpawnValidator.prototype.clampToValidZone = function(position) {
    position.x = Math.max(this.spawnMinX, Math.min(this.spawnMaxX, position.x));
    position.z = Math.max(this.spawnMinZ, Math.min(this.spawnMaxZ, position.z));
    return position;
};
