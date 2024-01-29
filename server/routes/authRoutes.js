import express from 'express';
import {
  registerController,
  loginController,
  updateProfile,
  updateCart,
} from '../controllers/authController.js';
import { isAdmin, isLoggedIn } from '../middlewares/protectRoute.js';

// creating a router
const router = express.Router();

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

//protect user's private routes
router.get('/user-auth', isLoggedIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put('/update-profile', isLoggedIn, updateProfile);
router.put('/update-cart', isLoggedIn, updateCart);

// protect admin's private routes
router.get('/admin-auth', isLoggedIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
