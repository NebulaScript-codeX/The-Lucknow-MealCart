const Plan = require("../models/planModel");
const Subscription = require("../models/subscriptionModel");
const Kitchen = require("../models/kitchenModel");

//Create a plan
async function createPlan(req, res) {
  try {
    const kitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    if (!kitchen) {
      return res.send({
        success: false,
        message: "Please Create A Kitchen First.",
      });
    }

    const plan = await Plan.create({
      ...req.body,
      kitchenId: kitchen._id,
    });

    return res.send({
      success: true,
      message: "Plan Created Successfully.",
      data: plan,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
//Get all plans (browse — all kitchens, active plans only)
async function getAllPlans(req, res) {
  try {
    const plans = await Plan.find({ isActive: true })
      .populate("kitchenId")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: plans,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Get all plans of a kitchen
async function getMyPlans(req, res) {
  try {
    const kitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    const plans = await Plan.find({
      kitchenId: kitchen._id,
    });

    return res.send({
      success: true,
      data: plans,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
//Update a plan
async function updatePlan(req, res) {
  try {
    const { planId } = req.params;

    const plan = await Plan.findByIdAndUpdate(planId, req.body, { new: true });

    return res.send({
      success: true,
      message: "Plan Updated Successfully.",
      data: plan,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Delete a plan
async function deletePlan(req, res) {
  try {
    const { planId } = req.params;

    await Plan.findByIdAndDelete(planId);

    return res.send({
      success: true,
      message: "Plan Deleted Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Subscribe to a plan
async function subscribePlan(req, res) {
  try {
    const { planId } = req.params;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.send({
        success: false,
        message: "Plan Not Found.",
      });
    }

    let endDate = new Date();

    if (plan.duration === "weekly") {
      endDate.setDate(endDate.getDate() + 7);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      customerId: req.user._id,
      kitchenId: plan.kitchenId,
      planId: plan._id,
      endDate,
    });

    return res.send({
      success: true,
      message: "Subscribed Successfully.",
      data: subscription,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Get my Subscription

async function getMySubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.find({
      customerId: req.user._id,
    })
      .populate("planId")
      .populate("kitchenId");

    return res.send({
      success: true,
      data: subscriptions,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Cancel subscription

async function cancelSubscription(req, res) {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      {
        status: "cancelled",
      },
      {
        new: true,
      },
    );

    return res.send({
      success: true,
      message: "Subscription Cancelled Successfully.",
      data: subscription,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createPlan,
  getMyPlans,
  getAllPlans,
  updatePlan,
  deletePlan,
  subscribePlan,
  getMySubscriptions,
  cancelSubscription,
};
