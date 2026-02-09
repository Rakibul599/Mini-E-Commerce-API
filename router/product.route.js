const express = require('express');
const { createProduct,getAllProducts,updateProduct,deleteProduct,patchStock } = require('../controllers/product.controller');
const { auth } = require('../middleware/auth.middleware');
const { checkAdmin } = require('../middleware/product.middleware');

const router = express.Router();
// admin route to create a product
router.post('/products',auth,checkAdmin, createProduct);
router.put('/products/:id',auth,checkAdmin,updateProduct);
router.delete('/products/:id',auth,checkAdmin,deleteProduct);
router.patch('/products/:id/stock',auth,checkAdmin,patchStock);

// public route to get all products
router.get('/products',getAllProducts);

module.exports = router;