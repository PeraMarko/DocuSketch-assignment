<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import simple from "../data/simple.json";
import triangle from "../data/triangle.json";
import tShape from "../data/t_shape.json";
import { Wall, WallsCoordinates } from "../types";
import { slope, slope } from "../utils/geometry";
defineProps<{ msg: string }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(window.innerWidth);
const canvasHeight = ref(window.innerHeight);
const dataJSON = triangle;

const GAP = 0.1;

const roomData = computed(() => {
  const minX = Math.min(...dataJSON.corners.map((corner) => corner.x));
  const maxX = Math.max(...dataJSON.corners.map((corner) => corner.x));
  const minY = Math.min(...dataJSON.corners.map((corner) => corner.y));
  const maxY = Math.max(...dataJSON.corners.map((corner) => corner.y));

  return {
    minX,
    minY,
    maxX,
    maxY,
    height: maxY - minY,
    width: maxX - minX,
  };
});

const scalingFactor = computed(() => {
  const { height, width } = roomData.value;
  const heightFactor =
    canvasHeight.value >= height ? 1 : canvasHeight.value / height - GAP;
  const widthFactor =
    canvasWidth.value >= width ? 1 : canvasWidth.value / width - GAP;

  return Math.min(heightFactor, widthFactor);
});

const wallData = computed(() => {
  const { minX, minY, height, width } = roomData.value;

  const data = dataJSON.corners.reduce((acc: WallsCoordinates, item) => {
    const startWallId = item.wallStarts[0].id;
    const endWallId = item.wallEnds[0].id;
    const startNextWalls: string[] = [endWallId];
    const endNextWalls: string[] = [startWallId];

    if (acc[startWallId]?.nextWalls) {
      startNextWalls.push(...acc[startWallId].nextWalls);
    }

    if (acc[endWallId]?.nextWalls) {
      endNextWalls.push(...acc[endWallId].nextWalls);
    }

    const position = {
      x: item.x,
      y: item.y,
      scaledX:
        (canvasWidth.value - width * scalingFactor.value) / 2 +
        (item.x - minX) * scalingFactor.value,
      scaledY:
        (canvasHeight.value - height * scalingFactor.value) / 2 +
        (item.y - minY) * scalingFactor.value,
    };
    acc[startWallId] = {
      ...acc[startWallId],
      start: position,
      nextWalls: startNextWalls,
    };
    acc[endWallId] = {
      ...acc[endWallId],
      end: position,
      nextWalls: endNextWalls,
    };
    return acc;
  }, {});

});

const drawRoom = () => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

      Object.values(wallData.value).forEach((item) => {
        ctx.moveTo(item.start.scaledX, item.start.scaledY);
        ctx.lineTo(item.end.scaledX, item.end.scaledY);
      });

      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  }
};

const drawLength = (wall: Wall) => {
  const scaledStart = { x: wall.start.scaledX, y: wall.start.scaledY };
  const scaledEnd = { x: wall.end.scaledX, y: wall.end.scaledY };
  const m = slope(scaledStart, scaledEnd);
  const b =
};

onMounted(() => {
  drawRoom();
});
</script>

<template>
  <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<style scoped>
canvas {
  height: 100vh;
  width: 100%;
}
</style>
