const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({ 
    category_name: {
        type: String,
        required: true
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    }],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    
},{timestamps: true});

const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
