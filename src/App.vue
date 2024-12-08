<script setup lang="ts">
import { computed, ref } from "vue";
import Canvas from "./components/Canvas.vue";
import { CANVAS_SIZE, ROOMS, GAP } from "./constants";
import { WallsCoordinates } from "./types";

const currentRoomIndex = ref(Math.floor(Math.random() * 3));
const currentRoom = computed(() => ROOMS[currentRoomIndex.value]);
const onChangeRoom = () => {
  if (currentRoomIndex.value === ROOMS.length - 1) {
    currentRoomIndex.value = 0;
    return;
  }

  currentRoomIndex.value += 1;
};
</script>

<template>
  <Canvas msg="canvasSize.height + ''" />
</template>

<style scoped>
.action {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 80px;
}

button {
  background-color: transparent;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
}
</style>
