// Utility helper functions

/**
 * Formats a price to a string with currency.
 * @param {number} price - The price to format.
 * @param {string} currency - The currency symbol.
 * @returns {string} - Formatted price string.
 */
function formatPrice(price, currency = '$') {
    return `${currency}${price.toFixed(2)}`;
}

/**
 * Calculates the discount amount.
 * @param {number} originalPrice - The original price.
 * @param {number} discountPercentage - The discount percentage.
 * @returns {number} - The discounted price.
 */
function calculateDiscount(originalPrice, discountPercentage) {
    return originalPrice - (originalPrice * (discountPercentage / 100));
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Debounces a function, limiting how often it can be called.
 * @param {function} func - The function to debounce.
 * @param {number} wait - The time to wait before calling the function.
 * @returns {function} - The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Throttles a function, limiting how often it can be called over time.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The time limit in milliseconds.
 * @returns {function} - The throttled function.
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan || (Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
        }
    };
}

/**
 * Formats a date to 'YYYY-MM-DD'.
 * @param {Date} date - The date to format.
 * @returns {string} - Formatted date string.
 */
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Exporting the utility functions
module.exports = {
    formatPrice,
    calculateDiscount,
    validateEmail,
    debounce,
    throttle,
    formatDate
};