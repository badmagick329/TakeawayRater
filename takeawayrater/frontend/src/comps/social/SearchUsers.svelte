<script>
    import { getCookie } from '../../utils';
    export let location
    let searchQuery = "";
    let searchResults = [];
    let message = "";

    async function search() {
        const data = new URLSearchParams();
        data.append("q", searchQuery);
        let resp = await (await fetch(`/api/search-users?${data}`)).json();
        if (resp["success"]) {
            searchResults = resp["users"];
            searchResults.length === 0 ? message = "No results found" : message = "";
        } else {
            searchResults = [];
            message = resp["message"];
        }
    }

    async function linkRequest(id) {
        const data = new FormData();
        data.append("id", id);
        let resp = await (await fetch(`/api/send-link-request`, {
            method: "POST",
            mode: "same-origin",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: data,
        })).json();
        searchResults = [];
        message = resp["message"];
    }

</script>
<div class="search-users-container">
    <div class="input-field">
        <input type="text" placeholder="Search Users" bind:value={searchQuery} />
        <button on:click={search}>Search</button>
    </div>
    <div class:bordered={searchResults.length > 0} class="search-results" style="width: 340px;">
        {#if message}
            <h4 class="text-color-2">{message}</h4>
        {/if}
        {#each searchResults as result}
            <div class="search-result">
                <span class="text-color-2">
                    {result.username}
                </span>
                <button on:click={() => linkRequest(result.id)}>Add</button>
            </div>
        {/each}
    </div>
</div>
<style lang="scss">
    .search-users-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100%;
        width: 100%;

        & > div {
            margin-top: 0.5rem;
        }

        .input-field {
            display: flex;
            flex-direction: row;
            align-items: center;
            input {
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                border: 1px solid #ccc;
                border-radius: 5px;
                margin-left: 10px;
            }
        }
        .bordered {
            border: 2px solid #ccc;
            padding: 0.5rem 0;
        }
        .search-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.5rem;
            .search-result {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                button {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
            }
        }
    }

</style>
