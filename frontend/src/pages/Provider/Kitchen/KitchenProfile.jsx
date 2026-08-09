import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaStore,
  FaUtensils,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaTruck,
  FaUsers,
  FaUtensilSpoon,
  FaPlus,
  FaTrash,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaImage,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./KitchenProfile.css";

const emptyForm = {
  kitchenName: "",
  description: "",
  timings: "",
  deliveryAreas: [""],
  minimumOrderAmount: "",
  estimatedDeliveryTime: "",
  gallery: [""],
  openStatus: true,
};

const KitchenProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [kitchen, setKitchen] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  /*
   * ---------------------------------------------------------
   * FETCH KITCHEN
   * ---------------------------------------------------------
   */

  useEffect(() => {
    fetchKitchen();
  }, []);

  const fetchKitchen = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/kitchen/my-kitchen");

      if (response.data?.success) {
        const kitchenData = response.data.data;

        /*
         * No kitchen found
         * Show create-kitchen form instead of dashboard.
         */
        if (!kitchenData) {
          setKitchen(null);
          setFormData(emptyForm);
          return;
        }

        /*
         * Kitchen exists.
         * This page becomes Kitchen Settings/Profile.
         */
        setKitchen(kitchenData);

        setFormData({
          kitchenName: kitchenData.kitchenName || "",
          description: kitchenData.description || "",
          timings: kitchenData.timings || "",

          deliveryAreas:
            Array.isArray(kitchenData.deliveryAreas) &&
            kitchenData.deliveryAreas.length
              ? kitchenData.deliveryAreas
              : [""],

          minimumOrderAmount:
            kitchenData.minimumOrderAmount !== undefined &&
            kitchenData.minimumOrderAmount !== null
              ? String(kitchenData.minimumOrderAmount)
              : "",

          estimatedDeliveryTime:
            kitchenData.estimatedDeliveryTime || "",

          gallery:
            Array.isArray(kitchenData.gallery) &&
            kitchenData.gallery.length
              ? kitchenData.gallery
              : [""],

          openStatus:
            typeof kitchenData.openStatus === "boolean"
              ? kitchenData.openStatus
              : true,
        });
      } else {
        toast.error(
          response.data?.message || "Unable to load kitchen."
        );
      }
    } catch (error) {
      console.error("Kitchen Fetch Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load your kitchen profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * FORM HANDLERS
   * ---------------------------------------------------------
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeliveryAreaChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.deliveryAreas];
      updated[index] = value;

      return {
        ...prev,
        deliveryAreas: updated,
      };
    });
  };

  const addDeliveryArea = () => {
    setFormData((prev) => ({
      ...prev,
      deliveryAreas: [...prev.deliveryAreas, ""],
    }));
  };

  const removeDeliveryArea = (index) => {
    setFormData((prev) => {
      const updated = prev.deliveryAreas.filter(
        (_, areaIndex) => areaIndex !== index
      );

      return {
        ...prev,
        deliveryAreas: updated.length ? updated : [""],
      };
    });
  };

  const handleGalleryChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = value;

      return {
        ...prev,
        gallery: updated,
      };
    });
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ""],
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => {
      const updated = prev.gallery.filter(
        (_, imageIndex) => imageIndex !== index
      );

      return {
        ...prev,
        gallery: updated.length ? updated : [""],
      };
    });
  };

  const toggleKitchenStatus = () => {
    setFormData((prev) => ({
      ...prev,
      openStatus: !prev.openStatus,
    }));
  };

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */

  const validateKitchen = () => {
    if (!formData.kitchenName.trim()) {
      toast.error("Please enter your kitchen name.");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter your kitchen description.");
      return false;
    }

    if (!formData.timings.trim()) {
      toast.error("Please enter your operating hours.");
      return false;
    }

    if (!formData.estimatedDeliveryTime.trim()) {
      toast.error("Please enter estimated delivery time.");
      return false;
    }

    if (
      formData.minimumOrderAmount === "" ||
      Number(formData.minimumOrderAmount) < 0
    ) {
      toast.error("Please enter a valid minimum order amount.");
      return false;
    }

    const areas = formData.deliveryAreas
      .map((area) => area.trim())
      .filter(Boolean);

    if (!areas.length) {
      toast.error("Please add at least one delivery area.");
      return false;
    }

    return true;
  };

  /*
   * ---------------------------------------------------------
   * CREATE / UPDATE KITCHEN
   * ---------------------------------------------------------
   */

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateKitchen()) return;

    const cleanedDeliveryAreas = formData.deliveryAreas
      .map((area) => area.trim())
      .filter(Boolean);

    const cleanedGallery = formData.gallery
      .map((image) => image.trim())
      .filter(Boolean);

    const payload = {
      kitchenName: formData.kitchenName.trim(),
      description: formData.description.trim(),
      timings: formData.timings.trim(),
      deliveryAreas: cleanedDeliveryAreas,
      minimumOrderAmount: Number(formData.minimumOrderAmount),
      estimatedDeliveryTime:
        formData.estimatedDeliveryTime.trim(),
      gallery: cleanedGallery,
      openStatus: formData.openStatus,
    };

    try {
      setSaving(true);

      let response;

      /*
       * NO KITCHEN
       * Create new kitchen
       */
      if (!kitchen) {
        response = await axiosInstance.post(
          "/kitchen/create",
          payload
        );
      }

      /*
       * KITCHEN EXISTS
       * Update kitchen
       */
      else {
        response = await axiosInstance.put(
          "/kitchen/update",
          payload
        );
      }

      if (response.data?.success) {
        const savedKitchen = response.data.data;

        setKitchen(savedKitchen);

        toast.success(
          response.data.message ||
            (kitchen
              ? "Kitchen updated successfully."
              : "Kitchen created successfully!")
        );

        /*
         * After first kitchen creation,
         * directly open provider dashboard.
         */
        if (!kitchen) {
          setTimeout(() => {
            navigate("/provider/dashboard", {
              replace: true,
            });
          }, 700);

          return;
        }

        /*
         * Existing kitchen
         */
        setFormData({
          kitchenName: savedKitchen?.kitchenName || "",
          description: savedKitchen?.description || "",
          timings: savedKitchen?.timings || "",

          deliveryAreas:
            Array.isArray(savedKitchen?.deliveryAreas) &&
            savedKitchen.deliveryAreas.length
              ? savedKitchen.deliveryAreas
              : [""],

          minimumOrderAmount:
            savedKitchen?.minimumOrderAmount !== undefined
              ? String(savedKitchen.minimumOrderAmount)
              : "",

          estimatedDeliveryTime:
            savedKitchen?.estimatedDeliveryTime || "",

          gallery:
            Array.isArray(savedKitchen?.gallery) &&
            savedKitchen.gallery.length
              ? savedKitchen.gallery
              : [""],

          openStatus:
            typeof savedKitchen?.openStatus === "boolean"
              ? savedKitchen.openStatus
              : true,
        });
      } else {
        toast.error(
          response.data?.message ||
            "Unable to save kitchen."
        );
      }
    } catch (error) {
      console.error("Kitchen Save Error:", error);

      toast.error(
        error?.response?.data?.message ||
          (kitchen
            ? "Unable to update kitchen."
            : "Unable to create kitchen.")
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="kitchen-profile-page">
          <div className="kitchen-profile-loading">
            <div className="kitchen-profile-loader">
              <FaStore />
            </div>

            <h3>Checking your kitchen...</h3>

            <p>
              We are checking whether your provider account
              has a kitchen.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN PAGE
   * ---------------------------------------------------------
   */

  const isCreateMode = !kitchen;

  return (
    <>
      <Navbar />

      <main className="kitchen-profile-page">
        <div className="kitchen-profile-orb kitchen-profile-orb-one" />
        <div className="kitchen-profile-orb kitchen-profile-orb-two" />

        <div className="kitchen-profile-container">

          {/* HEADER */}

          <motion.div
            className="kitchen-profile-header"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              type="button"
              className="kitchen-back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
              Back
            </button>

            <span className="kitchen-eyebrow">
              PROVIDER KITCHEN
            </span>

            <h1>
              {isCreateMode ? (
                <>
                  Create Your <span>Kitchen</span>
                </>
              ) : (
                <>
                  Your <span>Kitchen</span>
                </>
              )}
            </h1>

            <p>
              {isCreateMode
                ? "Set up your kitchen profile to start adding meals, managing orders and serving customers."
                : "Manage your kitchen profile, delivery areas, timings and business information."}
            </p>
          </motion.div>

          {/* CREATE MODE INFO */}

          {isCreateMode && (
            <motion.div
              className="kitchen-setup-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="kitchen-setup-icon">
                <FaCheckCircle />
              </div>

              <div>
                <strong>
                  Complete your kitchen setup
                </strong>

                <span>
                  Add the required details below. Once your
                  kitchen is created, your provider dashboard
                  will be activated.
                </span>
              </div>
            </motion.div>
          )}

          {/* EXISTING KITCHEN HERO */}

          {!isCreateMode && (
            <>
              <motion.section
                className="kitchen-hero-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="kitchen-hero-icon">
                  <FaUtensils />
                </div>

                <div className="kitchen-hero-info">
                  <div className="kitchen-title-row">
                    <h2>
                      {kitchen.kitchenName}
                    </h2>

                    <span className="kitchen-provider-badge">
                      PROVIDER
                    </span>
                  </div>

                  <p className="kitchen-owner">
                    <FaUser />

                    {kitchen.ownerId?.name ||
                      "Kitchen Provider"}

                    {kitchen.ownerId?.email && (
                      <>
                        <span className="kitchen-meta-divider">
                          •
                        </span>

                        <FaEnvelope />

                        {kitchen.ownerId.email}
                      </>
                    )}
                  </p>

                  <div className="kitchen-hero-meta">
                    <span>
                      <FaMapMarkerAlt />

                      {kitchen.deliveryAreas?.length
                        ? `${kitchen.deliveryAreas.length} delivery area${
                            kitchen.deliveryAreas.length > 1
                              ? "s"
                              : ""
                          }`
                        : "No delivery areas"}
                    </span>

                    <span>
                      <FaClock />

                      {kitchen.timings ||
                        "Timings not added"}
                    </span>
                  </div>
                </div>

                <div className="kitchen-status-wrapper">
                  <button
                    type="button"
                    className={`kitchen-status ${
                      formData.openStatus
                        ? "is-open"
                        : "is-closed"
                    }`}
                    onClick={toggleKitchenStatus}
                  >
                    {formData.openStatus ? (
                      <FaToggleOn />
                    ) : (
                      <FaToggleOff />
                    )}

                    <span>
                      {formData.openStatus
                        ? "OPEN"
                        : "CLOSED"}
                    </span>
                  </button>

                  <small>
                    Kitchen Status
                  </small>
                </div>
              </motion.section>

              {/* STATS */}

              <div className="kitchen-stats-grid">
                <div className="kitchen-stat-card">
                  <div className="kitchen-stat-icon">
                    <FaUtensilSpoon />
                  </div>

                  <div>
                    <strong>
                      {kitchen.totalMeals ?? 0}
                    </strong>

                    <span>Total Meals</span>
                  </div>
                </div>

                <div className="kitchen-stat-card">
                  <div className="kitchen-stat-icon">
                    <FaUsers />
                  </div>

                  <div>
                    <strong>
                      {kitchen.totalSubscribers ?? 0}
                    </strong>

                    <span>Subscribers</span>
                  </div>
                </div>

                <div className="kitchen-stat-card">
                  <div className="kitchen-stat-icon">
                    <FaTruck />
                  </div>

                  <div>
                    <strong>
                      {kitchen.estimatedDeliveryTime ||
                        "—"}
                    </strong>

                    <span>Delivery Time</span>
                  </div>
                </div>

                <div className="kitchen-stat-card">
                  <div className="kitchen-stat-icon">
                    <FaRupeeSign />
                  </div>

                  <div>
                    <strong>
                      ₹{kitchen.minimumOrderAmount ?? 0}
                    </strong>

                    <span>Minimum Order</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* KITCHEN FORM */}

          <form onSubmit={handleSave}>
            <div className="kitchen-content-grid">

              {/* BASIC INFORMATION */}

              <motion.section className="kitchen-card">
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaStore />
                  </div>

                  <div>
                    <h2>
                      Kitchen Information
                    </h2>

                    <p>
                      Add your kitchen identity and
                      description.
                    </p>
                  </div>
                </div>

                <div className="kitchen-fields">

                  <div className="kitchen-field">
                    <label>
                      Kitchen Name *
                    </label>

                    <div className="kitchen-input">
                      <FaStore />

                      <input
                        name="kitchenName"
                        value={formData.kitchenName}
                        onChange={handleChange}
                        placeholder="e.g. Lucknow Gharana Kitchen"
                      />
                    </div>
                  </div>

                  <div className="kitchen-field">
                    <label>
                      Kitchen Description *
                    </label>

                    <div className="kitchen-textarea">
                      <FaShieldAlt />

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell customers about your kitchen, food quality and speciality..."
                        rows="6"
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* OPERATIONS */}

              <motion.section className="kitchen-card">
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaClock />
                  </div>

                  <div>
                    <h2>Operations</h2>

                    <p>
                      Configure timings and delivery
                      settings.
                    </p>
                  </div>
                </div>

                <div className="kitchen-fields">

                  <div className="kitchen-field">
                    <label>
                      Operating Hours *
                    </label>

                    <div className="kitchen-input">
                      <FaClock />

                      <input
                        name="timings"
                        value={formData.timings}
                        onChange={handleChange}
                        placeholder="e.g. 10 AM - 10 PM"
                      />
                    </div>
                  </div>

                  <div className="kitchen-two-column">

                    <div className="kitchen-field">
                      <label>
                        Estimated Delivery *
                      </label>

                      <div className="kitchen-input">
                        <FaTruck />

                        <input
                          name="estimatedDeliveryTime"
                          value={
                            formData.estimatedDeliveryTime
                          }
                          onChange={handleChange}
                          placeholder="e.g. 30-45 mins"
                        />
                      </div>
                    </div>

                    <div className="kitchen-field">
                      <label>
                        Minimum Order *
                      </label>

                      <div className="kitchen-input">
                        <FaRupeeSign />

                        <input
                          name="minimumOrderAmount"
                          type="number"
                          min="0"
                          value={
                            formData.minimumOrderAmount
                          }
                          onChange={handleChange}
                          placeholder="e.g. 199"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </motion.section>

              {/* DELIVERY AREAS */}

              <motion.section className="kitchen-card">
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h2>Delivery Areas</h2>

                    <p>
                      Add areas where you deliver meals.
                    </p>
                  </div>
                </div>

                <div className="kitchen-list">
                  <AnimatePresence>
                    {formData.deliveryAreas.map(
                      (area, index) => (
                        <motion.div
                          className="kitchen-list-item"
                          key={`area-${index}`}
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
                          <div className="kitchen-list-number">
                            {index + 1}
                          </div>

                          <div className="kitchen-input">
                            <FaMapMarkerAlt />

                            <input
                              value={area}
                              onChange={(e) =>
                                handleDeliveryAreaChange(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={`Delivery area ${
                                index + 1
                              }`}
                            />
                          </div>

                          {formData.deliveryAreas.length >
                            1 && (
                            <button
                              type="button"
                              className="kitchen-delete-btn"
                              onClick={() =>
                                removeDeliveryArea(
                                  index
                                )
                              }
                            >
                              <FaTrash />
                            </button>
                          )}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className="kitchen-add-btn"
                  onClick={addDeliveryArea}
                >
                  <FaPlus />
                  Add Delivery Area
                </button>
              </motion.section>

              {/* GALLERY */}

              <motion.section className="kitchen-card">
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaImage />
                  </div>

                  <div>
                    <h2>Kitchen Gallery</h2>

                    <p>
                      Add photos of your kitchen and food.
                    </p>
                  </div>
                </div>

                <div className="kitchen-list">
                  <AnimatePresence>
                    {formData.gallery.map(
                      (image, index) => (
                        <motion.div
                          className="kitchen-list-item"
                          key={`gallery-${index}`}
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
                          <div className="kitchen-list-number">
                            <FaImage />
                          </div>

                          <div className="kitchen-input">
                            <FaImage />

                            <input
                              value={image}
                              onChange={(e) =>
                                handleGalleryChange(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Paste image URL"
                            />
                          </div>

                          {formData.gallery.length >
                            1 && (
                            <button
                              type="button"
                              className="kitchen-delete-btn"
                              onClick={() =>
                                removeGalleryImage(
                                  index
                                )
                              }
                            >
                              <FaTrash />
                            </button>
                          )}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className="kitchen-add-btn"
                  onClick={addGalleryImage}
                >
                  <FaPlus />
                  Add Kitchen Image
                </button>
              </motion.section>

              {/* SAVE */}

              <motion.section className="kitchen-save-card">
                <div>
                  <div className="kitchen-save-icon">
                    {isCreateMode ? (
                      <FaStore />
                    ) : (
                      <FaSave />
                    )}
                  </div>

                  <div>
                    <h2>
                      {isCreateMode
                        ? "Create Your Kitchen"
                        : "Save Kitchen Changes"}
                    </h2>

                    <p>
                      {isCreateMode
                        ? "Complete the setup to activate your provider dashboard."
                        : "Your updated kitchen information will be saved to your provider account."}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="kitchen-primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="kitchen-spinner" />
                      {isCreateMode
                        ? "Creating..."
                        : "Saving..."}
                    </>
                  ) : (
                    <>
                      {isCreateMode ? (
                        <FaStore />
                      ) : (
                        <FaSave />
                      )}

                      {isCreateMode
                        ? "Create Kitchen"
                        : "Save Kitchen"}
                    </>
                  )}
                </button>
              </motion.section>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default KitchenProfile;