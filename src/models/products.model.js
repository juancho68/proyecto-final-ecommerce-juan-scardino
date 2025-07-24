import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

const jsonPath = path.join(__dirname, "./products.json");
const json = fs.readFileSync(jsonPath, "utf-8");
const products = JSON.parse(json);

// console.log(products);

import { db } from "./data.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where
  
} from "firebase/firestore";

const productsCollection = collection(db, "products");

export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(error);
  }
};

export const getProductById = async (id) => {

  try {
    const productRef = doc(productsCollection, id);
    const snapshot = await getDoc(productRef);
    
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (error) {
    console.error(error);
  }
};


export const createProduct = async (data) => {
  try {
    const docRef = await addDoc(productsCollection, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const productRef = doc(productsCollection, id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return false;
    }

    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error(error);
  }
};

export async function updateProduct(id, productData) {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("ID inválido");
    }

    if (!productData || typeof productData !== "object" || Array.isArray(productData)) {
      throw new Error("Datos inválidos");
    }

    const productRef = doc(productsCollection, id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return null; // No existe
    }

    await updateDoc(productRef, productData);

    return { id, ...productData };
  } catch (error) {
    console.error("Modelo - updateProduct:", error.message);
    throw error;
  }
}

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

// export async function searchProducts(searchTerm) {
//   try {
//     const q = query(productsCollection);
//     const snapshot = await getDocs(q);

//     const results = [];

//     snapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       const name = data.name || "";

//       if (
//         typeof name === "string" &&
//         name.toLowerCase().includes(searchTerm.toLowerCase())
//       ) {
//         results.push({ id: docSnap.id, ...data });
//       }
//     });

//     return results;
//   } catch (error) {
//     console.error("Modelo - searchProducts:", error.message);
//     throw error;
//   }
// }

// export async function searchProducts(searchTerm) {
//   const snapshot = await getDocs(productsCollection);
//   const lowerSearch = searchTerm.toLowerCase();

//   return snapshot.docs
//     .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
//     .filter((product) =>
//       typeof product.name === "string" &&
//       product.name.toLowerCase().includes(lowerSearch)
//     );
// }