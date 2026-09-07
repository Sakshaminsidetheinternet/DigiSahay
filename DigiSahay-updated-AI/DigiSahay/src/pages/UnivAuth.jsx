import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DiamondMark, MailIcon, LockIcon } from "../components/icons";
import { CampusHubIllustration, SmartSolutionsIllustration } from "../components/AuthIllustrations";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser } from "../api/authService";
import "./UnivAuth.css";

export default function UnivAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Sign In state
  const [signInEmail,    setSignInEmail]    = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName,     setSignUpName]     = useState("");
  const [signUpEmail,    setSignUpEmail]    = useState("");
  const [signUpNAAC,     setSignUpNAAC]     = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

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
        role: "University",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/university");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: "UNIVERSITIES",
      });
      const data = await loginUser({
        email: signUpEmail,
        password: signUpPassword,
      });
      login({
        id: data.id,
        email: data.email,
        role: "University",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/university");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="sx-cauth-page">
      {/* Header */}
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

          {/* ===== FORMS CONTAINER ===== */}
          <div className="sx-forms-container">
            <div className="sx-signin-signup">

              {/* SIGN IN FORM */}
              <form onSubmit={handleSignIn} className="sx-form sx-sign-in-form">
                <h2 className="sx-cauth-title">Welcome Back!</h2>
                <p className="sx-cauth-sub">
                  Sign in to continue to the DigiSahay University Research Portal.
                </p>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Institution Email</span>
                  <div className="sx-input-wrapper">
                    <MailIcon />
                    <input
                      type="email"
                      required
                      placeholder="you@university.edu.in"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <div className="sx-field-row">
                    <span className="sx-field-title">Password</span>
                    <a href="#forgot" className="sx-forgot-pass" onClick={(e) => e.preventDefault()}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="sx-input-wrapper">
                    <LockIcon />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="sx-btn-submit">
                  Sign In to University Portal
                </button>

                <div className="sx-mobile-switch">
                  <span>New institution? </span>
                  <button type="button" className="sx-mobile-switch-btn" onClick={() => setIsSignUp(true)}>
                    Register
                  </button>
                </div>
              </form>

              {/* SIGN UP FORM */}
              <form onSubmit={handleSignUp} className="sx-form sx-sign-up-form">
                <h2 className="sx-cauth-title">Register Institution</h2>
                <p className="sx-cauth-sub">
                  Onboard your university to submit civic solutions and access the national grant pool.
                </p>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">University / Institute Full Name</span>
                  <div className="sx-input-wrapper">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Atal Institute of Science & Technology"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Official Institution Email</span>
                  <div className="sx-input-wrapper">
                    <MailIcon />
                    <input
                      type="email"
                      required
                      placeholder="research@university.edu.in"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">NAAC / UGC Affiliation Code</span>
                  <div className="sx-input-wrapper">
                    <input
                      type="text"
                      placeholder="e.g. NAAC-A++ · UGC-2024"
                      value={signUpNAAC}
                      onChange={(e) => setSignUpNAAC(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sx-cauth-field">
                  <span className="sx-field-title">Create Password</span>
                  <div className="sx-input-wrapper">
                    <LockIcon />
                    <input
                      type="password"
                      required
                      placeholder="Create a secure password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="sx-btn-submit">
                  Register & Access Dashboard
                </button>

                <div className="sx-mobile-switch">
                  <span>Already registered? </span>
                  <button type="button" className="sx-mobile-switch-btn" onClick={() => setIsSignUp(false)}>
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ===== PANELS CONTAINER ===== */}
          <div className="sx-panels-container">
            {/* LEFT PANEL — prompts Sign Up */}
            <div className="sx-panel sx-left-panel">
              <div className="sx-panel-content">
                <div className="sx-panel-brand">
                  <div className="sx-brand-icon">
                    <DiamondMark />
                  </div>
                  <span className="sx-brand-name">DigiSahay</span>
                </div>
                <h3 className="sx-panel-heading">First time here?</h3>
                <p className="sx-panel-para">
                  Register your institution to start submitting research-backed solutions to live municipal problem statements.
                </p>
                <button type="button" className="sx-panel-toggle-btn" onClick={() => setIsSignUp(true)}>
                  Register Institution
                </button>
              </div>

              <div className="sx-panel-image-wrap">
                <CampusHubIllustration />
              </div>
            </div>

            {/* RIGHT PANEL — prompts Sign In */}
            <div className="sx-panel sx-right-panel">
              <div className="sx-panel-content">
                <div className="sx-panel-brand">
                  <div className="sx-brand-icon">
                    <DiamondMark />
                  </div>
                  <span className="sx-brand-name">DigiSahay</span>
                </div>
                <h3 className="sx-panel-heading">Already a partner?</h3>
                <p className="sx-panel-para">
                  Sign in to access your problem bank, submitted proposals, and university rating dashboard.
                </p>
                <button type="button" className="sx-panel-toggle-btn" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </div>

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