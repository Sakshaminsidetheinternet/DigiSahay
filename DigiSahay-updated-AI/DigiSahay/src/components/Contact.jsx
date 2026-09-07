import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Contact() {
  const { t, language } = useLanguage();
  const [sectionRef, isVisible] = useScrollReveal(0.1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "citizen",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", category: "citizen", message: "" });
    }, 4000);
  };

  const isHindi = language === "hi";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`sx-contact-section sx-scroll-reveal ${isVisible ? "sx-in-view" : ""}`}
      aria-label="Contact DigiSahay"
    >
      <div className="sx-wrap">
        {/* Section Heading */}
        <div className="sx-process-head">
          <h2 className="sx-process-title">{t.contactHeading || "CONTACT US"}</h2>
        </div>

        <p className="sx-contact-sub">
          {t.contactSub ||
            "Have inquiries, partnership proposals, or need civic support? Our coordination desk is ready to help."}
        </p>

        <div className="sx-contact-layout">
          {/* Left Column: Direct Official Contact Channels */}
          <div className="sx-contact-info-panel">
            <div className="sx-contact-card">
              <div className="sx-contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="sx-contact-card-text">
                <h4>{isHindi ? "कार्यालय" : "Our Office"}</h4>
                <p>{isHindi ? "नई दिल्ली, भारत" : "New Delhi, India"}</p>
              </div>
            </div>

            <div className="sx-contact-card">
              <div className="sx-contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="sx-contact-card-text">
                <h4>{isHindi ? "नागरिक हेल्पलाइन" : "Civic Toll-Free Helpline"}</h4>
                <p>1800-DIGISAHAY (1800-344-4724)</p>
                <span className="sx-contact-badge">{isHindi ? "24x7 उपलब्ध" : "24x7 Available"}</span>
              </div>
            </div>

            <div className="sx-contact-card">
              <div className="sx-contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="sx-contact-card-text">
                <h4>{isHindi ? "आधिकारिक ईमेल" : "Official Inquiries"}</h4>
                <p>contact@digisahay.gov.in</p>
                <p style={{ fontSize: "12px", color: "var(--sx-muted)" }}>partner@digisahay.in ({isHindi ? "अनुदान व साझेदारी" : "Grants & CSR"})</p>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Message / Inquiry Form */}
          <div className="sx-contact-form-panel">
            <form className="sx-contact-form" onSubmit={handleSubmit}>
              <div className="sx-form-row">
                <div className="sx-form-group">
                  <label htmlFor="contact-name">{isHindi ? "पूरा नाम" : "Full Name"}</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder={isHindi ? "उदा. राजेश कुमार" : "e.g. Rajesh Kumar"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="sx-form-group">
                  <label htmlFor="contact-email">{isHindi ? "ईमेल पता" : "Email Address"}</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="sx-form-group">
                <label htmlFor="contact-category">{isHindi ? "आपकी श्रेणी" : "Your Role / Category"}</label>
                <select
                  id="contact-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="citizen">{isHindi ? "नागरिक / समुदाय प्रतिनिधि" : "Citizen / Community Resident"}</option>
                  <option value="university">{isHindi ? "विश्वविद्यालय / शोधकर्ता" : "University / Researcher"}</option>
                  <option value="industry">{isHindi ? "उद्योग / स्टार्टअप / सीएसआर" : "Industry / Startup / CSR Partner"}</option>
                  <option value="government">{isHindi ? "सरकारी विभाग / नगर निगम" : "Government Department / Urban Local Body"}</option>
                </select>
              </div>

              <div className="sx-form-group">
                <label htmlFor="contact-message">{isHindi ? "संदेश / पूछताछ" : "Message / Inquiry"}</label>
                <textarea
                  id="contact-message"
                  rows="4"
                  required
                  placeholder={
                    isHindi
                      ? "हमें बताएं कि हम आपकी किस प्रकार सहायता कर सकते हैं..."
                      : "Describe your inquiry or partnership proposal..."
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="sx-contact-submit-btn">
                {submitted
                  ? (isHindi ? "✓ संदेश भेजा गया!" : "✓ Message Sent!")
                  : (isHindi ? "संदेश भेजें →" : "Send Inquiry →")}
              </button>

              {submitted && (
                <p className="sx-form-success-note">
                  {isHindi
                    ? "धन्यवाद! हमारे राष्ट्रीय समन्वय डेस्क से शीघ्र ही संपर्क किया जाएगा।"
                    : "Thank you! Our coordination desk will respond within 24 business hours."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

