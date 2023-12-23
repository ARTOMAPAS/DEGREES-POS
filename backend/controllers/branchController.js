const BranchModel = require('../models/branchsModel');
const mongoose = require('mongoose');

// get all Branch
const getAllBranchs = async (req, res) => {
  try {
    const branch = await BranchModel.find({}).sort({ createdAt: -1 });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a branch
const getBranch = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }

    const branch = await BranchModel.findById(id);

    if (!branch) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new branch
const createBranch = async (req, res) => {
  try {
    const { branch_name, location, added_by, branchImage } = req.body;

    let emptyFields = [];
    if (!branch_name) emptyFields.push('branch_name');
    if (!location) emptyFields.push('location');
    if (!added_by) emptyFields.push('added_by');
    console.log(emptyFields);
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill all the fields', emptyFields });
    }

    const branchCount = await BranchModel.countDocuments({});

    let branchData = { branch_name,branchOrderId: "DB"+(branchCount+1), location, added_by };
    
    // Check if a Base64-encoded image is provided
    if (branchImage) {
      // Add the Base64-encoded image to the branch data
      branchData.branchImage = branchImage;
    }
    
    const branch = await BranchModel.create(branchData);
    res.status(200).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a branch
const deleteBranch = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }

    const branch = await BranchModel.findOneAndDelete({ _id: id });

    if (!branch) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update branch
const updateBranch = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }
    // If branchImage is provided, update it
    const updatedBranch = await BranchModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({ error: 'This Branch is not exist.' });
    }

    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateAvailability = async (req, res) => {
  const { id: branchId } = req.params;
  console.log("Branch ID from URL:", branchId);
  const { productId, availability } = req.body;

  try {
    const branch = await BranchModel.findById(branchId);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found.' });
    }

    // Check if the product ID is in availableMenu
    const isProductAvailable = branch.availableMenu.includes(productId);
    console.log("available", isProductAvailable)
    if (availability === 'available' && !isProductAvailable) {
      // Add product ID to availableMenu
      branch.availableMenu.push(productId);
    } else if (availability === 'notAvailable' && isProductAvailable) {
      // Remove product ID from availableMenu
      branch.availableMenu = branch.availableMenu.filter(id => id.toString() !== productId);
    } else {
      // No change needed
      return res.status(200).json(branch);
    }

    // Save the updated branch
    const updatedBranch = await branch.save();
    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllBranchs,
  getBranch,
  createBranch,
  deleteBranch,
  updateBranch,
  updateAvailability
};
