import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("src/data/products.json");

// GET /
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET /:pid
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) return res.json(product);
  res.status(404).json({ error: "Producto no encontrado" });
});

// POST /
router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// PUT /:pid
router.put("/:pid", async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (updated) return res.json(updated);
  res.status(404).json({ error: "Producto no encontrado" });
});

// DELETE /:pid
router.delete("/:pid", async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  if (result) return res.json({ message: "Producto eliminado" });
  res.status(404).json({ error: "Producto no encontrado" });
});

export default router;
