import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("src/data/carts.json");

// POST /
router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /:cid
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) return res.json(cart);
  res.status(404).json({ error: "Carrito no encontrado" });
});

// POST /:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const result = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  if (result) return res.json(result);
  res.status(404).json({ error: "Carrito no encontrado o producto inválido" });
});

export default router;
