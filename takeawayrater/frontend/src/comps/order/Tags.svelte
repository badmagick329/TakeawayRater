<script>
    export let tags;
</script>
<div class="tags">
    {#each tags as tag}
        <span class="text-size--small">{tag}</span>
    {/each}
</div>
<style>
    .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.2em;
    }
    span {
        padding: 2px 4px;
        border: 1px solid black;
        color: white;
        border-radius: 4px;
        margin-right: 6px;
    }
</style>