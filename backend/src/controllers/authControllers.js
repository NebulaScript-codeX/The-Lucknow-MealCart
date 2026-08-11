const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================================================
// REGISTER USER
// =========================================================
async function register(req, res) {
  try {
    const { name, email, password, contactNumber, addresses, role } = req.body;

    // =====================================================
    // BASIC CLEANING
    // =====================================================
    const cleanName = typeof name === "string" ? name.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const cleanPassword = typeof password === "string" ? password : "";

    // =====================================================
    // REQUIRED FIELDS
    // =====================================================
    if (!cleanName || !cleanEmail || !cleanPassword) {
      return res.status(400).send({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // =====================================================
    // ROLE VALIDATION
    // =====================================================
    if (role !== "customer" && role !== "provider") {
      return res.status(400).send({
        success: false,
        message: "Invalid role.",
      });
    }

    // =====================================================
    // NAME VALIDATION
    // =====================================================
    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    if (cleanName.length < 2 || cleanName.length > 50) {
      return res.status(400).send({
        success: false,
        message: "Name must be between 2 and 50 characters.",
      });
    }

    if (!nameRegex.test(cleanName)) {
      return res.status(400).send({
        success: false,
        message:
          "Name can contain only letters, spaces, apostrophes and hyphens.",
      });
    }

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).send({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Reject emails such as 123@gmail.com
    const emailLocalPart = cleanEmail.split("@")[0];

    if (/^\d+$/.test(emailLocalPart)) {
      return res.status(400).send({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================
    if (cleanPassword.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (cleanPassword.length > 72) {
      return res.status(400).send({
        success: false,
        message: "Password cannot exceed 72 characters.",
      });
    }

    if (!/[A-Z]/.test(cleanPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain at least one uppercase letter.",
      });
    }

    if (!/[a-z]/.test(cleanPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain at least one lowercase letter.",
      });
    }

    if (!/[0-9]/.test(cleanPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    if (!/[^A-Za-z0-9]/.test(cleanPassword)) {
      return res.status(400).send({
        success: false,
        message: "Password must contain at least one special character.",
      });
    }

    // =====================================================
    // CONTACT NUMBER VALIDATION
    // =====================================================

    let cleanContactNumber;

    if (
      contactNumber !== undefined &&
      contactNumber !== null &&
      String(contactNumber).trim() !== ""
    ) {
      const contactString = String(contactNumber).trim();

      // Reject alphabets and special characters
      if (!/^\d+$/.test(contactString)) {
        return res.status(400).send({
          success: false,
          message: "Phone number can contain only digits.",
        });
      }

      // Exactly 10 digits
      if (contactString.length !== 10) {
        return res.status(400).send({
          success: false,
          message: "Phone number must be exactly 10 digits.",
        });
      }

      // Indian mobile number must start from 6-9
      if (!/^[6-9]\d{9}$/.test(contactString)) {
        return res.status(400).send({
          success: false,
          message: "Please enter a valid 10-digit phone number.",
        });
      }

      // Store as NUMBER
      cleanContactNumber = Number(contactString);

      // Extra safety check
      if (!Number.isSafeInteger(cleanContactNumber)) {
        return res.status(400).send({
          success: false,
          message: "Please enter a valid phone number.",
        });
      }
    }

    // =====================================================
    // ADDRESS VALIDATION
    // =====================================================

    let cleanAddresses = [];

    if (addresses !== undefined && addresses !== null) {
      if (!Array.isArray(addresses)) {
        return res.status(400).send({
          success: false,
          message: "Addresses must be an array.",
        });
      }

      cleanAddresses = addresses
        .map((address) => (typeof address === "string" ? address.trim() : ""))
        .filter(Boolean);

      for (const address of cleanAddresses) {
        if (address.length < 10) {
          return res.status(400).send({
            success: false,
            message: "Address must be at least 10 characters long.",
          });
        }

        if (address.length > 200) {
          return res.status(400).send({
            success: false,
            message: "Address cannot exceed 200 characters.",
          });
        }
      }
    }

    // =====================================================
    // CHECK EXISTING USER
    // =====================================================

    const userData = await User.findOne({
      email: cleanEmail,
    });

    if (userData) {
      return res.status(400).send({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashPassword = await bcrypt.hash(cleanPassword, 10);

    // =====================================================
    // CREATE USER
    // =====================================================

    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashPassword,
      role,
      contactNumber: cleanContactNumber,
      addresses: cleanAddresses,
    });

    // =====================================================
    // REMOVE PASSWORD FROM RESPONSE
    // =====================================================

    const userResponse = newUser.toObject();

    delete userResponse.password;

    return res.status(201).send({
      success: true,
      message: "Registered Successfully.",
      data: userResponse,
    });
  } catch (err) {
    // =====================================================
    // DUPLICATE EMAIL
    // =====================================================

    if (err.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // =====================================================
    // MONGOOSE VALIDATION ERROR
    // =====================================================

    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0];

      return res.status(400).send({
        success: false,
        message: firstError?.message || "Invalid registration data.",
      });
    }

    console.error("REGISTER ERROR:", err);

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

    // Clean Email
    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : email;

    // Find User
    const userData = await User.findOne({
      email: cleanEmail,
    });

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

    // =====================================================
    // NAME VALIDATION
    // =====================================================

    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Name is required.",
      });
    }

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 50) {
      return res.status(400).send({
        success: false,
        message: "Name must be between 2 and 50 characters.",
      });
    }

    if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(cleanName)) {
      return res.status(400).send({
        success: false,
        message:
          "Name can contain only letters, spaces, apostrophes and hyphens.",
      });
    }

    // =====================================================
    // ADDRESS VALIDATION
    // =====================================================

    if (addresses !== undefined && !Array.isArray(addresses)) {
      return res.status(400).send({
        success: false,
        message: "Addresses must be an array.",
      });
    }

    const cleanedAddresses = Array.isArray(addresses)
      ? addresses
          .map((address) => (typeof address === "string" ? address.trim() : ""))
          .filter(Boolean)
      : undefined;

    if (cleanedAddresses) {
      for (const address of cleanedAddresses) {
        if (address.length < 10 || address.length > 200) {
          return res.status(400).send({
            success: false,
            message: "Each address must be between 10 and 200 characters.",
          });
        }
      }
    }

    // =====================================================
    // UPDATE DATA
    // =====================================================

    const updateData = {
      name: cleanName,
    };

    // =====================================================
    // CONTACT NUMBER
    // =====================================================

    if (
      contactNumber !== undefined &&
      contactNumber !== null &&
      String(contactNumber).trim() !== ""
    ) {
      const contactString = String(contactNumber).trim();

      if (!/^\d+$/.test(contactString)) {
        return res.status(400).send({
          success: false,
          message: "Phone number can contain only digits.",
        });
      }

      if (contactString.length !== 10) {
        return res.status(400).send({
          success: false,
          message: "Phone number must be exactly 10 digits.",
        });
      }

      if (!/^[6-9]\d{9}$/.test(contactString)) {
        return res.status(400).send({
          success: false,
          message: "Please enter a valid 10-digit phone number.",
        });
      }

      updateData.contactNumber = Number(contactString);
    } else {
      updateData.contactNumber = undefined;
    }

    // =====================================================
    // ADDRESSES
    // =====================================================

    if (cleanedAddresses !== undefined) {
      updateData.addresses = cleanedAddresses;
    }

    // =====================================================
    // UPDATE USER
    // =====================================================

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
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0];

      return res.status(400).send({
        success: false,
        message: firstError?.message || "Invalid profile data.",
      });
    }

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

// =========================================================
// EXPORTS
// =========================================================
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
