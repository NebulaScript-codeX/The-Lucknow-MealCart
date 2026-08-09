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

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
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

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await login(loginForm.email, loginForm.password);

    setLoading(false);

    if (res.success) {
      // Navbar ko notify karega ki user login ho gaya
      window.dispatchEvent(new Event("login"));

      navigate("/");
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const payload = {
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role,
      contactNumber: registerForm.contactNumber
        ? Number(registerForm.contactNumber)
        : undefined,
      addresses: registerForm.address ? [registerForm.address] : [],
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Account created! Redirecting to login...");
      setLoginForm({ email: registerForm.email, password: "" });
      setTimeout(() => switchMode("login"), 1000);
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

          {mode === "register" && (
            <form
              className="auth-form"
              onSubmit={handleRegisterSubmit}
              key="register-form"
            >
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
                  className={`auth-role-btn ${role === "customer" ? "active" : ""}`}
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
                  className={`auth-role-btn ${role === "provider" ? "active" : ""}`}
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

              <div className="auth-field">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  autoComplete="name"
                />
                <label>Full name</label>
              </div>

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

              <div className="auth-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  minLength={6}
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

              <div className="auth-field-row">
                <div className="auth-field">
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder=" "
                    value={registerForm.contactNumber}
                    onChange={handleRegisterChange}
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
                  />
                  <label>Address</label>
                </div>
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
