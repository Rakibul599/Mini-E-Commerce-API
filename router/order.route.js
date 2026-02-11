const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const {
  orderController,
  getOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/order.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing API
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Place an order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       403:
 *         description: Account suspended due to cancellations
 *       400:
 *         description: Cart is empty or insufficient stock
 */
router.post("/", auth, orderController);

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders of current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/", auth, getOrder);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get("/:id", auth, getOrderById);

/**
 * @swagger
 * /api/order/{id}/status:
 *   put:
 *     summary: Update order status (Admin Only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put("/:id/status", auth, updateOrderStatus);

/**
 * @swagger
 * /api/order/{id}/cancel:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.delete("/:id/cancel", auth, cancelOrder);

module.exports = router;
