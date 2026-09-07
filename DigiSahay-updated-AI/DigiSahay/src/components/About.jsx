import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function About() {
  const { t } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  const pillars = t.aboutPillars || [
    {
      title: "Grassroots Crowdsourcing",
      desc: "Empowering residents across 28 states and union territories to report, geotag, and advocate for civic necessities in real-time.",
    },
    {
      title: "Academic & Tech R&D",
      desc: "Mobilizing accredited universities, professors, and student creators to engineer indigenous prototypes for identified community pain points.",
    },
    {
      title: "Verified Field Deployment",
      desc: "Facilitating CSR funding, administrative validation, and public procurement channels to take tested pilot solutions to nationwide scale.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`sx-about-section sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
      aria-label="About DigiSahay"
    >
      <div className="sx-wrap">
        {/* Section Heading matching Our Work Motive & Our Milestones */}
        <div className="sx-process-head">
          <h2 className="sx-process-title">{t.aboutUsHeading || "ABOUT US"}</h2>
        </div>

        {/* Narrative Intro Block */}
        <div className="sx-about-narrative">
          <p className="sx-about-lead">
            {t.aboutLead || "Transforming civic participation into verifiable nationwide impact."}
          </p>
          <p className="sx-about-story">
            {t.aboutStory ||
              "DigiSahay is India's dedicated civic innovation infrastructure connecting everyday citizens, university researchers, dynamic startups, and administrative stakeholders into a single high-trust ecosystem. We transform grassroots challenges into verified, scalable solutions through collective collaboration and transparent tracking."}
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="sx-about-pillars-grid">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="sx-about-pillar-card sx-stagger-item"
              style={{ "--stagger-idx": idx + 1 }}
            >
              <div className="sx-about-pillar-top">
                <span className="sx-pillar-num">0{idx + 1}</span>
                <div className="sx-pillar-line" />
              </div>
              <h3 className="sx-pillar-title">{pillar.title}</h3>
              <p className="sx-pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

