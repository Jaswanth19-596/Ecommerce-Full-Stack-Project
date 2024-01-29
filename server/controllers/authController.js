import colors from 'colors';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { hashPassword, comparePassword } from './../helpers/authHelper.js';

export const registerController = async (req, res) => {
  try {
    // Getting the values from body of the request
    const { name, email, password, phone, address, role } = req.body;

    // Perform validation
    if (!name) {
      res.send({ error: 'Name is required' });
    }
    if (!email) {
      res.send({ error: 'Email is required' });
    }
    if (!password) {
      res.send({ error: 'password is required' });
    }
    if (!address) {
      res.send({ error: 'address is required' });
    }


    // Check if email exists
    const isUserExists = await userModel.findOne({ email });

    if (isUserExists) {
      console.log('Usser existed already');
      return res.status(200).send({
        success: false,
        message: 'User Already registered , Please login',
      });
    }
    // Hashing the password
    const hashedPassword = await hashPassword(password);

    // Creating a new Document
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    });

    // Saving the document to the collection
    const userDoc = await user.save();

    // Sending the success response
    return res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      data: userDoc,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'something went wrong -> registration' + error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    // Getting the email and password from body
    const { email, password } = req.body;

    // Check if email exists or not
    const existingUser = await userModel.findOne({ email }).populate('cart');

    // If user does not registered
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: 'Please register to continue',
      });
    }

    // Compare the password with the user we got from above
    const isPasswordMatched = await comparePassword(
      password,
      existingUser.password
    );

    // If password does not match
    if (!isPasswordMatched) {
      return res.status(404).send({
        success: false,
        message: 'Password Is incorrect',
      });
    }

    // Adding the user to the request to access it for next middleware
    req.user = existingUser;

    // Creating a token
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);

    // If everything is OK => Login Successful
    return res.status(200).send({
      success: true,
      message: 'login successfull',
      token,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
        role: existingUser.role,
        cart: existingUser.cart,
      },
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      error: 'Error while logging in the user ',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const details = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    if (req.body.password) {
      details.password = await hashPassword(req.body.password);
    }

    const user = await userModel.findOneAndUpdate(
      { email: details.email },
      details,
      {
        new: true,
      }
    );

    res.status(200).send({ data: user });
  } catch (error) {
    console.log('Error while updating the profile');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
export const updateCart = async (req, res) => {
  try {
    const cart = req.body.cart;
    const user = req.body.user;

    console.log(cart);

    const response = await userModel.findOneAndUpdate(
      { email: user.email },
      { cart },
      {
        new: true,
      }
    );

    res.status(200).send({ data: response });
  } catch (error) {
    console.log('Error while updating the cart');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// export const getCartItems = async (req,res)=>{
//   try {
//     await userModel.findOne({})
//   } catch (error) {

//   }
// }
