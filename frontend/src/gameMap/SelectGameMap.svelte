<script>
  import { PlayerMap } from "./gameMap.js";
  import { fly, fade } from "svelte/transition";
  import { userData } from "../user/userStore.js";

  import GameMap from "./GameMap.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let mapSize = $userData.mapSize;
  let prevMapSize = mapSize;
  let map = $userData.mapUser;

  let interval = 0;
  function startUpdate() {
    interval = setInterval(renderNewMap, 100);
  }
  function stopUpdate() {
    clearInterval(interval);
    interval = 0;
  }
  function onNewMapClick() {
    stopUpdate();
    renderNewMap();
  }
  function renderNewMap() {
    //console.log("renderNewMap()");
    if (interval && prevMapSize == mapSize) return;
    prevMapSize = mapSize;
    $userData.setMapSize(mapSize);
    map = new PlayerMap(mapSize);
    dispatch("newMap", { map: map }); // отправляем в компонент выше данные новой карты
  }
  if (!map) {
    setTimeout(renderNewMap, 1);
  }
</script>

<style>
  .map-size {
    border: 0px;
  }
</style>

<div class="container">
  <div class="row">
    <div
      class="col-5"
      in:fly={{ x: -100, delay: 100, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <button
        class="btn btn-lg btn-primary btn-block"
        type="submit"
        on:click={onNewMapClick}>
        расставить корабли случайно
      </button>
    </div>
    <div class="col-6">
      <div
        in:fly={{ x: 100, delay: 100, duration: 800 }}
        out:fade={{ duration: 0 }}>
        размер карты:
        <input type="number" bind:value={mapSize} min="10" max="20" />
        <input
          class="map-size"
          type="range"
          bind:value={mapSize}
          min="10"
          max="20"
          on:mousedown={startUpdate}
          on:mouseup={stopUpdate} />
      </div>
    </div>

  </div>
  <div class="row">
    <div class="col-12 text-center">
      <GameMap {map} mapId="map1" isedit="1" />
    </div>
  </div>
</div>
