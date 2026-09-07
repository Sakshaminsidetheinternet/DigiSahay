import React from "react";

/* ==========================================================================
   ILLUSTRATION 1: CAMPUS COMMUNITY & WARD HUB (Sign Up / Left Panel)
   ========================================================================== */
export function CampusHubIllustration() {
  return (
    <div className="sx-illustration-wrap">
      <svg
        viewBox="0 0 380 256"
        className="sx-panel-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="hub-pill-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000000" floodOpacity="0.25" />
          </filter>
          <filter id="hub-badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* 1. BACKGROUND SKYLINE SILHOUETTES */}
        {/* Left tall building */}
        <rect x="42" y="96" width="34" height="106" fill="#BD7272" opacity="0.6" rx="2" />
        <rect x="48" y="106" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="63" y="106" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="48" y="120" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="63" y="120" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="48" y="134" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="63" y="134" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="48" y="148" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="63" y="148" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />

        {/* Left mid building */}
        <rect x="80" y="80" width="38" height="122" fill="#B26565" opacity="0.75" rx="2" />
        <rect x="88" y="90" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="104" y="90" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="88" y="104" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="104" y="104" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="88" y="118" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="104" y="118" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="88" y="132" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="104" y="132" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="88" y="146" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="104" y="146" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />

        {/* Right mid building */}
        <rect x="262" y="80" width="38" height="122" fill="#B26565" opacity="0.75" rx="2" />
        <rect x="270" y="90" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="286" y="90" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="270" y="104" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="286" y="104" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="270" y="118" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="286" y="118" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="270" y="132" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="286" y="132" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="270" y="146" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="286" y="146" width="6" height="7.5" rx="1" fill="#FFFFFF" opacity="0.35" />

        {/* Right tall building */}
        <rect x="304" y="96" width="34" height="106" fill="#BD7272" opacity="0.6" rx="2" />
        <rect x="310" y="106" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="325" y="106" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="310" y="120" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="325" y="120" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="310" y="134" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />
        <rect x="325" y="134" width="5.5" height="7" rx="1" fill="#FFFFFF" opacity="0.35" />

        {/* 2. CLASSICAL CIVIC / CAMPUS BUILDING */}
        {/* Triangular Pediment */}
        <path d="M 100 128 L 190 76 L 280 128 Z" fill="#E8BCB6" />
        {/* Entablature beam */}
        <rect x="96" y="128" width="188" height="11" rx="1" fill="#DE9C97" />
        {/* Background wall of portico */}
        <rect x="110" y="139" width="160" height="57" fill="#C97E78" />
        {/* Center doorway arch */}
        <rect x="174" y="156" width="32" height="40" rx="3" fill="#5F1C1C" />

        {/* 4 Columns */}
        {/* Col 1 */}
        <rect x="122" y="139" width="15" height="57" fill="#FDF7F0" />
        <rect x="120" y="139" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        <rect x="120" y="192.5" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        {/* Col 2 */}
        <rect x="154" y="139" width="15" height="57" fill="#FDF7F0" />
        <rect x="152" y="139" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        <rect x="152" y="192.5" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        {/* Col 3 */}
        <rect x="211" y="139" width="15" height="57" fill="#FDF7F0" />
        <rect x="209" y="139" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        <rect x="209" y="192.5" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        {/* Col 4 */}
        <rect x="243" y="139" width="15" height="57" fill="#FDF7F0" />
        <rect x="241" y="139" width="19" height="3.5" rx="1" fill="#EEDFCF" />
        <rect x="241" y="192.5" width="19" height="3.5" rx="1" fill="#EEDFCF" />

        {/* Base Steps */}
        <rect x="100" y="196" width="180" height="8" rx="1.5" fill="#DE9C97" />
        <rect x="88" y="204" width="204" height="8" rx="2" fill="#C57A74" />

        {/* 3. TREES */}
        {/* Left Tree */}
        <rect x="52" y="180" width="6" height="36" rx="3" fill="#758872" />
        <ellipse cx="55" cy="164" rx="22" ry="27" fill="#9CD8BF" />

        {/* Right Tree */}
        <rect x="322" y="180" width="6" height="36" rx="3" fill="#758872" />
        <ellipse cx="325" cy="164" rx="22" ry="27" fill="#9CD8BF" />

        {/* 4. FOUR HUMAN FIGURES */}
        {/* Person 1 (Far Left - Maroon) */}
        <g>
          <circle cx="76" cy="152" r="9.5" fill="#ECC8A4" />
          <rect x="64" y="165" width="24" height="42" rx="11" fill="#842828" />
          <line x1="71" y1="207" x2="68" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="81" y1="207" x2="84" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Person 2 (Center Left - Beige) */}
        <g>
          <circle cx="134" cy="152" r="9.5" fill="#ECC8A4" />
          <rect x="122" y="165" width="24" height="42" rx="11" fill="#EBD3B9" />
          <line x1="129" y1="207" x2="126" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="139" y1="207" x2="142" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Person 3 (Center Right - Maroon) */}
        <g>
          <circle cx="246" cy="152" r="9.5" fill="#ECC8A4" />
          <rect x="234" y="165" width="24" height="42" rx="11" fill="#842828" />
          <line x1="241" y1="207" x2="238" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="251" y1="207" x2="254" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Person 4 (Far Right - Beige) */}
        <g>
          <circle cx="304" cy="152" r="9.5" fill="#ECC8A4" />
          <rect x="292" y="165" width="24" height="42" rx="11" fill="#EBD3B9" />
          <line x1="299" y1="207" x2="296" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="309" y1="207" x2="312" y2="236" stroke="#1A1918" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* 5. THREE FLOATING BADGES */}
        {/* Left Badge: Better Education */}
        <g filter="url(#hub-badge-shadow)">
          <circle cx="56" cy="78" r="26" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Mortarboard icon */}
          <path d="M 56 63 L 68 69 L 56 75 L 44 69 Z" fill="#697DC8" />
          <path d="M 48 71.5 L 48 76.5 Q 56 80 64 76.5 L 64 71.5" fill="#5264A6" />
          <path d="M 66 70 L 69 76 L 69 79.5" stroke="#EBD3B9" strokeWidth="1.2" strokeLinecap="round" />
          <text x="56" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            Better
          </text>
          <text x="56" y="97" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            Education
          </text>
        </g>

        {/* Center Badge: Stronger Communities */}
        <g filter="url(#hub-badge-shadow)">
          <circle cx="190" cy="34" r="26" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Two people silhouettes */}
          <circle cx="186" cy="21" r="3.2" fill="#756AB6" />
          <path d="M 180 31 C 180 27 183 26 186 26 C 189 26 192 27 192 31 Z" fill="#756AB6" />
          <circle cx="194" cy="21" r="3.2" fill="#8F82DA" />
          <path d="M 188 31 C 188 27 191 26 194 26 C 197 26 200 27 200 31 Z" fill="#8F82DA" />
          <text x="190" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            Stronger
          </text>
          <text x="190" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            Communities
          </text>
        </g>

        {/* Right Badge: Together We Grow */}
        <g filter="url(#hub-badge-shadow)">
          <circle cx="324" cy="78" r="26" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Handshake icon */}
          <g transform="translate(315, 63) scale(0.65)">
            <path
              d="M 5 12 L 11 6 C 12 5 14 5 15 6 L 18 9 L 14 13 Z M 23 12 L 17 6 C 16 5 14 5 13 6 L 10 9 L 14 13 Z"
              fill="#F2BC43"
            />
            <circle cx="14" cy="14" r="3" fill="#F8CF6B" />
          </g>
          <text x="324" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            Together
          </text>
          <text x="324" y="97" textAnchor="middle" fill="#FFFFFF" fontSize="8.2" fontWeight="700" fontFamily="sans-serif">
            We Grow
          </text>
        </g>

        {/* 6. FLOATING BOTTOM WHITE PILL */}
        <g filter="url(#hub-pill-shadow)">
          <rect x="75" y="222" width="230" height="28" rx="14" fill="#FFFFFF" />
          {/* Temple / Landmark building icon */}
          <g transform="translate(88, 228) scale(0.7)">
            <path d="M 2 8 L 11 2 L 20 8 Z" fill="#581C1C" />
            <rect x="2" y="8" width="18" height="2" fill="#581C1C" />
            <rect x="4" y="10" width="2" height="7" fill="#581C1C" />
            <rect x="8.5" y="10" width="2" height="7" fill="#581C1C" />
            <rect x="13" y="10" width="2" height="7" fill="#581C1C" />
            <rect x="17" y="10" width="2" height="7" fill="#581C1C" />
            <rect x="1" y="17" width="20" height="3" rx="0.5" fill="#581C1C" />
          </g>
          <text
            x="199"
            y="240"
            textAnchor="middle"
            fill="#341414"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="sans-serif"
            letterSpacing="0.2"
          >
            Ward Community &amp; Campus Hub
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   ILLUSTRATION 2: SMART SOLUTIONS & LIVE TRIALS (Sign In / Right Panel)
   ========================================================================== */
export function SmartSolutionsIllustration() {
  return (
    <div className="sx-illustration-wrap">
      <svg
        viewBox="0 0 380 256"
        className="sx-panel-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="smart-pill-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000000" floodOpacity="0.25" />
          </filter>
          <filter id="smart-badge-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* 1. CLOVERLEAF DECORATIVE MOTIFS */}
        {/* Left clover */}
        <g transform="translate(38, 196) scale(1.05)">
          <circle cx="0" cy="-5" r="5" fill="#842828" />
          <circle cx="-5" cy="0" r="5" fill="#842828" />
          <circle cx="5" cy="0" r="5" fill="#842828" />
          <path d="M -1 0 L -3.5 9 L 3.5 9 L 1 0 Z" fill="#842828" />
        </g>

        {/* Right clover (faint/translucent) */}
        <g transform="translate(342, 198) scale(1.05)" opacity="0.45">
          <circle cx="0" cy="-5" r="5" fill="#842828" />
          <circle cx="-5" cy="0" r="5" fill="#842828" />
          <circle cx="5" cy="0" r="5" fill="#842828" />
          <path d="M -1 0 L -3.5 9 L 3.5 9 L 1 0 Z" fill="#842828" />
        </g>

        {/* 2. CENTER SMARTPHONE MOCKUP */}
        {/* Phone Frame */}
        <rect
          x="128"
          y="14"
          width="124"
          height="212"
          rx="24"
          fill="#1C1C20"
          stroke="#2D2D32"
          strokeWidth="2"
        />
        {/* Phone Screen */}
        <rect x="133" y="19" width="114" height="202" rx="20" fill="#F8F4EC" />
        {/* Dynamic Island / Speaker Notch */}
        <rect x="175" y="25" width="30" height="4.5" rx="2.25" fill="#1C1C20" />

        {/* Map Grid Roads */}
        <path
          d="M 133 70 L 247 114 M 133 146 L 247 80 M 165 19 L 212 221 M 206 19 L 158 221 M 133 100 L 247 166"
          stroke="#E6DDCF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Map Pin */}
        {/* Drop shadow */}
        <ellipse cx="190" cy="128" rx="9" ry="3.5" fill="rgba(0,0,0,0.15)" />
        {/* Teardrop marker */}
        <path
          d="M 190 126 C 182 115 176 106 176 98 C 176 90.3 182.3 84 190 84 C 197.7 84 204 90.3 204 98 C 204 106 198 115 190 126 Z"
          fill="#882727"
        />
        {/* Inner white circle */}
        <circle cx="190" cy="98" r="4.2" fill="#FFFFFF" />

        {/* 3. TWO FIGURES REACHING TOWARDS PHONE */}
        {/* Left Figure */}
        <g>
          <circle cx="108" cy="158" r="10.5" fill="#1A1918" />
          <rect x="95" y="172" width="26" height="52" rx="12" fill="#842828" />
          {/* Reaching arm pointing to phone */}
          <path
            d="M 116 182 L 138 168 C 140 167 142 169 141 171 L 118 191 Z"
            fill="#842828"
          />
        </g>

        {/* Right Figure */}
        <g>
          <circle cx="272" cy="158" r="10.5" fill="#1A1918" />
          <rect x="259" y="172" width="26" height="52" rx="12" fill="#842828" />
          {/* Reaching arm pointing to phone */}
          <path
            d="M 264 182 L 242 168 C 240 167 238 169 239 171 L 262 191 Z"
            fill="#842828"
          />
        </g>

        {/* 4. FOUR FLOATING BADGES */}
        {/* Left Badge: Stronger Communities */}
        <g filter="url(#smart-badge-shadow)">
          <circle cx="74" cy="116" r="26" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Statue / Monument / Pawn icon */}
          <circle cx="74" cy="102" r="2.8" fill="#FFFFFF" />
          <path d="M 71 111 C 71 106 77 106 77 111 Z" fill="#FFFFFF" />
          <rect x="70" y="111" width="8" height="2" rx="0.5" fill="#FFFFFF" />
          <text x="74" y="126" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            Stronger
          </text>
          <text x="74" y="135" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700" fontFamily="sans-serif">
            Communities
          </text>
        </g>

        {/* Top Right Badge: Voice That Matters */}
        <g filter="url(#smart-badge-shadow)">
          <circle cx="300" cy="54" r="25" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Crescent / Voice icon */}
          <path d="M 297 44 A 5 5 0 0 1 297 54 Z" fill="#FFFFFF" />
          <path d="M 301 46 A 4 4 0 0 1 301 52" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <text x="300" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Voice That
          </text>
          <text x="300" y="71" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Matters
          </text>
        </g>

        {/* Middle Right Badge: Cleaner Neighborhoods */}
        <g filter="url(#smart-badge-shadow)">
          <circle cx="308" cy="122" r="25" fill="#4B1616" fillOpacity="0.75" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" />
          {/* Castle / Rook tower icon */}
          <path d="M 303 111 H 313 V 114 H 304 Z" fill="#FFFFFF" />
          <path d="M 304 114 L 305 121 H 311 L 312 114 Z" fill="#FFFFFF" />
          <rect x="303" y="121" width="10" height="2" rx="0.5" fill="#FFFFFF" />
          <text x="308" y="131" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Cleaner
          </text>
          <text x="308" y="139" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Neighborhoods
          </text>
        </g>

        {/* Bottom Right Badge: Safer Tomorrow (overlapping phone & figure) */}
        <g filter="url(#smart-badge-shadow)">
          <circle cx="278" cy="180" r="24" fill="#4B1616" fillOpacity="0.82" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          {/* Diamond outline icon */}
          <polygon
            points="278,167 283,172 278,177 273,172"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <text x="278" y="189" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Safer
          </text>
          <text x="278" y="197" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">
            Tomorrow
          </text>
        </g>

        {/* 5. FLOATING BOTTOM WHITE PILL */}
        <g filter="url(#smart-pill-shadow)">
          <rect x="85" y="222" width="210" height="28" rx="14" fill="#FFFFFF" />
          {/* Diamond outline icon */}
          <polygon
            points="104,232 108,236 104,240 100,236"
            fill="none"
            stroke="#8A2525"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <text
            x="196"
            y="240"
            textAnchor="middle"
            fill="#321515"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="sans-serif"
            letterSpacing="0.2"
          >
            Smart Solutions &amp; Live Trials
          </text>
        </g>
      </svg>
    </div>
  );
}

