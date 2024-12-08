# Documentation

## Task Description

There is a room of random shapes, all the walls are straight lines.

The room has "length" and "width" dimensions. These are 2 perpendicular segments, where either "length" or "width" is parallel to one of the walls. Both segments are stretched for a length from wall to wall.

The task is:

- to draw a random version of such a room on the canvas (take a random one: triangle, simple, or t-shape), as well as one of the options for the length and width of this room.
- Add a button that will change the length and width options according to the different walls in this room.

## TECH STACK

- Vue
- Typescript
- Vite
- Canvas API

## Getting Started

1. Install dependencies: `npm install `
2. Start the development server: `npm run dev`
3. Open browser and navigate to http://localhost:5173

## Features

1. ### Coordinate Translation:

   Translating room's coordinates to canvas coordinates, ensuring proper alignment and placement.

2. ### Shape Scaling:

   Scaling the shape if it exceeds the canvas dimensions, maintaining aspect ratio.

3. ### Shape Rendering:

   Drawing the roms onto the canvas using calculations for position and scaling.

4. ### Length and Width Calculation:

   Dynamically computing coordinates for the shape's length and width.

5. ### Length and Width Rendering:

   Rendering the computed length and width on the canvas.

6. ### Change Wall Options:
   Button that changes width and length options according to the different wall
