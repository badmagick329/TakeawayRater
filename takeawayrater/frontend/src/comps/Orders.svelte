<script>
    import { onMount } from 'svelte';
    import Order from './order/Order.svelte'
    import OrderNew from './order/OrderNew.svelte';
    import { filterOrders } from '../utils'

    export let sortBy;
    export let searchFilters;
    export let searchQuery;
    export let containerWidth = 340;
    export let showOrderNew = false

    let orders = null;
    let filteredOrders = null;
    
    
    async function getOrders() {
        let response = await fetch('/api/orders-list');
        orders = await response.json();
    }

    onMount(() => {
        getOrders();
    });

    $: {
        if (orders) {
            filteredOrders = filterOrders(orders, searchQuery, searchFilters.includes("tags"),
            searchFilters.includes("foods"), searchFilters.includes("restaurants"), 
            searchFilters.includes("my orders"), sortBy);
        }
    }

</script>
<div class="orders" style="width:{containerWidth}px;">
    {#if showOrderNew}
    <OrderNew on:refreshOrders={getOrders} bind:showOrderNew={showOrderNew} />
    {/if}
    {#if orders === null}
        <div class="loading">
            <div class="loading__spinner"></div>
        </div>
    {:else if orders.length === 0 && !showOrderNew}
        <h4 class="text-color-2">No orders found. Click Add Order to create an entry</h4>
    {:else if filteredOrders.length === 0 && !showOrderNew}
        <h4 class="text-color-2">No orders found</h4>
    {:else}
        {#each filteredOrders as order (order.id)}
            <Order bind:order={order} on:refreshOrders={getOrders} />
        {/each}
    {/if}
</div>
<style>
    .orders {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
