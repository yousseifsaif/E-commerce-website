window.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("products-container");

    // تأكد إن المنتجات موجودة
    if (!products || !Array.isArray(products)) {
        console.error("❌ المنتجات غير موجودة أو غير معرفة!");
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className =
            "flex flex-col justify-between border rounded-lg p-4 shadow-xl bg-gray-900 hover:scale-105 duration-300 transition-all";

        card.innerHTML = `
            <div>
                <img src="${product.image}" alt="${product.name}" class="w-full h-52 object-cover rounded-md mb-4 cursor-pointer">
                <h2 class="text-lg font-semibold text-white mb-1 cursor-pointer">${product.name}</h2>
                <p class="text-gray-400 mb-4">EGP ${product.price}</p>
            </div>
            <button class="add-to-cart-btn mt-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded transition">
                <i class="fas fa-cart-plus mr-2"></i> Add to Cart
            </button>
        `;

        // فتح صفحة تفاصيل المنتج
        card.querySelector("img").addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        card.querySelector("h2").addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        // إضافة المنتج للسلة
        card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(product);
        });

        productContainer.appendChild(card);
    });
});

// دالة لإضافة منتج إلى السلة وتخزينه في localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`🛒 Added "${product.name}" to cart!`);
}