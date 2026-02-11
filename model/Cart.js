const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number
      }
    ]
  },{timestamps:true});

const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;