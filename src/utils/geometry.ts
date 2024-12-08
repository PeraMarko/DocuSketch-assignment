import { DIMENSIONS_OFFSET } from "../constants";
import { Point, WallsCoordinates } from "../types";

export const getSlope = (point1: Point, point2: Point) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return dx === 0 ? null : dy / dx;
};

export const getYIntercept = (slope: number | null, point: Point) => {
  return slope === null ? point.x : point.y - slope * point.x;
};

export const getLineIntersect = (
  m1: number | null,
  b1: number,
  m2: number | null,
  b2: number
) => {
  if (m1 === m2) {
    return null;
  }

  if (m1 === null) {
    const x = b1;
    const y = m2! * x + b2;
    return { x, y };
  }

  if (m2 === null) {
    const x = b2;
    const y = m1 * x + b1;
    return { x, y };
  }

  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;

  return { x, y };
};

export const getPercentageVector = (point1: Point, point2: Point) => {
  return {
    x: (point2.x - point1.x) / 100,
    y: (point2.y - point1.y) / 100,
  };
};

export const getPerpendicularSlope = (slope: number | null) => {
  if (slope === null) return 0;
  if (slope === 0) return null;
  return -1 / slope;
};

export const getIntersectionCoordinates = (
  wallData: WallsCoordinates,
  m: number | null,
  b: number
) => {
  return Object.keys(wallData).reduce((acc: Point[], key) => {
    const item = wallData[key];
    const itemSlope = getSlope(item.scaledStart, item.scaledEnd);
    const itemIntersect = getYIntercept(itemSlope, item.scaledStart);
    const intersection = getLineIntersect(m, b, itemSlope, itemIntersect);
    if (intersection) {
      if (
        Math.min(item.scaledStart.x, item.scaledEnd.x) <= intersection.x &&
        intersection.x <= Math.max(item.scaledStart.x, item.scaledEnd.x) &&
        Math.min(item.scaledStart.y, item.scaledEnd.y) <= intersection.y &&
        intersection.y <= Math.max(item.scaledStart.y, item.scaledEnd.y)
      ) {
        acc.push(intersection);
      }
    }

    return acc;
  }, []);
};

export const getPerpendicularCoordinates = (
  wallData: WallsCoordinates,
  point1: Point,
  point2: Point
) => {
  const vector = getPercentageVector(point1, point2);
  const point = {
    x: point1.x + vector.x * DIMENSIONS_OFFSET,
    y: point1.y + vector.y * DIMENSIONS_OFFSET,
  };
  const m = getSlope(point1, point2);
  const newM = getPerpendicularSlope(m);
  const y = getYIntercept(newM, point);
  return getIntersectionCoordinates(wallData, newM, y);
};
