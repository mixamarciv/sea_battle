<script>
  import LoginForm from "./user/LoginForm.svelte";
  import SelectGameMap from "./gamemap/SelectGameMap.svelte";
</script>

<div class="container">
  <div class="row">
    <div class="col-12 text-center">
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
      <SelectGameMap />
    </div>
  </div>
</div>
