import React from "react";
import StatGrid from "./StatGrid";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useLanguage } from "../context/LanguageContext";

export default function Impact() {
  const { t } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.12);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className={`sx-impact sx-stats-section sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
      aria-label="National Civic Impact Statistics"
    >
      <div className="sx-wrap">
        <div className="sx-process-head">
          <h2 className="sx-process-title">{t.statsHeading || "OUR MILESTONES"}</h2>
        </div>
        <StatGrid isVisible={isVisible} />
      </div>
    </section>
  );
}

