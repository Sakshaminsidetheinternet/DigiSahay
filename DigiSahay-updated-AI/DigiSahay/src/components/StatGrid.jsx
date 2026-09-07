import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

function AnimatedNumber({ target, isVisible }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    const str = String(target);
    const isMillion = str.includes("M");
    const num = parseFloat(str.replace(/[^0-9.]/g, ""));

    if (isNaN(num)) {
      setDisplay(str);
      return;
    }

    const duration = 1600;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = num * ease;

      if (isMillion) {
        setDisplay(`${current.toFixed(1)}M+`);
      } else {
        const rounded = Math.round(current);
        setDisplay(`${rounded.toLocaleString()}+`);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplay(str);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, isVisible]);

  return <span>{display}</span>;
}

export default function StatGrid({ isVisible = true }) {
  const { t } = useLanguage();

  const cards = t.statCards || [
    {
      tag: "CITIZEN INPUT",
      title: "Problems Sourced",
      figure: "1,420+",
      unit: "COMMUNITY CHALLENGES LOGGED",
      desc: "Real civic problems crowdsourced, geotagged, and submitted by residents across 28 states.",
      status: "LIVE CITIZEN INTAKE",
      type: "problems",
    },
    {
      tag: "DELIVERY",
      title: "Solutions Live / Deployed",
      figure: "89+",
      unit: "ACTIVE PILOT DEPLOYMENTS",
      desc: "Engineered by university researchers, funded by industry partners, and verified on-ground.",
      status: "VERIFIED ON-GROUND",
      type: "solutions",
    },
    {
      tag: "OUTCOME",
      title: "Lives Impacted",
      figure: "1.4M+",
      unit: "CITIZENS EMPOWERED NATIONWIDE",
      desc: "Direct beneficiaries of restored clean water, safer streets, and rapid grievance redressal.",
      status: "LARGEST EMOTIONAL OUTCOME",
      type: "lives",
    },
  ];

  return (
    <div className="sx-stats-wrapper">
      <div className="sx-stat-flashcards">
        {cards.map((card, idx) => {
          const isProblems = card.type === "problems" || idx === 0;
          const isSolutions = card.type === "solutions" || idx === 1;
          const isLives = card.type === "lives" || idx === 2;

          return (
            <div
              key={card.title || idx}
              className={`sx-stat-flashcard sx-stat-type-${card.type || idx} ${isLives ? "sx-flashcard-hero" : ""} sx-stagger-item`}
              style={{ "--stagger-idx": idx + 1 }}
            >
              {/* Background ambient lighting specific to each card */}
              <div className="sx-flashcard-glow" />

              {/* Card Header: Category Tag & Distinct Animated Status Badge */}
              <div className="sx-flashcard-top">
                <span className="sx-stat-tag">{card.tag}</span>

                {isProblems && (
                  <div className="sx-anim-badge sx-badge-radar" title="Active real-time crowdsourcing">
                    <span className="sx-radar-beacon">
                      <span className="sx-radar-wave w1" />
                      <span className="sx-radar-wave w2" />
                      <span className="sx-radar-core" />
                    </span>
                    <span className="sx-badge-text">{card.status}</span>
                  </div>
                )}

                {isSolutions && (
                  <div className="sx-anim-badge sx-badge-circuit" title="Verified field deployments">
                    <span className="sx-circuit-beacon">
                      <span className="sx-circuit-dot" />
                      <span className="sx-circuit-ping" />
                    </span>
                    <span className="sx-badge-text">{card.status}</span>
                  </div>
                )}

                {isLives && (
                  <div className="sx-anim-badge sx-badge-heart" title="Human emotional outcome">
                    <svg className="sx-heart-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="sx-badge-text">{card.status}</span>
                  </div>
                )}
              </div>

              {/* Distinctive Mid Animation Graphic */}
              <div className="sx-flashcard-visual-zone">
                {isProblems && (
                  /* Radar signal frequency / acoustic waves indicating citizen input flow */
                  <div className="sx-visual-radar" aria-hidden="true">
                    <div className="sx-signal-wave-bar bar-1" />
                    <div className="sx-signal-wave-bar bar-2" />
                    <div className="sx-signal-wave-bar bar-3" />
                    <div className="sx-signal-wave-bar bar-4" />
                    <div className="sx-signal-wave-bar bar-5" />
                    <div className="sx-signal-wave-bar bar-6" />
                    <div className="sx-signal-wave-bar bar-7" />
                  </div>
                )}

                {isSolutions && (
                  /* Circuit tracer telemetry line showing live delivery pipeline */
                  <div className="sx-visual-circuit" aria-hidden="true">
                    <div className="sx-circuit-line">
                      <div className="sx-circuit-runner" />
                    </div>
                    <div className="sx-circuit-nodes">
                      <span className="sx-cnode active" />
                      <span className="sx-cnode-line" />
                      <span className="sx-cnode active" />
                      <span className="sx-cnode-line" />
                      <span className="sx-cnode active pulse" />
                    </div>
                  </div>
                )}

                {isLives && (
                  /* Emotional ECG heartbeat monitor wave with golden shimmer */
                  <div className="sx-visual-heartbeat" aria-hidden="true">
                    <svg className="sx-ecg-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path
                        className="sx-ecg-path-bg"
                        d="M 0,20 L 40,20 L 50,8 L 60,32 L 70,4 L 80,34 L 90,20 L 130,20 L 140,8 L 150,32 L 160,4 L 170,34 L 180,20 L 200,20"
                      />
                      <path
                        className="sx-ecg-path-pulse"
                        d="M 0,20 L 40,20 L 50,8 L 60,32 L 70,4 L 80,34 L 90,20 L 130,20 L 140,8 L 150,32 L 160,4 L 170,34 L 180,20 L 200,20"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Big Metric Display */}
              <div className="sx-flashcard-metric-block">
                <p className={`sx-flashcard-figure ${isLives ? "sx-figure-hero" : ""}`}>
                  <AnimatedNumber target={card.figure} isVisible={isVisible} />
                </p>
                <h3 className="sx-flashcard-title">{card.title}</h3>
              </div>

              {/* Sub-label & Description */}
              <div className="sx-flashcard-footer">
                <p className="sx-flashcard-unit">{card.unit}</p>
                <p className="sx-flashcard-desc">{card.desc}</p>
              </div>

              {/* Shimmer Border Beam for all cards */}
              <div className="sx-flashcard-border-beam" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
