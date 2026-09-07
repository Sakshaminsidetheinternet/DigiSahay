import React from "react";
import { Link } from "react-router-dom";
import frontImg from "../assets/front.png";
import goiLogo from "../assets/GOI.png";
import gojLogo from "../assets/GOJ.png";
import akgecLogo from "../assets/AKGEC.png";

export default function Hero() {
  return (
    <section
      className="sx-hero"
      style={{ backgroundImage: `url(${frontImg})` }}
      aria-label="DigiSahay Civic Platform"
    >
      <div className="sx-hero-overlay" />

      {/* Top right corner logos */}
      <div className="sx-hero-logos" aria-label="Partner and Institutional Logos">
        <img
          src={goiLogo}
          alt="Government of India"
          className="sx-hero-logo"
        />
        <img
          src={gojLogo}
          alt="Government of Jharkhand"
          className="sx-hero-logo"
        />
        <img
          src={akgecLogo}
          alt="AKGEC"
          className="sx-hero-logo"
        />
      </div>

      <div className="sx-wrap sx-hero-wrap">
        <div className="sx-hero-content">

          <span className="sx-hero-tag">
            🇮🇳 DIGITAL CIVIC PARTICIPATION PLATFORM
          </span>

          <h1 className="sx-hero-headline">
            <span className="sx-stroke-word sx-stroke-report" data-text="REPORT.">
              REPORT.
            </span>
            {" "}
            <span className="sx-stroke-word sx-stroke-connect" data-text="CONNECT.">
              CONNECT.
            </span>
            <br />
            <span className="sx-stroke-word sx-stroke-solve" data-text="SOLVE.">
              SOLVE.
            </span>
          </h1>

          <p className="sx-hero-tagline">
            Making civic problem solving simpler, faster and more
            collaborative for communities across India.
          </p>

          <div className="sx-hero-actions">
            <Link to="/login" className="sx-hero-primary-btn">
              REPORT A PROBLEM →
            </Link>

            <Link to="/login" className="sx-hero-secondary-btn">
              EXPLORE ISSUES
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}