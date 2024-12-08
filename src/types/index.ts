import SIMPLE from "../data/simple.json";
import T_SHAPE from "../data/t_shape.json";
import TRIANGLE from "../data/triangle.json";

export type WallsCoordinates = Record<string, Wall>;

export interface Wall {
  start: Point;
  end: Point;
  scaledStart: Point;
  scaledEnd: Point;
}

export interface Point {
  x: number;
  y: number;
}

export type Data = typeof SIMPLE | typeof T_SHAPE | typeof TRIANGLE;
