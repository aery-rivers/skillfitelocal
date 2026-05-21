var Trail = pc.createScript('ribbon');

Trail.attributes.add("lifetime", { type: "number", default: 0.5 });
Trail.attributes.add("xoffset", { type: "number", default: -0.8 });
Trail.attributes.add("yoffset", { type: "number", default: 1 });
Trail.attributes.add("height", { type: "number", default: 0.4 });


var MAX_VERTICES = 600;
var VERTEX_SIZE = 4;


Trail_shaderDefinition = {
    attributes: {
        aPositionAge: pc.SEMANTIC_POSITION
    },
    vshader: [
        "attribute vec4 aPositionAge;",
        "",
        "uniform mat4 matrix_viewProjection;",
        "uniform float trail_time;",
        "",
        "varying float vAge;",
        "",
        "void main(void)",
        "{",
        "    vAge = trail_time - aPositionAge.w;",
        "    gl_Position = matrix_viewProjection * vec4(aPositionAge.xyz, 1.0);",
        "}"
    ].join("\n"),
    fshader: [
        "precision mediump float;",
        "",
        "varying float vAge;",
        "",
        "uniform float trail_lifetime;",
        "",
        "vec3 grayscale(float x)",
        "{",
        "float intensity = x;",
        "return vec3(intensity, intensity, intensity);",
        "}",
        "void main(void)",
        "{",
        "    float ageFactor = vAge / trail_lifetime;",
        "    gl_FragColor = vec4(grayscale(1.0 - ageFactor), (1.0 - ageFactor) * 0.5);",
        "}"
    ].join("\n")

};

Trail.prototype.initialize = function () {



    //only run this if not already itited befored 
    if (!this.material) {
        var shader = new pc.Shader(this.app.graphicsDevice, Trail_shaderDefinition);

        this.material = new pc.Material();

        //this.material.opacityDither= pc.DITHER_BAYER8;

        this.material.shader = shader;
        this.material.setParameter('trail_time', 0);
        this.material.setParameter('trail_lifetime', this.lifetime);
        this.material.cull = pc.CULLFACE_NONE;
        this.material.blend = true;
        this.material.blendSrc = pc.BLENDMODE_SRC_ALPHA;
        this.material.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA;
        this.material.blendEquation = pc.BLENDMODE_CONSTANT_ALPHA; // pc.BLENDEQUATION_ADD;
        this.material.depthWrite = true; //false

        this.timer = 0;

        // The generated ribbon vertices data
        this.vertices = [];

        // Vertex array to use with Mesh API and update the mesh
        this.vertexData = new Float32Array(MAX_VERTICES * VERTEX_SIZE);

        // Create the array for the vertex positions
        this.vertexIndexArray = [];
        for (var i = 0; i < this.vertexData.length; ++i) {
            this.vertexIndexArray.push(i);
        }

        // Prepare the mesh to be created into a mesh instance
        this.mesh = new pc.Mesh(this.app.graphicsDevice);
        this.mesh.clear(true, false);
        this.mesh.setPositions(this.vertexData, VERTEX_SIZE, MAX_VERTICES);
        this.mesh.setIndices(this.vertexIndexArray, MAX_VERTICES);
        this.mesh.update(pc.PRIMITIVE_TRISTRIP);

        // Create the mesh instance
        var meshInstance = new pc.MeshInstance(this.mesh, this.material);

        this.entity.addComponent('render', {
            meshInstances: [meshInstance],
            layers: [this.app.scene.layers.getLayerByName('World').id]
        });

        this.entity.render.enabled = false;
    }

    this.reset();
};


Trail.prototype.reset = function () {
    //only run if already initialized before. 
    //This is run directly for players
    if(this.entity.render){
    //will be enabled next render tick
    this.entity.render.enabled = false;

    //this.vertexData = new Float32Array(MAX_VERTICES * VERTEX_SIZE);
    this.timer = 1000000000;

    this.clearOldVertices();

    this.timer = 0;
    this.vertices = [];
    }




};


Trail.prototype.spawnNewVertices = function () {
    var node = this.entity;
    var pos = node.getPosition();
    var yaxis = node.up.clone().scale(this.height);

    //console.log(`New trail pos: ${pos}`)

    var s = this.xoffset;
    var e = this.yoffset;

    var spawnTime = this.timer;
    var vertexPair = [
        pos.x + yaxis.x * s, pos.y + yaxis.y * s, pos.z + yaxis.z * s,
        pos.x + yaxis.x * e, pos.y + yaxis.y * e, pos.z + yaxis.z * e
    ];

    this.vertices.unshift({ spawnTime, vertexPair });
};


Trail.prototype.clearOldVertices = function () {
    for (var i = this.vertices.length - 1; i >= 0; i--) {
        var vp = this.vertices[i];
        if (this.timer - vp.spawnTime >= this.lifetime) {
            this.vertices.pop();
        } else {
            break;
        }
    }
};


Trail.prototype.prepareVertexData = function () {
    for (var i = 0; i < this.vertices.length; i++) {
        var vp = this.vertices[i];

        this.vertexData[i * 8 + 0] = vp.vertexPair[0];
        this.vertexData[i * 8 + 1] = vp.vertexPair[1];
        this.vertexData[i * 8 + 2] = vp.vertexPair[2];
        this.vertexData[i * 8 + 3] = vp.spawnTime;

        this.vertexData[i * 8 + 4] = vp.vertexPair[3];
        this.vertexData[i * 8 + 5] = vp.vertexPair[4];
        this.vertexData[i * 8 + 6] = vp.vertexPair[5];
        this.vertexData[i * 8 + 7] = vp.spawnTime;

        if (this.vertexData.length === i) {
            break;
        }
    }
};


Trail.prototype.update = function (dt) {
    this.timer += dt;
    this.material.setParameter('trail_time', this.timer);

    // Remove any old vertices at the end of the trail based on the timer value
    this.clearOldVertices();

    // Create new vertices on the updated position of the beginning of the trail
    this.spawnNewVertices();

    // Update the mesh
    if (this.vertices.length > 1) {
        this.prepareVertexData();
        var currentLength = this.vertices.length * 2;
        var limit = MAX_VERTICES;

        if (currentLength < limit) {
            limit = currentLength;
        }



        this.mesh.setPositions(this.vertexData, VERTEX_SIZE, limit);
        this.mesh.setIndices(this.vertexIndexArray, limit);
        this.mesh.update(pc.PRIMITIVE_TRISTRIP);
        this.entity.render.enabled = true;
    }
};
