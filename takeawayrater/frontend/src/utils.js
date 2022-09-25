export function title(text) {
    
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function sleep(func, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            func();
        }, 2000);
    });
}

function sortOrders(orders, sortBy) {
    if (orders.length > 1) {
        if (sortBy == "date") {
            orders.sort((a,b) => {
                return new Date(b.order_date) - new Date(a.order_date);
            })
            return orders;
        } else if (sortBy == "rating") {
            orders.sort((a,b) => {
                let aRating = 0;
                let bRating = 0;
                a.foods.forEach(food => {
                    aRating += food.rating;
                })
                b.foods.forEach(food => {
                    bRating += food.rating;
                })
                let avgARating = aRating / a.foods.length;
                let avgBRating = bRating / b.foods.length;
                return avgBRating - avgARating;
            })
            return orders;
        }
    }
    return orders;
}

function getUniqueOrders(orders) {
    let uniqueOrders = []
    for (let order of orders) {
        let addedOrder = uniqueOrders.filter((o) => o.id === order.id);
        if (addedOrder.length > 0) {
            addedOrder = addedOrder[0];
            for (const food of order.foods) {
                if (!addedOrder.foods.includes(food)) {
                    addedOrder.foods.push(food);
                }
            }
        } else {
            uniqueOrders.push(order);
        }
    }
    return uniqueOrders;
}

export function filterOrders(orders, search, tags, foods, restaurants, ownOnly, sortBy) {
    let filteredOrders = [];
    let ordersList = [];
    if (ownOnly) {
        ordersList = orders.filter(order => order.ordered_by === undefined || order.ordered_by === "You");
    } else {
        ordersList = orders;
    }

    if (search.trim() === "") {
        return sortOrders(ordersList, sortBy);
    }
    search = search.toLowerCase().trim();

    for (let order of ordersList) {
        if (restaurants) {
            if (order.restaurant.toLowerCase().includes(search)) {
                filteredOrders.push(order);
            }
        }
        if (foods) {
            let filteredFoods = [];
            for (let food of order.foods) {
                if (food.name.toLowerCase().includes(search)) {
                    filteredFoods.push(food);
                }
            }
            if (filteredFoods.length > 0) {
                filteredOrders.push({
                    ...order,
                    foods: filteredFoods
                });
            }
        }
        if (tags) {
            let filteredFoods = [];
            for (let food of order.foods) {
                for (let tag of food.tags) {
                    if (tag.toLowerCase().includes(search)) {
                        filteredFoods.push(food)
                    }
                }
            }
            if (filteredFoods.length > 0) {
                filteredOrders.push({
                    ...order,
                    foods: filteredFoods
                });
            }
        }

    }
    return sortOrders(getUniqueOrders(filteredOrders), sortBy);
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}