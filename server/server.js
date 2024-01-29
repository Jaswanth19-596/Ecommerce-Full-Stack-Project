import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// var cors = require('cors');
import cors from 'cors';

import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { isAdmin, isLoggedIn } from './middlewares/protectRoute.js';

// configuring dotenv-> Linking .env file
dotenv.config({ path: './.env' });

// Connecting to DB
connectDB();

// Server object
const app = express();

// Increasing payload limit for transactions
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middlewares
app.use(cors()); // Cross origin resource sharing
app.use(morgan('dev'));
app.use(express.json());

// Mounting the routes
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/category/', categoryRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/orders/', orderRoutes);
app.use('/api/v1/users/', userRoutes);

// REST Api's
app.get('/api/v1/users', isLoggedIn, isAdmin, (req, res) => {
  res.send('<h1>users</h1>');
});

// PORT
const PORT = process.env.PORT || 8080;

// Creating a server
app.listen(PORT, () => {
  console.log(
    `Server started at port ${PORT} on ${process.env.DEV_MODE} Mode`.bgBlue
      .white
  );
});
