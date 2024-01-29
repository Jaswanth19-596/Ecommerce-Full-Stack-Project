import express from 'express';
import userModel from './../models/userModel.js';

const router = express.Router();

router.get('/get-all-users', async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select('-password -cart -role -createdAt -updatedAt -__v');

    res.status(200).send({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
