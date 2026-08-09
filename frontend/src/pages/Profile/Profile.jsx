import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaPlus,
  FaTrash,
  FaSave,
  FaSignOutAlt,
  FaShieldAlt,
  FaUtensils,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    addresses: [""],
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/auth/me");

      if (response.data?.success) {
        const userData = response.data.data;

        setUser(userData);

        setProfileData({
          name: userData?.name || "",
          email: userData?.email || "",
          contactNumber: userData?.contactNumber
            ? String(userData.contactNumber)
            : "",
          addresses:
            Array.isArray(userData?.addresses) && userData.addresses.length > 0
              ? userData.addresses
              : [""],
        });
      } else {
        toast.error("Unable to load profile.");
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PROFILE INPUT HANDLERS
  // =========================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADDRESS HANDLERS
  // =========================================================

  const handleAddressChange = (index, value) => {
    setProfileData((prev) => {
      const updatedAddresses = [...prev.addresses];

      updatedAddresses[index] = value;

      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
  };

  const addAddress = () => {
    setProfileData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, ""],
    }));
  };

  const removeAddress = (index) => {
    setProfileData((prev) => {
      const updatedAddresses = prev.addresses.filter(
        (_, addressIndex) => addressIndex !== index,
      );

      return {
        ...prev,
        addresses: updatedAddresses.length > 0 ? updatedAddresses : [""],
      };
    });
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (
      profileData.contactNumber &&
      !/^\d{10}$/.test(profileData.contactNumber)
    ) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }

    const cleanedAddresses = profileData.addresses
      .map((address) => address.trim())
      .filter((address) => address.length > 0);

    try {
      setSavingProfile(true);

      const response = await axiosInstance.put("/auth/update-profile", {
        name: profileData.name.trim(),
        contactNumber: profileData.contactNumber,
        addresses: cleanedAddresses,
      });

      if (response.data?.success) {
        const updatedUser = response.data.data;

        setUser(updatedUser);

        setProfileData({
          name: updatedUser?.name || "",
          email: updatedUser?.email || "",
          contactNumber: updatedUser?.contactNumber
            ? String(updatedUser.contactNumber)
            : "",
          addresses:
            Array.isArray(updatedUser?.addresses) &&
            updatedUser.addresses.length > 0
              ? updatedUser.addresses
              : [""],
        });

        toast.success(response.data.message || "Profile updated successfully.");
      }
    } catch (error) {
      console.error("Update Profile Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================================================
  // PASSWORD INPUT
  // =========================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await axiosInstance.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || "Password changed successfully.",
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      console.error("Change Password Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await axiosInstance.get("/auth/logout");

      if (response.data?.success) {
        toast.success(response.data.message || "Logged out successfully.");

        navigate("/login");
      }
    } catch (error) {
      console.error("Logout Error:", error);

      toast.error(error?.response?.data?.message || "Unable to logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <div className="profile-loading">
            <div className="profile-loader">
              <FaUtensils />
            </div>

            <h3>Loading your profile...</h3>

            <p>Please wait while we fetch your account details.</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="profile-page">
        {/* =================================================
            BACKGROUND DECORATION
        ================================================= */}

        <div className="profile-orb profile-orb-one" />
        <div className="profile-orb profile-orb-two" />

        <div className="profile-container">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <motion.div
            className="profile-page-header"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="profile-back-btn"
              onClick={() => navigate(-1)}
              type="button"
            >
              <FaArrowLeft />
              Back
            </button>

            <div>
              <span className="profile-eyebrow">ACCOUNT SETTINGS</span>

              <h1>
                My <span>Profile</span>
              </h1>

              <p>
                Manage your personal information, addresses and account
                security.
              </p>
            </div>
          </motion.div>

          {/* =================================================
              PROFILE HERO
          ================================================= */}

          <motion.section
            className="profile-hero-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="profile-avatar">
              {profileData.name
                ? profileData.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="profile-hero-info">
              <div className="profile-name-row">
                <h2>{profileData.name || "Customer"}</h2>

                <span className="profile-role-badge">CUSTOMER</span>
              </div>

              <p>
                <FaEnvelope />
                {profileData.email || "No email available"}
              </p>

              <span className="profile-member-text">
                <FaShieldAlt />
                Your account is protected
              </span>
            </div>

            <div className="profile-hero-icon">
              <FaUtensils />
            </div>
          </motion.section>

          {/* =================================================
              CONTENT GRID
          ================================================= */}

          <div className="profile-content-grid">
            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="profile-card-header">
                <div className="profile-section-icon">
                  <FaUser />
                </div>

                <div>
                  <h2>Personal Information</h2>

                  <p>Keep your account details up to date.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="profile-form-grid">
                  {/* NAME */}

                  <div className="profile-field">
                    <label htmlFor="name">Full Name</label>

                    <div className="profile-input-wrapper">
                      <FaUser />

                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="profile-field">
                    <label htmlFor="email">Email Address</label>

                    <div className="profile-input-wrapper profile-input-disabled">
                      <FaEnvelope />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                      />
                    </div>

                    <small>Email is linked to your login account.</small>
                  </div>

                  {/* PHONE */}

                  <div className="profile-field">
                    <label htmlFor="contactNumber">Contact Number</label>

                    <div className="profile-input-wrapper">
                      <FaPhone />

                      <input
                        id="contactNumber"
                        type="tel"
                        name="contactNumber"
                        value={profileData.contactNumber}
                        onChange={handleProfileChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="profile-primary-btn"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <span className="profile-btn-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </motion.section>

            {/* =================================================
                DELIVERY ADDRESSES
            ================================================= */}

            <motion.section
              className="profile-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="profile-card-header">
                <div className="profile-section-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h2>Delivery Addresses</h2>

                  <p>Save places where you regularly receive meals.</p>
                </div>
              </div>

              <div className="profile-address-list">
                <AnimatePresence>
                  {profileData.addresses.map((address, index) => (
                    <motion.div
                      key={`address-${index}`}
                      className="profile-address-item"
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                    >
                      <div className="profile-address-number">{index + 1}</div>

                      <div className="profile-address-input">
                        <textarea
                          value={address}
                          onChange={(e) =>
                            handleAddressChange(index, e.target.value)
                          }
                          placeholder={`Enter delivery address ${index + 1}`}
                          rows="2"
                        />
                      </div>

                      {profileData.addresses.length > 1 && (
                        <button
                          type="button"
                          className="profile-delete-address"
                          onClick={() => removeAddress(index)}
                          title="Remove address"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="profile-address-actions">
                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={addAddress}
                >
                  <FaPlus />
                  Add Address
                </button>

                <button
                  type="button"
                  className="profile-save-address-btn"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  <FaSave />
                  {savingProfile ? "Saving..." : "Save Addresses"}
                </button>
              </div>
            </motion.section>

            {/* =================================================
                SECURITY
            ================================================= */}

            <motion.section
              className="profile-card profile-security-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="profile-card-header">
                <div className="profile-section-icon">
                  <FaLock />
                </div>

                <div>
                  <h2>Account Security</h2>

                  <p>Update your password to keep your account secure.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="profile-security-grid">
                  {/* CURRENT PASSWORD */}

                  <div className="profile-field">
                    <label htmlFor="currentPassword">Current Password</label>

                    <div className="profile-input-wrapper">
                      <FaLock />

                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* NEW PASSWORD */}

                  <div className="profile-field">
                    <label htmlFor="newPassword">New Password</label>

                    <div className="profile-input-wrapper">
                      <FaLock />

                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Minimum 6 characters"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div className="profile-field">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>

                    <div className="profile-input-wrapper">
                      <FaLock />

                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Repeat new password"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="profile-password-note">
                  <FaShieldAlt />

                  <span>
                    Use a strong password containing letters, numbers and
                    special characters.
                  </span>
                </div>

                <button
                  type="submit"
                  className="profile-primary-btn"
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <>
                      <span className="profile-btn-spinner" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </motion.section>

            {/* =================================================
                ACCOUNT ACTION
            ================================================= */}

            <motion.section
              className="profile-card profile-account-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="profile-account-content">
                <div className="profile-account-icon">
                  <FaSignOutAlt />
                </div>

                <div>
                  <h2>Sign Out</h2>

                  <p>End your current MealCart session on this device.</p>
                </div>

                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <>
                      <span className="profile-btn-spinner" />
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <FaSignOutAlt />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
