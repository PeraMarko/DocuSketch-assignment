<script setup lang="ts">
import Canvas from "./components/Canvas.vue";
import useRoom from "./hooks/useRoom";

const { room, currentWallId, onChangeRoom, onChangeWall } = useRoom();
</script>

<template>
  <Canvas :room="room" :wall-id="currentWallId" />
  <div class="action">
    <button @click="onChangeRoom">Next Room</button>
    <button @click="onChangeWall">Next Wall</button>
  </div>
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
