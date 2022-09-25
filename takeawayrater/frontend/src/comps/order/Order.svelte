<script>
    import { createEventDispatcher } from 'svelte';
    import Food from './Food.svelte';
    import Tags from './Tags.svelte';
    import { title, getCookie } from '../../utils';
    export let order;

    const dispatch = createEventDispatcher();

    function refreshOrders() {
        dispatch('refreshOrders');
    }

    async function deleteOrder(id) {
        const resp = await fetch(`/api/delete-order/${id}`, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        const data = await resp.json();
        if (data["success"]) {
            refreshOrders();
        }
    }

</script>
<div class="order">
    {#if order}
        <div class="order__header">
            <div class="left">
                <span><a href={order.url} target="_blank">{title(order.restaurant)}</a></span>
                <span class="text-size--small">
                    {#if order.ordered_by}
                        <strong>{order.ordered_by}</strong> ordered on {order.order_date}
                    {:else}
                        Ordered on {order.order_date}
                    {/if}
                </span>
            </div>
            <div class="right">
                {#if order.ordered_by === undefined || order.ordered_by === "You"}
                    <button on:click={() => deleteOrder(order.id)}>Delete</button>
                {/if}
            </div>
        </div>
        <div class="order__tags">
            <Tags tags={order.tags} />
        </div>
        <div class="order__body">
            {#each order.foods as food}
                <Food food={food} />
            {/each}
        </div>
    {/if}
</div>
<style lang="scss">
    .order > div {
        padding: 5px 0.4em;
    }
    .order__header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .order__header .left {
        display: flex;
        flex-direction: column;
    }
    .order__header .left > span > a {
        font-weight: bold;
    }
    span {
        padding: 2px;
    }
    .order__body {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.4em;
    }
    
</style>