// دالة لجلب المنتجات
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading products:", error);
        showError("Please Try Again");
        return [];
    }
}

// دالة لعرض المنتجات
async function displayProducts() {
    const productsContainer = document.getElementById("products-container");

    // عرض حالة التحميل
    productsContainer.innerHTML = `
        <div class="col-span-4 text-center py-12">
            <i class="fas fa-spinner fa-spin text-5xl text-purple-500 mb-4"></i>
            <h2 class="text-2xl font-bold">Loading....</h2>
        </div>
    `;

    const products = await fetchProducts();

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-4 text-center py-12">
                <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold">لم يتم العثور على منتجات</h2>
                <p class="text-gray-500 mt-2">يرجى المحاولة مرة أخرى لاحقاً</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col">
            <a href="product.html?id=${product.id}" class="block">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover" loading="lazy">
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

// دالة لإضافة منتج إلى السلة
async function addToCart(productId) {
    try {
        const products = await fetchProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            throw new Error("Not Available");
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();

        // عرض إشعار نجاح
        showNotification("Added Successfully ", "success");
    } catch (error) {
        console.error("Error adding to cart:", error);
        showNotification("حدث خطأ أثناء إضافة المنتج إلى السلة", "error");
    }
}

// دالة لعرض الإشعارات
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center transition-all duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`;
    
    notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check" : "exclamation"}-circle mr-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add("opacity-0");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});