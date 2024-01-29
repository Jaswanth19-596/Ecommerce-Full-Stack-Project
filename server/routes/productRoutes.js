import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAllProducts,
  getImage,
  getProductCount,
  getAllProductsBasedOnPage,
  getProductsOnSearchKeyword,
  getProductsOnCategory,
  getProductDetails,
  getSimilarProducts,
  brainTreeTokenController,
  brainTreePaymentController,
} from '../controllers/productController.js';
import { isAdmin, isLoggedIn } from '../middlewares/protectRoute.js';
import formiddaleMiddleware from 'express-formidable';

const router = express.Router();

// Creating a product
router.post(
  '/create-product',
  isLoggedIn,
  isAdmin,
  formiddaleMiddleware(),
  createProduct
);

// Updating a product
router.put(
  '/update-product/:id',
  isLoggedIn,
  isAdmin,
  formiddaleMiddleware(),
  updateProduct
);

// Deleting a product
router.delete('/delete-product/:id', isLoggedIn, isAdmin, deleteProduct);

// Get a product
router.get('/get-single-product/:id', isLoggedIn, isAdmin, getSingleProduct);

// Get product on slug
router.get('/product-details/:slug', getProductDetails);

// Getting all products
router.get('/get-all-products', getAllProducts);

// Get similar products
router.get('/get-similar-products/:cid/:pid', getSimilarProducts);

// Getting products based on page no
router.get('/get-all-products/:page', getAllProductsBasedOnPage);

// Get the product count
router.get('/get-products-count', getProductCount);

// get the products based on search keyword
router.get('/get-products/search/:keyword', getProductsOnSearchKeyword);

// Get all the products of a particular category
router.get('/get-by-category/:slug', getProductsOnCategory);

// Get image
router.get('/get-image/:id', getImage);

// Related to payment

// Token route
router.get('/braintree/token', brainTreeTokenController);

// Payment route
router.post('/braintree/payment', isLoggedIn, brainTreePaymentController);

export default router;
