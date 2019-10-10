<script>
  import { userData } from "./user/userStore.js";
  import { fly, fade } from "svelte/transition";
  import { push } from "svelte-spa-router";

  import { PlayerMap, GamePlayer, GamePlay } from "./gamemap/gameMap.js";
  import GameMap from "./gamemap/GameMap.svelte";

  let mapUser = $userData.mapUser;
  let mapEnemy = $userData.mapEnemy;
  if (!mapEnemy || !mapUser) {
    // если карты не заданы то возвращаемся в меню настройки игры
    push("/gameoptions");
  }

  let gamePlay = new GamePlay(mapUser, mapEnemy);

  gamePlay.on("startTurn", onTurn);
  gamePlay.on("userTurn", () => onTurn(1));
  let turnName = "";
  function onTurn(userOrAi) {
    if (userOrAi == 1) turnName = "твой ход";
    else turnName = "ход игрока: " + $userData.enemy;
  }
  function onCellClick(event) {
    let { x, y } = event.detail;
    gamePlay.userAttack(x, y);
  }

  gamePlay.startGame();
</script>

<style>
  .playerName {
    font-family: cursive;

    font-size: 20px;
  }
</style>

<!--<svelte:component this={$mainForm.form} />-->
<div class="container">
  <div class="row">
    <div
      class="col-5 text-right playerName"
      in:fly={{ x: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      {$userData.name}
    </div>
    <div
      class="col-2 text-center playerName"
      in:fly={{ y: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      vs
    </div>
    <div
      class="col-5 playerName"
      in:fly={{ x: 100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      {$userData.enemy}
    </div>
  </div>

  <div class="row">
    <div
      class="col-12 text-center"
      in:fade={{ delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <h2>{turnName}</h2>
    </div>
  </div>

  <div class="row">
    <div
      class="col-6 text-right"
      in:fly={{ x: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <GameMap map={mapUser} mapId="mapUser1" />
    </div>
    <div
      class="col-6"
      in:fly={{ x: 100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <GameMap
        map={mapEnemy}
        on:onCellClick={onCellClick}
        mapId="mapPlayer1"
        ishidden="1" />
    </div>
  </div>

</div>
