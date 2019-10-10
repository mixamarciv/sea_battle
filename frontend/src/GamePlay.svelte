<script>
  import { userData } from "./user/userStore.js";
  import { fly, fade } from "svelte/transition";
  import { push } from "svelte-spa-router";

  import { PlayerMap, GamePlayer, GamePlay } from "./game.js";
  import GameMap from "./gamemap/GameMap.svelte";

  let mapUser = $userData.mapUser;
  let mapEnemy = $userData.mapEnemy;
  if (!mapEnemy || !mapUser) {
    // если карты не заданы то возвращаемся в меню настройки игры
    push("/gameoptions");
  }

  let gamePlay = new GamePlay(mapUser, mapEnemy);

  gamePlay.on("startTurn", onTurn);
  gamePlay.on("message", onMessage);
  gamePlay.on("win", onHasWinner);
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

  let messages = [];
  function onMessage(msg) {
    if (messages.length > 100) messages.pop();
    messages = [msg].concat(messages);
  }

  let winner = "";
  let winnern = 0;
  function onHasWinner(d) {
    if (d.winner == 1) {
      winner = $userData.name;
      turnName = "ПОБЕДА";
    }
    if (d.winner == 2) {
      winner = $userData.enemy;
      turnName = "ПОРАЖЕНИЕ";
    }
    gamePlay.gameMessage("Победитель " + winner);
  }

  setTimeout(function() {
    if (!gamePlay.isLoaded()) return;
    gamePlay.startGame();
  }, 500);
</script>

<style>
  .playerName {
    font-family: cursive;

    font-size: 20px;
  }
  .gamelog {
    height: 200px;
    border: 1px solid #a6caff;
    background: #fefeff;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 0px;
    padding: 0px;
  }
  .gamemessage {
    border: 1px solid #d9e8ff;
    margin-top: -1px;
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

  <div class="row">
    <div
      class="col-12 gamelog"
      in:fly={{ y: 100, delay: 300, duration: 800 }}
      out:fade={{ duration: 0 }}>
      {#if messages && messages.length > 0}
        {#each messages as msg, i (msg.id)}
          <div class="gamemessage">
            <span class="msgtime text-muted">
              <small>[{msg.time}]</small>
            </span>
            <span>{msg.text}</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>

</div>
