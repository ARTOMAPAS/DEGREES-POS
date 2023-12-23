const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    branch_name: {
        type: String,
        required: true,
    },
    branchOrderId:{
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    assignedUser:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],

    availableMenu:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    }],


    branchImage: {
        type: String, // Store the image path as a string
    },
    sales: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sales',
        },
    ],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
}, { timestamps: true });

const BranchModel = mongoose.model("branchs", BranchSchema)
module.exports = BranchModel