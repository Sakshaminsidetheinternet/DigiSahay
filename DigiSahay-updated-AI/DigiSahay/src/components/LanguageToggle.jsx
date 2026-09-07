import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="sx-lang-compact"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        className={`sx-lang-compact-tab ${language === "en" ? "is-active" : ""}`}
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
      >
        ENG
      </button>

      <span className="sx-lang-compact-divider" aria-hidden="true">/</span>

      <button
        type="button"
        className={`sx-lang-compact-tab ${language === "hi" ? "is-active" : ""}`}
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        aria-label="Switch to Hindi"
      >
        HINDI
      </button>
    </div>
  );
}
