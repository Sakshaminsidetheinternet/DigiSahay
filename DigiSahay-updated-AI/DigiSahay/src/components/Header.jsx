import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DiamondMark } from "./icons";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleHome = () => {
    setMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="sx-header">
      <div className="sx-wrap sx-nav">

        {/* DigiSahay Brand */}
        <Link
          to="/"
          className="sx-auth-brand"
          aria-label="DigiSahay Home"
          onClick={handleHome}
        >
          <div className="sx-logo-mark">
            <DiamondMark />
          </div>

          <span>DigiSahay</span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="sx-navtoggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            style={{
              display: "block",
              width: 20,
              height: 2,
              background: "var(--sx-ink)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -6,
                left: 0,
                width: 20,
                height: 2,
                background: "var(--sx-ink)",
              }}
            />

            <span
              style={{
                position: "absolute",
                top: 6,
                left: 0,
                width: 20,
                height: 2,
                background: "var(--sx-ink)",
              }}
            />
          </span>
        </button>

        {/* Navigation */}
        <div className={`sx-nav-right ${menuOpen ? "sx-open" : ""}`}>

          <nav
            className="sx-header-nav-links"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className="sx-header-nav-link"
              onClick={handleHome}
            >
              HOME
            </Link>

            <a
              href="#about"
              className="sx-header-nav-link"
              onClick={handleScrollTo("about")}
            >
              {t.aboutUs || "ABOUT"}
            </a>

            <a
              href="#process"
              className="sx-header-nav-link"
              onClick={handleScrollTo("process")}
            >
              HOW IT WORKS
            </a>

            <a
              href="#impact"
              className="sx-header-nav-link"
              onClick={handleScrollTo("impact")}
            >
              IMPACT
            </a>

            <a
              href="#faqs"
              className="sx-header-nav-link"
              onClick={handleScrollTo("faqs")}
            >
              {t.faqs || "FAQs"}
            </a>

            <a
              href="#contact"
              className="sx-header-nav-link"
              onClick={handleScrollTo("contact")}
            >
              {t.contactUs || "CONTACT"}
            </a>
          </nav>

          <LanguageToggle />

          <Link to="/login" className="sx-login">
            {t.login || "LOGIN"}
          </Link>

        </div>
      </div>
    </header>
  );
}