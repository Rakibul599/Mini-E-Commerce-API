const mongoose = require('mongoose');
const Cart = require('../model/Cart');
const Order = require('../model/Order');
const Product = require('../model/Product');
const User = require('../model/User');

async function orderController(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userFound = await User.findById(req.user.id).session(session);

        // 1. Fraud Prevention: Check cancel_count
        if (userFound.cancel_count >= 5) {
            await session.abortTransaction();
            return res.status(403).json({
                message: 'Account suspended from ordering due to excessive cancellations.'
            });
        }

        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId').session(session);
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = [];
        let totalAmount = 0;

        // 2. Stock Validation and calculation
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Product not found for one or more items.` });
            }

            if (product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
                });
            }

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;

            // 3. Deduct stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 4. Create Order (Status defaults to 'pending' from schema)
        const newOrder = new Order({
            userId: req.user.id,
            items: orderItems,
            totalAmount,
            status: 'pending' // Initial status
        });

        // 5. Payment Simulation (Bonus)
        console.log(`Processing payment of ${totalAmount} for user ${req.user.email}...`);
        const paymentSuccessful = true; // Simulated success

        if (!paymentSuccessful) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Payment failed' });
        }

        await newOrder.save({ session });

        // 6. Clear the cart
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: 'Error placing order',
            error: error.message
        });
    }
}

async function getOrder(req, res) {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id).populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = req.body.status || order.status;
        await order.save();
        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
}

async function cancelOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.status === 'cancelled') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Return stock to products
        for (const item of order.items) {
            const product = await Product.findById(item.productId).session(session);
            if (product) {
                product.stock += item.quantity;
                await product.save({ session });
            }
        }

        order.status = 'cancelled';
        await order.save({ session });

        const userFound = await User.findById(order.userId).session(session);
        if (userFound) {
            userFound.cancel_count += 1;
            await userFound.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Order cancelled successfully and stock restored.',
            order
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: 'Error cancelling order',
            error: error.message
        });
    }
}
module.exports = {
    orderController,
    getOrder,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};