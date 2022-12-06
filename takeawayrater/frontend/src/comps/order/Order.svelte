<script>
  import { createEventDispatcher } from "svelte";
  import { missingImage } from "../../const";
  import { getCookie, title } from "../../utils";
  import Food from "./Food.svelte";
  import OrderEdit from "./OrderEdit.svelte";
  import Tags from "./Tags.svelte";

  export let order;
  let beingEdited = false;

  const dispatch = createEventDispatcher();

  function refreshOrders() {
    dispatch("refreshOrders");
  }

  async function deleteOrder(id) {
    const resp = await fetch(`/api/delete-order/${id}`, {
      method: "POST",
      mode: "same-origin",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    const data = await resp.json();
    if (data["success"]) {
      refreshOrders();
    }
  }

  function createInitialData() {
    return {
      id: order.id,
      restaurant: order.restaurant,
      url: order.url,
      foods: order.foods.map((food) => {
        let foodImage;
        if (food.image === missingImage) {
          if (food.image_url) {
            foodImage = food.image_url;
          } else {
            foodImage = "";
          }
        } else {
          foodImage = food.image;
        }
        return {
          id: food.id,
          name: food.name,
          rating: food.rating,
          tags: food.tags,
          imageUrl: foodImage,
          comment: food.comment,
        };
      }),
    };
  }

  //$: console.log(`Order is ${JSON.stringify(order)}`);
</script>

{#if order}
  {#if beingEdited}
    <OrderEdit
      showOrderNew={false}
      initialData={createInitialData()}
      bind:beingEdited
      on:refreshOrders={refreshOrders}
    />
  {:else}
    <div class="order">
      <div class="order__header">
        <div class="left">
          {#if order.url}
            <span
              ><a href={order.url} target="_blank">{title(order.restaurant)}</a
              ></span
            >
          {:else}
            <span style="font-weight:600;">{title(order.restaurant)}</span>
          {/if}
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
            <button on:click={() => (beingEdited = true)}>Edit</button>
          {/if}
        </div>
      </div>
      <div class="order__tags">
        <Tags tags={order.tags} />
      </div>
      <div class="order__body">
        {#each order.foods as food}
          <Food {food} />
        {/each}
      </div>
    </div>
  {/if}
{/if}

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
