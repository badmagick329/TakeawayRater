<script>
  import ActionBar from "./ActionBar.svelte";
  import Orders from "./Orders.svelte";
  import SearchBar from "./SearchBar.svelte";

  export let location;

  let showOrderNew = false;
</script>

<div class="home">
  <SearchBar />
  <ActionBar bind:showOrderNew />
  <Orders bind:showOrderNew />
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
    width: 100%;
  }
</style>
