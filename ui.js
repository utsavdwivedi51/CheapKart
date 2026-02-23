// ui.js

// Function to render products on the UI
function renderProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `<h3>${product.name}</h3><p>${product.price}</p>`;
        productContainer.appendChild(productCard);
    });
}

// Function to render the shopping cart
function renderCart(cartItems) {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `<h4>${item.name}</h4><p>${item.quantity} x ${item.price}</p>`;
        cartContainer.appendChild(cartItem);
    });
}

// Function to update the cart UI
function updateCartUI(cartItems) {
    const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const totalContainer = document.getElementById('cart-total');
    totalContainer.innerText = `Total: $${total.toFixed(2)}`;
    renderCart(cartItems);
}

// Function to show notifications
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Function to toggle menu visibility
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Function to render checkout page
function renderCheckout(cartItems) {
    const checkoutContainer = document.getElementById('checkout');
    checkoutContainer.innerHTML = '';
    const summary = cartItems.map(item => `<div>${item.name}: ${item.quantity}</div>`).join('');
    checkoutContainer.innerHTML = `<h2>Checkout</h2>${summary}`;
}