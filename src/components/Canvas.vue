<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Wall, WallsCoordinates } from "../types";
import { getPerpendicularCoordinates } from "../utils/geometry";
import { CANVAS_SIZE } from "../constants";
const props = defineProps<{
  room: WallsCoordinates;
  wallId?: keyof WallsCoordinates;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = computed(() =>
  canvas.value ? canvas.value.getContext("2d") : null
);

const drawRoom = () => {
  ctx.value?.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
  ctx.value?.beginPath();

  Object.values(props.room).forEach((item) => {
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
    props.room,
    scaledStart,
    scaledEnd
  );
  const [lengthStart, lengthEnd] = getPerpendicularCoordinates(
    props.room,
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

watch([() => props.room, () => props.wallId], ([room, wallId]) => {
  if (room && wallId) {
    drawDimensions(room[wallId]);
  }
});

onMounted(() => {
  if ((props.room, props.wallId)) {
    drawDimensions(props.room[props.wallId]);
  }
});
</script>

<template>
  <div class="container">
    <canvas
      ref="canvas"
      :width="CANVAS_SIZE.width"
      :height="CANVAS_SIZE.height"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>
