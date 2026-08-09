const Notification = require("../models/notificationModel");

//Create notification

async function createNotification(req, res) {
  try {
    const { userId, title, message } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
    });

    return res.send({
      success: true,
      message: "Notification Created Successfully.",
      data: notification,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Get my notification

async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: notifications,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Mark as read

async function markAsRead(req, res) {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Notification Marked As Read.",
      data: notification,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
//delete notification
async function deleteNotification(req, res) {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    return res.send({
      success: true,
      message: "Notification Deleted Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
};
