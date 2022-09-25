<script>
    import { onMount } from 'svelte';
    import { getCookie } from '../../utils';
    export let location;
    let linksList=null;
    let linkRequestsList=null;

    async function getLinksList() {
        const resp = await fetch('/api/links-list');
        linksList = await resp.json();
    }

    async function getLinkRequestsList() {
        let resp = await(await fetch('/api/link-requests-list')).json();
        linkRequestsList = resp['users'];
    }

    onMount(() => {
        getLinksList();
        getLinkRequestsList();
    });

    async function removeLink(id) {
        const resp = await fetch(`/api/remove-link/${id}`, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        });
        const data = await resp.json();
        if (data["success"]) {
            getLinksList();
        }
    }

    async function respondToLinkRequest(id, accept) {
        let url;
        accept ? url = `/api/accept-link-request` : url = `/api/reject-link-request`;
        const resp = await(await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                id: id,
            })
        })).json();
        
        if (resp["success"] && accept) {
            getLinkRequestsList();
            getLinksList();
        } else if (resp["success"] && !accept) {
            getLinkRequestsList();
        }
    }
</script>
<div class="container">
    {#if linksList === null || linkRequestsList === null}
        <div class="loading">
            <div class="loading__spinner"></div>
        </div>
    {:else}
        <div class="links">
            {#if linksList.length === 0}
                <div class="links__header">
                    <h4 class="text-color-2">You are not linked with any other users</h4>
                </div>
            {:else}
                <div class="links__header">
                    <h4 class="text-color-2">Linked Accounts</h4>
                </div>
                <div class="links__body">
                    {#each linksList as link}
                        <div class="link">
                            <span class="text-color-2">{link.username}</span>
                            <button on:click={() => removeLink(link.id)}>Remove</button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="requests">
        {#if linkRequestsList.length === 0}
            <div class="requests__header">
                <h4 class="text-color-2">You have no pending requests</h4>
            </div>
        {:else}
            <div class="requests__header">
                <h4 class="text-color-2">You have {linkRequestsList.length} link requests</h4>
            </div>
            <div class="requests__body">
            {#each linkRequestsList as request (request.id)}
                <p class="text-color-2">{request.username}</p>
                <div class="buttons">
                    <button on:click={() => respondToLinkRequest(request.id, true)}>Accept</button>
                    <button on:click={() => respondToLinkRequest(request.id, false)}>Decline</button>
                </div>
            {/each}
            </div>
        {/if}
        </div>
    {/if}
</div>
<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-content: center;
        width: 100%;
        
        .links {
            margin-bottom: 1rem;
            border-bottom: 1px solid white;
        }
        .links,.requests {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            .links__header,.requests__header {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem 0;
                background-color: var(--color-1);
                border-radius: 0.5rem;
                h4 {
                    margin: 0;
                }
            }
            .links__body,.requests__body {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem 0;
                background-color: var(--color-1);
                border-radius: 0.5rem;
                .link {
                    display: flex;
                    align-items: center;
                    * {
                        margin: 0 0.5rem;
                    }
                }
            }
        }
    }
</style>