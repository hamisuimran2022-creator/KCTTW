/* =========================================================
   KCTTW MAIN.JS
   Product colors + cart + animations
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    updateCartDisplay();
});


/* =========================================================
   SELECTED PRODUCT COLORS
========================================================= */

const selectedProductColors = {
    cap: "Black",
    round: "Black",
    collar: "Black"
};


/* =========================================================
   SELECT PRODUCT COLOR
========================================================= */

function selectProductColor(productType, color, button) {

    selectedProductColors[productType] = color;

    /*
       Remove active state from all colors
       belonging to this product.
    */

    const parent = button.parentElement;

    parent.querySelectorAll(".color-option").forEach(option => {
        option.classList.remove("active");
    });

    /*
       Activate selected color
    */

    button.classList.add("active");

    /*
       Update displayed color name
    */

    const colorNameIds = {
        cap: "capColorName",
        round: "roundColorName",
        collar: "collarColorName"
    };

    const colorNameElement =
        document.getElementById(colorNameIds[productType]);

    if (colorNameElement) {
        colorNameElement.textContent = color;
    }

    /*
       Small selection animation
    */

    button.animate(
        [
            {
                transform: "scale(1)"
            },
            {
                transform: "scale(1.25)"
            },
            {
                transform: "scale(1)"
            }
        ],
        {
            duration: 300,
            easing: "ease-out"
        }
    );
}


/* =========================================================
   ADD COLORED PRODUCT TO CART
========================================================= */

function addColoredProductToCart(
    productName,
    price,
    image,
    productType
) {

    const selectedColor =
        selectedProductColors[productType] || "Black";

    let cart =
        JSON.parse(localStorage.getItem("kcttwCart")) || [];

    /*
       Find same product + same color
    */

    const existingProduct = cart.find(
        item =>
            item.name === productName &&
            item.color === selectedColor
    );

    if (existingProduct) {

        existingProduct.quantity =
            (existingProduct.quantity || 1) + 1;

    } else {

        cart.push({
            id: Date.now() + Math.random(),
            name: productName,
            price: Number(price),
            image: image,
            color: selectedColor,
            quantity: 1
        });
    }

    localStorage.setItem(
        "kcttwCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    /*
       Show success message
    */

    showCartNotification(
        `${productName} (${selectedColor}) added to your cart 🛒`
    );

    /*
       Button feedback
    */

    const buttons =
        document.querySelectorAll(".add-cart");

    buttons.forEach(button => {

        if (
            button.textContent
                .toLowerCase()
                .includes("add to cart")
        ) {

            const originalText = button.innerHTML;

            button.innerHTML =
                `<i class="bi bi-check-lg"></i> ADDED`;

            button.classList.add("cart-added");

            setTimeout(() => {

                button.innerHTML = originalText;

                button.classList.remove("cart-added");

            }, 1200);
        }

    });

    updateCartDisplay();
}


/* =========================================================
   OLD ADD TO CART SUPPORT
   Keeps your existing buttons working.
========================================================= */

function addToCart(productName, price, image) {

    let cart =
        JSON.parse(localStorage.getItem("kcttwCart")) || [];

    const existingProduct = cart.find(
        item =>
            item.name === productName &&
            !item.color
    );

    if (existingProduct) {

        existingProduct.quantity =
            (existingProduct.quantity || 1) + 1;

    } else {

        cart.push({
            id: Date.now() + Math.random(),
            name: productName,
            price: Number(price),
            image: image,
            color: "Default",
            quantity: 1
        });
    }

    localStorage.setItem(
        "kcttwCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showCartNotification(
        `${productName} added to your cart 🛒`
    );

    updateCartDisplay();
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("kcttwCart")) || [];

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );

    document
        .querySelectorAll("#cartCount")
        .forEach(element => {
            element.textContent = count;
        });
}


/* =========================================================
   GET CART
========================================================= */

function getKCTTWCart() {

    return JSON.parse(
        localStorage.getItem("kcttwCart")
    ) || [];
}


/* =========================================================
   UPDATE CART DISPLAY
========================================================= */

function updateCartDisplay() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems) return;

    const cart = getKCTTWCart();

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart text-center py-4">

                <i
                    class="bi bi-bag-x"
                    style="font-size:3rem;"
                ></i>

                <h4 class="mt-3">
                    Your cart is empty
                </h4>

                <p>
                    Add something from the KCTTW collection.
                </p>

                <a
                    href="products.html"
                    class="btn-main"
                >
                    SHOP NOW
                </a>

            </div>
        `;

        if (cartTotal) {
            cartTotal.textContent = "₦0";
        }

        return;
    }


    let total = 0;

    cartItems.innerHTML = cart.map(item => {

        const quantity =
            Number(item.quantity || 1);

        const itemTotal =
            Number(item.price) * quantity;

        total += itemTotal;

        return `
            <div
                class="cart-item"
                data-id="${item.id}"
            >

                <img
                    src="${item.image}"
                    alt="${escapeHTML(item.name)}"
                >

                <div class="cart-item-details">

                    <h5>
                        ${escapeHTML(item.name)}
                    </h5>

                    <p class="cart-item-color">
                        Color:
                        <strong>
                            ${escapeHTML(item.color || "Default")}
                        </strong>
                    </p>

                    <p>
                        ₦${formatNumber(item.price)}
                    </p>

                    <div class="cart-controls">

                        <button
                            onclick="changeCartQuantity(
                                '${item.id}',
                                -1
                            )"
                        >
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="changeCartQuantity(
                                '${item.id}',
                                1
                            )"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="cart-item-actions">

                    <strong>
                        ₦${formatNumber(itemTotal)}
                    </strong>

                    <button
                        class="remove-cart"
                        onclick="removeFromCart('${item.id}')"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </div>

            </div>
        `;

    }).join("");


    if (cartTotal) {

        cartTotal.textContent =
            `₦${formatNumber(total)}`;
    }
}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(id, change) {

    let cart = getKCTTWCart();

    const item = cart.find(
        product =>
            String(product.id) === String(id)
    );

    if (!item) return;

    item.quantity =
        Number(item.quantity || 1) + Number(change);

    if (item.quantity <= 0) {

        cart = cart.filter(
            product =>
                String(product.id) !== String(id)
        );
    }

    localStorage.setItem(
        "kcttwCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    updateCartDisplay();
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(id) {

    let cart = getKCTTWCart();

    cart = cart.filter(
        item =>
            String(item.id) !== String(id)
    );

    localStorage.setItem(
        "kcttwCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    updateCartDisplay();

    showCartNotification(
        "Product removed from cart"
    );
}


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {

    localStorage.removeItem("kcttwCart");

    updateCartCount();

    updateCartDisplay();
}


/* =========================================================
   FORMAT NAIRA
========================================================= */

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("en-NG");
}


/* =========================================================
   ESCAPE HTML
   Basic protection when displaying cart information.
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value ?? "");

    return div.innerHTML;
}


/* =========================================================
   CART NOTIFICATION
========================================================= */

function showCartNotification(message) {

    /*
       Remove previous notification
    */

    const old =
        document.querySelector(".kcttw-cart-notification");

    if (old) {
        old.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        "kcttw-cart-notification";

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="bi bi-check-circle-fill"></i>
        </div>

        <div class="notification-text">
            ${escapeHTML(message)}
        </div>
    `;


    document.body.appendChild(notification);


    /*
       Animate notification
    */

    requestAnimationFrame(() => {

        notification.classList.add("show");

    });


    setTimeout(() => {

        notification.classList.remove("show");

        setTimeout(() => {

            notification.remove();

        }, 400);

    }, 2500);
}


/* =========================================================
   QUICK VIEW
========================================================= */

function quickView(
    productName,
    price,
    image
) {

    const title =
        document.getElementById("quickViewTitle");

    const priceElement =
        document.getElementById("quickViewPrice");

    const imageElement =
        document.getElementById("quickViewImage");

    const addButton =
        document.getElementById("quickAddButton");


    if (title) {
        title.textContent = productName;
    }

    if (priceElement) {

        priceElement.textContent =
            `₦${formatNumber(price)}`;
    }

    if (imageElement) {

        imageElement.src = image;
        imageElement.alt = productName;
    }


    if (addButton) {

        addButton.onclick = function () {

            addToCart(
                productName,
                price,
                image
            );

        };
    }


    const modalElement =
        document.getElementById("quickViewModal");

    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();
    }
}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkoutWhatsApp() {

    const cart = getKCTTWCart();

    if (!cart.length) {

        showCartNotification(
            "Your cart is empty."
        );

        return;
    }


    let message =
        "Hello KCTTW 👋%0A%0A" +
        "I would like to place an order:%0A%0A";


    let total = 0;


    cart.forEach((item, index) => {

        const quantity =
            Number(item.quantity || 1);

        const itemTotal =
            Number(item.price) * quantity;

        total += itemTotal;


        message +=
            `${index + 1}. ${encodeURIComponent(item.name)}%0A` +
            `Color: ${encodeURIComponent(item.color || "Default")}%0A` +
            `Quantity: ${quantity}%0A` +
            `Price: ₦${itemTotal.toLocaleString("en-NG")}%0A%0A`;

    });


    message +=
        `Total: ₦${total.toLocaleString("en-NG")}%0A%0A` +
        "Thank you.";


    window.open(
        `https://wa.me/2349072585516?text=${message}`,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   YEAR
========================================================= */

function updateYear() {

    const year =
        document.getElementById("year");

    if (year) {

        year.textContent =
            new Date().getFullYear();
    }
}

updateYear();


/* =========================================================
   MOBILE NAVBAR
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const clickedLink =
            event.target.closest(
                ".navbar-nav .nav-link"
            );

        if (!clickedLink) return;

        const navbar =
            document.getElementById("mainNavbar");

        if (
            navbar &&
            navbar.classList.contains("show") &&
            typeof bootstrap !== "undefined"
        ) {

            const collapse =
                bootstrap.Collapse.getInstance(
                    navbar
                );

            if (collapse) {
                collapse.hide();
            }
        }
    }
);