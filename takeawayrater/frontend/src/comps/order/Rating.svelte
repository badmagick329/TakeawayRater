<script>
    export let rating = 3;
    export let allowInput = true;
    let ratingArray = [1,2,3,4,5];
</script>
<div class="stars" style={allowInput ? "justify-content: center" : ""}>
    {#each ratingArray as star}
        {#if allowInput}
        <span class="star-input" class:inactive={rating < star} on:click={() => rating = star}>
            ⭐
        </span>
        {:else}
        <span class="star" class:inactive={rating < star}>
            ⭐
        </span>
        {/if}
    {/each}
</div>
<style lang="scss">
    .stars {
        display: flex;
        flex-direction: row;
    }
    
    .star-input {
        font-size: 1.25rem;
        cursor: pointer;
    }
    .star-input.inactive, .star.inactive {
        opacity: 0.5;
    } 
</style>