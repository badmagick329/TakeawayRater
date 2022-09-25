<script>
    import { createEventDispatcher } from 'svelte';
    import { title, getCookie } from '../../utils';
    import Rating from './Rating.svelte';
    import Tags from './Tags.svelte';

    export let showOrderNew;

    const dispatch = createEventDispatcher();

    function refreshOrders() {
        dispatch('refreshOrders');
    }

    let order = {
        restaurant: "",
        url: "",
        foods: [],
    };

    

    function toFormData(order, csrfToken, includeImages=false) {
        const formData = new FormData();
        formData.append("restaurant", order.restaurant);
        formData.append("url", order.url);
        order.foods.forEach((food, i) => {
            formData.append(`food-${i}-name`, food.name);
            formData.append(`food-${i}-rating`, food.rating);
            formData.append(`food-${i}-tags`, food.tags);
            formData.append(`food-${i}-comment`, food.comment);

            if (includeImages && food.image) {
                formData.append(`food-${i}-image`, food.image);
            }
        });
        formData.append('csrfmiddlewaretoken', csrfToken);
        return formData;
    }

    let previews = {};

    $: {
        order.foods.forEach(food => {
            food.tags = [];
            food.tagsStr.split(",").forEach(tag => {
                if (tag.trim() != "") {
                    food.tags.push(tag.trim().toLowerCase());
                }
            });
        });
    }

    let errors = {
        restaurant: "",
        url: "",
        foods: []
    };

    function addFood() {
        order.foods.push({
            name: "",
            rating: 1,
            image: null,
            tagsStr: "",
            tags: [],
            comment: "",
        });
        errors.foods.push("");
        order = {...order};
    }

    if (order.foods.length == 0) {
        addFood();
    }

    function removeFood() {
        if (order.foods.length > 1) {
            order.foods.pop();
            errors.foods.pop();
            order = {...order};
        }
    }

    function readImage(e,i) {
        order.foods[i].image = e.target.files[0]
        let reader = new FileReader();
        reader.readAsDataURL(order.foods[i].image);
        reader.onload = (e) => {
            previews[i] = e.target.result;
            
        }
        order = {...order};
    }

    function displayErrors(data) {
        if (data["errors"]["restaurant"]){
            errors.restaurant = data["errors"]["restaurant"];
        }
        if (data["errors"]["url"]){
            errors.url = data["errors"]["url"];
        }
        if (data["errors"]["foods"]){
            data["errors"]["foods"].forEach((food, index) => {
                errors.foods[index] = food;
            });
        }
    }
    
    async function validate(e) {
        const formData = toFormData(order, getCookie('csrftoken'));
        const resp = await fetch('/api/validate', {
            method: 'POST',
            mode: 'same-origin',
            body: formData,
        });
        const data = await resp.json();

        if (data["errors"]){
            displayErrors(data);
        } else {
            errors = {
                restaurant: "",
                url: "",
                foods: [...errors.foods]
            };

            if (data["url"]) {
                order.url = data["url"];
                order = {...order};
            }
            if (data["foods"]) {
                data["foods"].forEach((food, i) => {
                if (food["rating"]) {
                    order.foods[i].rating = food["rating"];
                    }
                if (food["tags"] && order.foods[i].tagsStr.trim() == "") {
                    order.foods[i].tagsStr = food["tags"].join(",");
                    }
                if (food["image"] && !previews[i]) {
                    previews[i] = food["image"];
                    }
                if (food["comment"] && order.foods[i].comment.trim() == "") {
                    order.foods[i].comment = food["comment"];
                    }
                });

                order = {...order};
            }
            
            if (e.target.name.startsWith("food-"))
            {
                const index = parseInt(e.target.name.split("-")[1]);
                if (e.target.value.trim() === "") {
                    errors.foods[index] = "Food name cannot be empty";
                } else {
                    errors.foods[index] = "";
                }
            }
        }
    }

    async function submitOrder() {
        const formData = toFormData(order, getCookie('csrftoken'), true);
        
        const resp = await fetch('/api/create-order', {
            method: 'POST',
            mode: 'same-origin',
            body: formData,
        });
        const data = await resp.json();
        if (data["errors"]){
            displayErrors(data);
        } else if (data["success"]) {
            errors = {
                restaurant: "",
                url: "",
                foods: []
            };
            order = {
                restaurant: "",
                url: "",
                foods: [],
            };
            previews = {}
            document.querySelectorAll('.file-input').forEach(input => {
                input.value = "";
            });
            addFood();
            showOrderNew = false;
            refreshOrders();
        }
    }
</script>
<div class="order">
    <div class="input-field">
        <div class="error-field" style={errors.restaurant ? "display:block;" : "display:none;"}>
            <span>{errors.restaurant}</span>
        </div>
        <input type="text" name="restaurant" bind:value={order.restaurant} on:blur={validate} placeholder="Restaurant Name"/>
    </div>
    
    <div class="input-field">
        <div class="error-field" style={errors.url ? "display:block;" : "display:none;"}>
            <span>{errors.url}</span>
        </div>
        <input type="text" name="url" bind:value={order.url} on:blur={validate} placeholder="Restaurant URL (Optional)"/>
    </div>

    <div class="food-input">
        {#each order.foods as food, i}
            <div class="input-field">
                <div class="error-field" style={errors.foods[i] ? "display:block;" : "display:none;"}>
                    <span>{errors.foods[i]}</span>
                </div>
                <input type="text" name={`food-${i}`} bind:value={order.foods[i].name} on:blur={validate} placeholder="Food Name"/>
            </div>
            <div class="input-field">
                <input type="text" name={`tags-${i}`} bind:value={order.foods[i].tagsStr} placeholder="Tags (Optional)"/>
            </div>
            <div class="input-display">
                {#if order.foods[i].tags.length > 0}
                    <Tags tags={order.foods[i].tags}/>
                {/if}
            </div>
            <div class="input-field">
                <input type="text" name={`comment-${i}`} bind:value={order.foods[i].comment} placeholder="Comment (Optional)"/>
            </div>
            <div class="input-field">
                <Rating bind:rating={order.foods[i].rating}/>
            </div>
            <div class="input-field">
                <input class="file-input" type="file" name={`image-${i}`} accept="image/*" on:input={(e) => readImage(e,i)}/>
                {#if previews[i]}
                    <img class="preview-image" src={previews[i]} alt={order.foods[i].name} />
                {/if}
            </div>
        {/each}
    </div>

    <div class="buttons-bar">
        <button on:click={addFood}>More Food</button>
        {#if order.foods.length > 1}
            <button on:click={removeFood}>Less Food</button>
        {/if}
        <button on:click={submitOrder}>Submit</button>
    </div>
    
</div>
<style lang="scss">
    .input-field,.input-display {
        display: flex;
        flex-direction: column;
        padding: 5px 0.4em;
    }
    .error-field {
        color: red;
        font-weight: 600;
        padding: 0.2em;
    }
    .food-input {
        display: flex;
        flex-direction: column;
        margin-top: 1em;
        
    }
    .buttons-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 5px 0.4em;
    }

    .preview-image {
        max-width: 80%;
        max-height: 270px;
        align-self: center;
    }
</style>