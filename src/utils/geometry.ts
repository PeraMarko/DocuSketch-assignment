import { Point } from "../types";

export const slope = (point1: Point, point2: Point) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return dx === 0 ? null : dy / dx;
};

export const yIntercept = (slope: number, point: Point) => {
  return slope === null ? point.x : point.y - slope * point.x;
};

export const lineIntersect = (
  m1: number,
  b1: number,
  m2: number,
  b2: number
) => {
  if (m1 === m2) return null;

  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;

  return { x, y };
};
