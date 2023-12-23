const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchs',
    },
    itemImage: {
        type: String,
    },
    item_type:{
        type: String,
        required: true
    },
    item_name:{
        type: String,
        required: true
    },
    total_qty:
    {
        type: String,
        required: true
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true,
    },
},{timestamps: true})

const ItemModel = mongoose.model("items", ItemSchema)
module.exports = ItemModel