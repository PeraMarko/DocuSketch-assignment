import SIMPLE from "../data/simple.json";
import T_SHAPE from "../data/t_shape.json";
import TRIANGLE from "../data/triangle.json";

export type WallsCoordinates = Record<string, Wall>;

export interface Wall {
  start: Position;
  end: Position;
  nextWalls: string[];
  slope: number;
  yIntersect: number;
}

export interface Position extends Point {
  scaledX: number;
  scaledY: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Data = typeof SIMPLE | typeof T_SHAPE | typeof TRIANGLE;
