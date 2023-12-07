var gl;
var myShaderProgram;
var alpha, beta, gamma; // Rotation angles around x, y and z axes
var transX, transY; // Translation factors along x and y axes
var textureImage;

var chairImage, deskImage, laptopImage;

function init() {
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {
    alert("WebGL is not available on this browser.");
  }
  gl.viewport(0, 0, 512, 512);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);
  myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(myShaderProgram);

  alpha = 0.0;
  beta = 0.0;
  gamma = 0.0;
  transX = 0;
  transY = 0;

  // Tetrahedron vertices
  var tetrahedronVertices = [
    0.0,
    0.5,
    -Math.sqrt(3) / 6,
    -0.5,
    -0.5,
    -Math.sqrt(3) / 6,
    0.5,
    -0.5,
    -Math.sqrt(3) / 6,

    0.0,
    0.5,
    -Math.sqrt(3) / 6,
    -0.5,
    -0.5,
    -Math.sqrt(3) / 6,
    0.0,
    0.0,
    Math.sqrt(3) / 3,

    -0.5,
    -0.5,
    -Math.sqrt(3) / 6,
    0.5,
    -0.5,
    -Math.sqrt(3) / 6,
    0.0,
    0.0,
    Math.sqrt(3) / 3,

    0.5,
    -0.5,
    -Math.sqrt(3) / 6,
    0.0,
    0.5,
    -Math.sqrt(3) / 6,
    0.0,
    0.0,
    Math.sqrt(3) / 3,
  ];

  // Tetrahedron texture
  var textureCoordinates = [
    // Face 1
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,

    // Face 2
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,

    // Face 3
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,

    // Face 4
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
  ];

  // Tetrahedron faces (filled triangles)
  var tetrahedronIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  var myImage = document.getElementById("textureImage");

  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);

  iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(tetrahedronIndices),
    gl.STATIC_DRAW
  );

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tetrahedronVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureVertexbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureVertexbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);

  var textureCoordinate = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(textureCoordinate, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(textureCoordinate);

  transXLoc = gl.getUniformLocation(myShaderProgram, "transX");
  gl.uniform1f(transXLoc, transX);
  transYLoc = gl.getUniformLocation(myShaderProgram, "transY");
  gl.uniform1f(transYLoc, transY);

  render();
}

function render() {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.uniform1f(gl.getUniformLocation(myShaderProgram, "texMap0"), 0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var numVertices = 12;

  gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_SHORT, 0);
  requestAnimFrame(render);
}

function drawTable() {
  var vertices = [
    vec4(-0.5, 0.01, -0.2), //TOP
    vec4(-0.5, -0.01, -0.2),
    vec4(0.5, -0.01, -0.2),
    vec4(0.5, 0.01, -0.2),
    vec4(0.5, 0.01, 0.2),
    vec4(-0.5, 0.01, 0.2),
    vec4(-0.5, -0.01, 0.2),
    vec4(0.5, -0.01, 0.2),

    vec4(-0.01 + 0.49, 0.1 - 0.1, -0.01 + 0.19), //LEG1
    vec4(-0.01 + 0.49, -0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 + 0.49, -0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 + 0.49, 0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 + 0.49, 0.1 - 0.1, 0.01 + 0.19),
    vec4(-0.01 + 0.49, 0.1 - 0.1, 0.01 + 0.19),
    vec4(-0.01 + 0.49, -0.1 - 0.1, 0.01 + 0.19),
    vec4(0.01 + 0.49, -0.1 - 0.1, 0.01 + 0.19),

    vec4(-0.01 - 0.49, 0.1 - 0.1, -0.01 - 0.19), //LEG2
    vec4(-0.01 - 0.49, -0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 - 0.49, -0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 - 0.49, 0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 - 0.49, 0.1 - 0.1, 0.01 - 0.19),
    vec4(-0.01 - 0.49, 0.1 - 0.1, 0.01 - 0.19),
    vec4(-0.01 - 0.49, -0.1 - 0.1, 0.01 - 0.19),
    vec4(0.01 - 0.49, -0.1 - 0.1, 0.01 - 0.19),

    vec4(-0.01 + 0.49, 0.1 - 0.1, -0.01 - 0.19), //LEG3
    vec4(-0.01 + 0.49, -0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 + 0.49, -0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 + 0.49, 0.1 - 0.1, -0.01 - 0.19),
    vec4(0.01 + 0.49, 0.1 - 0.1, 0.01 - 0.19),
    vec4(-0.01 + 0.49, 0.1 - 0.1, 0.01 - 0.19),
    vec4(-0.01 + 0.49, -0.1 - 0.1, 0.01 - 0.19),
    vec4(0.01 + 0.49, -0.1 - 0.1, 0.01 - 0.19),

    vec4(-0.01 - 0.49, 0.1 - 0.1, -0.01 + 0.19), //LEG4
    vec4(-0.01 - 0.49, -0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 - 0.49, -0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 - 0.49, 0.1 - 0.1, -0.01 + 0.19),
    vec4(0.01 - 0.49, 0.1 - 0.1, 0.01 + 0.19),
    vec4(-0.01 - 0.49, 0.1 - 0.1, 0.01 + 0.19),
    vec4(-0.01 - 0.49, -0.1 - 0.1, 0.01 + 0.19),
    vec4(0.01 - 0.49, -0.1 - 0.1, 0.01 + 0.19),
  ];

  var textureCoordinates = [
    vec2(0.0, 0.0), //top
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg1
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg2
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg3
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg4
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
  ];

  var indexList = [
    0,
    1,
    3,
    1,
    2,
    3,
    6,
    5,
    7,
    4,
    7,
    5,
    0,
    6,
    1,
    5,
    6,
    0,
    2,
    4,
    3,
    2,
    7,
    4,
    0,
    4,
    5,
    0,
    3,
    4,
    2,
    1,
    6,
    2,
    6,
    7,

    0 + 8,
    1 + 8,
    3 + 8,
    1 + 8,
    2 + 8,
    3 + 8,
    6 + 8,
    5 + 8,
    7 + 8,
    4 + 8,
    7 + 8,
    5 + 8,
    0 + 8,
    6 + 8,
    1 + 8,
    5 + 8,
    6 + 8,
    0 + 8,
    2 + 8,
    4 + 8,
    3 + 8,
    2 + 8,
    7 + 8,
    4 + 8,
    0 + 8,
    4 + 8,
    5 + 8,
    0 + 8,
    3 + 8,
    4 + 8,
    2 + 8,
    1 + 8,
    6 + 8,
    2 + 8,
    6 + 8,
    7 + 8,

    0 + 16,
    1 + 16,
    3 + 16,
    1 + 16,
    2 + 16,
    3 + 16,
    6 + 16,
    5 + 16,
    7 + 16,
    4 + 16,
    7 + 16,
    5 + 16,
    0 + 16,
    6 + 16,
    1 + 16,
    5 + 16,
    6 + 16,
    0 + 16,
    2 + 16,
    4 + 16,
    3 + 16,
    2 + 16,
    7 + 16,
    4 + 16,
    0 + 16,
    4 + 16,
    5 + 16,
    0 + 16,
    3 + 16,
    4 + 16,
    2 + 16,
    1 + 16,
    6 + 16,
    2 + 16,
    6 + 16,
    7 + 16,

    0 + 24,
    1 + 24,
    3 + 24,
    1 + 24,
    2 + 24,
    3 + 24,
    6 + 24,
    5 + 24,
    7 + 24,
    4 + 24,
    7 + 24,
    5 + 24,
    0 + 24,
    6 + 24,
    1 + 24,
    5 + 24,
    6 + 24,
    0 + 24,
    2 + 24,
    4 + 24,
    3 + 24,
    2 + 24,
    7 + 24,
    4 + 24,
    0 + 24,
    4 + 24,
    5 + 24,
    0 + 24,
    3 + 24,
    4 + 24,
    2 + 24,
    1 + 24,
    6 + 24,
    2 + 24,
    6 + 24,
    7 + 24,

    0 + 32,
    1 + 32,
    3 + 32,
    1 + 32,
    2 + 32,
    3 + 32,
    6 + 32,
    5 + 32,
    7 + 32,
    4 + 32,
    7 + 32,
    5 + 32,
    0 + 32,
    6 + 32,
    1 + 32,
    5 + 32,
    6 + 32,
    0 + 32,
    2 + 32,
    4 + 32,
    3 + 32,
    2 + 32,
    7 + 32,
    4 + 32,
    0 + 32,
    4 + 32,
    5 + 32,
    0 + 32,
    3 + 32,
    4 + 32,
    2 + 32,
    1 + 32,
    6 + 32,
    2 + 32,
    6 + 32,
    7 + 32,
  ];

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indexList),
    gl.STATIC_DRAW
  );

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var myPosition = gl.getAttribLocation(myShaderProgram, "myPosition");
  gl.vertexAttribPointer(myPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(myPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, deskImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.drawElements(gl.TRIANGLES, 180, gl.UNSIGNED_BYTE, 0);
}

function drawChair() {
  var vertices = [
    vec4(-0.1 + transX, 0.01, -0.1 - 0.5), //BOTTOM
    vec4(-0.1 + transX, -0.01, -0.1 - 0.5),
    vec4(0.1 + transX, -0.01, -0.1 - 0.5),
    vec4(0.1 + transX, 0.01, -0.1 - 0.5),
    vec4(0.1 + transX, 0.01, 0.1 - 0.5),
    vec4(-0.1 + transX, 0.01, 0.1 - 0.5),
    vec4(-0.1 + transX, -0.01, 0.1 - 0.5),
    vec4(0.1 + transX, -0.01, 0.1 - 0.5),

    vec4(-0.01 - 0.09 + transX, 0.1 + 0.09, -0.1 - 0.5), //BACK
    vec4(-0.01 - 0.09 + transX, -0.1 + 0.09, -0.1 - 0.5),
    vec4(0.01 - 0.09 + transX, -0.1 + 0.09, -0.1 - 0.5),
    vec4(0.01 - 0.09 + transX, 0.1 + 0.09, -0.1 - 0.5),
    vec4(0.01 - 0.09 + transX, 0.1 + 0.09, 0.1 - 0.5),
    vec4(-0.01 - 0.09 + transX, 0.1 + 0.09, 0.1 - 0.5),
    vec4(-0.01 - 0.09 + transX, -0.1 + 0.09, 0.1 - 0.5),
    vec4(0.01 - 0.09 + transX, -0.1 + 0.09, 0.1 - 0.5),

    vec4(-0.01 + 0.09 + transX, 0.1 - 0.1, -0.01 - 0.59), //LEG1
    vec4(-0.01 + 0.09 + transX, -0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 + 0.09 + transX, -0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 + 0.09 + transX, 0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 + 0.09 + transX, 0.1 - 0.1, 0.01 - 0.59),
    vec4(-0.01 + 0.09 + transX, 0.1 - 0.1, 0.01 - 0.59),
    vec4(-0.01 + 0.09 + transX, -0.1 - 0.1, 0.01 - 0.59),
    vec4(0.01 + 0.09 + transX, -0.1 - 0.1, 0.01 - 0.59),

    vec4(-0.01 - 0.09 + transX, 0.1 - 0.1, -0.01 - 0.59), //LEG2
    vec4(-0.01 - 0.09 + transX, -0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 - 0.09 + transX, -0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 - 0.09 + transX, 0.1 - 0.1, -0.01 - 0.59),
    vec4(0.01 - 0.09 + transX, 0.1 - 0.1, 0.01 - 0.59),
    vec4(-0.01 - 0.09 + transX, 0.1 - 0.1, 0.01 - 0.59),
    vec4(-0.01 - 0.09 + transX, -0.1 - 0.1, 0.01 - 0.59),
    vec4(0.01 - 0.09 + transX, -0.1 - 0.1, 0.01 - 0.59),

    vec4(-0.01 + 0.09 + transX, 0.1 - 0.1, -0.01 - 0.41), //LEG3
    vec4(-0.01 + 0.09 + transX, -0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 + 0.09 + transX, -0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 + 0.09 + transX, 0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 + 0.09 + transX, 0.1 - 0.1, 0.01 - 0.41),
    vec4(-0.01 + 0.09 + transX, 0.1 - 0.1, 0.01 - 0.41),
    vec4(-0.01 + 0.09 + transX, -0.1 - 0.1, 0.01 - 0.41),
    vec4(0.01 + 0.09 + transX, -0.1 - 0.1, 0.01 - 0.41),

    vec4(-0.01 - 0.09 + transX, 0.1 - 0.1, -0.01 - 0.41), //LEG4
    vec4(-0.01 - 0.09 + transX, -0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 - 0.09 + transX, -0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 - 0.09 + transX, 0.1 - 0.1, -0.01 - 0.41),
    vec4(0.01 - 0.09 + transX, 0.1 - 0.1, 0.01 - 0.41),
    vec4(-0.01 - 0.09 + transX, 0.1 - 0.1, 0.01 - 0.41),
    vec4(-0.01 - 0.09 + transX, -0.1 - 0.1, 0.01 - 0.41),
    vec4(0.01 - 0.09 + transX, -0.1 - 0.1, 0.01 - 0.41),
  ];

  var textureCoordinates = [
    vec2(0.0, 0.0), //bottom
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //back
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg1
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg2
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg3
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),

    vec2(0.0, 0.0), //leg4
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
  ];

  var indexList = [
    0,
    1,
    3,
    1,
    2,
    3,
    6,
    5,
    7,
    4,
    7,
    5,
    0,
    6,
    1,
    5,
    6,
    0,
    2,
    4,
    3,
    2,
    7,
    4,
    0,
    4,
    5,
    0,
    3,
    4,
    2,
    1,
    6,
    2,
    6,
    7,

    0 + 8,
    1 + 8,
    3 + 8,
    1 + 8,
    2 + 8,
    3 + 8,
    6 + 8,
    5 + 8,
    7 + 8,
    4 + 8,
    7 + 8,
    5 + 8,
    0 + 8,
    6 + 8,
    1 + 8,
    5 + 8,
    6 + 8,
    0 + 8,
    2 + 8,
    4 + 8,
    3 + 8,
    2 + 8,
    7 + 8,
    4 + 8,
    0 + 8,
    4 + 8,
    5 + 8,
    0 + 8,
    3 + 8,
    4 + 8,
    2 + 8,
    1 + 8,
    6 + 8,
    2 + 8,
    6 + 8,
    7 + 8,

    0 + 16,
    1 + 16,
    3 + 16,
    1 + 16,
    2 + 16,
    3 + 16,
    6 + 16,
    5 + 16,
    7 + 16,
    4 + 16,
    7 + 16,
    5 + 16,
    0 + 16,
    6 + 16,
    1 + 16,
    5 + 16,
    6 + 16,
    0 + 16,
    2 + 16,
    4 + 16,
    3 + 16,
    2 + 16,
    7 + 16,
    4 + 16,
    0 + 16,
    4 + 16,
    5 + 16,
    0 + 16,
    3 + 16,
    4 + 16,
    2 + 16,
    1 + 16,
    6 + 16,
    2 + 16,
    6 + 16,
    7 + 16,

    0 + 24,
    1 + 24,
    3 + 24,
    1 + 24,
    2 + 24,
    3 + 24,
    6 + 24,
    5 + 24,
    7 + 24,
    4 + 24,
    7 + 24,
    5 + 24,
    0 + 24,
    6 + 24,
    1 + 24,
    5 + 24,
    6 + 24,
    0 + 24,
    2 + 24,
    4 + 24,
    3 + 24,
    2 + 24,
    7 + 24,
    4 + 24,
    0 + 24,
    4 + 24,
    5 + 24,
    0 + 24,
    3 + 24,
    4 + 24,
    2 + 24,
    1 + 24,
    6 + 24,
    2 + 24,
    6 + 24,
    7 + 24,

    0 + 32,
    1 + 32,
    3 + 32,
    1 + 32,
    2 + 32,
    3 + 32,
    6 + 32,
    5 + 32,
    7 + 32,
    4 + 32,
    7 + 32,
    5 + 32,
    0 + 32,
    6 + 32,
    1 + 32,
    5 + 32,
    6 + 32,
    0 + 32,
    2 + 32,
    4 + 32,
    3 + 32,
    2 + 32,
    7 + 32,
    4 + 32,
    0 + 32,
    4 + 32,
    5 + 32,
    0 + 32,
    3 + 32,
    4 + 32,
    2 + 32,
    1 + 32,
    6 + 32,
    2 + 32,
    6 + 32,
    7 + 32,

    0 + 40,
    1 + 40,
    3 + 40,
    1 + 40,
    2 + 40,
    3 + 40,
    6 + 40,
    5 + 40,
    7 + 40,
    4 + 40,
    7 + 40,
    5 + 40,
    0 + 40,
    6 + 40,
    1 + 40,
    5 + 40,
    6 + 40,
    0 + 40,
    2 + 40,
    4 + 40,
    3 + 40,
    2 + 40,
    7 + 40,
    4 + 40,
    0 + 40,
    4 + 40,
    5 + 40,
    0 + 40,
    3 + 40,
    4 + 40,
    2 + 40,
    1 + 40,
    6 + 40,
    2 + 40,
    6 + 40,
    7 + 40,
  ];

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(indexList),
    gl.STATIC_DRAW
  );

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var myPosition = gl.getAttribLocation(myShaderProgram, "myPosition");
  gl.vertexAttribPointer(myPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(myPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW);

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, chairImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.drawElements(gl.TRIANGLES, 216, gl.UNSIGNED_BYTE, 0);
}

// Add event listeners to detect keypresses
document.addEventListener("keydown", function (event) {
  if (event.key === "z") {
    rotateAroundX();
  } else if (event.key === "x") {
    rotateAroundY();
  } else if (event.key === "c") {
    rotateAroundZ();
  }

  // Translation
  else if (event.key === "l") {
    translateUpOnX();
  } else if (event.key === "j") {
    translateDownOnX();
  } else if (event.key === "i") {
    translateUpOnY();
  } else if (event.key === "k") {
    translateDownOnY();
  }
});

function rotateAroundX() {
  alpha = alpha + 0.1;
  alphaLoc = gl.getUniformLocation(myShaderProgram, "alpha");
  gl.uniform1f(alphaLoc, alpha);
}
function rotateAroundY() {
  beta = beta + 0.1;
  betaLoc = gl.getUniformLocation(myShaderProgram, "beta");
  gl.uniform1f(betaLoc, beta);
}
function rotateAroundZ() {
  gamma = gamma + 0.1;
  gammaLoc = gl.getUniformLocation(myShaderProgram, "gamma");
  gl.uniform1f(gammaLoc, gamma);
}

function translateUpOnX() {
  transX = transX + 0.1;
  transXLoc = gl.getUniformLocation(myShaderProgram, "transX");
  gl.uniform1f(transXLoc, transX);
}

function translateDownOnX() {
  transX = transX - 0.1;
  transXLoc = gl.getUniformLocation(myShaderProgram, "transX");
  gl.uniform1f(transXLoc, transX);
}

function translateUpOnY() {
  transY = transY + 0.1;
  transYLoc = gl.getUniformLocation(myShaderProgram, "transY");
  gl.uniform1f(transYLoc, transY);
}

function translateDownOnY() {
  transY = transY - 0.1;
  transYLoc = gl.getUniformLocation(myShaderProgram, "transY");
  gl.uniform1f(transYLoc, transY);
}
