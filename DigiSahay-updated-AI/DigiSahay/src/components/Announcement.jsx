import React from "react";

export default function Announcement() {
  const announcements = (
    <>
      <span>
        📢 Welcome to DigiSahay — India's Digital Civic Participation Platform 🇮🇳
      </span>

      <span className="sx-announcement-dot">◆</span>

      <span>
        📢 Report civic problems. Connect communities. Build better cities. 🇮🇳
      </span>

      <span className="sx-announcement-dot">◆</span>
    </>
  );

  return (
    <div className="sx-announcement">
      <div className="sx-announcement-marquee">
        <div className="sx-announcement-track">
          
          {/* First copy */}
          <div className="sx-announcement-group">
            {announcements}
          </div>

          {/* Exact duplicate */}
          <div
            className="sx-announcement-group"
            aria-hidden="true"
          >
            {announcements}
          </div>

        </div>
      </div>
    </div>
  );
}