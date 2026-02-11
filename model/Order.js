const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: Number,
    status: { type: String,enum: ["pending", "shipped", "delivered","cancelled"], default: "pending"  }
  },{timestamps:true});

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;