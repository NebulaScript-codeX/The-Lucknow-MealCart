const Cart = require("../models/cartModel");
const Meal = require("../models/mealModel");

// Add To Cart
async function addToCart(req, res) {
  try {
    const { mealId, quantity } = req.body;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.send({
        success: false,
        message: "Meal Not Found.",
      });
    }

    // IMPORTANT: Do not allow unavailable meals in cart
    if (meal.isAvailable === false) {
      return res.send({
        success: false,
        message: "This meal is currently unavailable.",
      });
    }

    let cart = await Cart.findOne({
      customerId: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        customerId: req.user._id,
        items: [
          {
            mealId,
            quantity,
            price: meal.price,
          },
        ],
        totalAmount: meal.price * quantity,
      });
    } else {
      const existingMeal = cart.items.find(
        (item) => item.mealId.toString() === mealId,
      );

      if (existingMeal) {
        existingMeal.quantity += quantity;
      } else {
        cart.items.push({
          mealId,
          quantity,
          price: meal.price,
        });
      }

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await cart.save();
    }

    return res.send({
      success: true,
      message: "Meal Added To Cart.",
      data: cart,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get My Cart
async function getMyCart(req, res) {
  try {
    const cart = await Cart.findOne({
      customerId: req.user._id,
    }).populate("items.mealId");

    return res.send({
      success: true,
      data: cart,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Update Cart Item
async function updateCartItem(req, res) {
  try {
    const { mealId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    const item = cart.items.find((item) => item.mealId.toString() === mealId);

    if (!item) {
      return res.send({
        success: false,
        message: "Meal Not Found In Cart.",
      });
    }

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.send({
      success: true,
      message: "Cart Updated Successfully.",
      data: cart,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Remove From Cart
async function removeFromCart(req, res) {
  try {
    const { mealId } = req.params;

    const cart = await Cart.findOne({
      customerId: req.user._id,
    });

    cart.items = cart.items.filter((item) => item.mealId.toString() !== mealId);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await cart.save();

    return res.send({
      success: true,
      message: "Meal Removed From Cart.",
      data: cart,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Clear Cart
async function clearCart(req, res) {
  try {
    await Cart.findOneAndDelete({
      customerId: req.user._id,
    });

    return res.send({
      success: true,
      message: "Cart Cleared Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
