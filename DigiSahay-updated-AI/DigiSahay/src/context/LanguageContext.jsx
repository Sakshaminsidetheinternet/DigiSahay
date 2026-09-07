import React, { createContext, useContext, useState, useEffect } from "react";

export const TRANSLATIONS = {
  en: {
    headerLabel: "NATIONAL CIVIC PORTAL",
    login: "LOGIN",
    langToggleAria: "Switch language to Hindi",
    heroWordmark: "DigiSahay",
    heroQuote:
      "Bridging the gap between critical civic challenges and innovative, scalable solutions for a better tomorrow.",
    heroCta: "LOGIN TO PORTAL →",
    processHeading: "OUR WORK MOTIVE",
    steps: {
      IDENTIFY: {
        title: "IDENTIFY",
        body: "We actively source real-world problems from local communities and government departments through our national network.",
      },
      COLLABORATE: {
        title: "COLLABORATE",
        body: "Connecting innovative startups, researchers, and students with relevant industry partners and public stakeholders.",
      },
      SCALE: {
        title: "SCALE",
        body: "Facilitating funding, policy support, and pilot deployments for high-impact solutions across the nation.",
      },
    },
    impactHeading: "Quantifiable national impact",
    impactBody:
      "Our data-driven approach ensures that every innovation is tracked from proposal to community-level deployment.",
    statsHeading: "OUR MILESTONES",
    statCards: [
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
    ],
    aboutUs: "About Us",
    faqs: "FAQs",
    contactUs: "Contact Us",
    aboutUsHeading: "ABOUT US",
    aboutLead: "Transforming civic participation into verifiable nationwide impact.",
    aboutStory: "DigiSahay is India's dedicated civic innovation infrastructure connecting everyday citizens, university researchers, dynamic startups, and administrative stakeholders into a single high-trust ecosystem. We transform grassroots challenges into verified, scalable solutions through collective collaboration and transparent tracking.",
    aboutPillars: [
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
    ],
    contactHeading: "CONTACT US",
    contactSub: "Have inquiries, partnership proposals, or need civic support? Our coordination desk is ready to help.",
    processFlowHeading: "PROCESS FLOW",
    processStages: [
      {
        step: "01",
        title: "Report",
        subtitle: "Citizens submit verified civic challenges with geo-tagging.",
        side: "above",
      },
      {
        step: "02",
        title: "Verify",
        subtitle: "Civic authorities and community reps review and authenticate.",
        side: "below",
      },
      {
        step: "03",
        title: "Register",
        subtitle: "Problems indexed on national innovation registry for matching.",
        side: "above",
      },
      {
        step: "04",
        title: "Collaborate",
        subtitle: "Startups, universities & industry teams co-engineer solutions.",
        side: "below",
      },
      {
        step: "05",
        title: "Deploy",
        subtitle: "Funded solutions piloted on ground with measurable impact.",
        side: "above",
      },
    ],
    viewReport: "VIEW REPORT",
    footerWordmark: "DigiSahay",
    footerCopy: "© 2024 NATIONAL INNOVATION REGISTRY. ALL RIGHTS RESERVED.",
  },
  hi: {
    headerLabel: "राष्ट्रीय नागरिक पोर्टल",
    login: "लॉग इन",
    aboutUs: "हमारे बारे में",
    faqs: "FAQs",
    contactUs: "संपर्क करें",
    aboutUsHeading: "हमारे बारे में",
    aboutLead: "नागरिक भागीदारी को सत्यापन योग्य राष्ट्रव्यापी प्रभाव में बदलना।",
    aboutStory: "डिजीसहाय भारत का समर्पित नागरिक नवाचार ढांचा है जो आम नागरिकों, विश्वविद्यालय शोधकर्ताओं, स्टार्टअप्स और प्रशासनिक हितधारकों को एक विश्वसनीय नेटवर्क में जोड़ता है। हम सामूहिक सहयोग और पारदर्शी ट्रैकिंग के माध्यम से जमीनी समस्याओं को ठोस समाधानों में बदलते हैं।",
    aboutPillars: [
      {
        title: "जमीनी स्तर पर क्राउडसोर्सिंग",
        desc: "28 राज्यों और केंद्र शासित प्रदेशों के नागरिकों को वास्तविक समय में नागरिक समस्याओं की रिपोर्ट और जियोटैग करने के लिए सशक्त बनाना।",
      },
      {
        title: "अकादमिक व तकनीकी अनुसंधान",
        desc: "चिह्नित सामुदायिक चुनौतियों के लिए स्वदेशी प्रोटोटाइप तैयार करने हेतु विश्वविद्यालयों, प्राध्यापकों और छात्रों को संगठित करना।",
      },
      {
        title: "जमीन पर सत्यापित तैनाती",
        desc: "परीक्षण किए गए पायलट समाधानों को राष्ट्रव्यापी स्तर तक पहुंचाने के लिए सीएसआर फंडिंग और प्रशासनिक सहयोग प्रदान करना।",
      },
    ],
    contactHeading: "संपर्क करें",
    contactSub: "क्या आपके पास प्रश्न हैं, साझेदारी का प्रस्ताव है, या नागरिक सहायता चाहिए? हमारी समन्वय टीम मदद के लिए तत्पर है।",
    langToggleAria: "Switch language to English",
    heroWordmark: "डिजीसहाय",
    heroQuote:
      "नागरिक चुनौतियों और एक बेहतर कल के लिए नवोन्मेषी, स्केलेबल समाधानों के बीच की दूरी को पाटना।",
    heroCta: "पोर्टल में प्रवेश करें →",
    processHeading: "हमारा कार्य उद्देश्य",
    steps: {
      IDENTIFY: {
        title: "पहचानें",
        body: "हम अपने राष्ट्रीय नेटवर्क के माध्यम से स्थानीय समुदायों और सरकारी विभागों से वास्तविक समस्याओं को सक्रिय रूप से एकत्रित करते हैं।",
      },
      COLLABORATE: {
        title: "सहयोग करें",
        body: "नवोन्मेषी स्टार्टअप्स, शोधकर्ताओं और छात्रों को संबंधित उद्योग भागीदारों और सार्वजनिक हितधारकों से जोड़ना।",
      },
      SCALE: {
        title: "विस्तार करें",
        body: "देश भर में उच्च प्रभाव वाले समाधानों के लिए वित्त पोषण, नीति समर्थन और पायलट परीक्षण की सुविधा प्रदान करना।",
      },
    },
    impactHeading: "मापने योग्य राष्ट्रीय प्रभाव",
    impactBody:
      "हमारा डेटा-संचालित दृष्टिकोण यह सुनिश्चित करता है कि प्रत्येक नवाचार को प्रस्ताव से लेकर समुदाय-स्तरीय तैनाती तक ट्रैक किया जाए।",
    statsHeading: "हमारी उपलब्धियां",
    statCards: [
      {
        tag: "नागरिक इनपुट",
        title: "पहचानी गई समस्याएं",
        figure: "1,420+",
        unit: "दर्ज की गई सामुदायिक चुनौतियां",
        desc: "28 राज्यों के नागरिकों द्वारा वास्तविक समय में रिपोर्ट और जियोटैग की गई समस्याएं।",
        status: "लाइव नागरिक इनटेक",
        type: "problems",
      },
      {
        tag: "कार्यान्वयन",
        title: "सक्रिय समाधान",
        figure: "89+",
        unit: "सक्रिय पायलट समाधान",
        desc: "विश्वविद्यालयों द्वारा शोधित, उद्योग द्वारा वित्तपोषित और जमीनी स्तर पर सत्यापित।",
        status: "जमीन पर सत्यापित",
        type: "solutions",
      },
      {
        tag: "परिणाम",
        title: "प्रभावित जीवन",
        figure: "1.4M+",
        unit: "देशभर में सशक्त नागरिक",
        desc: "स्वच्छ पानी, सुरक्षित सड़कों और पारदर्शी नागरिक सेवाओं से लाभान्वित जीवन।",
        status: "सर्वाधिक महत्वपूर्ण प्रभाव",
        type: "lives",
      },
    ],
    processFlowHeading: "प्रक्रिया प्रवाह",
    processStages: [
      {
        step: "01",
        title: "रिपोर्ट",
        subtitle: "नागरिक जियो-टैगिंग के साथ सत्यापित नागरिक समस्याएं दर्ज करते हैं।",
        side: "above",
      },
      {
        step: "02",
        title: "सत्यापित",
        subtitle: "नागरिक प्राधिकरण और समुदाय प्रतिनिधि समीक्षा व प्रमाणीकरण करते हैं।",
        side: "below",
      },
      {
        step: "03",
        title: "रजिस्टर",
        subtitle: "समस्याओं को समाधान से मिलान हेतु राष्ट्रीय रजिस्ट्री में दर्ज किया जाता है।",
        side: "above",
      },
      {
        step: "04",
        title: "सहयोग",
        subtitle: "स्टार्टअप, विश्वविद्यालय व उद्योग मिलकर समाधान तैयार करते हैं।",
        side: "below",
      },
      {
        step: "05",
        title: "तैनाती",
        subtitle: "वित्तपोषित समाधानों को जमीनी स्तर पर प्रभाव के साथ लागू किया जाता है।",
        side: "above",
      },
    ],
    viewReport: "रिपोर्ट देखें",
    footerWordmark: "डिजीसहाय",
    footerCopy: "© 2024 राष्ट्रीय नवाचार रजिस्ट्री। सर्वाधिकार सुरक्षित।",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("digisahay_lang") || localStorage.getItem("sahyogx_lang") || "en";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("digisahay_lang", lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: TRANSLATIONS.en,
    };
  }
  return context;
}

