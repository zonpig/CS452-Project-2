# Lab 5: Texture Mapping

Done by:

Bryan Lim
Mustapha Jom

## How to run

To load the object, you need to run a local host server. I used http-server to run the local host server. To run the local host server, you need to install http-server and run the following commands in the terminal.

```terminal commands
npm install --global http-server
http-server
```

## Key Bindings

We have implemented the following key bindings for different transformations:

- 'z': Rotate Around X
- 'x': Rotate Around Y
- 'c': Rotate Around Z
- 'a': Scale Up on X
- 'd': Scale Down on X
- 'w': Scale Up on Y
- 's': Scale Down on Y
- 'j': Translate Left on X
- 'l': Translate Right on X
- 'i': Translate Up on Y
- 'k': Translate Down on Y

The Rotation (zxc) key bindings are on in one row as they only rotate in one direction. While for the Scaling (wasd) and Translation (ijkl) key bindings, they are in a manner such they resemble the arrow keys on a keyboard.

## Implementation

For Lab 5, we started by using Lab 3 as the base.  
After that, we referenced code from textureCode.zip to implement texture mapping.
All faces are textured.
We use Linear Filtering for texture mapping and since the texture is a power of 2, we used Mipmapping as well.
