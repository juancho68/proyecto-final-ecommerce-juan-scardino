import { Router } from "express";

const router = Router();


const products = [
];

import {
  getAllProducts,
  searchProduct,
  getProductById,
  createProduct,
  deleteProduct,
  updateProductController,

} from "../controllers/products.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

router.get("/products", getAllProducts);

router.get("/products/search", searchProduct);

router.get("/products/:id", getProductById);
router.post("/products", auth, createProduct);
router.put("/products/:id", auth, updateProductController);
router.delete("/products/:id", auth, deleteProduct);



export default router;
