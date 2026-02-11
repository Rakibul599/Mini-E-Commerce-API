const Cart = require("../model/Cart");

async function addToCart(req, res) {
  try {
    const cartItem = await Cart.findOne({ userId: req.user.id });

    if (!cartItem) {
      const newCart = new Cart({
        userId: req.user.id,
        items: req.body.items,
      });

      await newCart.save();

      return res.status(201).json({
        message: "Product added to cart successfully",
      });
    }

    // If cart exists
    req.body.items.forEach((element) => {
      const itemIndex = cartItem.items.findIndex(
        (item) => item.productId.toString() === element.productId
      );

      if (itemIndex > -1) {
        // Product exists increase quantity
        cartItem.items[itemIndex].quantity += element.quantity || 1;
      } else {
        // Product does not exist push new
        cartItem.items.push({
          productId: element.productId,
          quantity: element.quantity || 1,
        });
      }
    });

    await cartItem.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding product to cart",
      error: error.message,
    });
  }
}
async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
}
// Remove item from cart
async function removeFromCart(req, res) {
  const productId = req.params.productId;
  try {
    const cart=await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    console.log(itemIndex);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save(); 
    return res.status(200).json({
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
        message: "Error removing product from cart",
        error: error.message,
      });
  }

}

module.exports = { addToCart, getCart,removeFromCart };
