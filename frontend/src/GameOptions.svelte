<script>
  import LoginForm from "./user/LoginForm.svelte";
  import SelectGameMap from "./gamemap/SelectGameMap.svelte";
  import { PlayerMap } from "./gamemap/gameMap.js";
  import { userData } from "./user/userStore.js";
  import { fly, fade } from "svelte/transition";
  import { push } from "svelte-spa-router";

  let userMap = $userData.mapUser;
  let enemyMap = $userData.mapEnemy;
  function onNewMap(event) {
    userMap = event.detail.map;
  }

  function onStartGame() {
    console.log("создаем карту противника");
    enemyMap = new PlayerMap(userMap.getMapSize());
    $userData.setMapData(userMap, enemyMap);
    push("/gameplay");
  }
</script>

<div class="container">
  <div class="row">
    <div
      class="col-12 text-center"
      in:fly={{ y: -100, delay: 100, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <h1>Выберите Имя и карту</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <LoginForm />
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div in:fade={{ delay: 100, duration: 800 }} out:fade={{ duration: 0 }}>
        <SelectGameMap on:newMap={onNewMap} />
      </div>
    </div>
  </div>
  <div class="row">
    <div
      class="col-12 py-2"
      in:fly={{ y: 100, delay: 100, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <button
        class="btn btn-lg btn-success btn-block"
        type="submit"
        on:click={onStartGame}>
        Начать игру
      </button>
    </div>
  </div>
</div>
