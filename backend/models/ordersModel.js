const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({ 
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchs',
    },
    orderTable:[{
        productsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    totalAmount:{
        type: Number,
        required: true,
    }
},{timestamps: true})

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel