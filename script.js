document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((products) => {
      displayProducts(products);
      updateCartCount();
    })
    .catch((err) => showError("Failed to load products."));
});

function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear previous products

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  products.forEach((product) => {
    const inCart = cart.some(item => item.id === product.id);
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;
    
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button class="cart-btn">${inCart ? "Remove from Cart" : "Add to Cart"}</button>
    `;

    productList.appendChild(card);
  });

  // Attach event listeners once for all buttons
  productList.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const productId = parseInt(card.dataset.productId);
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const inCart = cart.some(item => item.id === product.id);

      if (inCart) {
        cart = cart.filter(item => item.id !== product.id);
        showToast(`${product.name} removed from cart!`);
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
        showToast(`${product.name} added to cart!`);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      // Update button text to toggle instantly
      e.target.textContent = inCart ? "Add to Cart" : "Remove from Cart";
    });
  });
}


function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cartCount;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#4b0082";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  toast.style.zIndex = "1000";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.5s ease";

  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 2000);
}

function showError(msg) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = `<p class="error">${msg}</p>`;
}
