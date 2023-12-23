const ItemTypeModel = require('../models/itemTypesModel')
const mongoose = require('mongoose')

//get all ItemType
const getAllItemTypes = async (req,res)=>{
    const itemType = await ItemTypeModel.find({}).sort({createdAt:-1})

    res.status(200).json(itemType)
}
//get a itemType
const getItemType = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This ItemType is not exist."})
    }
    const itemType = await ItemTypeModel.findById(id)
    if(!itemType){
        return res.status(404).json({error: "This ItemType is not exist."})
    }

    res.status(200).json(itemType)
}
// create a new itemType
const createItemType = async (req,res)=>{
    const{itemType_name,added_by} = req.body

    let emptyFields = []
    if(!itemType_name){
        emptyFields.push('itemType_name')
    }
    if(!added_by){
        emptyFields.push('added_by')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill all the fields', emptyFields})
    }

    //add doc to db
    try{
        const itemType = await ItemTypeModel.create({itemType_name,added_by})
        res.status(200).json(itemType)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a itemType
const deleteItemType = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This ItemType is not exist."})
    }
    const itemType = await ItemTypeModel.findOneAndDelete({_id: id})
    if(!itemType){
        return res.status(404).json({error: "This ItemType is not exist."})
    }

    res.status(200).json(itemType)
}

//update itemType
const updateItemType = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This ItemType is not exist."})
    }
    const itemType = await ItemTypeModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!itemType){
        return res.status(404).json({error: "This ItemType is not exist."})
    }

    res.status(200).json(itemType)
}

module.exports ={
    getAllItemTypes,
    getItemType,
    createItemType,
    deleteItemType,
    updateItemType
}