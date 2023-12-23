const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({ 
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    product_name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    // ingredients: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'items',
    // }],
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String, // Store the image path as a string
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true,
    },
},{timestamps: true})

const ProductModel = mongoose.model("products", ProductSchema)
module.exports = ProductModel