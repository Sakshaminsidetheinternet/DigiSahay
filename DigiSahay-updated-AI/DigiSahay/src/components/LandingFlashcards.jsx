import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PORTAL_FLASHCARDS } from "../data/content";
import {
  RotateIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "./icons";
import { useAuth } from "../context/AuthContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import citizenImg from "../assets/citizen.png";
import univImg from "../assets/univ.png";
import industryImg from "../assets/industry.png";

const ROLE_IMAGES = {
  citizen: citizenImg,
  university: univImg,
  industry: industryImg,
};

export default function LandingFlashcards() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sectionRef, isVisible] = useScrollReveal(0.1);

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
      login({
        email: portal.email || "anvita@digisahay.gov.in",
        role: "Citizen",
        name: "Anvita Chaudhary",
      });
      navigate("/dashboard/citizen");
      navigate("/citizen-auth");
    } else {
      login({ email: portal.email, role: portal.title });
      navigate("/dashboard");
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`sx-landing-flashcards-section sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
    >
      <div className="sx-wrap">
        <div className="sx-section-head-center">
          <p className="sx-kicker">NATIONAL ACCESS GATEWAYS</p>
          <h2 className="sx-section-title-serif">Choose your portal flashcard</h2>
          <p className="sx-section-subhead">
            Dedicated access streams for citizens, academic researchers, and enterprise innovators. Flip any card to inspect capabilities.
          </p>
        </div>

        <div className="sx-flashcards-grid">
          {PORTAL_FLASHCARDS.map((portal, idx) => {
            const isFlipped = !!flipped[portal.id];
            const imageSrc = ROLE_IMAGES[portal.id];

            return (
              <div
                key={portal.id}
                className={`sx-flashcard-wrapper sx-stagger-item ${isFlipped ? "is-flipped" : ""}`}
                style={{ "--stagger-idx": idx }}
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
                        alt={`${portal.title} visual`}
                        className="sx-flashcard-img"
                      />
                    </div>

                    <div className="sx-flashcard-hero">
                      <h3 className="sx-flashcard-title">{portal.title}</h3>
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
                        <span>Flip to view access capabilities</span>
                      </button>
                    </div>
                  </div>

                  {/* BACK OF FLASHCARD */}
                  <div className="sx-flashcard-face sx-flashcard-back">
                    <div className="sx-flashcard-top">
                      <span className="sx-flashcard-badge">{portal.badge}</span>
                    </div>

                    <div className="sx-back-header">
                      <p className="sx-back-kicker">AUTHORIZED POWERS</p>
                      <h3 className="sx-back-title">{portal.title} Capabilities</h3>
                    </div>

                    <ul className="sx-capabilities-list">
                      {(portal.benefits || []).map((cap, i) => (
                        <li key={i} className="sx-capability-item">
                          <div className="sx-cap-check">
                            <CheckCircleIcon />
                          </div>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>

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
                        <span>Flip back to card overview</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
