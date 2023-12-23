const ReportModel = require('../models/reportsModel')
const mongoose = require('mongoose')

//get all Report
const getAllReports = async (req,res)=>{
    const report = await ReportModel.find({}).sort({createdAt:-1})

    res.status(200).json(report)
}
//get a report
const getReport = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Report is not exist."})
    }
    const report = await ReportModel.findById(id)
    if(!report){
        return res.status(404).json({error: "This Report is not exist."})
    }

    res.status(200).json(report)
}
// create a new report
const createReport = async (req,res)=>{
    const{branch_id,type,reportFile,added_by} = req.body

    let emptyFields = []
    if(!branch_id){
        emptyFields.push('branch_id')
    }
    if(!type){
        emptyFields.push('type')
    }
    if(!reportFile){
        emptyFields.push('reportFile')
    }
    if(!added_by){
        emptyFields.push('added_by')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill all the fields', emptyFields})
    }

    //add doc to db
    try{
        const report = await ReportModel.create({branch_id,type,reportFile,added_by})
        res.status(200).json(report)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a report
const deleteReport = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Report is not exist."})
    }
    const report = await ReportModel.findOneAndDelete({_id: id})
    if(!report){
        return res.status(404).json({error: "This Report is not exist."})
    }

    res.status(200).json(report)
}

//update report
const updateReport = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This Report is not exist."})
    }
    const report = await ReportModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!report){
        return res.status(404).json({error: "This Report is not exist."})
    }

    res.status(200).json(report)
}

module.exports ={
    getAllReports,
    getReport,
    createReport,
    deleteReport,
    updateReport
}