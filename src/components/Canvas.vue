<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import simple from "../data/simple.json";
import triangle from "../data/triangle.json";
import tShape from "../data/t_shape.json";
import { Wall, WallsCoordinates } from "../types";
import { getPerpendicularCoordinates } from "../utils/geometry";
import { GAP } from "../constants";
defineProps<{ msg: string }>();

const canvas = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(window.innerWidth);
const canvasHeight = ref(window.innerHeight);
const ctx = computed(() =>
  canvas.value ? canvas.value.getContext("2d") : null
);
const dataJSON = tShape;

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

  return dataJSON.corners.reduce((acc: WallsCoordinates, item) => {
    const startWallId = item.wallStarts[0].id;
    const endWallId = item.wallEnds[0].id;

    const position = {
      x: item.x,
      y: item.y,
    };
    const decimal = (value: number) => parseInt(value.toFixed(2));
    const scaledPosition = {
      x: decimal(
        (canvasWidth.value - width * scalingFactor.value) / 2 +
          (item.x - minX) * scalingFactor.value
      ),
      y: decimal(
        (canvasHeight.value - height * scalingFactor.value) / 2 +
          (item.y - minY) * scalingFactor.value
      ),
    };
    acc[startWallId] = {
      ...acc[startWallId],
      start: position,
      scaledStart: scaledPosition,
    };
    acc[endWallId] = {
      ...acc[endWallId],
      end: position,
      scaledEnd: scaledPosition,
    };
    return acc;
  }, {});
});

const drawRoom = () => {
  ctx.value?.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  ctx.value?.beginPath();

  Object.values(wallData.value).forEach((item) => {
    ctx.value?.moveTo(item.scaledStart.x, item.scaledStart.y);
    ctx.value?.lineTo(item.scaledEnd.x, item.scaledEnd.y);
  });

  ctx.value!.strokeStyle = "black";
  ctx.value?.stroke();
  ctx.value?.save();
};

const drawDimensions = ({ scaledStart, scaledEnd }: Wall) => {
  drawRoom();
  ctx.value?.restore();
  const [widthStart, widthEnd] = getPerpendicularCoordinates(
    wallData.value,
    scaledStart,
    scaledEnd
  );
  const [lengthStart, lengthEnd] = getPerpendicularCoordinates(
    wallData.value,
    widthStart,
    widthEnd
  );

  ctx.value?.beginPath();
  ctx.value?.moveTo(widthStart.x, widthStart.y);
  ctx.value?.lineTo(widthEnd.x, widthEnd.y);
  ctx.value!.strokeStyle = "red";
  ctx.value?.stroke();

  ctx.value?.beginPath();
  ctx.value?.moveTo(lengthStart.x, lengthStart.y);
  ctx.value?.lineTo(lengthEnd.x, lengthEnd.y);
  ctx.value!.strokeStyle = "blue";
  ctx.value?.stroke();
};

const wallId = ref();

const onClick = () => {
  let index = Object.keys(wallData.value).indexOf(wallId.value);
  if (index === Object.keys(wallData.value).length - 1) {
    index = -1;
  }
  wallId.value = Object.keys(wallData.value)[index + 1];
  drawDimensions(wallData.value[wallId.value]);
};

onMounted(() => {
  drawRoom();
  wallId.value = Object.keys(wallData.value)[0];
  drawDimensions(wallData.value[wallId.value]);
});
</script>

<template>
  <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  <button @click="onClick">Next Wall</button>
</template>

<style scoped>
canvas {
  height: 100vh;
  width: 100%;
}
button {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px;
  margin: auto;
  width: 250px;
}
</style>
