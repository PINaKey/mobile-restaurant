import { menuArray } from "./data.js";

const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const modal = document.getElementById("modal");
const backdrop = document.getElementById("backdrop");
const cardDetailsForm = document.getElementById("card-details-form");

const renderMenuItems = (menuItems) => {
    return menuItems
        .map(
            ({ emoji, name, ingredients, price, id }) => `
             <div class="menu-item">
                <p class="item-emoji">${emoji}</p>
                <div class="item-detials">
                    <h2 class="item-name">${name}</h2>
                    <p class="item-ingredients">
                        ${ingredients.join("")}
                    </p>
                    <p class="item-price">$${price}</p>
                </div>
                <button class="add-item-btn" data-add="${id}">+</button>
            </div>
          `
        )
        .join("");
};

menu.innerHTML = renderMenuItems(menuArray);

let cartItems = [];

if (cartItems.length <= 0) {
    cart.classList.add("hidden");
}

const renderCartItems = (cartItems) => {
    return cartItems
        .map(
            ({ name, id, count, price }) => `
                <div class="cart-line-item">
                    <h3 class="item-name">${name}</h3>
                    <button class="remove-item-btn" data-remove="${id}">remove</button>
                    <p class="cart-item-price">${count} X $${price} = $${
                count * price
            }</p>
                </div>`
        )
        .join("");
};

const handleAddBtnClick = (itemId) => {
    const targetMenuObj = menuArray.find((item) => item.id === Number(itemId));
    const existingItem = cartItems.find((item) => item.id === targetMenuObj.id);

    if (existingItem) {
        existingItem.count += 1;
    } else {
        cartItems.push({ ...targetMenuObj, count: 1 });
    }

    cart.classList.remove("hidden");
    document.getElementById("cart-items").innerHTML =
        renderCartItems(cartItems);
    document.getElementById(
        "total-item-price"
    ).textContent = `$${cartItems.reduce(
        (totalPrice, currentItem) =>
            totalPrice + currentItem.price * currentItem.count,
        0
    )}`;
};

const handleRemoveBtnClick = (itemId) => {
    const targetMenuObj = menuArray.find((item) => item.id === Number(itemId));
    const existingItem = cartItems.find((item) => item.id === targetMenuObj.id);

    if (existingItem) {
        if (existingItem.count === 1) {
            cartItems = cartItems.filter(
                (item) => item.id !== targetMenuObj.id
            );
        } else {
            existingItem.count -= 1;
        }
    }

    if (cartItems.length <= 0) {
        cart.classList.add("hidden");
    }

    document.getElementById("cart-items").innerHTML =
        renderCartItems(cartItems);
    document.getElementById(
        "total-item-price"
    ).textContent = `$${cartItems.reduce(
        (totalPrice, currentItem) =>
            totalPrice + currentItem.price * currentItem.count,
        0
    )}`;
};

document.addEventListener("click", (e) => {
    if (e.target.dataset.add) {
        handleAddBtnClick(e.target.dataset.add);
    }

    if (e.target.dataset.remove) {
        handleRemoveBtnClick(e.target.dataset.remove);
    }

    if (e.target === document.getElementById("complete-order-btn")) {
        modal.style.display = "block";
        backdrop.style.display = "block";
    }

    if (
        e.target === document.getElementById("modal-close-btn") ||
        e.target === backdrop
    ) {
        modal.style.display = "none";
        backdrop.style.display = "none";
    }
});

cardDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    modal.style.display = "none";
    backdrop.style.display = "none";

    cartItems = [];
    cart.classList.add("hidden");

    const cardDetailsFormData = new FormData(cardDetailsForm);
    const name = cardDetailsFormData.get("name");

    const successMessage = document.createElement("p");
    successMessage.className = "success-message";
    successMessage.textContent = `Thanks, ${name}! Your order is on its way!`;

    menu.append(successMessage);
});
