var MobileUisizeAdjust = pc.createScript('mobileUisizeAdjust');

// initialize code called once per entity
MobileUisizeAdjust.prototype.initialize = function() {
    // Adjust UI scale based on device pixel ratio for mobile devices
    var scale = window.devicePixelRatio || 1;
    if (scale > 1) {
        // Scale UI elements for high-DPI mobile devices
        this.entity.setLocalScale(scale, scale, scale);
    }
};

// update code called every frame
MobileUisizeAdjust.prototype.update = function(dt) {
    // Handle any runtime UI adjustments if needed
};

// swap method called for script hot-reloading
// inherit your script state here
// MobileUisizeAdjust.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/
