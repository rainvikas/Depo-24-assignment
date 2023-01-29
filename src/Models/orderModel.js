const mongoose = require('mongoose')
ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

  shipping: {type: Object, required: true, trim: true},

  // name: {type: String, required: true, trim: true},

  // address: {type: String, required: true, trim: true},

  // city: {type: String, required: true, trim: true},

  // state: {type: String, required: true, trim: true},

  // country: {type: String, required: true, trim: true},

  // postal_code: {type: Number, required: true, trim: true},

  items: [{
    productId: {type: ObjectId, refs: "item", required: true, trim : true},

    quantity: {type: Number, required: true, min: 1}
  }],

  subTotal: {type: Number, required: true, trim: true},

  totalItems: {type: Number, required: true,trim: true},

  totalQuantity: {type: Number, required: true, trim: true},
  
  deletedAt: {type: Date, default: null}, 

  isDeleted: {type: Boolean, default: false},
   
}, {timestamps: true})

module.exports = mongoose.model('order', orderSchema)