/* =========================================
   KCTTW WEBSITE JAVASCRIPT
========================================= */

let cart = [];


/* =========================================
   PAGE LOADER
========================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.getElementById("loader");

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

    }, 1000);

});


/* =========================================
   AOS
========================================= */

AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: "ease-out-cubic"
});


/* =========================================
   NAVBAR
========================================= */

window.addEventListener("scroll", () => {

    const navbar = document.getElementById("mainNavbar");

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* =========================================
   YEAR
========================================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price, image) {

    const existing = cart.find(
        item => item.name === name
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });

    }

    updateCart();

    showNotification(
        `${name} added to your cart`
    );

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    const cartItems =
        document.getElementById("cartItems");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="
                text-align:center;
                padding:40px 10px;
                color:#777;
            ">
                <i
                    class="bi bi-bag"
                    style="
                        font-size:40px;
                        color:#d4af37;
                    "
                ></i>

                <p style="margin-top:15px;">
                    Your cart is empty.
                </p>
            </div>
        `;

    } else {

        cartItems.innerHTML = cart.map(
            (item, index) => `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h6>
                            ${item.name}
                        </h6>

                        <p>
                            ₦${item.price.toLocaleString()}
                            × ${item.quantity}
                        </p>

                    </div>

                    <button
                        class="remove-item"
                        onclick="removeFromCart(${index})"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </div>

            `
        ).join("");

    }


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    document.getElementById(
        "cartTotal"
    ).textContent =
        `₦${total.toLocaleString()}`;

}


/* =========================================
   REMOVE CART ITEM
========================================= */

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    updateCart();

    const modal =
        new bootstrap.Modal(
            document.getElementById("cartModal")
        );

    modal.show();

}


/* =========================================
   QUICK VIEW
========================================= */

function quickView(name, price, image) {

    document.getElementById(
        "quickViewTitle"
    ).textContent = name;

    document.getElementById(
        "quickViewPrice"
    ).textContent =
        `₦${price.toLocaleString()}`;

    document.getElementById(
        "quickViewImage"
    ).src = image;

    document.getElementById(
        "quickAddButton"
    ).onclick = () => {

        addToCart(name, price, image);

    };


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "quickViewModal"
            )
        );

    modal.show();

}


/* =========================================
   WHATSAPP CHECKOUT
========================================= */

function checkoutWhatsApp() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty."
        );

        return;

    }

    let message =
        "Hello KCTTW 👋%0A%0A" +
        "I would like to place an order:%0A%0A";

    cart.forEach(item => {

        message +=
            `• ${item.name}%0A` +
            `Quantity: ${item.quantity}%0A` +
            `Price: ₦${(
                item.price * item.quantity
            ).toLocaleString()}%0A%0A`;

    });


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    message +=
        `Total: ₦${total.toLocaleString()}%0A%0A` +
        "Thank you — KCTTW.";

    /*
       IMPORTANT:
       Replace 234XXXXXXXXXX with your
       real WhatsApp number later.
    */

    const whatsappNumber =
        "234XXXXXXXXXX";

    const url =
        `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(url, "_blank");

}


/* =========================================
   NOTIFICATION
========================================= */

function showNotification(message) {

    const notification =
        document.createElement("div");

    notification.innerHTML = `

        <div style="
            display:flex;
            align-items:center;
            gap:12px;
        ">

            <i
                class="bi bi-check-circle-fill"
                style="color:#d4af37;font-size:20px;"
            ></i>

            <span>${message}</span>

        </div>

    `;

    notification.style.position = "fixed";
    notification.style.bottom = "30px";
    notification.style.right = "30px";
    notification.style.zIndex = "99999";
    notification.style.background = "#111";
    notification.style.color = "white";
    notification.style.padding = "15px 20px";
    notification.style.border =
        "1px solid rgba(212,175,55,.4)";
    notification.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.5)";
    notification.style.fontSize = "11px";
    notification.style.transform =
        "translateY(30px)";
    notification.style.opacity = "0";
    notification.style.transition = ".4s ease";

    document.body.appendChild(notification);


    setTimeout(() => {

        notification.style.transform =
            "translateY(0)";

        notification.style.opacity = "1";

    }, 50);


    setTimeout(() => {

        notification.style.opacity = "0";

        notification.style.transform =
            "translateY(30px)";

        setTimeout(() => {
            notification.remove();
        }, 400);

    }, 3000);

}


/* =========================================
   NAVBAR LINK ACTIVE STATE
========================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (
            window.scrollY >= sectionTop
        ) {

            current =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});