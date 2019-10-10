<script>
  import moment from "moment";
  export let title;
  export let text;
</script>

<div class="jumbotron">
  <div class="container">
    <h1 class="display-3">{title}</h1>
    <p>{text}</p>
    <p>приносим извинения за доставленные неудобства</p>
  </div>
  <div>дата и время ошибки {moment().format('YYYY.MM.DD HH:mm:ss')}</div>
</div>
