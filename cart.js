// cart.js - Cart management functions

let cart = [];

// Add item to cart
function addToCart(item) {
    cart.push(item);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
}

// Update quantity of an item in the cart
function updateCartQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
    }
}

// Get total price of items in cart
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear the cart
function clearCart() {
    cart = [];
}

// Get all items in the cart
function getCartItems() {
    return cart;
}

// Export functions
module.exports = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart,
    getCartItems
};