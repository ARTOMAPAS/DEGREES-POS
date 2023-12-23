const mongoose = require('mongoose')

const SaleSchema = new mongoose.Schema({ 
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchs',
    },
    orderId: {
        type: String,
        unique: true,
    },
    salesTable:[{
        productsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: {
            type: Number,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        }
    }],
    totalAmount:{
        type: Number,
        required: true,
    },
    void: {
        type: Boolean,
        default: false,
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
},{timestamps: true})

const SaleModel = mongoose.model("sales", SaleSchema)
module.exports = SaleModel