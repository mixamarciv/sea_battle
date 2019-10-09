<script>
  import { userData } from "./user/userStore.js";
  import { fly, fade } from "svelte/transition";
  import { push } from "svelte-spa-router";

  import { PlayerMap, Attack } from "./gamemap/gameMap.js";
  import GameMap from "./gamemap/GameMap.svelte";

  let mapUser = $userData.mapUser;
  let mapEnemy = $userData.mapEnemy;
  let AttackUser = new Attack(mapEnemy, mapUser);
  let AttackEnemy = new Attack(mapUser, mapEnemy);

  function onCellClick(event) {
    let { x, y } = event.detail;
    AttackUser.sendAttack(x, y);
  }
</script>

<!--<svelte:component this={$mainForm.form} />-->
<div class="container">
  <div class="row">
    <div
      class="col-5 text-right"
      in:fly={{ x: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      {$userData.name}
    </div>
    <div
      class="col-2 text-center"
      in:fly={{ y: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      vs
    </div>
    <div
      class="col-5"
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
      игра началась
    </div>
  </div>

  <div class="row">
    <div
      class="col-5 text-right"
      in:fly={{ x: -100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <GameMap map={mapUser} />
    </div>
    <div
      class="col-2 text-center"
      in:fly={{ y: 100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      --
    </div>
    <div
      class="col-5"
      in:fly={{ x: 100, delay: 0, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <GameMap map={mapEnemy} on:onCellClick={onCellClick} />
    </div>
  </div>

</div>
