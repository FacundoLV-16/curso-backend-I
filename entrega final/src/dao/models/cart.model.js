import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Referencia al modelo Product
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

// Exportamos el modelo
export const CartModel = mongoose.model("Cart", cartSchema);
