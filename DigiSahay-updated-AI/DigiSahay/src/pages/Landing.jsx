import React, { useEffect } from "react";
import Header from "../components/Header";
import Announcement from "../components/Announcement";
import Hero from "../components/Hero";
import Process from "../components/Process";
import Impact from "../components/Impact";
import ProcessFlow from "../components/ProcessFlow";
import About from "../components/About";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Landing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="top">
      <Header />

      <Announcement />

      <main>
        <Hero />
        <Process />
        <Impact />
        <ProcessFlow />
        <About />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}