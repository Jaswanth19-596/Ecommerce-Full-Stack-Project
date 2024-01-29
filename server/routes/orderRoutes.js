import express from 'express';
import { isAdmin, isLoggedIn } from './../middlewares/protectRoute.js';
import {
  getOrders,
  getOrdersForAdmin,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/get-orders', isLoggedIn, getOrders);

// orders for admin
router.get('/get-orders-admin', isLoggedIn, isAdmin, getOrdersForAdmin);

router.put(
  '/update-order-status/:orderId',
  isLoggedIn,
  isAdmin,
  updateOrderStatus
);

export default router;
