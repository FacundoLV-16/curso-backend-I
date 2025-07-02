const socket = io();

// Referencias a elementos del DOM
const productList = document.getElementById("productList");
const form = document.getElementById("addProductForm");

// Escuchamos la lista de productos desde el servidor
socket.on("productList", (products) => {
  productList.innerHTML = ""; // Limpiamos lista actual

  // Recorremos y agregamos productos al DOM
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} <button onclick="deleteProduct(${p.id})">Eliminar</button>`;
    productList.appendChild(li);
  });
});

// Enviar producto nuevo
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    title: form.title.value,
    price: form.price.value,
  };
  socket.emit("addProduct", data);
  form.reset();
});

// Eliminar producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
