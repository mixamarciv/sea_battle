<script>
  import { fly, fade } from "svelte/transition";
  import { userData } from "../user/userStore.js";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let mapId = "map" + Math.round(Math.random() * 1000000);
  let mapObject = 0;
  let shipsInfo = {};
  onMount(async () => {
    mapObject = document.getElementById(mapId);
    if (map) {
      map.on("changeCells", onChangeCells);
      map.on("changeShips", onChangeShips);
      onChangeShips(map.getShipsInfo());
    }
    setTimeout(function() {
      mapObject = document.getElementById(mapId);
    }, 0);
  });

  export let map;
  export let ishidden = 0;
  export let isedit = 0;
  $: freeMapStr = map && map.getFreeMapStr();
  $: mapcells = map && map.getMapCells();
  $: mapWidth = mapObject && Math.round(mapObject.clientWidth);
  $: cellWidth =
    mapWidth && Math.floor(mapWidth / (map && map.getMapSize()) + 1);

  window.addEventListener("resize", onResizeMap, false);
  function onResizeMap() {
    mapObject = document.getElementById(mapId);
    mapWidth = mapObject && Math.round(mapObject.clientWidth);
    //console.log("onResizeMap()  mapWidth: " + mapWidth);
  }
  let m = { x: 0, y: 0 };
  function onMousemove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }

  function onCellClick(x, y) {
    // передаем на уровень выше событие нажатия на ячейку
    dispatch("onCellClick", { x, y });
  }

  //обработка события изменения ячеек
  function onChangeCells(cells) {
    //console.log("onChangeCells");
    setTimeout(() => {
      mapcells = cells;
    }, 0);
  }

  function onChangeShips(optShipsInfo) {
    shipsInfo = optShipsInfo;
    shipsInfo.safeShipsNames = Object.keys(shipsInfo.safeShips);
    shipsInfo.destroyShipsNames = Object.keys(shipsInfo.destroyShips);
  }

  //console.log("mapObject.offsetWidth2: " + mapObject.offsetWidth);
</script>

<style>
  .mapdata {
    max-width: 500px;
    padding: 0px;
    margin: 0px;
    display: inline-block;
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
  .marked {
    background: #ffaf7a;
  }
  .marked:hover {
    background: #ff7519;
  }
  .damaged {
    background: #ff8e42;
  }
  .damaged:hover {
    background: #ff7519;
  }
  .damagedship {
    background: #ff4a4a;
  }
  .damagedship:hover {
    background: #ff1f1f;
  }

  .safeShipsText,
  .destroyShipsText {
    color: #0b2e0b;
  }
  .destroyShipsText {
    color: crimson;
  }
</style>

<div class="container text-center py-2">
  <div class="row text-center">
    <div class="col-12 text-center">
      <!-- [размер карты: {mapWidth}; размер одной ячейки: {cellWidth}] -->
      <!-- Позиция курсора мыши {m.x} x {m.y} -->
      {#if !isedit && shipsInfo && shipsInfo.cntTotalShips}
        всего кораблей: {shipsInfo.cntSafeShips} / {shipsInfo.cntTotalShips}
      {/if}
    </div>
  </div>
  <div class="row ">
    <div class="col-12 text-center">
      <div class="mapdata" id={mapId} on:mousemove={onMousemove}>
        {#if mapcells}
          {#each mapcells as mapcell, i (mapcell.id)}
            <div
              class="float-left mapcell"
              style="width:{cellWidth}px; height:{cellWidth}px;"
              class:ship={!ishidden && mapcell.ship}
              class:marked={mapcell.marked}
              class:damaged={mapcell.damaged}
              class:damagedship={mapcell.ship && mapcell.damaged}
              on:click={() => {
                onCellClick(mapcell.x, mapcell.y);
              }} />
          {/each}
        {:else}загрузка данных...{/if}
      </div>
    </div>
  </div>
  <div class="row text-left">
    <div class="col-6 text-left safeShipsText">
      {#if !isedit && shipsInfo && shipsInfo.safeShipsNames}
        осталось кораблей: {shipsInfo.cntSafeShips}
        {#each shipsInfo.safeShipsNames as name}
          <div>{name}: {shipsInfo.safeShips[name]}ед.</div>
        {/each}
      {/if}
    </div>
    <div class="col-6 text-left destroyShipsText">
      {#if !isedit && shipsInfo && shipsInfo.destroyShipsNames}
        уничтожено: {shipsInfo.cntDestroyShips}
        {#each shipsInfo.destroyShipsNames as name}
          <div>{name}: {shipsInfo.destroyShips[name]}ед.</div>
        {/each}
      {/if}
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
