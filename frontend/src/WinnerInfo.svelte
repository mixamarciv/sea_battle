<script>
  import { userData } from "./user/userStore.js";
  import { fly, fade } from "svelte/transition";
  import { push } from "svelte-spa-router";

  export let winnerData = {};
  let iscloseModal = 0;
  function onToggleModal() {
    iscloseModal = !iscloseModal;
  }
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: opacity 500ms;
    visibility: visible;
    opacity: 1;
  }

  .popup {
    margin: 70px auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    width: 60%;
    position: relative;
    transition: all 5s ease-in-out;
  }

  .popup .close {
    position: absolute;
    top: 20px;
    right: 30px;
    transition: all 200ms;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    color: #333;
  }
  .popup .close:hover {
    color: #06d85f;
  }
  .popup .content {
    max-height: 30%;
    overflow: auto;
  }
  .hidden {
    display: none;
  }
</style>

<div class="container">
  <button class="btn btn-primary btn-block" on:click={onToggleModal}>
    вывести результат
  </button>
  <div class="overlay" class:hidden={iscloseModal}>
    <div class="popup">
      <h2>{winnerData.msg}</h2>
      <button class="close" on:click={onToggleModal}>&times;</button>
      <div class="content">

        <h4>статистика победителя: {winnerData.name}</h4>
        <div class="stat">
          <big>
            эффективность: {Math.round((winnerData.attackSuccess / winnerData.attackCnt) * 100)}%
          </big>
        </div>
        <div class="stat">
          атаки успешно/всего: {winnerData.attackSuccess} / {winnerData.attackCnt}
        </div>
        <div class="stat">всего ходов: {winnerData.turnCnt}</div>

      </div>
    </div>
  </div>
</div>
