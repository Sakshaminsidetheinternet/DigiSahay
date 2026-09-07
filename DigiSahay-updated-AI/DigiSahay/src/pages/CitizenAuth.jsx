import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DiamondMark, MailIcon, LockIcon } from "../components/icons";
import { CampusHubIllustration, SmartSolutionsIllustration } from "../components/AuthIllustrations";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser } from "../api/authService";
import "./CitizenAuth.css"; 

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

function getPasswordStrength(pwd) {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "#e53935" };
  if (score === 2) return { level: 2, label: "Fair", color: "#fb8c00" };
  if (score === 3) return { level: 3, label: "Good", color: "#43a047" };
  return { level: 4, label: "Strong", color: "#1b5e20" };
}

export default function CitizenAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Sign-in states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPwd, setShowSignInPwd] = useState(false);

  // Sign-up states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpState, setSignUpState] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [showSignUpPwd, setShowSignUpPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const pwdStrength = useMemo(() => getPasswordStrength(signUpPassword), [signUpPassword]);
  const confirmMismatch = signUpConfirm && signUpPassword !== signUpConfirm;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({
        email: signInEmail,
        password: signInPassword,
      });
      login({
        id: data.id,
        email: data.email,
        role: "Citizen",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/citizen");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (confirmMismatch) return;
    try {
      await registerUser({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: "CITIZEN",
      });
      const data = await loginUser({
        email: signUpEmail,
        password: signUpPassword,
      });
      login({
        id: data.id,
        email: data.email,
        role: "Citizen",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/citizen");
    } catch (err) {
      alert(err.response?.data?.message || "Sign up failed.");
    }
  };

  return (
    <div className="sx-cauth-page">
      {/* Top Header Navigation */}
      <header className="sx-portal-header">
        <div className="sx-wrap sx-portal-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark">
              <DiamondMark />
            </div>
            <span>DigiSahay</span>
          </Link>
          <Link to="/login" className="sx-portal-back">
            ← Switch Role
          </Link>
        </div> 
      </header>

      {/* Main Sliding Container */}
      <main className="sx-cauth-main">
        <div className={`sx-cauth-container ${isSignUp ? "sign-up-mode" : ""}`}>
          {/* ================= FORMS CONTAINER ================= */}
          <div className="sx-forms-container">
            <div className="sx-signin-signup">
              {/* 1. SIGN IN FORM */}
              <form onSubmit={handleSignIn} className="sx-form sx-sign-in-form">
                <h2 className="sx-cauth-title">Welcome Back!</h2>
                <p className="sx-cauth-sub">
                  Sign in to continue to DigiSahay Citizen Portal.
                </p>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Email address</span>
                  <div className="sx-input-wrapper">
                    <MailIcon />
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <div className="sx-field-row">
                    <span className="sx-field-title">Password</span>
                    <a
                      href="#forgot"
                      className="sx-forgot-pass"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="sx-input-wrapper">
                    <LockIcon />
                    <input
                      type={showSignInPwd ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="sx-eye-btn"
                      onClick={() => setShowSignInPwd((v) => !v)}
                      aria-label={showSignInPwd ? "Hide password" : "Show password"}
                    >
                      {showSignInPwd ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="sx-btn-submit">
                  Sign In
                </button>

                <div className="sx-mobile-switch">
                  <span>New here ? </span>
                  <button
                    type="button"
                    className="sx-mobile-switch-btn"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign up
                  </button>
                </div>
              </form>

              {/* 2. SIGN UP FORM */}
              <form onSubmit={handleSignUp} className="sx-form sx-sign-up-form">
                <h2 className="sx-cauth-title">Create an Account</h2>
                <p className="sx-cauth-sub">
                  Join the DigiSahay community to report and resolve local civic bottlenecks.
                </p>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Full Name</span>
                  <div className="sx-input-wrapper">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anvita Chaudhary"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Email address</span>
                  <div className="sx-input-wrapper">
                    <MailIcon />
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">State</span>
                  <div className="sx-input-wrapper sx-select-wrapper">
                    <span className="sx-select-icon">📍</span>
                    <select
                      required
                      value={signUpState}
                      onChange={(e) => setSignUpState(e.target.value)}
                      className="sx-state-select"
                    >
                      <option value="" disabled>Select your state / UT</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Password</span>
                  <div className="sx-input-wrapper">
                    <LockIcon />
                    <input
                      type={showSignUpPwd ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="sx-eye-btn"
                      onClick={() => setShowSignUpPwd((v) => !v)}
                      aria-label={showSignUpPwd ? "Hide password" : "Show password"}
                    >
                      {showSignUpPwd ? "🙈" : "👁"}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {signUpPassword && (
                    <div className="sx-pwd-strength">
                      <div className="sx-pwd-bars">
                        {[1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className="sx-pwd-bar"
                            style={{
                              background: i <= pwdStrength.level ? pwdStrength.color : "#e0e0e0",
                            }}
                          />
                        ))}
                      </div>
                      <span className="sx-pwd-label" style={{ color: pwdStrength.color }}>
                        {pwdStrength.label}
                      </span>
                    </div>
                  )}
                  <p className="sx-pwd-hint">
                    Min 8 chars · 1 uppercase · 1 number · 1 special character
                  </p>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Confirm Password</span>
                  <div className={`sx-input-wrapper ${confirmMismatch ? "sx-input-error" : ""}`}>
                    <LockIcon />
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
                      value={signUpConfirm}
                      onChange={(e) => setSignUpConfirm(e.target.value)}
                    />
                    <button
                      type="button"
                      className="sx-eye-btn"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                    >
                      {showConfirmPwd ? "🙈" : "👁"}
                    </button>
                  </div>
                  {confirmMismatch && (
                    <p className="sx-pwd-mismatch">Passwords do not match</p>
                  )}
                </div>

                <button type="submit" className="sx-btn-submit">
                  Sign Up
                </button>

                <div className="sx-mobile-switch">
                  <span>One of us ? </span>
                  <button
                    type="button"
                    className="sx-mobile-switch-btn"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ================= PANELS CONTAINER ================= */}
          <div className="sx-panels-container">
            {/* LEFT PANEL (Prompt to Sign Up when in Sign In mode) */}
            <div className="sx-panel sx-left-panel">
              <div className="sx-panel-content">
                <div className="sx-panel-brand">
                  <div className="sx-brand-icon">
                    <DiamondMark />
                  </div>
                  <span className="sx-brand-name">DigiSahay</span>
                </div>
                <h3 className="sx-panel-heading">New here ?</h3>
                <p className="sx-panel-para">
                  Enter your details and start your journey with us.
                </p>
                <button
                  type="button"
                  className="sx-panel-toggle-btn"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign up
                </button>
              </div>

              {/* Campus Community Illustration */}
              <div className="sx-panel-image-wrap">
                <CampusHubIllustration />
              </div>
            </div>

            {/* RIGHT PANEL (Prompt to Sign In when in Sign Up mode) */}
            <div className="sx-panel sx-right-panel">
              <div className="sx-panel-content">
                <div className="sx-panel-brand">
                  <div className="sx-brand-icon">
                    <DiamondMark />
                  </div>
                  <span className="sx-brand-name">DigiSahay</span>
                </div>
                <h3 className="sx-panel-heading">One of us ?</h3>
                <p className="sx-panel-para">
                  If you already have an account, just sign in. We've missed you!
                </p>
                <button
                  type="button"
                  className="sx-panel-toggle-btn"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in
                </button>
              </div>

              {/* Smart Solutions Illustration */}
              <div className="sx-panel-image-wrap">
                <SmartSolutionsIllustration />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

