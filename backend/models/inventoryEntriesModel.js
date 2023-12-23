const mongoose = require('mongoose')

const InventoryEntrySchema = new mongoose.Schema({ 
    inventoryItems: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchs',
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: true,
    },
},{timestamps: true})

const InventoryEntryModel = mongoose.model("inventoryentries", InventoryEntrySchema)
module.exports = InventoryEntryModel