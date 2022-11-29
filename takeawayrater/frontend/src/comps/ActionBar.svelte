<script>
  import { containerWidth } from "../const.js";
  import { sortBy } from "../stores.js";
  import { title } from "../utils";

  export let showOrderNew;

  let sortByOptions = ["rating", "date"];
</script>

<div class="actionbar" style="width:{containerWidth}px;">
  <button class="actionbar__add" on:click={() => (showOrderNew = !showOrderNew)}
    >Add Order</button
  >
  <select
    class="text-size--small"
    bind:value={$sortBy}
    style="border-radius: 4px;"
  >
    {#each sortByOptions as sort}
      <option value={sort}>Sort by {title(sort)}</option>
    {/each}
  </select>
</div>

<style>
  .actionbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
