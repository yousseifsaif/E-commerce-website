// دالة لجلب المنتجات
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error loading products:", error);
        return [];
    }
}

// دالة لعرض المنتجات
async function displayProducts() {
    const productsContainer = document.getElementById("products-container");
    const products = await fetchProducts();

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-4 text-center py-12">
                <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold">No products found</h2>
                <p class="text-gray-500 mt-2">Please try again later</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
    <div class="product-card bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col">
        <a href="product.html?id=${product.id}" class="block">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <div class="flex justify-between items-center mt-2">
                    <p class="text-purple-400">$${product.price.toFixed(2)}</p>
                    ${product.badge ? `<span class="text-xs px-2 py-1 bg-purple-600 text-white rounded">${product.badge}</span>` : ''}
                </div>
            </div>
        </a>
        <button 
            onclick="addToCart(${product.id})" 
            class="mt-auto bg-purple-700 hover:bg-purple-800 text-white w-full py-2 font-semibold transition"
        >
            <i class="fas fa-cart-plus mr-2"></i>Add to Cart
        </button>
    </div>
`).join('');


    updateCartCounter();
}

// دالة لتحديث عداد السلة
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counters = document.querySelectorAll(".cart-count");
    
    counters.forEach(counter => {
        if (count > 0) {
            counter.textContent = count;
            counter.classList.remove("hidden");
        } else {
            counter.classList.add("hidden");
        }
    });
}
function addToCart(productId) {
    fetchProducts().then(products => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
    });
}


// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});