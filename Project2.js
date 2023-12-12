var gl;
var myShaderProgram;
var textureImage;

function init() {
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) {
    alert("WebGL is not available on this browser.");
  }
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, 512, 512);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(myShaderProgram);

  alpha = 0.0;
  beta = 0.0;
  gamma = 0.0;
  transX = 0;
  transY = 0;

  // eye
  var eye = vec3(0.0, 1.5, 3);
  var at = vec3(0.0, 0.0, 0.0); // at point
  var vup = vec3(0.0, 1.0, 0.0); // up vector
  var n = normalize(vec3(eye[0] - at[0], eye[1] - at[1], eye[2] - at[2]));
  var u = normalize(cross(vup, n));
  var v = normalize(cross(n, u));

  var M = [
    u[0],
    v[0],
    n[0],
    0.0,
    u[1],
    v[1],
    n[1],
    0.0,
    u[2],
    v[2],
    n[2],
    0.0,
    -dot(eye, u),
    -dot(eye, v),
    -dot(eye, n),
    1.0,
  ];

  var Minvt = [
    u[0],
    v[0],
    n[0],
    eye[0],
    u[1],
    v[1],
    n[1],
    eye[1],
    u[2],
    v[2],
    n[2],
    eye[2],
    0.0,
    0.0,
    0.0,
    1.0,
  ];

  var nearPlane = 0.1;
  var farPlane = 100.0;
  var rightPlane = 0.1;
  var leftPlane = -rightPlane;
  var topPlane = 0.1;
  var bottomPlane = -topPlane;

  var P_persp = [
    (2.0 * nearPlane) / (rightPlane - leftPlane),
    0.0,
    0.0,
    0.0,
    0.0,
    (2.0 * nearPlane) / (topPlane - bottomPlane),
    0.0,
    0.0,
    (rightPlane + leftPlane) / (rightPlane - leftPlane),
    (topPlane + bottomPlane) / (topPlane - bottomPlane),
    -(farPlane + nearPlane) / (farPlane - nearPlane),
    -1.0,
    0.0,
    0.0,
    (-2.0 * farPlane * nearPlane) / (farPlane - nearPlane),
    0.0,
  ];

  first_light();
  second_light();

  var Muniform = gl.getUniformLocation(myShaderProgram, "M");
  gl.uniformMatrix4fv(Muniform, false, M);
  var Minvtuniform = gl.getUniformLocation(myShaderProgram, "Minvt");
  gl.uniformMatrix4fv(Minvtuniform, false, Minvt);
  var Ppuniform = gl.getUniformLocation(myShaderProgram, "P_persp");
  gl.uniformMatrix4fv(Ppuniform, false, P_persp);

  transXLoc = gl.getUniformLocation(myShaderProgram, "transX");
  gl.uniform1f(transXLoc, transX);
  transYLoc = gl.getUniformLocation(myShaderProgram, "transY");
  gl.uniform1f(transYLoc, transY);

  render();
}

function first_light() {
  ////////////// 1st (Point Light Source) //////////////

  // Set up coefficients for the object (ambient, diffuse, specular, shininess)

  var p0 = [0.0, 0.0, -10.0]; // only for Point Light Source

  var Ia = [0.1, 0.1, 0.1];
  var Id = [0.8, 0.8, 0.8];
  var Is = [0.8, 0.8, 0.8];

  var ka = [0.5, 0.5, 0.5];
  var kd = [0.5, 0.5, 0.5];
  var ks = [1.0, 1.0, 1.0];

  var alpha1 = 4.0;

  // send coefficients to the shader program

  var p0loc = gl.getUniformLocation(myShaderProgram, "p0");
  var Ialoc = gl.getUniformLocation(myShaderProgram, "Ia");
  var Idloc = gl.getUniformLocation(myShaderProgram, "Id");
  var Isloc = gl.getUniformLocation(myShaderProgram, "Is");
  var kaloc = gl.getUniformLocation(myShaderProgram, "ka");
  var kdloc = gl.getUniformLocation(myShaderProgram, "kd");
  var ksloc = gl.getUniformLocation(myShaderProgram, "ks");
  var alphaloc = gl.getUniformLocation(myShaderProgram, "alpha1");

  gl.uniform3fv(p0loc, p0);
  gl.uniform3fv(Ialoc, Ia);
  gl.uniform3fv(Idloc, Id);
  gl.uniform3fv(Isloc, Is);
  gl.uniform3fv(kaloc, ka);
  gl.uniform3fv(kdloc, kd);
  gl.uniform3fv(ksloc, ks);
  gl.uniform1f(alphaloc, alpha);
}

function second_light() {
  ////////////// 2nd (Directional Light) //////////////

  // Set up coefficients for the object (ambient, diffuse, specular, shininess)

  var direction = [0.0, 10.0, 10.0];

  var Ia2 = [0.2, 0.1, 0.2];
  var Id2 = [1.1, 0.5, 0.7];
  var Is2 = [0.8, 0.8, 0.8];

  var ka2 = [0.5, 0.5, 0.5];
  var kd2 = [0.5, 0.5, 0.5];
  var ks2 = [1.0, 1.0, 1.0];

  var alpha2 = 3.0;

  // send coefficients to the shader program

  var Ia2loc = gl.getUniformLocation(myShaderProgram, "Ia2");
  var Id2loc = gl.getUniformLocation(myShaderProgram, "Id2");
  var Is2loc = gl.getUniformLocation(myShaderProgram, "Is2");
  var ka2loc = gl.getUniformLocation(myShaderProgram, "ka2");
  var kd2loc = gl.getUniformLocation(myShaderProgram, "kd2");
  var ks2loc = gl.getUniformLocation(myShaderProgram, "ks2");
  var directionLoc = gl.getUniformLocation(myShaderProgram, "direction");
  var alpha2loc = gl.getUniformLocation(myShaderProgram, "alpha2");

  gl.uniform3fv(Ia2loc, Ia2);
  gl.uniform3fv(Id2loc, Id2);
  gl.uniform3fv(Is2loc, Is2);
  gl.uniform3fv(ka2loc, ka2);
  gl.uniform3fv(kd2loc, kd2);
  gl.uniform3fv(ks2loc, ks2);
  gl.uniform3fv(directionLoc, direction);
  gl.uniform1f(alpha2loc, alpha2);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawBox();
  drawTableTop();
  drawTableLeg();
  drawChairSeat();
  drawChairBackRest();
  drawChairLegs();
  requestAnimFrame(render);
}

function drawTableTop() {
  // Vertices for the table top
  var tableTopVertices = [
    // Front face
    -1.5,
    0.1,
    1.0, // Vertex 0
    1.5,
    0.1,
    1.0, // Vertex 1
    1.5,
    0.2,
    1.0, // Vertex 2
    -1.5,
    0.2,
    1.0, // Vertex 3

    // Back face
    -1.5,
    0.1,
    -1.0, // Vertex 4
    -1.5,
    0.2,
    -1.0, // Vertex 5
    1.5,
    0.2,
    -1.0, // Vertex 6
    1.5,
    0.1,
    -1.0, // Vertex 7

    // Top face
    -1.5,
    0.2,
    -1.0, // Vertex 3 (Repeated for continuity)
    -1.5,
    0.2,
    1.0, // Vertex 2 (Repeated for continuity)
    1.5,
    0.2,
    1.0, // Vertex 6 (Repeated for continuity)
    1.5,
    0.2,
    -1.0, // Vertex 7 (Repeated for continuity)

    // Bottom face
    -1.5,
    0.1,
    -1.0, // Vertex 4 (Repeated for continuity)
    1.5,
    0.1,
    -1.0, // Vertex 7 (Repeated for continuity)
    1.5,
    0.1,
    1.0, // Vertex 1 (Repeated for continuity)
    -1.5,
    0.1,
    1.0, // Vertex 0 (Repeated for continuity)

    // Right face
    1.5,
    0.1,
    -1.0, // Vertex 7 (Repeated for continuity)
    1.5,
    0.2,
    -1.0, // Vertex 6 (Repeated for continuity)
    1.5,
    0.2,
    1.0, // Vertex 2 (Repeated for continuity)
    1.5,
    0.1,
    1.0, // Vertex 1 (Repeated for continuity)

    // Left face
    -1.5,
    0.1,
    -1.0, // Vertex 4 (Repeated for continuity)
    -1.5,
    0.1,
    1.0, // Vertex 0 (Repeated for continuity)
    -1.5,
    0.2,
    1.0, // Vertex 3 (Repeated for continuity)
    -1.5,
    0.2,
    -1.0, // Vertex 5 (Repeated for continuity)
  ];

  // Texture coordinates for the table top
  var tableTopTextureCoordinates = [
    // Front
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3

    // Back
    1.0,
    0.0, // Vertex 4 (Flipped)
    0.0,
    0.0, // Vertex 5 (Flipped)
    0.0,
    1.0, // Vertex 6 (Flipped)
    1.0,
    1.0, // Vertex 7 (Flipped)

    // Top
    0.0,
    1.0, // Vertex 3 (Repeated for continuity)
    1.0,
    1.0, // Vertex 2 (Repeated for continuity)
    1.0,
    0.0, // Vertex 6 (Repeated for continuity)
    0.0,
    0.0, // Vertex 7 (Repeated for continuity)

    // Bottom
    0.0,
    0.0, // Vertex 4 (Repeated for continuity)
    1.0,
    0.0, // Vertex 7 (Repeated for continuity)
    1.0,
    1.0, // Vertex 1 (Repeated for continuity)
    0.0,
    1.0, // Vertex 0 (Repeated for continuity)

    // Right
    1.0,
    0.0, // Vertex 7 (Repeated for continuity)
    0.0,
    0.0, // Vertex 6 (Repeated for continuity)
    0.0,
    1.0, // Vertex 2 (Repeated for continuity)
    1.0,
    1.0, // Vertex 1 (Repeated for continuity)

    // Left
    0.0,
    0.0, // Vertex 4 (Repeated for continuity)
    1.0,
    0.0, // Vertex 0 (Repeated for continuity)
    1.0,
    1.0, // Vertex 3 (Repeated for continuity)
    0.0,
    1.0, // Vertex 5 (Repeated for continuity)
  ];

  // Index list for rendering the table top
  var tableTopIndexList = [
    0,
    1,
    2,
    0,
    2,
    3, // Front face
    4,
    5,
    6,
    4,
    6,
    7, // Back face
    8,
    9,
    10,
    8,
    10,
    11, // Top face
    12,
    13,
    14,
    12,
    14,
    15, // Bottom face
    16,
    17,
    18,
    16,
    18,
    19, // Right face
    20,
    21,
    22,
    20,
    22,
    23, // Left face
  ];

  var myImage = document.getElementById("tablePicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(tableTopIndexList),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tableTopVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(tableTopTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(gl.TRIANGLES, tableTopIndexList.length, gl.UNSIGNED_BYTE, 0);
}

function drawTableLeg() {
  // Vertices for the table leg
  var tableLegVertices = [
    // Front right leg
    1.4,
    -0.8,
    0.9, // Vertex 0
    1.5,
    -0.8,
    0.9, // Vertex 1
    1.5,
    0.2,
    0.9, // Vertex 2
    1.4,
    0.2,
    0.9, // Vertex 3

    // Front left leg
    -1.5,
    -0.8,
    0.9, // Vertex 4
    -1.4,
    -0.8,
    0.9, // Vertex 5
    -1.4,
    0.2,
    0.9, // Vertex 6
    -1.5,
    0.2,
    0.9, // Vertex 7

    // Back left leg
    -1.5,
    -0.8,
    -0.9, // Vertex 8
    -1.4,
    -0.8,
    -0.9, // Vertex 9
    -1.4,
    0.2,
    -0.9, // Vertex 10
    -1.5,
    0.2,
    -0.9, // Vertex 11

    // Back right leg
    1.4,
    -0.8,
    -0.9, // Vertex 12
    1.5,
    -0.8,
    -0.9, // Vertex 13
    1.5,
    0.2,
    -0.9, // Vertex 14
    1.4,
    0.2,
    -0.9, // Vertex 15
  ];

  // Texture coordinates for the table legs
  var tableLegTextureCoordinates = [
    // Front right leg
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3

    // Front left leg
    0.0,
    0.0, // Vertex 4
    1.0,
    0.0, // Vertex 5
    1.0,
    1.0, // Vertex 6
    0.0,
    1.0, // Vertex 7

    // Back left leg
    0.0,
    0.0, // Vertex 8
    1.0,
    0.0, // Vertex 9
    1.0,
    1.0, // Vertex 10
    0.0,
    1.0, // Vertex 11

    // Back right leg
    0.0,
    0.0, // Vertex 12
    1.0,
    0.0, // Vertex 13
    1.0,
    1.0, // Vertex 14
    0.0,
    1.0, // Vertex 15
  ];

  // Index list for rendering the table legs
  var tableLegIndexList = [
    // Front right leg
    0, 1, 2, 0, 2, 3,
    // Front left leg
    4, 5, 6, 4, 6, 7,
    // Back left leg
    8, 9, 10, 8, 10, 11,
    // Back right leg
    12, 13, 14, 12, 14, 15,
  ];

  var myImage = document.getElementById("tablePicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(tableLegIndexList),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(tableLegVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(tableLegTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(gl.TRIANGLES, tableLegIndexList.length, gl.UNSIGNED_BYTE, 0);
}

function drawBox() {
  // Vertices for the gift box
  var boxVertices = [
    // Front face
    -0.5,
    0.1,
    0.0, // Vertex 0
    0.5,
    0.1,
    0.0, // Vertex 1
    0.5,
    1.1,
    0.0, // Vertex 2
    -0.5,
    1.1,
    0.0, // Vertex 3

    // Back face
    -0.5,
    0.1,
    -1.0, // Vertex 4
    0.5,
    0.1,
    -1.0, // Vertex 5
    0.5,
    1.1,
    -1.0, // Vertex 6
    -0.5,
    1.1,
    -1.0, // Vertex 7

    // Top face
    -0.5,
    1.1,
    0.0, // Vertex 3 (Repeated for continuity)
    0.5,
    1.1,
    0.0, // Vertex 2 (Repeated for continuity)
    0.5,
    1.1,
    -1.0, // Vertex 6 (Repeated for continuity)
    -0.5,
    1.1,
    -1.0, // Vertex 7 (Repeated for continuity)

    // Bottom face
    -0.5,
    0.1,
    0.0, // Vertex 0 (Repeated for continuity)
    0.5,
    0.1,
    0.0, // Vertex 1 (Repeated for continuity)
    0.5,
    0.1,
    -1.0, // Vertex 5 (Repeated for continuity)
    -0.5,
    0.1,
    -1.0, // Vertex 4 (Repeated for continuity)

    // Right face
    0.5,
    0.1,
    0.0, // Vertex 1 (Repeated for continuity)
    0.5,
    0.1,
    -1.0, // Vertex 5 (Repeated for continuity)
    0.5,
    1.1,
    -1.0, // Vertex 6 (Repeated for continuity)
    0.5,
    1.1,
    0.0, // Vertex 2 (Repeated for continuity)

    // Left face
    -0.5,
    0.1,
    0.0, // Vertex 0 (Repeated for continuity)
    -0.5,
    0.1,
    -1.0, // Vertex 4 (Repeated for continuity)
    -0.5,
    1.1,
    -1.0, // Vertex 7 (Repeated for continuity)
    -0.5,
    1.1,
    0.0, // Vertex 3 (Repeated for continuity)
  ];

  // Texture coordinates for the gift box
  var boxTextureCoordinates = [
    // Front
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3

    // Back
    1.0,
    0.0, // Vertex 5 (Flipped)
    0.0,
    0.0, // Vertex 4 (Flipped)
    0.0,
    1.0, // Vertex 7 (Flipped)
    1.0,
    1.0, // Vertex 6 (Flipped)

    // Top
    0.0,
    1.0, // Vertex 3 (Repeated for continuity)
    1.0,
    1.0, // Vertex 2 (Repeated for continuity)
    1.0,
    0.0, // Vertex 6 (Repeated for continuity)
    0.0,
    0.0, // Vertex 7 (Repeated for continuity)

    // Bottom
    0.0,
    0.0, // Vertex 0 (Repeated for continuity)
    1.0,
    0.0, // Vertex 1 (Repeated for continuity)
    1.0,
    1.0, // Vertex 5 (Repeated for continuity)
    0.0,
    1.0, // Vertex 4 (Repeated for continuity)

    // Right
    1.0,
    0.0, // Vertex 1 (Repeated for continuity)
    0.0,
    0.0, // Vertex 5 (Repeated for continuity)
    0.0,
    1.0, // Vertex 6 (Repeated for continuity)
    1.0,
    1.0, // Vertex 2 (Repeated for continuity)

    // Left
    0.0,
    0.0, // Vertex 0 (Repeated for continuity)
    1.0,
    0.0, // Vertex 4 (Repeated for continuity)
    1.0,
    1.0, // Vertex 7 (Repeated for continuity)
    0.0,
    1.0, // Vertex 3 (Repeated for continuity)
  ];

  // Index list for rendering the gift box
  var boxIndexList = [
    0,
    1,
    2,
    0,
    2,
    3, // Front face
    4,
    5,
    6,
    4,
    6,
    7, // Back face
    8,
    9,
    10,
    8,
    10,
    11, // Top face
    12,
    13,
    14,
    12,
    14,
    15, // Bottom face
    16,
    17,
    18,
    16,
    18,
    19, // Right face
    20,
    21,
    22,
    20,
    22,
    23, // Left face
  ];

  var myImage = document.getElementById("giftPicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(boxIndexList),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(boxVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(boxTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(gl.TRIANGLES, boxIndexList.length, gl.UNSIGNED_BYTE, 0);
}

var moveZ = 0.0;

function drawChairSeat() {
  // Vertices for the chair seat
  var chairSeatVertices = [
    // Front face
    -0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 0
    0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 1
    0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 2
    -0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 3

    // Back face
    -0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 4
    -0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 5
    0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 6
    0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 7

    // Top face
    -0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 8
    -0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 9
    0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 10
    0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 11

    // Bottom face
    -0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 12
    0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 13
    0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 14
    -0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 15

    // Right face
    0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 16
    0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 17
    0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 18
    0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 19

    // Left face
    -0.5,
    0.0,
    -0.5 + 1.3 + moveZ, // Vertex 20
    -0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 21
    -0.5,
    0.1,
    0.5 + 1.3 + moveZ, // Vertex 22
    -0.5,
    0.1,
    -0.5 + 1.3 + moveZ, // Vertex 23
  ];

  // Texture coordinates for the chair seat
  var chairSeatTextureCoordinates = [
    // Front
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3

    // Back
    0.0,
    0.0, // Vertex 4
    1.0,
    0.0, // Vertex 5
    1.0,
    1.0, // Vertex 6
    0.0,
    1.0, // Vertex 7

    // Top
    0.0,
    0.0, // Vertex 8
    1.0,
    0.0, // Vertex 9
    1.0,
    1.0, // Vertex 10
    0.0,
    1.0, // Vertex 11

    // Bottom
    0.0,
    0.0, // Vertex 12
    1.0,
    0.0, // Vertex 13
    1.0,
    1.0, // Vertex 14
    0.0,
    1.0, // Vertex 15

    // Right
    0.0,
    0.0, // Vertex 16
    1.0,
    0.0, // Vertex 17
    1.0,
    1.0, // Vertex 18
    0.0,
    1.0, // Vertex 19

    // Left
    0.0,
    0.0, // Vertex 20
    1.0,
    0.0, // Vertex 21
    1.0,
    1.0, // Vertex 22
    0.0,
    1.0, // Vertex 23
  ];

  // Index list for rendering the chair seat
  var chairSeatIndices = [
    0,
    1,
    2,
    0,
    2,
    3, // Front face
    4,
    5,
    6,
    4,
    6,
    7, // Back face
    8,
    9,
    10,
    8,
    10,
    11, // Top face
    12,
    13,
    14,
    12,
    14,
    15, // Bottom face
    16,
    17,
    18,
    16,
    18,
    19, // Right face
    20,
    21,
    22,
    20,
    22,
    23, // Left face
  ];

  var myImage = document.getElementById("chairPicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(chairSeatIndices),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(chairSeatVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(chairSeatTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(gl.TRIANGLES, chairSeatIndices.length, gl.UNSIGNED_BYTE, 0);
}

function drawChairBackRest() {
  // Vertices for the chair backrest
  var chairBackrestVertices = [
    -0.6,
    -0.2,
    0.4 + 1.3 + moveZ, // Vertex 0
    0.6,
    -0.2,
    0.4 + 1.3 + moveZ, // Vertex 1
    0.6,
    0.8,
    0.4 + 1.3 + moveZ, // Vertex 2
    -0.6,
    0.8,
    0.4 + 1.3 + moveZ, // Vertex 3
  ];

  // Texture coordinates for the chair backrest
  var chairBackrestTextureCoordinates = [
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3
  ];

  // Index list for rendering the chair backrest
  var chairBackrestIndices = [0, 1, 2, 0, 2, 3];

  var myImage = document.getElementById("chairPicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(chairBackrestIndices),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(chairBackrestVertices),
    gl.STATIC_DRAW
  );

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(chairBackrestTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(
    gl.TRIANGLES,
    chairBackrestIndices.length,
    gl.UNSIGNED_BYTE,
    0
  );
}

function drawChairLegs() {
  // Vertices for the chair legs
  var chairLegsVertices = [
    // Front left leg
    -0.5,
    -0.6,
    0.6 + 1.3 + moveZ, // Vertex 0
    -0.4,
    -0.6,
    0.6 + 1.3 + moveZ, // Vertex 1
    -0.4,
    0.0,
    0.6 + 1.3 + moveZ, // Vertex 2
    -0.55, // Changed
    0.0,
    0.6 + 1.3 + moveZ, // Vertex 3

    // Front right leg
    0.4,
    -0.6,
    0.6 + 1.3 + moveZ, // Vertex 4
    0.5,
    -0.6,
    0.6 + 1.3 + moveZ, // Vertex 5
    0.55, // Changed
    0.0,
    0.6 + 1.3 + moveZ, // Vertex 6
    0.4,
    0.0,
    0.6 + 1.3 + moveZ, // Vertex 7

    // Back left leg
    -0.55, // Changed
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 8
    -0.4,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 9
    -0.4,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 10
    -0.55, // Changed
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 11

    // Back right leg
    0.4,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 12
    0.6,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 13
    0.55, // Changed
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 14
    0.4,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 15
  ];

  var chairLegsVertices = [
    // Front left leg
    -0.5,
    -0.6,
    0.5 + 1.3 + moveZ, // Vertex 0
    -0.4,
    -0.6,
    0.5 + 1.3 + moveZ, // Vertex 1
    -0.4,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 2
    -0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 3

    // Front right leg
    0.4,
    -0.6,
    0.5 + 1.3 + moveZ, // Vertex 4
    0.5,
    -0.6,
    0.5 + 1.3 + moveZ, // Vertex 5
    0.5,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 6
    0.4,
    0.0,
    0.5 + 1.3 + moveZ, // Vertex 7

    // Back left leg
    -0.5,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 8
    -0.4,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 9
    -0.4,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 10
    -0.5,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 11

    // Back right leg
    0.4,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 12
    0.5,
    -0.6,
    0.4 + 1.3 + moveZ, // Vertex 13
    0.5,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 14
    0.4,
    0.0,
    0.4 + 1.3 + moveZ, // Vertex 15
  ];

  // Texture coordinates for the chair legs
  var chairLegsTextureCoordinates = [
    // Front left leg
    0.0,
    0.0, // Vertex 0
    1.0,
    0.0, // Vertex 1
    1.0,
    1.0, // Vertex 2
    0.0,
    1.0, // Vertex 3

    // Front right leg
    0.0,
    0.0, // Vertex 4
    1.0,
    0.0, // Vertex 5
    1.0,
    1.0, // Vertex 6
    0.0,
    1.0, // Vertex 7

    // Back left leg
    0.0,
    0.0, // Vertex 8
    1.0,
    0.0, // Vertex 9
    1.0,
    1.0, // Vertex 10
    0.0,
    1.0, // Vertex 11

    // Back right leg
    0.0,
    0.0, // Vertex 12
    1.0,
    0.0, // Vertex 13
    1.0,
    1.0, // Vertex 14
    0.0,
    1.0, // Vertex 15
  ];

  // Index list for rendering the chair legs
  var chairLegsIndices = [
    // Front left leg
    0, 1, 2, 0, 2, 3,

    // Front right leg
    4, 5, 6, 4, 6, 7,

    // Back left leg
    8, 9, 10, 8, 10, 11,

    // Back right leg
    12, 13, 14, 12, 14, 15,
  ];

  var myImage = document.getElementById("chairPicture");
  textureImage = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureImage);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(chairLegsIndices),
    gl.STATIC_DRAW
  );
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(chairLegsVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(myShaderProgram, "vertexPosition");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    flatten(chairLegsTextureCoordinates),
    gl.STATIC_DRAW
  );

  var texturePosition = gl.getAttribLocation(
    myShaderProgram,
    "textureCoordinate"
  );
  gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texturePosition);

  gl.drawElements(gl.TRIANGLES, chairLegsIndices.length, gl.UNSIGNED_BYTE, 0);
}

function moveChairForward() {
  if (moveZ < -0.5) {
    return alert("You can't move the chair forward anymore!");
  }
  moveZ = moveZ - 0.1;
}

function moveChairBackward() {
  if (moveZ > 0.5) {
    return alert("You can't move the chair backward anymore!");
  }
  moveZ = moveZ + 0.1;
}
