import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decode;

    next();
  } catch (err) {
    res.status(200).send({
      success: false,
      message: 'Not a valid user -> In is logged in ',
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // Getting the role of the user  -> we have attached it in the previous middleware
    const user = await userModel.findById(req.user.id);

    if (+user.role !== 1) {
      return res.send({
        status: 500,
        message: 'Unauthorized access in admin middleware',
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'error in protect routes',
    });
  }
};
