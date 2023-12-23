const ProductModel = require('../models/productsModel');
const CategoryModel = require('../models/categoriesModel');
const mongoose = require('mongoose');

//get all Product
const getAllProducts = async (req, res) => {
  try {
    const product = await ProductModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get a product
const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'This Product does not exist.' });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'This Product does not exist.' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new product
const createProduct = async (req, res) => {
  try {
    const { category_id, product_name, description, price, added_by, productImage } = req.body;

    let emptyFields = [];
    if (!category_id) emptyFields.push('category_id');
    if (!product_name) emptyFields.push('product_name');
    if (!description) emptyFields.push('description');
    if (!price) emptyFields.push('price');
    if (!added_by) {
      emptyFields.push('added_by');
    }
    console.log(emptyFields)
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill all the fields', emptyFields });
    }

    let productData = { category_id, product_name, description, price, added_by };

    // Check if a Base64-encoded image is provided
    if (productImage) {
      // Add the Base64-encoded image to the product data
      productData.productImage = productImage;
    }

    // Create the product
    const product = await ProductModel.create(productData);

    // Update the category with the new product's ID
    await CategoryModel.findOneAndUpdate(
      { _id: category_id },
      { $push: { product_ids: product._id } },
      { new: true }
    );

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'This Product does not exist.' });
    }

    const product = await ProductModel.findOneAndDelete({ _id: id });

    if (!product) {
      return res.status(404).json({ error: 'This Product does not exist.' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'This Product does not exist.' });
      }
      // If productImage is provided, update it
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'This Product does not exist.' });
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
