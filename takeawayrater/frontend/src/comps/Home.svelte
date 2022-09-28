<script>
    import SearchBar from "./SearchBar.svelte";
    import ActionBar from "./ActionBar.svelte";
    import Orders from "./Orders.svelte";
    
    export let location;

    let showOrderNew = false;
</script>
<div class="home">
    <SearchBar />
    <ActionBar bind:showOrderNew={showOrderNew}/>
    <Orders bind:showOrderNew={showOrderNew} />
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