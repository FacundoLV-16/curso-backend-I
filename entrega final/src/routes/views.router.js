// src/routes/views.router.js

import { Router } from "express";
import { ProductModel } from "../dao/models/product.model.js";
import { CartModel } from "../dao/models/cart.model.js";

const router = Router();

// 1. Vista paginada de productos (GET /products)
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await ProductModel.paginate(
      {},
      {
        page,
        limit,
        lean: true,
      }
    );

    res.render("index", {
      title: "Listado de productos",
      productos: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
    });
  } catch (error) {
    console.error("Error al renderizar productos:", error);
    res.status(500).send("Error interno");
  }
});

// 2. Vista de detalle del producto (GET /products/:pid)
router.get("/products/:pid", async (req, res) => {
  try {
    const producto = await ProductModel.findById(req.params.pid).lean();
    if (!producto) return res.status(404).send("Producto no encontrado");

    res.render("productDetails", {
      title: producto.title,
      producto,
    });
  } catch (error) {
    console.error("Error al renderizar detalle:", error);
    res.status(500).send("Error interno");
  }
});

// 3. Vista del carrito con populate (GET /carts/:cid)
router.get("/carts/:cid", async (req, res) => {
  try {
    const carrito = await CartModel.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!carrito) return res.status(404).send("Carrito no encontrado");

    res.render("cart", {
      title: `Carrito ${carrito._id}`,
      productos: carrito.products,
    });
  } catch (error) {
    console.error("Error al renderizar carrito:", error);
    res.status(500).send("Error interno");
  }
});

export default router;
