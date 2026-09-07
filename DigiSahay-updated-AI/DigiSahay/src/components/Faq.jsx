import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const FAQ_DATA = {
  en: [
    {
      q: "What is DigiSahay and how does it work?",
      a: "DigiSahay is India's national civic innovation platform connecting everyday citizens reporting real-world challenges with university researchers, startups, and government departments to co-create scalable solutions.",
    },
    {
      q: "How can citizens report local civic issues?",
      a: "Citizens can register with their mobile number or Aadhaar, capture live photos and geolocation of the civic problem, and submit it directly to the national ledger for priority matching.",
    },
    {
      q: "How do universities and industry partners collaborate?",
      a: "Accredited universities and researchers browse open civic challenges to submit R&D proposals, while corporate partners provide grant funding, mentorship, and pilot deployment testing.",
    },
    {
      q: "Is funding available for innovative solutions?",
      a: "Yes. Verified solutions reaching the pilot deployment stage are connected to public innovation grants, CSR funding, and municipal procurement channels for nationwide scale.",
    },
  ],
  hi: [
    {
      q: "डिजीसहाय क्या है और यह कैसे काम करता है?",
      a: "डिजीसहाय भारत का राष्ट्रीय नागरिक नवाचार मंच है जो वास्तविक चुनौतियों की रिपोर्ट करने वाले नागरिकों को विश्वविद्यालय शोधकर्ताओं, स्टार्टअप्स और सरकारी विभागों से जोड़ता है।",
    },
    {
      q: "नागरिक स्थानीय नागरिक समस्याओं की रिपोर्ट कैसे कर सकते हैं?",
      a: "नागरिक अपने मोबाइल नंबर से पंजीकरण कर सकते हैं, समस्या की तस्वीरें और जियोलोकेशन संलग्न कर सकते हैं, और इसे सीधे राष्ट्रीय पोर्टल पर दर्ज कर सकते हैं।",
    },
    {
      q: "विश्वविद्यालय और उद्योग भागीदार कैसे सहयोग करते हैं?",
      a: "विश्वविद्यालय और शोधकर्ता खुली नागरिक चुनौतियों के लिए अनुसंधान प्रस्ताव प्रस्तुत करते हैं, जबकि उद्योग भागीदार अनुदान और पायलट परीक्षण सहायता प्रदान करते हैं।",
    },
    {
      q: "क्या नवोन्मेषी समाधानों के लिए वित्त पोषण उपलब्ध है?",
      a: "हाँ। पायलट परीक्षण चरण तक पहुँचने वाले सत्यापित समाधानों को सार्वजनिक नवाचार अनुदान, सीएसआर फंडिंग और राष्ट्रव्यापी विस्तार के लिए सहायता मिलती है।",
    },
  ],
};

export default function Faq() {
  const { language, t } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.1);
  const [openIdx, setOpenIdx] = useState(0);

  const items = FAQ_DATA[language] || FAQ_DATA.en;

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section
      id="faqs"
      ref={sectionRef}
      className={`sx-faq-section sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
    >
      <div className="sx-wrap">
        <div className="sx-faq-head">
          <h2 className="sx-faq-title">{t.faqs || "FREQUENTLY ASKED QUESTIONS"}</h2>
          <p className="sx-faq-sub">
            {language === "hi"
              ? "डिजीसहाय नागरिक नवाचार मंच के बारे में अक्सर पूछे जाने वाले महत्वपूर्ण प्रश्न।"
              : "Everything you need to know about the DigiSahay civic innovation ecosystem."}
          </p>
        </div>

        <div className="sx-faq-list">
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`sx-faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="sx-faq-question"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="sx-faq-q-text">{item.q}</span>
                  <span className="sx-faq-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="sx-faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

