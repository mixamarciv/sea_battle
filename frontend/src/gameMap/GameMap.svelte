<script>
  import { fly, fade } from "svelte/transition";
  import { userData } from "../user/userStore.js";

  export let map;
  $: freeMapStr = map.getFreeMapStr();
  let arr = [];
</script>

<div class="container">
  <div class="row">
    {#each arr as i}text 1{/each}
    GameMap.svelte:
    <br />
    <pre class="py-5">
      <big>{freeMapStr}</big>
    </pre>
  </div>
</div>
