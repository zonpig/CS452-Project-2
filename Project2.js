var gl;
var myShaderProgram;
var alpha, beta, gamma; // Rotation angles around x, y and z axes
var scaleX, scaleY; // Scaling factors along x and y axes
var transX, transY; // Translation factors along x and y axes

var textureImage;

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
  scaleX = 1;
  scaleY = 1;
  transX = 0;
  transY = 0;

  // Tetrahedron vertices
  var tetrahedronVertices = [
    0.0,0.5,-Math.sqrt(3) / 6,
    -0.5,-0.5,-Math.sqrt(3) / 6,
    0.5,-0.5,-Math.sqrt(3) / 6,

    0.0,0.5,-Math.sqrt(3) / 6,
    -0.5,-0.5,-Math.sqrt(3) / 6,
    0.0,0.0,Math.sqrt(3) / 3,

    -0.5,-0.5,-Math.sqrt(3) / 6,
    0.5,-0.5,-Math.sqrt(3) / 6,
    0.0,0.0,Math.sqrt(3) / 3,

    0.5,-0.5,-Math.sqrt(3) / 6,
    0.0,0.5,-Math.sqrt(3) / 6,
    0.0,0.0,Math.sqrt(3) / 3,
  ];

  // Tetrahedron texture
  var textureCoordinates = [
    // Face 1
    0.0, 0.0,
    1.0, 0.0,
    0.5, 1.0,
  
    // Face 2
    0.0, 0.0,
    1.0, 0.0,
    0.5, 1.0,
  
    // Face 3
    0.0, 0.0,
    1.0, 0.0,
    0.5, 1.0,
  
    // Face 4
    0.0, 0.0,
    1.0, 0.0,
    0.5, 1.0,
  ];

  // Tetrahedron faces (filled triangles)
  var tetrahedronIndices = 
  [0, 1, 2, 
   3, 4, 5, 
   6, 7, 8, 
   9, 10, 11];

  var myImage = document.getElementById("textureImage");

  textureImage = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, textureImage );
  gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, myImage );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
  gl.generateMipmap( gl.TEXTURE_2D );

  iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(tetrahedronIndices), gl.STATIC_DRAW);

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER,vertexBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(tetrahedronVertices), gl.STATIC_DRAW );

  var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
  gl.vertexAttribPointer( vertexPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vertexPosition );

  var textureVertexbuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER,textureVertexbuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(textureCoordinates), gl.STATIC_DRAW );

  var textureCoordinate = gl.getAttribLocation(myShaderProgram, "textureCoordinate");
  gl.vertexAttribPointer( textureCoordinate, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( textureCoordinate );

  // Set initial scale and translate uniform values to allow rendering to work
  scaleXLoc = gl.getUniformLocation(myShaderProgram, "scaleX");
  gl.uniform1f(scaleXLoc, scaleX);
  scaleYLoc = gl.getUniformLocation(myShaderProgram, "scaleY");
  gl.uniform1f(scaleYLoc, scaleY);

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

// Add event listeners to detect keypresses
document.addEventListener("keydown", function (event) {
  if (event.key === "z") {
    rotateAroundX();
  } else if (event.key === "x") {
    rotateAroundY();
  } else if (event.key === "c") {
    rotateAroundZ();
  }
  // Scaling
  else if (event.key === "a") {
    scaleUpOnX();
  } else if (event.key === "d") {
    scaleDownOnX();
  } else if (event.key === "w") {
    scaleUpOnY();
  } else if (event.key === "s") {
    scaleDownOnY();
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

function scaleUpOnX() {
  scaleX = scaleX + 0.1;
  scaleXLoc = gl.getUniformLocation(myShaderProgram, "scaleX");
  gl.uniform1f(scaleXLoc, scaleX);
}

function scaleDownOnX() {
  scaleX = scaleX - 0.1;
  scaleXLoc = gl.getUniformLocation(myShaderProgram, "scaleX");
  gl.uniform1f(scaleXLoc, scaleX);
}

function scaleUpOnY() {
  scaleY = scaleY + 0.1;
  scaleYLoc = gl.getUniformLocation(myShaderProgram, "scaleY");
  gl.uniform1f(scaleYLoc, scaleY);
}

function scaleDownOnY() {
  scaleY = scaleY - 0.1;
  scaleYLoc = gl.getUniformLocation(myShaderProgram, "scaleY");
  gl.uniform1f(scaleYLoc, scaleY);
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
