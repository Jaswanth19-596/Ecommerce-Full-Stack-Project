import slugify from 'slugify';
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import fs from 'fs';
import braintree from 'braintree';
import dotenv from 'dotenv';

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProduct = async (req, res) => {
  try {
    // Getting the data from express-formiddable
    const { name, slug, price, description, quantity, category, shipping } =
      req.fields;
    const { image } = req.files;

    // creating a document
    const product = new productModel({ ...req.fields, slug: slugify(name) });

    // attaching the image to the product to store in db
    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }

    // Saving the document in the db
    await product.save();

    // sending the response
    return res.status(201).send({
      success: true,
      message: 'Successfully created the product',
      data: product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Get the id from the parameters
    const { id } = req.params;

    const image = req.files.image;

    // Find and update the product
    const product = await productModel.findByIdAndUpdate(
      id,
      { ...req.fields },
      { new: true }
    );

    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }

    await product.save();

    // sending the response
    return res.status(200).send({
      success: true,
      data: product,
      message: 'Product Updated Successfully',
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // Get the id of the product
    const { id } = req.params;

    // find by id and delete
    await productModel.findByIdAndDelete(id);

    // sending the response
    return res.status(200).send({
      success: true,
      message: 'Successfully deleted the product',
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Get one product
export const getProductDetails = async (req, res) => {
  try {
    // Getting the slug from the URL
    const { slug } = req.params;

    // Getting the product without image
    const product = await productModel
      .find({ slug })
      .select('-image')
      .populate('category');

    // If the product is found
    if (product) {
      return res.status(200).send({
        success: true,
        message: 'Successfully fetched the product',
        data: product,
      });
    }

    // If there is no product
    return res.status(404).send({
      success: false,
      message: 'Cannot find the product',
    });
  } catch (err) {
    console.log('error in getting single product');
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Get single product
export const getSingleProduct = async (req, res) => {
  try {
    // Getting the slug from the URL
    const { id } = req.params;

    // Getting the product without image
    const product = await productModel
      .findById(id)
      .select('-image')
      .populate('category');

    // If the product is found
    if (product) {
      return res.status(200).send({
        success: true,
        message: 'Successfully fetched the product',
        data: product,
      });
    }

    // If there is no product
    return res.status(404).send({
      success: false,
      message: 'Cannot find the product',
    });
  } catch (err) {
    console.log('error in getting single product');
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Get similar products
export const getSimilarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    // Get all the products that are of the category but ignore the document with pid
    const similarProducts = await productModel
      .find({
        $and: [{ category: cid }, { _id: { $ne: pid } }],
      })
      .select('-image')
      .limit(3);

    // Send the response
    res.status(200).send({
      success: true,
      data: similarProducts,
    });
  } catch (error) {
    console.log('Error while fetching similar products in server');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    // Getting all the products without images
    const products = await productModel
      .find({})
      .select('-image')
      .populate('category')
      .limit(12)
      .sort({ createdAt: -1 });

    // Send the response
    return res.status(200).send({
      success: true,
      message: 'Fetched all products',
      data: products,
      length: products.length,
    });
  } catch (err) {
    console.log('Error In get all products');
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Get all products based on page
export const getAllProductsBasedOnPage = async (req, res) => {
  try {
    const { page } = req.params;

    const productsPerPage = 6;
    const products = await productModel
      .find({})
      .select('-image')
      .populate('category')
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log('Error while get all products based on page');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get the product count
export const getProductCount = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log('Error while getting product count');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get image of product
export const getImage = async (req, res) => {
  try {
    // Get the id
    const { id } = req.params;

    // Find the product and only select image from it
    const product = await productModel.findById(id).select('image');

    // if product image is present then send the response
    if (product.image.data) {
      res.set('Content-type', product.image.contentType);
      return res.status(200).send(product.image.data);
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Error while fetching the image',
    });
  }
};

export const getProductsOnSearchKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;

    // Gets all products which matches with the keyword
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    };

    const products = await productModel.find(query).select('-image');


    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log('Error while fetching products on search');
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getProductsOnCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    // From the slug, find to which category it belongs
    const [category] = await categoryModel.find({ slug });

    // Using the category , fetch all the products
    const products = await productModel
      .find({ category: category._id })
      .populate('category')
      .select('-image');
    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Payment routes

// Get the token
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// make the payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => (total += i.price));

    console.log('Im coming into payment controller');

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user.id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
