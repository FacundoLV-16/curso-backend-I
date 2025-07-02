// Módulo para manejar la lógica de productos

import fs from "fs/promises";

export default class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Agregar un nuevo producto
  async addProduct(product) {
    const products = await this.getProducts();
    product.id = Date.now(); // ID único simple
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  // Eliminar producto por ID
  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id != id);
    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
  }
}
