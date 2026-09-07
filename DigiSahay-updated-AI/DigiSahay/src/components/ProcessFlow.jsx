import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const STAGES_DATA = [
  {
    step: "01",
    title: "Report",
    subtitle: "Citizens submit verified civic challenges with geo-tagging.",
    side: "above",
    x: 10,
    y: 32,
    svgX: 100,
    svgY: 115,
  },
  {
    step: "02",
    title: "Verify",
    subtitle: "Civic authorities and community reps review and authenticate.",
    side: "below",
    x: 30,
    y: 68,
    svgX: 300,
    svgY: 245,
  },
  {
    step: "03",
    title: "Register",
    subtitle: "Problems indexed on national innovation registry for matching.",
    side: "above",
    x: 50,
    y: 28,
    svgX: 500,
    svgY: 101,
  },
  {
    step: "04",
    title: "Collaborate",
    subtitle: "Startups, universities & industry teams co-engineer solutions.",
    side: "below",
    x: 70,
    y: 70,
    svgX: 700,
    svgY: 252,
  },
  {
    step: "05",
    title: "Deploy",
    subtitle: "Funded solutions piloted on ground with measurable impact.",
    side: "above",
    x: 90,
    y: 32,
    svgX: 900,
    svgY: 115,
  },
];

// Faint scattered background constellation dots echoing the portal's node/network motif
const SCATTERED_DOTS = [
  { cx: 50, cy: 60, r: 2.5, opacity: 0.18 },
  { cx: 160, cy: 40, r: 3, opacity: 0.15 },
  { cx: 220, cy: 190, r: 2, opacity: 0.22 },
  { cx: 270, cy: 80, r: 3.5, opacity: 0.14 },
  { cx: 380, cy: 160, r: 2.5, opacity: 0.2 },
  { cx: 430, cy: 300, r: 2, opacity: 0.16 },
  { cx: 480, cy: 50, r: 3, opacity: 0.25 },
  { cx: 580, cy: 220, r: 2.5, opacity: 0.18 },
  { cx: 640, cy: 90, r: 3.5, opacity: 0.15 },
  { cx: 720, cy: 310, r: 2, opacity: 0.2 },
  { cx: 790, cy: 150, r: 3, opacity: 0.18 },
  { cx: 840, cy: 50, r: 2.5, opacity: 0.16 },
  { cx: 870, cy: 280, r: 2, opacity: 0.22 },
  { cx: 950, cy: 80, r: 3, opacity: 0.15 },
  { cx: 980, cy: 230, r: 2.5, opacity: 0.18 },
];

// Faint network connection lines between background nodes
const NETWORK_LINKS = [
  { x1: 50, y1: 60, x2: 160, y2: 40 },
  { x1: 220, y1: 190, x2: 270, y2: 80 },
  { x1: 380, y1: 160, x2: 430, y2: 300 },
  { x1: 480, y1: 50, x2: 580, y2: 220 },
  { x1: 640, y1: 90, x2: 720, y2: 310 },
  { x1: 790, y1: 150, x2: 840, y2: 50 },
  { x1: 870, y1: 280, x2: 950, y2: 80 },
];

export default function ProcessFlow() {
  const { t } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.1);
  const [activeStage, setActiveStage] = useState(null);

  const stages = t.processStages || STAGES_DATA;

  // Winding dotted S-curve path connecting all 5 alternating nodes
  const pathD =
    "M 100,115 C 200,115 200,245 300,245 C 400,245 400,101 500,101 C 600,101 600,252 700,252 C 800,252 800,115 900,115";

  return (
    <section
      id="process-flow"
      ref={sectionRef}
      className={`sx-process-flow sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
      aria-label="DigiSahay Civic Process Flow"
    >
      <div className="sx-wrap">
        {/* Section Heading styled identically to Our Work Motive & Our Milestones */}
        <div className="sx-process-head">
          <h2 className="sx-process-title">{t.processFlowHeading || "PROCESS FLOW"}</h2>
        </div>

        {/* Artistic Non-linear Flow Stage Area */}
        <div className="sx-flow-stage-wrapper">
          <div className="sx-flow-stage-canvas">
            {/* SVG Background Layer: Scattered network dots, faint links, and the winding dotted path */}
            <svg
              className="sx-flow-svg"
              viewBox="0 0 1000 360"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="sx-flow-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9B3A32" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#9B3A32" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Faint network connection lines */}
              {NETWORK_LINKS.map((link, i) => (
                <line
                  key={`link-${i}`}
                  x1={link.x1}
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke="rgba(155, 58, 50, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              ))}

              {/* Faint scattered background constellation dots */}
              {SCATTERED_DOTS.map((dot, i) => (
                <circle
                  key={`dot-${i}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  fill="var(--sx-maroon, #9B3A32)"
                  opacity={dot.opacity}
                />
              ))}

              {/* Underlying soft aura guide */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(155, 58, 50, 0.08)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* The Single Winding Dashed Path Made of Small Dots */}
              <path
                d={pathD}
                fill="none"
                className="sx-winding-dotted-path"
                stroke="var(--sx-maroon, #9B3A32)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="0 14"
                opacity="0.6"
              />
            </svg>

            {/* Alternating Stage Nodes with Open-Side Labels */}
            <div className="sx-flow-nodes-container">
              {stages.map((stage, idx) => {
                const config = STAGES_DATA[idx] || STAGES_DATA[0];
                const isHigh = config.side === "above";
                const isHovered = activeStage === idx;

                return (
                  <div
                    key={stage.step || idx}
                    className={`sx-flow-node-item sx-flow-node-${idx + 1} ${
                      isHigh ? "sx-node-high" : "sx-node-low"
                    } ${isHovered ? "sx-node-active" : ""}`}
                    style={{
                      left: `${config.x}%`,
                      top: `${config.y}%`,
                    }}
                    onMouseEnter={() => setActiveStage(idx)}
                    onMouseLeave={() => setActiveStage(null)}
                  >
                    {/* The small filled circle in maroon/coral accent */}
                    <div className="sx-flow-circle-anchor">
                      <span className="sx-flow-halo" />
                      <span className="sx-flow-circle-dot" />
                    </div>

                    {/* Open-side Label (Above for high points, Below for low points) */}
                    <div
                      className={`sx-flow-label-box ${
                        isHigh ? "sx-label-above" : "sx-label-below"
                      }`}
                    >
                      <div className="sx-label-header">
                        <span className="sx-flow-step-num">{stage.step}</span>
                        <h3 className="sx-flow-stage-title">{stage.title}</h3>
                      </div>
                      <p className="sx-flow-stage-desc">{stage.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

