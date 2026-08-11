import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // =====================================================
  // LOGIN CHANGE
  // =====================================================
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTER CHANGE
  // =====================================================
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow ONLY digits on frontend
    if (name === "contactNumber") {
      if (!/^\d*$/.test(value)) {
        return;
      }

      if (value.length > 10) {
        return;
      }
    }

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };

  // =====================================================
  // SWITCH LOGIN / REGISTER
  // =====================================================
  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
  };

  // =====================================================
  // LOGIN SUBMIT
  // =====================================================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanEmail = loginForm.email.trim().toLowerCase();

    const res = await login(cleanEmail, loginForm.password);

    setLoading(false);

    if (res.success) {
      window.dispatchEvent(new Event("login"));

      navigate("/");
    } else {
      setError(res.message);
    }
  };

  // =====================================================
  // REGISTER SUBMIT
  // =====================================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    // ===================================================
    // CLEAN VALUES
    // ===================================================

    const name = registerForm.name.trim();

    const email = registerForm.email.trim().toLowerCase();

    const password = registerForm.password;

    const contactNumber = registerForm.contactNumber.trim();

    const address = registerForm.address.trim();

    // ===================================================
    // NAME VALIDATION
    // ===================================================

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (name.length < 2 || name.length > 50) {
      setError("Name must be between 2 and 50 characters.");
      return;
    }

    if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
      setError(
        "Name can contain only letters, spaces, apostrophes and hyphens.",
      );
      return;
    }

    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Reject 123@gmail.com
    const emailLocalPart = email.split("@")[0];

    if (/^\d+$/.test(emailLocalPart)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password.length > 72) {
      setError("Password cannot exceed 72 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    // ===================================================
    // PHONE VALIDATION
    // ===================================================

    if (contactNumber) {
      // Only digits
      if (!/^\d+$/.test(contactNumber)) {
        setError("Phone number can contain only digits.");
        return;
      }

      // Exactly 10 digits
      if (contactNumber.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        return;
      }

      // Starts from 6-9
      if (!/^[6-9]\d{9}$/.test(contactNumber)) {
        setError("Please enter a valid 10-digit phone number.");
        return;
      }
    }

    // ===================================================
    // ADDRESS VALIDATION
    // ===================================================

    if (address && (address.length < 10 || address.length > 200)) {
      setError("Address must be between 10 and 200 characters.");
      return;
    }

    // ===================================================
    // START LOADING
    // ===================================================

    setLoading(true);

    // ===================================================
    // PAYLOAD
    // Phone is converted to NUMBER here
    // ===================================================

    const payload = {
      name,
      email,
      password,
      role,

      contactNumber: contactNumber ? Number(contactNumber) : undefined,

      addresses: address ? [address] : [],
    };

    // ===================================================
    // REGISTER API
    // ===================================================

    const res = await register(payload);

    setLoading(false);

    // ===================================================
    // SUCCESS
    // ===================================================

    if (res.success) {
      setSuccessMsg("Account created! Redirecting to login...");

      setLoginForm({
        email,
        password: "",
      });

      setTimeout(() => {
        switchMode("login");
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page">
      {/* ===== LEFT ILLUSTRATION PANEL ===== */}

      <div className="auth-illustration-panel">
        <div className="auth-ribbon-shape" />

        <div className="auth-nav-mini">
          <span className="auth-logo-dot" />

          <span onClick={() => navigate("/")}>Lucknow Meal Cart</span>
        </div>

        <div className="auth-illustration-content">
          <img
            className="auth-plate auth-plate-1"
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
            alt="Fresh salad bowl"
          />

          <img
            className="auth-plate auth-plate-2"
            src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&q=80"
            alt="Grilled meal"
          />

          <img
            className="auth-plate auth-plate-3"
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=380&q=80"
            alt="Healthy bowl"
          />

          <div className="auth-illustration-text">
            <h2>
              Real Homemade Food,
              <br />
              <span>Delivered Fresh.</span>
            </h2>

            <p>Join thousands enjoying meals from trusted home kitchens.</p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT FORM PANEL ===== */}

      <div className="auth-form-panel">
        <div className="auth-glass-card">
          <button
            type="button"
            className="auth-back-btn"
            onClick={() => navigate("/")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </button>

          <div className="auth-card-header">
            <span className="auth-header-tag">
              {mode === "login" ? "Welcome back" : "Get started"}
            </span>

            <h1>
              {mode === "login" ? (
                <>
                  Sign in to <span>continue</span>
                </>
              ) : (
                <>
                  Create your <span>account</span>
                </>
              )}
            </h1>
          </div>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
              type="button"
            >
              Login
            </button>

            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
              type="button"
            >
              Register
            </button>

            <span
              className="auth-tab-indicator"
              style={{
                transform:
                  mode === "login" ? "translateX(0%)" : "translateX(100%)",
              }}
            />
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M12 8v5M12 16h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {successMsg && (
            <div className="auth-alert auth-alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12l5 5L20 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {successMsg}
            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          {mode === "login" && (
            <form
              className="auth-form"
              onSubmit={handleLoginSubmit}
              key="login-form"
            >
              <div className="auth-field">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="email"
                />

                <label>Email address</label>
              </div>

              <div className="auth-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="current-password"
                />

                <label>Password</label>

                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M6.6 6.7C4.3 8.2 2.7 10.2 2 12c1.5 3.6 5.5 7 10 7 1.8 0 3.5-.5 5-1.4M12 5c4.5 0 8.5 3.4 10 7-.5 1.1-1.1 2.2-2 3.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                <span className="auth-submit-btn-bg" />

                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    Login
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="auth-switch-text">
                Don't have an account?{" "}
                <span onClick={() => switchMode("register")}>Sign up</span>
              </p>
            </form>
          )}

          {/* =================================================
              REGISTER FORM
          ================================================= */}

          {mode === "register" && (
            <form
              className="auth-form"
              onSubmit={handleRegisterSubmit}
              key="register-form"
            >
              {/* ROLE */}

              <div className="auth-role-toggle">
                <div
                  className="auth-role-slider"
                  style={{
                    transform:
                      role === "customer"
                        ? "translateX(0%)"
                        : "translateX(100%)",
                  }}
                />

                <button
                  type="button"
                  className={`auth-role-btn ${
                    role === "customer" ? "active" : ""
                  }`}
                  onClick={() => setRole("customer")}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <path
                      d="M4.5 20c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Customer
                </button>

                <button
                  type="button"
                  className={`auth-role-btn ${
                    role === "provider" ? "active" : ""
                  }`}
                  onClick={() => setRole("provider")}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 10l1.5-5h13L20 10M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8M4 10h16"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Provider
                </button>
              </div>

              {/* NAME */}

              <div className="auth-field">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  maxLength={50}
                  autoComplete="name"
                />

                <label>Full name</label>
              </div>

              {/* EMAIL */}

              <div className="auth-field">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="email"
                />

                <label>Email address</label>
              </div>

              {/* PASSWORD */}

              <div className="auth-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                />

                <label>Password</label>

                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M6.6 6.7C4.3 8.2 2.7 10.2 2 12c1.5 3.6 5.5 7 10 7 1.8 0 3.5-.5 5-1.4M12 5c4.5 0 8.5 3.4 10 7-.5 1.1-1.1 2.2-2 3.1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* PHONE + ADDRESS */}

              <div className="auth-field-row">
                <div className="auth-field">
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder=" "
                    value={registerForm.contactNumber}
                    onChange={handleRegisterChange}
                    maxLength={10}
                    inputMode="numeric"
                  />

                  <label>Phone</label>
                </div>

                <div className="auth-field">
                  <input
                    type="text"
                    name="address"
                    placeholder=" "
                    value={registerForm.address}
                    onChange={handleRegisterChange}
                    maxLength={200}
                  />

                  <label>Address</label>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                <span className="auth-submit-btn-bg" />

                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="auth-switch-text">
                Already have an account?{" "}
                <span onClick={() => switchMode("login")}>Sign in</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
