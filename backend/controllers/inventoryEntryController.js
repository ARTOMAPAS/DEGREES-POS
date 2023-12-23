const InventoryEntryModel = require('../models/inventoryEntriesModel')
const ItemModel = require('../models/itemsModel');
const mongoose = require('mongoose')

//get all InventoryEntry
const getAllInventoryEntrys = async (req,res)=>{
    const inventoryEntries = await InventoryEntryModel.find({}).sort({createdAt:-1})

    res.status(200).json(inventoryEntries)
}
//get a inventoryEntries
const getInventoryEntry = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }
    const inventoryEntries = await InventoryEntryModel.findById(id)
    if(!inventoryEntries){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }

    res.status(200).json(inventoryEntries)
}
// create a new inventoryEntries
const createInventoryEntry = async (req, res) => {
    const { item_name, cost, quantity, supplier, or_id, date_purchase, added_by } = req.body;

    let emptyFields = [];
    if (!item_name) {
        emptyFields.push('item_name');
    }
    if (!cost) {
        emptyFields.push('cost');
    }
    if (!quantity) {
        emptyFields.push('quantity');
    }
    if (!supplier) {
        emptyFields.push('supplier');
    }
    if (!or_id) {
        emptyFields.push('or_id');
    }
    if (!date_purchase) {
        emptyFields.push('date_purchase');
    }
    if (!added_by) {
        emptyFields.push('added_by');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill all the fields', emptyFields });
    }

    // Look up the item document based on the provided item_name
    try {
        const item = await ItemModel.findOne({ item_name });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Create the inventory entry with the actual item document reference
        const inventoryEntry = await InventoryEntryModel.create({
            items: item._id,
            cost,
            quantity,
            supplier,
            or_id,
            date_purchase,
            added_by,
        });

        res.status(200).json(inventoryEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//delete a inventoryEntries
const deleteInventoryEntry = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }
    const inventoryEntries = await InventoryEntryModel.findOneAndDelete({_id: id})
    if(!inventoryEntries){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }

    res.status(200).json(inventoryEntries)
}

//update inventoryEntries
const updateInventoryEntry = async (req,res)=>{
    const {id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }
    const inventoryEntries = await InventoryEntryModel.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!inventoryEntries){
        return res.status(404).json({error: "This InventoryEntry is not exist."})
    }

    res.status(200).json(inventoryEntries)
}

module.exports ={
    getAllInventoryEntrys,
    getInventoryEntry,
    createInventoryEntry,
    deleteInventoryEntry,
    updateInventoryEntry
}