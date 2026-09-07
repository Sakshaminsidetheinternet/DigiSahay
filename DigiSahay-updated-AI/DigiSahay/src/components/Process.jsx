import React, { useState, useEffect, useCallback, useRef } from "react";
import { STEPS } from "../data/content";
import identifyImg from "../assets/identify.png";
import collabImg from "../assets/collab.png";
import scaleImg from "../assets/scale.png";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const STEP_IMAGES = {
  IDENTIFY: identifyImg,
  COLLABORATE: collabImg,
  SCALE: scaleImg,
};

export default function Process() {
  const { t } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, []);

  // Resets/restarts the 1.5s auto-advance timer after manual user interaction
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 1500);
    }
  }, [isHovered, handleNext]);

  const onManualNext = () => {
    handleNext();
    resetTimer();
  };

  const onManualPrev = () => {
    handlePrev();
    resetTimer();
  };

  // Auto-rotate through Identify → Collaborate → Scale cards every 1.5 seconds, looping back to start
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 1500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, handleNext]);

  // Determine orbital station for each card:
  // slot 0: Center (front & enlarged)
  // slot 1: Right (side orbit)
  // slot 2: Left (side orbit)
  const getSlot = (idx) => {
    return (idx - activeIndex + STEPS.length) % STEPS.length;
  };

  const handleCardClick = (idx, slot) => {
    if (slot === 1) onManualNext();
    else if (slot === 2) onManualPrev();
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className={`sx-process sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
    >
      <div className="sx-wrap">
        <div className="sx-process-head">
          <h2 className="sx-process-title">{t.processHeading || "OUR WORK MOTIVE"}</h2>
        </div>

        {/* Circular Carousel Container with Edge Navigation Arrows */}
        <div
          className="sx-orbit-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Large Circular Edge Button: Previous */}
          <button
            type="button"
            className="sx-orbit-edge-btn sx-orbit-edge-prev"
            onClick={onManualPrev}
            aria-label="Previous step"
            title="Previous step"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* 3 Flashcards in Circular Orbit */}
          <div className="sx-orbit-stage">
            {STEPS.map((step, idx) => {
              const imageSrc = STEP_IMAGES[step.title];
              const translatedStep = t.steps?.[step.title] || step;
              const slot = getSlot(idx);
              const isCenter = slot === 0;
              const isRight = slot === 1;
              const isLeft = slot === 2;

              let slotClass = "sx-orbit-slot-center";
              if (isRight) slotClass = "sx-orbit-slot-right";
              if (isLeft) slotClass = "sx-orbit-slot-left";

              return (
                <article
                  key={step.title}
                  className={`sx-step-card sx-orbit-card ${slotClass} ${
                    isCenter ? "is-center" : "is-side"
                  }`}
                  onClick={() => handleCardClick(idx, slot)}
                  role="region"
                  aria-label={`${translatedStep.title} - Step 0${idx + 1}`}
                >
                  <div className="sx-step-badge">STEP 0{idx + 1}</div>

                  <div className="sx-step-img-wrap">
                    <div className="sx-step-img-halo" />
                    <img
                      src={imageSrc}
                      alt={`${translatedStep.title} visual`}
                      className="sx-step-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="sx-step-content">
                    <h3>{translatedStep.title}</h3>
                    <p>{translatedStep.body}</p>
                  </div>

                  {isCenter && <div className="sx-step-shimmer" aria-hidden="true" />}
                </article>
              );
            })}
          </div>

          {/* Large Circular Edge Button: Next */}
          <button
            type="button"
            className="sx-orbit-edge-btn sx-orbit-edge-next"
            onClick={onManualNext}
            aria-label="Next step"
            title="Next step"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
