const SaleModel = require('../models/salesModel')
const mongoose = require('mongoose')

//get all Sale
const getAllSales = async (req,res)=>{
    const sale = await SaleModel.find({}).sort({createdAt:-1})

    res.status(200).json(sale)
}
//get a sale
const getSale = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Sale is not exist."})
    }
    const sale = await SaleModel.findById(id)
    if(!sale){
        return res.status(404).json({error: "This Sale is not exist."})
    }

    res.status(200).json(sale)
}
// create a new sale
const createSale = async (req,res)=>{
    const{branch_id,orderId,salesTable,totalAmount,cashier} = req.body

    let emptyFields = []
    if(!branch_id){
        emptyFields.push('branch_id')
    }
    // if(!orderId){
    //     emptyFields.push('orderId')
    // }
    if(!salesTable){
        emptyFields.push('salesTable')
    }
    if(!totalAmount){
        emptyFields.push('totalAmount')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill all the fields', emptyFields})
    }

    //add doc to db
    try{
        const sale = await SaleModel.create({branch_id,orderId,salesTable,totalAmount,cashier})
        res.status(200).json(sale)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a sale
const deleteSale = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Sale is not exist."})
    }
    const sale = await SaleModel.findOneAndDelete({_id: id})
    if(!sale){
        return res.status(404).json({error: "This Sale is not exist."})
    }

    res.status(200).json(sale)
}

//update sale
const updateSale = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Sale is not exist."})
    }
    const sale = await SaleModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!sale){
        return res.status(404).json({error: "This Sale is not exist."})
    }

    res.status(200).json(sale)
}

const getSaleCount = async (req, res) => {
    const { branch_id } = req.query;
  
    try {
      // Use Mongoose to query the database and get the count
      const count = await SaleModel.countDocuments({ branch_id });

      console.log(count)
  
      // Return the count in the response
      res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching sale count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports ={
    getAllSales,
    getSale,
    createSale,
    deleteSale,
    updateSale,
    getSaleCount
}