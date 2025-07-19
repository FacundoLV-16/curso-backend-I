import { addProductToCart } from "../../controllers/carts.controller.js";
import { Router } from "express";
import {
  createCart,
  getCartById,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  emptyCart,
} from "../../controllers/carts.controller.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", createCart);

// Obtener carrito por ID con populate
router.get("/:cid", getCartById);

// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", deleteProductFromCart);

// Reemplazar todo el arreglo de productos
router.put("/:cid", updateCart);

// Modificar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", updateProductQuantity);

// Vaciar el carrito completo
router.delete("/:cid", emptyCart);

// Agrega producto al carrito
router.post("/:cid/products/:pid", addProductToCart);
export default router;
