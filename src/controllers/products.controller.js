import * as model from "../models/products.model.js";
import { 
  updateProduct
  
} from "../models/products.model.js";


export const getAllProducts = async (req, res) => {
  const products = await model.getAllProducts();
  res.json(products);
};

export const searchProduct = (req, res) => {
  const { name } = req.query;

  const products = model.getAllProducts();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(filteredProducts);
};

//GET by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  
  const product = await model.getProductById(id);
  
  if (!product) {
    res.status(404).json({ error: "No existe el producto" });
  }

  res.json(product);
};

//POST
export const createProduct = async (req, res) => {
  const { name, price, stock, categories } = req.body;

  const newProduct = await model.createProduct({ name, price, stock, categories });

  res.status(201).json(newProduct);
};

//DELETE
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await model.deleteProduct(productId);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.status(204).send();
  
};

//PUT
export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Datos de actualización vacíos o inválidos" });
  }

  // Validaciones opcionales por campo si se envían:
  if ("name" in data && (typeof data.name !== "string" || data.name.trim() === "")) {
    return res.status(400).json({ error: "Nombre inválido" });
  }

  if ("price" in data && (typeof data.price !== "number" || data.price < 0)) {
    return res.status(400).json({ error: "Precio inválido" });
  }

  if ("stock" in data && (!Number.isInteger(data.stock) || data.stock < 0)) {
    return res.status(400).json({ error: "Stock inválido" });
  }

  try {
    const updated = await updateProduct(id, data);

    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar", details: error.message });
  }
};

