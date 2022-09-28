<script>
    import { searchFilters, searchQuery } from '../stores.js'
    import { title } from '../utils';
    let searchFiltersOptions = ["tags","foods","restaurants","my orders"];
</script>
<div class="search">
    <div class="search__box">
        <input type="text" placeholder="Search" bind:value={$searchQuery} />
    </div>
    <div class="search__options">
        <div class="filters">
            {#each searchFiltersOptions as searchFilter}
                <label>
                    <input type=checkbox bind:group={$searchFilters} name="searchFilters" value={searchFilter}  />
                    <span>{title(searchFilter)}</span>
                </label>
            {/each}
        </div>
    </div>
</div>
<style>
    .search {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        width: 80%;
        justify-content: center;
    }
    @media (max-width: 500px) {       
        .search {
            width: 100%;
        }
    }
    .search__box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0.5rem 0;
        /* border: 1px solid green; */
    }

    .search__box > input {
        width: 100%;
        max-width: min(90%, 600px);
    }

    .search__options {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 0 0.5rem 0;
        /* border: 1px solid black; */
    }

    .search__options > .filters {
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: min(90%, 600px);
        padding: 0.25em 5px 0 0;
        color: white;
        justify-content: center;
        /* border: 1px solid red; */
    }

    .search__options > .filters > label {
        margin: 0 5px;
    }
    
</style>