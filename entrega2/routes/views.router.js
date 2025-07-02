import { Router } from "express";
import ProductManager from "../utils/productManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, "../products.json")
);

// Ruta para home.handlebars (lista de productos sin sockets)
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// Ruta para realTimeProducts.handlebars (lista en tiempo real)
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
