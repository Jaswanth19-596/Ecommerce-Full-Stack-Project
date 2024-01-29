import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategory
} from "../controllers/categoryController.js";
import { isAdmin, isLoggedIn } from "../middlewares/protectRoute.js";

const router = express.Router();

// Creating a category
router.post("/create-category", isLoggedIn, isAdmin, createCategory);

// Updating a category
router.put(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  updateCategory
);

// Deleting a category
router.delete(
  "/delete-category/:id",
  isLoggedIn,
  isAdmin,
  deleteCategory
);

// Get all categories
router.get("/categories", getAllCategories);

// Get a single category
router.get('/categories/:slug',isLoggedIn,isAdmin,getCategory);


// router.post("/create-product", createProduct);

// router.post("/users", getAllUsers);

export default router;
