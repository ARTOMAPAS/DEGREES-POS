const CategoryModel = require('../models/categoriesModel')
const mongoose = require('mongoose')

//get all Category
const getAllCategories = async (req,res)=>{
    const category = await CategoryModel.find({}).sort({createdAt:-1})

    res.status(200).json(category)
}
//get a category
const getCategory = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Category is not exist."})
    }
    const category = await CategoryModel.findById(id)
    if(!category){
        return res.status(404).json({error: "This Category is not exist."})
    }

    res.status(200).json(category)
}
// create a new category
const createCategory = async (req,res)=>{
    const{category_name,added_by} = req.body

    let emptyFields = []
    if(!category_name){
        emptyFields.push('category_name')
    }
    if(!added_by){
        emptyFields.push('added_by')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill all the fields', emptyFields})
    }

    //add doc to db
    try{
        const category = await CategoryModel.create({category_name,added_by})
        res.status(200).json(category)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a category
const deleteCategory = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Category is not exist."})
    }
    const category = await CategoryModel.findOneAndDelete({_id: id})
    if(!category){
        return res.status(404).json({error: "This Category is not exist."})
    }

    res.status(200).json(category)
}

//update category
const updateCategory = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Category is not exist."})
    }
    const category = await CategoryModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!category){
        return res.status(404).json({error: "This Category is not exist."})
    }

    res.status(200).json(category)
}

module.exports ={
    getAllCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory
}