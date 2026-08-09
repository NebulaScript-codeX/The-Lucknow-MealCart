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
} from "react-icons/fa";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./KitchenProfile.css";

const KitchenProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [kitchen, setKitchen] = useState(null);

  const [formData, setFormData] = useState({
    kitchenName: "",
    description: "",
    timings: "",
    deliveryAreas: [""],
    minimumOrderAmount: "",
    estimatedDeliveryTime: "",
    gallery: [""],
    openStatus: true,
  });

  useEffect(() => {
    fetchKitchen();
  }, []);

  const fetchKitchen = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/kitchen/my-kitchen");

      if (response.data?.success) {
        const kitchenData = response.data.data;

        if (!kitchenData) {
          setKitchen(null);

          setFormData({
            kitchenName: "",
            description: "",
            timings: "",
            deliveryAreas: [""],
            minimumOrderAmount: "",
            estimatedDeliveryTime: "",
            gallery: [""],
            openStatus: true,
          });

          return;
        }

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
          estimatedDeliveryTime: kitchenData.estimatedDeliveryTime || "",
          gallery:
            Array.isArray(kitchenData.gallery) && kitchenData.gallery.length
              ? kitchenData.gallery
              : [""],
          openStatus:
            typeof kitchenData.openStatus === "boolean"
              ? kitchenData.openStatus
              : true,
        });
      } else {
        toast.error(
          response.data?.message || "Unable to load your kitchen.",
        );
      }
    } catch (error) {
      console.error("Kitchen Fetch Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load your kitchen profile.",
      );
    } finally {
      setLoading(false);
    }
  };

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
        (_, areaIndex) => areaIndex !== index,
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
        (_, imageIndex) => imageIndex !== index,
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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.kitchenName.trim()) {
      toast.error("Please enter your kitchen name.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter your kitchen description.");
      return;
    }

    if (!formData.timings.trim()) {
      toast.error("Please enter your kitchen timings.");
      return;
    }

    if (!formData.estimatedDeliveryTime.trim()) {
      toast.error("Please enter estimated delivery time.");
      return;
    }

    if (
      formData.minimumOrderAmount === "" ||
      Number(formData.minimumOrderAmount) < 0
    ) {
      toast.error("Please enter a valid minimum order amount.");
      return;
    }

    const cleanedDeliveryAreas = formData.deliveryAreas
      .map((area) => area.trim())
      .filter(Boolean);

    if (!cleanedDeliveryAreas.length) {
      toast.error("Please add at least one delivery area.");
      return;
    }

    const cleanedGallery = formData.gallery
      .map((image) => image.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const response = await axiosInstance.put("/kitchen/update", {
        kitchenName: formData.kitchenName.trim(),
        description: formData.description.trim(),
        timings: formData.timings.trim(),
        deliveryAreas: cleanedDeliveryAreas,
        minimumOrderAmount: Number(formData.minimumOrderAmount),
        estimatedDeliveryTime: formData.estimatedDeliveryTime.trim(),
        gallery: cleanedGallery,
        openStatus: formData.openStatus,
      });

      if (response.data?.success) {
        const updatedKitchen = response.data.data;

        setKitchen(updatedKitchen);

        setFormData({
          kitchenName: updatedKitchen?.kitchenName || "",
          description: updatedKitchen?.description || "",
          timings: updatedKitchen?.timings || "",
          deliveryAreas:
            Array.isArray(updatedKitchen?.deliveryAreas) &&
            updatedKitchen.deliveryAreas.length
              ? updatedKitchen.deliveryAreas
              : [""],
          minimumOrderAmount:
            updatedKitchen?.minimumOrderAmount !== undefined
              ? String(updatedKitchen.minimumOrderAmount)
              : "",
          estimatedDeliveryTime:
            updatedKitchen?.estimatedDeliveryTime || "",
          gallery:
            Array.isArray(updatedKitchen?.gallery) &&
            updatedKitchen.gallery.length
              ? updatedKitchen.gallery
              : [""],
          openStatus:
            typeof updatedKitchen?.openStatus === "boolean"
              ? updatedKitchen.openStatus
              : true,
        });

        toast.success(
          response.data.message || "Kitchen updated successfully.",
        );
      } else {
        toast.error(
          response.data?.message || "Unable to update kitchen.",
        );
      }
    } catch (error) {
      console.error("Kitchen Update Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update kitchen profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="kitchen-profile-page">
          <div className="kitchen-profile-loading">
            <div className="kitchen-profile-loader">
              <FaStore />
            </div>

            <h3>Loading your kitchen...</h3>

            <p>
              Fetching your kitchen information from the database.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!kitchen) {
    return (
      <>
        <Navbar />

        <main className="kitchen-profile-page">
          <div className="kitchen-empty-state">
            <div className="kitchen-empty-icon">
              <FaStore />
            </div>

            <span className="kitchen-empty-eyebrow">
              PROVIDER KITCHEN
            </span>

            <h1>Create Your Kitchen</h1>

            <p>
              You don't have a kitchen profile yet. Create one to start
              managing your meals and customers.
            </p>

            <button
              type="button"
              onClick={() => navigate("/provider/kitchen/create")}
              className="kitchen-primary-btn"
            >
              <FaPlus />
              Create Kitchen
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="kitchen-profile-page">
        <div className="kitchen-profile-orb kitchen-profile-orb-one" />
        <div className="kitchen-profile-orb kitchen-profile-orb-two" />

        <div className="kitchen-profile-container">
          <motion.div
            className="kitchen-profile-header"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
              Your <span>Kitchen</span>
            </h1>

            <p>
              Manage your kitchen profile, delivery areas, timings and
              business information.
            </p>
          </motion.div>

          <motion.section
            className="kitchen-hero-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="kitchen-hero-icon">
              <FaUtensils />
            </div>

            <div className="kitchen-hero-info">
              <div className="kitchen-title-row">
                <h2>{kitchen.kitchenName}</h2>

                <span className="kitchen-provider-badge">
                  PROVIDER
                </span>
              </div>

              <p className="kitchen-owner">
                <FaUser />

                {kitchen.ownerId?.name || "Kitchen Provider"}

                {kitchen.ownerId?.email && (
                  <>
                    <span className="kitchen-meta-divider">•</span>
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
                        kitchen.deliveryAreas.length > 1 ? "s" : ""
                      }`
                    : "No delivery areas"}
                </span>

                <span>
                  <FaClock />

                  {kitchen.timings || "Timings not added"}
                </span>
              </div>
            </div>

            <div className="kitchen-status-wrapper">
              <button
                type="button"
                className={`kitchen-status ${
                  formData.openStatus ? "is-open" : "is-closed"
                }`}
                onClick={toggleKitchenStatus}
              >
                {formData.openStatus ? (
                  <FaToggleOn />
                ) : (
                  <FaToggleOff />
                )}

                <span>
                  {formData.openStatus ? "OPEN" : "CLOSED"}
                </span>
              </button>

              <small>Kitchen Status</small>
            </div>
          </motion.section>

          <div className="kitchen-stats-grid">
            <motion.div
              className="kitchen-stat-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="kitchen-stat-icon">
                <FaUtensilSpoon />
              </div>

              <div>
                <strong>{kitchen.totalMeals ?? 0}</strong>
                <span>Total Meals</span>
              </div>
            </motion.div>

            <motion.div
              className="kitchen-stat-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="kitchen-stat-icon">
                <FaUsers />
              </div>

              <div>
                <strong>{kitchen.totalSubscribers ?? 0}</strong>
                <span>Subscribers</span>
              </div>
            </motion.div>

            <motion.div
              className="kitchen-stat-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="kitchen-stat-icon">
                <FaTruck />
              </div>

              <div>
                <strong>
                  {kitchen.estimatedDeliveryTime || "—"}
                </strong>
                <span>Delivery Time</span>
              </div>
            </motion.div>

            <motion.div
              className="kitchen-stat-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="kitchen-stat-icon">
                <FaRupeeSign />
              </div>

              <div>
                <strong>
                  ₹{kitchen.minimumOrderAmount ?? 0}
                </strong>
                <span>Minimum Order</span>
              </div>
            </motion.div>
          </div>

          <form onSubmit={handleSave}>
            <div className="kitchen-content-grid">
              <motion.section
                className="kitchen-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaStore />
                  </div>

                  <div>
                    <h2>Kitchen Information</h2>
                    <p>
                      Keep your kitchen identity and description
                      updated.
                    </p>
                  </div>
                </div>

                <div className="kitchen-fields">
                  <div className="kitchen-field">
                    <label htmlFor="kitchenName">
                      Kitchen Name
                    </label>

                    <div className="kitchen-input">
                      <FaStore />

                      <input
                        id="kitchenName"
                        name="kitchenName"
                        value={formData.kitchenName}
                        onChange={handleChange}
                        placeholder="Enter kitchen name"
                      />
                    </div>
                  </div>

                  <div className="kitchen-field">
                    <label htmlFor="description">
                      Kitchen Description
                    </label>

                    <div className="kitchen-textarea">
                      <FaShieldAlt />

                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your kitchen..."
                        rows="6"
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="kitchen-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaClock />
                  </div>

                  <div>
                    <h2>Operations</h2>
                    <p>
                      Configure timings, delivery and minimum order.
                    </p>
                  </div>
                </div>

                <div className="kitchen-fields">
                  <div className="kitchen-field">
                    <label htmlFor="timings">Operating Hours</label>

                    <div className="kitchen-input">
                      <FaClock />

                      <input
                        id="timings"
                        name="timings"
                        value={formData.timings}
                        onChange={handleChange}
                        placeholder="e.g. 10 AM - 10 PM"
                      />
                    </div>
                  </div>

                  <div className="kitchen-two-column">
                    <div className="kitchen-field">
                      <label htmlFor="estimatedDeliveryTime">
                        Estimated Delivery
                      </label>

                      <div className="kitchen-input">
                        <FaTruck />

                        <input
                          id="estimatedDeliveryTime"
                          name="estimatedDeliveryTime"
                          value={formData.estimatedDeliveryTime}
                          onChange={handleChange}
                          placeholder="e.g. 30-45 mins"
                        />
                      </div>
                    </div>

                    <div className="kitchen-field">
                      <label htmlFor="minimumOrderAmount">
                        Minimum Order
                      </label>

                      <div className="kitchen-input">
                        <FaRupeeSign />

                        <input
                          id="minimumOrderAmount"
                          name="minimumOrderAmount"
                          type="number"
                          min="0"
                          value={formData.minimumOrderAmount}
                          onChange={handleChange}
                          placeholder="e.g. 199"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="kitchen-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h2>Delivery Areas</h2>
                    <p>
                      Add locations where your kitchen delivers.
                    </p>
                  </div>
                </div>

                <div className="kitchen-list">
                  <AnimatePresence>
                    {formData.deliveryAreas.map((area, index) => (
                      <motion.div
                        className="kitchen-list-item"
                        key={`area-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
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
                                e.target.value,
                              )
                            }
                            placeholder={`Delivery area ${
                              index + 1
                            }`}
                          />
                        </div>

                        {formData.deliveryAreas.length > 1 && (
                          <button
                            type="button"
                            className="kitchen-delete-btn"
                            onClick={() =>
                              removeDeliveryArea(index)
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      </motion.div>
                    ))}
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

              <motion.section
                className="kitchen-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="kitchen-card-header">
                  <div className="kitchen-section-icon">
                    <FaImage />
                  </div>

                  <div>
                    <h2>Kitchen Gallery</h2>
                    <p>
                      Add image URLs for your kitchen gallery.
                    </p>
                  </div>
                </div>

                <div className="kitchen-list">
                  <AnimatePresence>
                    {formData.gallery.map((image, index) => (
                      <motion.div
                        className="kitchen-list-item"
                        key={`gallery-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
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
                                e.target.value,
                              )
                            }
                            placeholder="Paste image URL"
                          />
                        </div>

                        {formData.gallery.length > 1 && (
                          <button
                            type="button"
                            className="kitchen-delete-btn"
                            onClick={() =>
                              removeGalleryImage(index)
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className="kitchen-add-btn"
                  onClick={addGalleryImage}
                >
                  <FaPlus />
                  Add Image
                </button>
              </motion.section>

              <motion.section
                className="kitchen-save-card"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div>
                  <div className="kitchen-save-icon">
                    <FaSave />
                  </div>

                  <div>
                    <h2>Save Kitchen Changes</h2>

                    <p>
                      Your updated kitchen information will be saved
                      to your provider account.
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Kitchen
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