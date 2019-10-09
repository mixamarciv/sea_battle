<script>
  import { PlayerMap } from "./gameMap.js";
  import { fly, fade } from "svelte/transition";
  import { userData } from "../user/userStore.js";

  import GameMap from "./GameMap.svelte";

  let mapSize = $userData.mapSize;
  let prevMapSize = mapSize;
  let map, freeMapStr;

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
    console.log("renderNewMap()");
    if (interval && prevMapSize == mapSize) return;
    prevMapSize = mapSize;
    $userData.setMapSize(mapSize);
    map = new PlayerMap(mapSize);
    freeMapStr = map.getFreeMapStr();
  }
  renderNewMap();
  let arr = [];
</script>

<div class="container">
  <div class="row">
    <div class="col-6">
      размер карты:
      <input type="number" bind:value={mapSize} min="10" max="50" />
      <input
        type="range"
        bind:value={mapSize}
        min="10"
        max="50"
        on:mousedown={startUpdate}
        on:mouseup={stopUpdate} />
    </div>
  </div>
  <div class="row py-2">
    <div
      class="col-5"
      in:fly={{ y: 100, delay: 100, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <button
        class="btn btn-lg btn-primary btn-block"
        type="submit"
        on:click={onNewMapClick}>
        создать новую карту
      </button>
    </div>
  </div>
  <div class="row">

    <GameMap {map} />

    {#each arr as i}text1{/each}

    <pre class="py-5">
      <big>{freeMapStr}</big>
    </pre>

  </div>
</div>
