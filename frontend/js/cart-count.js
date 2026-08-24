document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("kcttwCart")) || [];

    const count = cart.reduce((total, item) => {
        return total + Number(item.quantity || 1);
    }, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;

        if (count > 0) {
            cartCount.style.display = "inline-flex";
        } else {
            cartCount.style.display = "none";
        }
    }
}