const mongoose = require('mongoose')

const ItemTypeSchema = new mongoose.Schema({ 
    itemType_name: {
        type: String,
        required: true
    },
    Item_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
    }],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    
},{timestamps: true});

const ItemTypeModel = mongoose.model("itemTypes", ItemTypeSchema);
module.exports = ItemTypeModel;
