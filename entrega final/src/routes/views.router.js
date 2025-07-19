// src/routes/views.router.js

import { Router } from "express";

const router = Router();

// Ruta principal que renderiza la vista "home"
router.get("/", async (req, res) => {
  try {
    // Le pasa una lista de productos de ejemplo para que se vea algo en pantalla
    res.render("home", {
      title: "Página Principal",
      productos: [
        { title: "Producto 1", price: 100 },
        { title: "Producto 2", price: 200 },
      ],
    });
  } catch (error) {
    console.error("Error al renderizar la vista:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
