document.addEventListener("DOMContentLoaded", () => {
 fetch("data/products.json")
  .then((res) => res.json())
  .then((products) => {
   displayProducts(products);
   updateCartCount();
  })
  .catch((err) => console.error("Failed to load products:", err));
});


function displayProducts(products) {
 const productList = document.getElementById("product-list");
 productList.innerHTML = ""; // Clear previous products

 let cart = JSON.parse(localStorage.getItem("cart")) || [];

 products.forEach((product) => {
  const inCart = cart.some(item => item.id === product.id);
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
   <img src="${product.image}" alt="${product.name}" />
   <h3>${product.name}</h3>
   <p>₹${product.price}</p>
   ${
    inCart 
     ? `<button onclick="removeFromCart(${product.id})">Remove from Cart</button>`
     : `<button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>`
   }
  `;
  productList.appendChild(card);
 });
}


function addToCart(id, name, price, image) {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];
 const existingItem = cart.find((item) => item.id === id);

 if (existingItem) {
  existingItem.qty += 1;
 } else {
  cart.push({ id, name, price, image, qty: 1 });
 }

 localStorage.setItem("cart", JSON.stringify(cart));
 updateCartCount();
 fetch("data/products.json")
  .then((res) => res.json())
  .then((products) => displayProducts(products))
  .catch((err) => console.error("Failed to reload products:", err));
 showToast(`${name} added to cart!`);
}


function removeFromCart(id) {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];
 cart = cart.filter(item => item.id !== id);

 localStorage.setItem("cart", JSON.stringify(cart));
 updateCartCount();
 fetch("data/products.json")
  .then((res) => res.json())
  .then((products) => displayProducts(products))
  .catch((err) => console.error("Failed to reload products:", err));
 showToast(`Item removed from cart!`);
}


function updateCartCount() {
 let cart = JSON.parse(localStorage.getItem("cart")) || [];
 const cartCount = cart.reduce((total, item) => total + item.qty, 0);
 const badge = document.getElementById("cart-count");
 if (badge) badge.textContent = cartCount;
}


// Toast message instead of alert
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
 setTimeout(() => (toast.style.opacity = "1"), 100); // fade in
 setTimeout(() => {
 toast.style.opacity = "0";
 setTimeout(() => document.body.removeChild(toast), 500); // fade out
 }, 2000);
}
