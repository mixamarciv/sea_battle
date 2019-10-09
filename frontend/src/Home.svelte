<script>
  import { userData } from "./user/userStore.js";
  import { push } from "svelte-spa-router";
</script>

<!--<svelte:component this={$mainForm.form} />-->
<div class="container">

  <div class="text-center p-5">
    <p>подождите идет загрузка..</p>
    <div class="p-2 m-2">
      <span class="spinner-border spinner-border-lg" />
    </div>
  </div>

</div>
