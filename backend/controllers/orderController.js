const OrderModel = require('../models/ordersModel')
const mongoose = require('mongoose')

//get all Order
const getAllOrders = async (req,res)=>{
    const order = await OrderModel.find({}).sort({createdAt:-1})

    res.status(200).json(order)
}
//get a order
const getOrder = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Order is not exist."})
    }
    const order = await OrderModel.findById(id)
    if(!order){
        return res.status(404).json({error: "This Order is not exist."})
    }

    res.status(200).json(order)
}
// create a new order
const createOrder = async (req,res)=>{
    const{branch_id,orderTable,totalAmount} = req.body

    let emptyFields = []
    if(!branch_id){
        emptyFields.push('branch_id')
    }
    if(!orderTable){
        emptyFields.push('orderTable')
    }
    if(!totalAmount){
        emptyFields.push('totalAmount')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill all the fields', emptyFields})
    }

    //add doc to db
    try{
        const order = await OrderModel.create({branch_id,orderTable,totalAmount})
        res.status(200).json(order)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a order
const deleteOrder = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Order is not exist."})
    }
    const order = await OrderModel.findOneAndDelete({_id: id})
    if(!order){
        return res.status(404).json({error: "This Order is not exist."})
    }

    res.status(200).json(order)
}

//update order
const updateOrder = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Order is not exist."})
    }
    const order = await OrderModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!order){
        return res.status(404).json({error: "This Order is not exist."})
    }

    res.status(200).json(order)
}

module.exports ={
    getAllOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder
}