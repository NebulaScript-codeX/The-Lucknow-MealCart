const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================================================
// REGISTER USER
// =========================================================
async function register(req, res) {
  try {
    const { name, email, password, contactNumber, addresses, role } = req.body;

    // Validate Role
    if (role !== "customer" && role !== "provider") {
      return res.status(400).send({
        success: false,
        message: "Invalid Role.",
      });
    }

    // Required Fields
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Required Fields Are Missing.",
      });
    }

    // Check Existing User
    const userData = await User.findOne({ email });

    if (userData) {
      return res.status(400).send({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      contactNumber,
      addresses,
      role,
    });

    return res.status(201).send({
      success: true,
      message: "Registered Successfully.",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// =========================================================
// LOGIN USER
// =========================================================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Required Fields
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Required Fields Are Missing.",
      });
    }

    // Find User
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    // Generate Token
    const token = jwt.sign(
      {
        userId: userData._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Save Token In Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.MODE === "production",
      sameSite: process.env.MODE === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({
      success: true,
      message: "Welcome Back!",
      data: userData,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// =========================================================
// GET CURRENT USER
// =========================================================
async function getMe(req, res) {
  return res.send({
    success: true,
    data: req.user,
  });
}

// =========================================================
// UPDATE PROFILE
// =========================================================
async function updateProfile(req, res) {
  try {
    const userId = req.user._id;

    const { name, contactNumber, addresses } = req.body;

    // Validate Name
    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Name is required.",
      });
    }

    // Validate Addresses
    if (addresses !== undefined && !Array.isArray(addresses)) {
      return res.status(400).send({
        success: false,
        message: "Addresses must be an array.",
      });
    }

    // Clean Addresses
    const cleanedAddresses = Array.isArray(addresses)
      ? addresses
          .map((address) => String(address).trim())
          .filter((address) => address.length > 0)
      : undefined;

    const updateData = {
      name: name.trim(),
    };

    // Contact Number
    if (
      contactNumber !== undefined &&
      contactNumber !== null &&
      contactNumber !== ""
    ) {
      updateData.contactNumber = Number(contactNumber);
    } else {
      updateData.contactNumber = undefined;
    }

    // Addresses
    if (cleanedAddresses !== undefined) {
      updateData.addresses = cleanedAddresses;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    return res.send({
      success: true,
      message: "Profile Updated Successfully.",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// =========================================================
// CHANGE PASSWORD
// =========================================================
async function changePassword(req, res) {
  try {
    const userId = req.user._id;

    const { currentPassword, newPassword } = req.body;

    // Required Fields
    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Current and new passwords are required.",
      });
    }

    // Password Length
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    // Get User
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Verify Current Password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      return res.status(400).send({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Prevent Same Password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).send({
        success: false,
        message: "New password must be different from current password.",
      });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.send({
      success: true,
      message: "Password Changed Successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// =========================================================
// LOGOUT USER
// =========================================================
async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
  });

  return res.send({
    success: true,
    message: "Logged Out Successfully.",
  });
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
