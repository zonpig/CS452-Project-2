# CS452 Project 2: 3D Scene Creation

Done by:

Bryan Lim

## How to run

To load the object, you need to run a local host server. I used http-server to run the local host server. To run the local host server, you need to install http-server and run the following commands in the terminal.

```terminal commands
npm install --save-dev vite
npx vite
```

## Scene

The scene we created is a 3D scene of a table with a chair. On the top of the table, there is a Gift Box waiting to be opened. (Inspired by upcoming Christmas)

The table is made up of a total of 5 polyhedra forming the entire table structure: 1 table top and 4 table legs and is given a brown wooden texture.

The chair is made up of a total of 6 polyhedra forming the entire chair structure: 1 chair seat, 1 chair back, 4 chair legs and is given a white wooden texture.

The box only consist of 1 polyhedra and is given gift wrapping texture.

## User Interaction

The user is able to move the chair forward and backward. The motion is to be similar to the motion when one tucks in and out his/her chair to open the present. (Done through manipulating the z-axis)

## Implementation

The hardest part of the project would be combining lighting and texture together. I started off by using code from Lab 4 and Lab 5 to be the boilterplate. To do this, trial and error, chatGPT and googling was used to assist us in the process. THe most useful link was <https://computergraphics.stackexchange.com/questions/5021/emission-of-light-from-texture-on-webgl>. After figuring out the lighting and texture on my Lab5 submision object, the rest of the stuff was implementing the objects for the scene and the user interaction.
