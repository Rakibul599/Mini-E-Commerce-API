const express = require('express');
const { addToCart,getCart,removeFromCart } = require('../controllers/cart.controller');
const { auth } = require('../middleware/auth.middleware');


const router = express.Router();

// add to cart route
router.post('/add',auth, addToCart);
// get all cart items
router.get('/mycart',auth, getCart);
// remove item from cart
router.delete('/remove/:productId',auth,removeFromCart);

module.exports = router;