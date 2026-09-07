import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LOGIN_CONTENT, PORTAL_FLASHCARDS } from "../data/content";
import {
  DiamondMark,
  RotateIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import citizenImg from "../assets/citizen.png";
import univImg from "../assets/univ.png";
import industryImg from "../assets/industry.png";

const ROLE_IMAGES = {
  citizen: citizenImg,
  university: univImg,
  industry: industryImg,
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // State to track flip status for each flashcard
  const [flipped, setFlipped] = useState({
    citizen: false,
    university: false,
    industry: false,
  });

  const toggleFlip = (id, e) => {
    if (e) e.stopPropagation();
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectRole = (portal) => {
    if (portal.id === "citizen") {
      navigate("/citizen-auth");
    } else if (portal.id === "university") {
      navigate("/university-auth");
    } else if (portal.id === "industry") {
      navigate("/industry-auth");
    }
  };

  return (
    <div className="sx-portal-screen">
      <header className="sx-portal-header">
        <div className="sx-wrap sx-portal-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark">
              <DiamondMark />
            </div>
            <span>DigiSahay</span>
          </Link>
          <Link to="/" className="sx-portal-back">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="sx-wrap sx-portal-main">
        <div className="sx-portal-intro">
          <h1 className="sx-portal-heading">{LOGIN_CONTENT.heading}</h1>
          <p className="sx-portal-subhead">{LOGIN_CONTENT.body}</p>
        </div>

        <div className="sx-flashcards-grid">
          {PORTAL_FLASHCARDS.map((portal) => {
            const isFlipped = !!flipped[portal.id];
            const imageSrc = ROLE_IMAGES[portal.id];

            return (
              <div
                key={portal.id}
                className={`sx-flashcard-wrapper ${isFlipped ? "is-flipped" : ""}`}
              >
                <div className="sx-flashcard">
                  {/* FRONT OF FLASHCARD */}
                  <div className="sx-flashcard-face sx-flashcard-front">
                    <div className="sx-flashcard-top">
                      <span className="sx-flashcard-badge">{portal.badge}</span>
                    </div>

                    <div className="sx-flashcard-img-wrap">
                      <img
                        src={imageSrc}
                        alt={`${portal.title} Gateway Visual`}
                        className="sx-flashcard-img"
                      />
                    </div>

                    <div className="sx-flashcard-hero">
                      <h2 className="sx-flashcard-title">{portal.title}</h2>
                      <p className="sx-flashcard-tagline">{portal.tagline}</p>
                    </div>

                    <p className="sx-flashcard-desc">{portal.description}</p>

                    <div className="sx-flashcard-tags">
                      {portal.tags.map((tag) => (
                        <span key={tag} className="sx-flashcard-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="sx-flashcard-actions">
                      <button
                        type="button"
                        className="sx-flashcard-btn-primary"
                        onClick={() => handleSelectRole(portal)}
                      >
                        <span>{portal.cta}</span>
                        <ArrowRightIcon />
                      </button>
                      <button
                        type="button"
                        className="sx-flashcard-btn-secondary"
                        onClick={(e) => toggleFlip(portal.id, e)}
                      >
                        <RotateIcon />
                        <span>View access capabilities</span>
                      </button>
                    </div>
                  </div>

                  {/* BACK OF FLASHCARD */}
                  <div className="sx-flashcard-face sx-flashcard-back">
                    <div className="sx-flashcard-top">
                      <span className="sx-flashcard-badge">{portal.badge}</span>
                    </div>

                    <div className="sx-flashcard-back-header">
                      <div className="sx-flashcard-icon-wrap sx-flashcard-icon-sm" style={{ overflow: "hidden", padding: 0 }}>
                        <img
                          src={imageSrc}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <h3 className="sx-flashcard-back-title">{portal.title} Portal</h3>
                        <p className="sx-flashcard-back-subtitle">Access & Capabilities</p>
                      </div>
                    </div>

                    <div className="sx-flashcard-benefits-wrap">
                      <p className="sx-flashcard-benefits-label">Included in this portal:</p>
                      <ul className="sx-flashcard-benefits">
                        {portal.benefits.map((benefit, idx) => (
                          <li key={idx}>
                            <div className="sx-benefit-icon">
                              <CheckCircleIcon />
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="sx-flashcard-actions">
                      <button
                        type="button"
                        className="sx-flashcard-btn-primary"
                        onClick={() => handleSelectRole(portal)}
                      >
                        <span>Enter as {portal.title}</span>
                        <ArrowRightIcon />
                      </button>
                      <button
                        type="button"
                        className="sx-flashcard-btn-secondary"
                        onClick={(e) => toggleFlip(portal.id, e)}
                      >
                        <span>← Back to overview</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

