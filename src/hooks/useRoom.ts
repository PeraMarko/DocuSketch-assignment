import { computed, ref } from "vue";
import { CANVAS_SIZE, ROOMS, GAP } from "../constants";
import { WallsCoordinates } from "../types";

const useRoom = () => {
  const currentRoomIndex = ref(Math.floor(Math.random() * ROOMS.length));
  const currentRoom = computed(() => ROOMS[currentRoomIndex.value]);
  const currentWallIndex = ref<number>(0);
  const currentWallId = computed<keyof WallsCoordinates>(
    () => Object.keys(room.value)[currentWallIndex.value]
  );

  const onChangeRoom = () => {
    if (currentRoomIndex.value === ROOMS.length - 1) {
      currentRoomIndex.value = 0;
      return;
    }

    currentRoomIndex.value += 1;
  };

  const onChangeWall = () => {
    if (currentWallIndex.value === Object.keys(room.value).length - 1) {
      currentWallIndex.value = 0;
      return;
    }

    currentWallIndex.value += 1;
  };

  const roomData = computed(() => {
    const minX = Math.min(
      ...currentRoom.value.corners.map((corner) => corner.x)
    );
    const maxX = Math.max(
      ...currentRoom.value.corners.map((corner) => corner.x)
    );
    const minY = Math.min(
      ...currentRoom.value.corners.map((corner) => corner.y)
    );
    const maxY = Math.max(
      ...currentRoom.value.corners.map((corner) => corner.y)
    );

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
      CANVAS_SIZE.height >= height ? 1 : CANVAS_SIZE.height / height - GAP;
    const widthFactor =
      CANVAS_SIZE.width >= width ? 1 : CANVAS_SIZE.width / width - GAP;

    return Math.min(heightFactor, widthFactor);
  });

  const room = computed(() => {
    const { minX, minY, height, width } = roomData.value;

    return currentRoom.value.corners.reduce((acc: WallsCoordinates, item) => {
      const startWallId = item.wallStarts[0].id;
      const endWallId = item.wallEnds[0].id;

      const position = {
        x: item.x,
        y: item.y,
      };
      const decimal = (value: number) => parseInt(value.toFixed(2));
      const scaledPosition = {
        x: decimal(
          (CANVAS_SIZE.width - width * scalingFactor.value) / 2 +
            (item.x - minX) * scalingFactor.value
        ),
        y: decimal(
          (CANVAS_SIZE.height - height * scalingFactor.value) / 2 +
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

  return {
    room,
    currentWallId,
    onChangeRoom,
    onChangeWall,
  };
};

export default useRoom;
