const Product = require('../model/Product');
// Create a new product
async function createProduct(req, res) {
    try {
        const result = await Product.create(req.body);
        res.status(201).json({ message: "Product created successfully",result });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
    res.status(201).json({ message: "Product created successfully" });
}
// Get all products
async function getAllProducts(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}
// Update a product by ID
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

// Delete a product by ID
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}

async function patchStock(req, res) {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Stock updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock", error: error.message });
    }
}

module.exports = { createProduct,getAllProducts,updateProduct,deleteProduct,patchStock };