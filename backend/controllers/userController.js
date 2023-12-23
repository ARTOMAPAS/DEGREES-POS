const UserModel = require('../models/usersModel');
const BranchModel = require('../models/branchsModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
var nodemailer = require('nodemailer');

// get all User
const getAllUsers = async (req, res) => {
    const users = await UserModel.find({}).sort({ createdAt: -1 });

    res.status(200).json(users);
};

// get a user
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "This User is not exist." });
    }

    const user = await UserModel.findById(id);

    if (!user) {
        return res.status(404).json({ error: "This User is not exist." });
    }

    res.status(200).json(user);
};

// create a new user
const createUser = async (req, res) => {
  try {
    const { user_type, branch_id_assigned, name, user_name, email, password, added_by, userImage } = req.body;

    let emptyFields = [];
    if (!user_type) {
      emptyFields.push('user_type');
    }
    if (user_type!=="Admin"){
      if (!branch_id_assigned) {
        emptyFields.push('branch_id_assigned');
      }
    }
    if (!name) {
      emptyFields.push('name');
    }
    if (!user_name) {
      emptyFields.push('user_name');
    }
    if (!email) {
      emptyFields.push('email');
    }
    if (!password) {
      emptyFields.push('password');
    }
    if (!added_by) {
      emptyFields.push('added_by');
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill all the fields', emptyFields });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let userData;
    const userCount = await UserModel.countDocuments({});
    console.log("Number of users in the database:", userCount);
    if(user_type==="Admin"){
      if(userCount==0){
        userData = { user_type, name, user_name, email, password: hashedPassword, added_by: null};
      }else{
        console.log("Number of users in the database:", userCount);
        userData = { user_type, name, user_name, email, password: hashedPassword, added_by };
      }
    }
    else{
      userData = { user_type, branch_id_assigned, name, user_name, email, password: hashedPassword, added_by };
    }
    

    // Check if a Base64-encoded image is provided
    if (userImage) {
      // Add the Base64-encoded image to the user data
      userData.userImage = userImage;
    }

    // Create the user
    const user = await UserModel.create(userData);
    console.log(user_type)
    if(user_type!=="Admin"){
      console.log(branch_id_assigned)
      await BranchModel.findOneAndUpdate(
        { _id: branch_id_assigned },
        { $push: { assignedUser: user._id } },
        { new: true }
      );
    }
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tokumota23@gmail.com',
        pass: 'heca yyxr unlk hntz'
      }
    });
    
    var mailOptions = {
      from: 'tokumota23@gmail.com',
      to: email,
      subject: 'New Account Details',
      text: `Your Account details is:\nUsername: ${user_name}\nEmail: ${email}\nPassword: ${password}\nLogin to Degrees Web System to change your Password for security`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "This User is not exist." });
    }

    const user = await UserModel.findOneAndDelete({ _id: id });

    if (!user) {
        return res.status(404).json({ error: "This User is not exist." });
    }

    res.status(200).json(user);
};

// update user
const updateUser = async (req, res) => {
  const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'This User does not exist.' });
      }
      // If userImage is provided, update it
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'This User does not exist.' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};
