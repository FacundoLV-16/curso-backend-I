import app from "./app.js";
import { connectDB } from "./dao/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
});
