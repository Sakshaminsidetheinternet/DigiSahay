import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DiamondMark,
  MailIcon,
  LockIcon,
  IndustryIcon,
} from "../components/icons";
import { CampusHubIllustration, SmartSolutionsIllustration } from "../components/AuthIllustrations";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser } from "../api/authService";
import "./CitizenAuth.css";

export default function IndustryAuth() {
  const [isSignUp, setIsSignUp] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [sector, setSector] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      login({
        id: data.id,
        email: data.email,
        role: "Industry",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/industry");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        name: companyName,
        email: companyEmail,
        password: signupPassword,
        role: "INDUSTRY",
      });
      const data = await loginUser({
        email: companyEmail,
        password: signupPassword,
      });
      login({
        id: data.id,
        email: data.email,
        role: "Industry",
        name: data.name,
        token: data.token,
      });
      navigate("/dashboard/industry");
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

    {/* Authentication Container */}
    <main className="sx-cauth-main">
      <div
        className={`sx-cauth-container ${
          isSignUp ? "sign-up-mode" : ""
        }`}
      >
        {/* ================= FORMS ================= */}
        <div className="sx-forms-container">
          <div className="sx-signin-signup">

            {/* SIGN IN */}
            <form
              onSubmit={handleSignIn}
              className="sx-form sx-sign-in-form"
            >
              <h2 className="sx-cauth-title">
                Welcome Back!
              </h2>

              <p className="sx-cauth-sub">
                Sign in to continue to your DigiSahay Industry Partner Portal.
              </p>

              <div className="sx-cauth-field">
                <span className="sx-field-title">
                  Company Email
                </span>

                <div className="sx-input-wrapper">
                  <MailIcon />

                  <input
                    type="email"
                    required
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="sx-cauth-field">
                <div className="sx-field-row">
                  <span className="sx-field-title">
                    Password
                  </span>

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
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sx-btn-submit"
              >
                Sign In
              </button>

              <div className="sx-mobile-switch">
                <span>New industry partner? </span>

                <button
                  type="button"
                  className="sx-mobile-switch-btn"
                  onClick={() => setIsSignUp(true)}
                >
                  Register
                </button>
              </div>
            </form>


            {/* SIGN UP */}
            <form
              onSubmit={handleSignUp}
              className="sx-form sx-sign-up-form"
            >
              <h2 className="sx-cauth-title">
                Register Company
              </h2>

              <p className="sx-cauth-sub">
                Join DigiSahay and access verified civic technology opportunities.
              </p>

              <div className="sx-cauth-field">
                <span className="sx-field-title">
                  Company Name
                </span>

                <div className="sx-input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="e.g. AetherGrid Technologies"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="sx-cauth-field">
                <span className="sx-field-title">
                  Official Company Email
                </span>

                <div className="sx-input-wrapper">
                  <MailIcon />

                  <input
                    type="email"
                    required
                    placeholder="enterprise@company.com"
                    value={companyEmail}
                    onChange={(e) =>
                      setCompanyEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="sx-cauth-field">
                <span className="sx-field-title">
                  Primary Industry Sector
                </span>

                <div className="sx-input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Infrastructure"
                    value={sector}
                    onChange={(e) =>
                      setSector(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="sx-cauth-field">
                <span className="sx-field-title">
                  Create Password
                </span>

                <div className="sx-input-wrapper">
                  <LockIcon />

                  <input
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={signupPassword}
                    onChange={(e) =>
                      setSignupPassword(e.target.value)
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sx-btn-submit"
              >
                Register & Access Dashboard
              </button>

              <div className="sx-mobile-switch">
                <span>Already registered? </span>

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


        {/* ================= SIDE PANELS ================= */}
        <div className="sx-panels-container">

          {/* LEFT PANEL */}
          <div className="sx-panel sx-left-panel">
            <div className="sx-panel-content">

              <div className="sx-panel-brand">
                <div className="sx-brand-icon">
                  <DiamondMark />
                </div>

                <span className="sx-brand-name">
                  DigiSahay
                </span>
              </div>

              <h3 className="sx-panel-heading">
                New industry partner?
              </h3>

              <p className="sx-panel-para">
                Register your company and start connecting
                with verified civic technology opportunities.
              </p>

              <button
                type="button"
                className="sx-panel-toggle-btn"
                onClick={() => setIsSignUp(true)}
              >
                Register Company
              </button>

            </div>

            <div className="sx-panel-image-wrap">
              <CampusHubIllustration />
            </div>
          </div>


          {/* RIGHT PANEL */}
          <div className="sx-panel sx-right-panel">
            <div className="sx-panel-content">

              <div className="sx-panel-brand">
                <div className="sx-brand-icon">
                  <DiamondMark />
                </div>

                <span className="sx-brand-name">
                  DigiSahay
                </span>
              </div>

              <h3 className="sx-panel-heading">
                Already a partner?
              </h3>

              <p className="sx-panel-para">
                Sign in to manage your company,
                proposals, opportunities and civic deployments.
              </p>

              <button
                type="button"
                className="sx-panel-toggle-btn"
                onClick={() => setIsSignUp(false)}
              >
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
