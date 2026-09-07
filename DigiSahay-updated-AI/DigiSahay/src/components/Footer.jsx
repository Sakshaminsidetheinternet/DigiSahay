import React from "react";
import { FOOTER_CONTENT } from "../data/content";
import { DiamondMark, TwitterIcon, LinkedInIcon, GlobeIcon } from "./icons";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="sx-footer">
      <div className="sx-wrap sx-footer-inner">
        <div className="sx-footer-left">
          <div className="sx-logo-mark sx-logo-sm">
            <span style={{ transform: "scale(0.9)", display: "flex", color: "var(--sx-cream)" }}>
              <DiamondMark />
            </span>
          </div>
          <span className="sx-footer-wordmark">{t.footerWordmark || FOOTER_CONTENT.wordmark}</span>
        </div>

        <p className="sx-footer-copy">{t.footerCopy || FOOTER_CONTENT.copy}</p>

        <div className="sx-footer-social">
          <a href="#" aria-label="Twitter">
            <TwitterIcon />
          </a>
          <a href="#" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="#" aria-label="Website">
            <GlobeIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
