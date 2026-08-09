const User = require("../models/userModel");
const Kitchen = require("../models/kitchenModel");

// Subscribe Kitchen
async function subscribeKitchen(req, res) {
  try {
    const { kitchenId } = req.params;

    const user = await User.findById(req.user._id);

    // Check already subscribed
    if (user.subscriptions.includes(kitchenId)) {
      return res.send({
        success: false,
        message: "Already Subscribed.",
      });
    }

    // Add kitchen to user's subscriptions
    user.subscriptions.push(kitchenId);

    await user.save();

    // Increase subscriber count
    await Kitchen.findByIdAndUpdate(kitchenId, {
      $inc: {
        totalSubscribers: 1,
      },
    });

    return res.send({
      success: true,
      message: "Kitchen Subscribed Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
// Unsubscribe Kitchen
async function unsubscribeKitchen(req, res) {
  try {
    const { kitchenId } = req.params;

    const user = await User.findById(req.user._id);

    user.subscriptions = user.subscriptions.filter(
      (id) => id.toString() !== kitchenId,
    );

    await user.save();

    await Kitchen.findByIdAndUpdate(kitchenId, {
      $inc: {
        totalSubscribers: -1,
      },
    });

    return res.send({
      success: true,
      message: "Kitchen Unsubscribed Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
// Get My Subscriptions
async function getMySubscriptions(req, res) {
  try {
    const user = await User.findById(req.user._id).populate("subscriptions");

    return res.send({
      success: true,
      data: user.subscriptions,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
module.exports = {
  subscribeKitchen,
  unsubscribeKitchen,
  getMySubscriptions,
};
