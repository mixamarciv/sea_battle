<script>
  import { fly, fade } from "svelte/transition";
  import { userData } from "../user/userStore.js";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let mapId = "map" + Math.round(Math.random() * 100000);
  let mapObject = 0;
  onMount(async () => {
    mapObject = document.getElementById(mapId);
    setTimeout(function() {
      mapObject = document.getElementById(mapId);
    }, 0);
  });

  window.addEventListener("resize", onResizeMap, false);
  function onResizeMap() {
    mapObject = document.getElementById(mapId);
    mapWidth = mapObject && Math.round(mapObject.clientWidth);
    console.log("onResizeMap()  mapWidth: " + mapWidth);
  }
  let m = { x: 0, y: 0 };
  function onMousemove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }

  function onCellClick(x, y) {
    console.log(x, y);
    dispatch("onCellClick", { x, y });
  }

  export let map;
  export let ishidden = 0;
  $: freeMapStr = map && map.getFreeMapStr();
  $: mapcells = map && map.getMapCells();
  $: mapWidth = mapObject && Math.round(mapObject.clientWidth);
  $: cellWidth =
    mapWidth && Math.floor(mapWidth / (map && map.getMapSize()) + 1);

  //console.log("mapObject.offsetWidth2: " + mapObject.offsetWidth);
</script>

<style>
  .mapdata {
    max-width: 500px;
    padding: 0px;
    margin: 0px;
  }
  .mapcell {
    cursor: pointer;
    position: relative;
    border: 1px solid #ced8ff;
    padding: 0px;
    margin: 0px;
    margin-top: -1px;
    margin-left: -1px;
    height: 0; /* что бы ячейка была квадратной формы 
    выравниваем её за счет padding-bottom: {cellWidth}%; */
    background: #eaf2ff;
  }
  .mapcell:hover {
    background: #a4baff;
  }

  .ship {
    background-image: url("./images/ship1.png");
  }
  .damaged {
    background: #ff8e42;
  }
</style>

<div class="container">
  <div class="row">
    [размер карты: {mapWidth}; размер одной ячейки: {cellWidth}]
    <br />
    Позиция курсора мыши {m.x} x {m.y}
  </div>
  <div class="row">
    <div
      class="col-12 mapdata"
      id={mapId}
      on:mousemove={onMousemove}
      on:resize={onResizeMap}>
      {#if mapcells}
        {#each mapcells as mapcell, i}
          <div
            class="float-left mapcell"
            style="width:{cellWidth}px; height:{cellWidth}px;"
            class:ship={mapcell.ship}
            class:damaged={mapcell.damaged}
            on:click={() => {
              onCellClick(mapcell.x, mapcell.y);
            }}>
            <!-- 
            <small>
              <small>{mapcell.x}:{mapcell.y}</small>
            </small>
            -->
            <!-- 
          x:{mapcell.x} y:{mapcell.y}
        {#if mapcell.ship}ship:{mapcell.ship.playerShipId}{/if}
        -->
          </div>
        {/each}
      {:else}загрузка данных...{/if}
    </div>
  </div>
  <!--
  <div class="row">
    <br />
    <pre class="py-5">
      <big>{freeMapStr}</big>
    </pre>
  </div>
  -->
</div>
