import slugify from 'slugify';
import categoryModel from './../models/categoryModel.js';

export const createCategory = async (req, res) => {
  try {
    // Get the name of the category
    const { name } = req.body;

    // check if name is provided or not
    if (!name) {
      return res
        .status(200)
        .send({ success: false, message: 'Name is a required field' });
    }

    // create a slug of the name
    const slug = slugify(name);

    // Check if category already exists

    const doesCategoryExists = await categoryModel.findOne({ name });

    if (doesCategoryExists) {
      console.log('Category already exists');
      return res
        .status(200)
        .send({ success: false, message: 'Category already exists' });
    }

    // Create a new category(Document)
    const category = new categoryModel({ name, slug });

    // Save the document
    category.save();

    return res.status(201).send({
      success: true,
      category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.log('Error in category controller');
    return res.status(500).send({
      success: false,
      message: 'Error in category controller',
      error,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    // Get id from params
    const { id } = req.params;

    // Get name from body
    const { name: newName } = req.body;

    // Identify the document and update it
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        name: newName,
        slug: slugify(newName),
      },
      { new: true }
    );

    // Return the success response
    return res.status(200).send({
      success: true,
      category: updatedCategory,
      message: 'Category Updated successfully',
    });
  } catch (error) {
    console.log('Error in update category controller');
    return res
      .status(500)
      .send({ error, success: false, message: 'Cannot update the category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // Get the id from the url
    const { id } = req.params;
    // Find and delete the category
    await categoryModel.findByIdAndDelete(id);

    return res
      .status(200)
      .send({ success: true, message: 'Deleted category successfull' });
  } catch (error) {
    console.log('Error while deleting the category' + error);

    return res.status(500).send({
      success: false,
      error,
      message: 'Error while deleting the category',
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Empty object -> match all
    const categories = await categoryModel.find({});

    return res.status(200).send({
      success: true,
      data: categories,
      message: 'Succesfully fetched all categories',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: 'Error while Getting all the categories',
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    // Get the id from the url
    const { slug } = req.params;

    // Find the category
    const category = await categoryModel.findOne(slug);

    return res.status(200).send({
      success: true,
      category,
      message: 'Succesfully fetched the category',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      message: 'Error while getting the category',
    });
  }
};
