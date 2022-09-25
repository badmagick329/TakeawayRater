<script>
    import SearchBar from "./SearchBar.svelte";
    import ActionBar from "./ActionBar.svelte";
    import Orders from "./Orders.svelte";
    
    export let location;

    let containerWidth = 340;
    let sortBy = "rating";
    let searchFilters = ["tags", "foods"];
    let searchQuery = "";
    let showOrderNew = false;
</script>
<div class="home">
    <SearchBar bind:searchFilters={searchFilters} bind:searchQuery={searchQuery} />
    <ActionBar containerWidth={containerWidth} bind:sortBy={sortBy} bind:showOrderNew={showOrderNew}/>
    <Orders containerWidth={containerWidth} bind:sortBy={sortBy} bind:searchFilters={searchFilters} 
    bind:searchQuery={searchQuery} bind:showOrderNew={showOrderNew} />
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