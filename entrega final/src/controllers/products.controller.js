import { ProductModel } from "../dao/models/product.model.js";

// GET paginado y filtrado
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    // Filtro dinámico por categoría o disponibilidad
    let filter = {};
    if (query) {
      if (query === "available") {
        filter.stock = { $gt: 0 };
      } else {
        filter.category = query;
      }
    }

    // Ordenamiento por precio asc/desc
    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    const result = await ProductModel.paginate(filter, options); // usamos paginate (más abajo vemos cómo instalarlo)

    // Construcción de links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const buildLink = (page) =>
      `${baseUrl}?limit=${limit}&page=${page}${sort ? `&sort=${sort}` : ""}${
        query ? `&query=${query}` : ""
      }`;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updated = await ProductModel.findByIdAndUpdate(pid, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: updated });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await ProductModel.findByIdAndDelete(pid);
    if (!deleted)
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", payload: deleted });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
