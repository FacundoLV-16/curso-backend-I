import { CartModel } from "../dao/models/cart.model.js";
import { ProductModel } from "../dao/models/product.model.js";

// Crear un nuevo carrito vacío
export const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ status: "success", cart: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Obtener un carrito con populate
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Eliminar un producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );
    await cart.save();

    res.json({ status: "success", message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Reemplazar todos los productos del carrito
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Actualizar cantidad de un producto específico
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );
    if (!productInCart)
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado en el carrito",
      });

    productInCart.quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Vaciar el carrito completo
export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });

    const product = await ProductModel.findById(pid);
    if (!product)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: pid, quantity: quantity || 1 });
    }

    await cart.save();

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      cart,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
