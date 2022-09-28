<script>
    import { createEventDispatcher } from 'svelte';
    import Rating from './Rating.svelte';
    import Tags from './Tags.svelte';
    import { getCookie } from '../../utils';

    export let showOrderNew;
    export let initialData = null;
    export let beingEdited = false;

    const dispatch = createEventDispatcher();

    function refreshOrders() {
        dispatch('refreshOrders');
    }
    let order
    if (initialData) {
        //console.log(`initialData: ${JSON.stringify(initialData)}`);
        order = {
            id: initialData.id,
            restaurant: initialData.restaurant,
            url: initialData.url,
            foods: initialData.foods.map(food => {
                return {
                    id: food.id,
                    name: food.name,
                    rating: food.rating,
                    tagsStr: food.tags.join(),
                    tags: food.tags,
                    imageUrl: food.imageUrl,
                    comment: food.comment,
                }
            })
        };
    } else {
        order = {
            restaurant: "",
            url: "",
            foods: [],
        };
    }


    function toFormData(order, csrfToken, includeImages=false) {
        const formData = new FormData();
        formData.append("restaurant", order.restaurant);
        formData.append("url", order.url);
        if (order.id) {
            formData.append("id", order.id);
        }
        order.foods.forEach((food, i) => {
            if (food.id) {
                formData.append(`foods-${i}-id`, food.id);
            }
            formData.append(`food-${i}-name`, food.name);
            formData.append(`food-${i}-rating`, food.rating);
            formData.append(`food-${i}-tags`, food.tags);
            formData.append(`food-${i}-comment`, food.comment);

            if (includeImages && food.image) {
                formData.append(`food-${i}-image`, food.image);
            } else if (includeImages && food.imageUrl) {
                formData.append(`food-${i}-image-url`, food.imageUrl);
            }
        });
        formData.append('csrfmiddlewaretoken', csrfToken);
        return formData;
    }

    let previews = {};

    $: {
        order.foods.forEach(food => {
            console.log(`food: ${JSON.stringify(food)}`);
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
            imageUrl: "",
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
        if (order.foods.length > 0) {
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
        const submitUrl = beingEdited ? `/api/edit-order/${initialData.id}` : '/api/create-order';
        const resp = await fetch(submitUrl, {
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
            showOrderNew = false;
            beingEdited = false;
            refreshOrders();
        }
    }

    //$: console.log(`OrderEdit: ${JSON.stringify(order)}`);
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
                <input class="link-input" type="text" name={`image-link-${i}`} bind:value={order.foods[i].imageUrl} 
                placeholder="(Alternative) Image Link"/>
                {#if previews[i]}
                    <img class="preview-image" src={previews[i]} alt={order.foods[i].name} />
                {:else if order.foods[i].imageUrl}
                    <img class="preview-image" src={order.foods[i].imageUrl} alt={order.foods[i].name} />
                {/if}
            </div>
        {/each}
    </div>

    <div class="buttons-bar">
        <button on:click={addFood}>More Food</button>
        {#if order.foods.length > 0}
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
        .file-input, .link-input {
            padding: 5px 0.4em;
        }
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
        margin-top: 1rem;
    }
</style>