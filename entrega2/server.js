// Importamos los módulos necesarios
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import viewsRouter from "./routes/views.router.js";
import ProductManager from "./utils/productManager.js";

// Configuración para poder usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializamos Express y el servidor HTTP
const app = express();
const httpServer = createServer(app); // Servidor HTTP con Express
const io = new Server(httpServer); // Socket.IO encima del servidor HTTP

// Instanciamos el ProductManager
const productManager = new ProductManager(
  path.join(__dirname, "products.json")
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Servimos archivos estáticos

// Configuramos Handlebars como motor de plantillas
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Usamos las rutas
app.use("/", viewsRouter);

// WebSockets: conexión con el cliente
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviamos la lista de productos al conectar
  const products = await productManager.getProducts();
  socket.emit("productList", products);

  // Escuchamos la creación de un producto
  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit("productList", updatedProducts); // Enviamos a todos los clientes
  });

  // Escuchamos la eliminación de un producto
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit("productList", updatedProducts);
  });
});

// Levantamos el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
