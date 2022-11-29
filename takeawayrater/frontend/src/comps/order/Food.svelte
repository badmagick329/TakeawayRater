<script>
  import { missingImage } from "../../const";
  import { title } from "../../utils";
  import Rating from "./Rating.svelte";
  import Tags from "./Tags.svelte";

  export let food;
</script>

<div class="food">
  <div class="food__header">
    <div class="left">
      <span>{title(food.name)}</span>
      <span><Rating rating={food.rating} allowInput={false} /></span>
      <span><Tags tags={food.tags} /></span>
    </div>
    <div class="right">
      {#if food.image === missingImage && food.image_url}
        <a href={food.image_url} target="_blank"
          ><img src={food.image_url} alt={food.name} width="100" /></a
        >
      {:else}
        <a href={food.image} target="_blank"
          ><img src={food.image} alt={food.name} width="100" /></a
        >
      {/if}
    </div>
  </div>
  {#if food.comment}
    <div class="food__comment">
      <span>{food.comment}</span>
    </div>
  {/if}
</div>

<style>
  .food > div:last-child {
    margin: 0.5em 0;
  }

  .food__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .food__header .left {
    display: flex;
    flex-direction: column;
  }
  .food__header .left > span {
    margin-bottom: 5px;
  }
  .food__header .right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .food__header .right img {
    border-radius: 4px;
  }
  .food__comment {
    max-width: 50ch;
  }
</style>
