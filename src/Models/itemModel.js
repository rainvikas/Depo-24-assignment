const mongoose = require('mongoose')



const itemSchema = new mongoose.Schema({

    name : {type: String,required: true,trim:true},

    description: {type: String,required: true,trim:true},

    sku: {type: String,required: true, trim: true},

    hsn: {type: Number,required: true, trim: true},

    rate: {type: Number,required: true, trim: true},

    discount: {type: Number, trim: true},

    deletedAt: {type: Date, default: null},

    isDeleted: {type: Boolean, default: false}
    
},
  {timestamps: true});

module.exports = mongoose.model('item', itemSchema)