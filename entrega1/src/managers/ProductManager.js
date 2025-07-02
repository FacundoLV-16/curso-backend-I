import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: uuidv4(),
      status: true,
      ...productData,
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedData,
      id: products[index].id,
    };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return null;

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
