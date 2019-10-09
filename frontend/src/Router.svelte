<script>
  import Router from "svelte-spa-router";

  import ErrPageNotFound from "./errs/ErrPageNotFound.svelte";
  import GamePlay from "./GamePlay.svelte";
  import GameOptions from "./GameOptions.svelte";
  //import UserList from "./user/UserList.svelte";

  const routes = new Map();

  // You can still use strings to define routes
  routes.set("/", GamePlay);
  routes.set(/^\/gameplay/i, GamePlay);
  routes.set(/^\/gameoptions/i, GameOptions);

  routes.set("*", ErrPageNotFound);
</script>

<Router {routes} />
