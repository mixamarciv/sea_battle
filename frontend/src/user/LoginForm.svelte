<script>
  // пример оформления формы взят тут: https://bootstrap-4.ru/docs/4.3.1/examples/floating-labels/
  import { userData } from "./userStore.js";
  import { fly, fade } from "svelte/transition";

  let inputYouName = $userData.name;
  let inputEnemyName = $userData.enemy;
  function onInputName(event) {
    if (event.which == 13) onSubmitFormLogin(event);
  }
  async function onSubmitFormLogin(event) {
    event.preventDefault();
    $userData.setName(inputYouName, inputEnemyName);
    return;
  }
</script>

<style>
  .form-label-group {
    position: relative;
    margin-bottom: 1rem;
  }
  .form-label-group > input,
  .form-label-group > label {
    height: 3.125rem;
    padding: 0.75rem;
  }
  .form-label-group > label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0; /* Override default `<label>` margin */
    line-height: 1.5;
    color: #495057;
    pointer-events: none;
    cursor: text; /* Match the input under the label */
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.1s ease-in-out;
  }
  .form-label-group input::-webkit-input-placeholder {
    color: transparent;
  }
  .form-label-group input:-ms-input-placeholder {
    color: transparent;
  }
  .form-label-group input::-ms-input-placeholder {
    color: transparent;
  }
  .form-label-group input::-moz-placeholder {
    color: transparent;
  }
  .form-label-group input::placeholder {
    color: transparent;
  }
  .form-label-group input:not(:placeholder-shown) {
    padding-top: 1.25rem;
    padding-bottom: 0.25rem;
  }
  .form-label-group input:not(:placeholder-shown) ~ label {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 12px;
    color: #777;
  }
  @supports (-ms-ime-align: auto) {
    .form-label-group > label {
      display: none;
    }
    .form-label-group input::-ms-input-placeholder {
      color: #777;
    }
  }
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    .form-label-group > label {
      display: none;
    }
    .form-label-group input:-ms-input-placeholder {
      color: #777;
    }
  }
</style>

<form on:submit={onSubmitFormLogin}>
  <div class="row">
    <div
      class="col-6"
      in:fly={{ x: -100, delay: 200, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <div class="form-label-group">
        <input
          type="login"
          id="inputYouName"
          class="form-control"
          placeholder="Ваше имя"
          required
          bind:value={inputYouName}
          on:keydown={onInputName} />
        <label for="inputYouName">Ваше имя</label>
      </div>
    </div>

    <div
      class="col-6"
      in:fly={{ x: 100, delay: 200, duration: 800 }}
      out:fade={{ duration: 0 }}>
      <div class="form-label-group">
        <input
          type="login"
          id="inputEnemyName"
          class="form-control"
          placeholder="Имя противника"
          required
          bind:value={inputEnemyName}
          on:keydown={onInputName} />
        <label for="inputEnemyName">Имя противника</label>
      </div>
    </div>
    <!--
        <div
          in:fly={{ y: 100, delay: 600, duration: 800 }}
          out:fade={{ duration: 0 }}>
          <button class="btn btn-lg btn-primary btn-block" type="submit">
            Поехали
          </button>
        </div>
  -->
  </div>
</form>
