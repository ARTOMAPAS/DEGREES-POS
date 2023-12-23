const ItemModel = require('../models/itemsModel');
const mongoose = require('mongoose');

// get all Item
const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a item
const getItem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    const item = await ItemModel.findById(id);
    if (!item) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new item
const createItem = async (req, res) => {
  const { branchId, item_type, item_name, costs, total_qty, added_by, itemImage } = req.body;

  let emptyFields = [];
  if (!branchId) {
    emptyFields.push('branchId');
  }
  if (!item_type) {
    emptyFields.push('item_type');
  }
  if (!item_name) {
    emptyFields.push('item_name');
  }
  if (!costs || costs.length === 0) {
    emptyFields.push('costs');
  }
  if (!total_qty) {
    emptyFields.push('total_qty');
  }
  if (!added_by) {
    emptyFields.push('added_by');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill all the fields', emptyFields });
  }

  try {
    let itemData = { branchId, item_type, item_name, costs, total_qty, added_by };

    // Check if a Base64-encoded image is provided
    if (itemImage) {
      // Add the Base64-encoded image to the item data
      itemData.itemImage = itemImage;
    }

    const item = await ItemModel.create(itemData);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a item
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    const item = await ItemModel.findOneAndDelete({ _id: id });
    if (!item) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update item
const updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    const existingItem = await ItemModel.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: "This Item is not exist." });
    }

    // Update the costs array if provided
    if (req.body.costs && req.body.costs.length > 0) {
      existingItem.costs = req.body.costs;
    }

    // Update other fields if provided
    if (req.body.item_type) {
      existingItem.item_type = req.body.item_type;
    }
    if (req.body.item_name) {
      existingItem.item_name = req.body.item_name;
    }
    if (req.body.total_qty) {
      existingItem.total_qty = req.body.total_qty;
    }

    // If itemImage is provided, update it
    if (req.body.itemImage) {
      existingItem.itemImage = req.body.itemImage;
    }

    const updatedItem = await existingItem.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllItems,
  getItem,
  createItem,
  deleteItem,
  updateItem,
};
