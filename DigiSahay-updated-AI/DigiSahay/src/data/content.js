export const NAV_LINKS = [];

export const HEADER_LABEL = "NATIONAL CIVIC PORTAL";

export const HERO_CONTENT = {
  wordmark: "DigiSahay",
  quote:
    "Bridging the gap between critical civic challenges and innovative, scalable solutions for a better tomorrow.",
};

export const PROCESS_CONTENT = {
  heading: "OUR WORK MOTIVE",
};

export const STEPS = [
  {
    icon: "search",
    title: "IDENTIFY",
    body: "We actively source real-world problems from local communities and government departments through our national network.",
  },
  {
    icon: "branch",
    title: "COLLABORATE",
    body: "Connecting innovative startups, researchers, and students with relevant industry partners and public stakeholders.",
  },
  {
    icon: "rocket",
    title: "SCALE",
    body: "Facilitating funding, policy support, and pilot deployments for high-impact solutions across the nation.",
  },
];

export const IMPACT_CONTENT = {
  heading: "Quantifiable national impact",
  body:
    "Our data-driven approach ensures that every innovation is tracked from proposal to community-level deployment.",
};

export const STATS = [
  { label: "ACTIVE PIPELINE", figure: "142", unit: "PROBLEMS SOURCED" },
  { label: "LIVE DEPLOYMENTS", figure: "89", unit: "SOLUTIONS ACTIVE" },
  { label: "SOCIAL REACH", figure: "1.4M", unit: "LIVES IMPACTED" },
];

export const FOOTER_CONTENT = {
  wordmark: "DigiSahay",
  copy: "© 2024 NATIONAL INNOVATION REGISTRY. ALL RIGHTS RESERVED.",
};

export const LOGIN_CONTENT = {
  kicker: "NATIONAL CIVIC ACCESS",
  heading: "Choose Your Gateway",
  body: "Select your role to access customized dashboards, active civic challenges, and innovation tools.",
};

export const PORTAL_FLASHCARDS = [
  {
    id: "citizen",
    title: "Citizen",
    badge: "CIVIC & COMMUNITY",
    tagline: "Voice local challenges & shape the community",
    description:
      "Directly flag civic bottlenecks, vote on community priorities, and follow real-time pilot deployments across your neighborhood.",
    icon: "citizen",
    tags: [],
    benefits: [
      "Submit municipal and public utility challenges directly to local bodies",
      "Vote and prioritize neighbourhood problem statements for rapid resolution",
      "Track live status and milestone progress of field pilots in your area",
      "Participate in citizen review panels and provide direct ground feedback",
    ],
    cta: "Continue as Citizen",
    email: "citizen@digisahay.gov.in",
  },
  {
    id: "university",
    title: "University",
    badge: "RESEARCH & ACADEMIA",
    tagline: "Translate academic R&D into scalable solutions",
    description:
      "Submit faculty and student innovations, match with government challenge statements, and apply for civic technology pilot grants.",
    icon: "university",
    tags: [],
    benefits: [
      "Access government-vetted challenge statements from urban local bodies",
      "Secure pilot funding and deployment support for campus prototypes",
      "Foster student capstones, PhD fellowships, and interdisciplinary labs",
      "Validate emerging technologies in controlled municipal testing beds",
    ],
    cta: "Continue as University",
    email: "university@digisahay.gov.in",
  },
  {
    id: "industry",
    title: "Industry",
    badge: "ENTERPRISE & SCALING",
    tagline: "Commercialize & scale public sector innovations",
    description:
      "Discover verified civic requirements, partner on Public-Private Partnerships (PPP), and scale tested technologies nationally.",
    icon: "industry",
    tags: [],
    benefits: [
      "Bid on national civic technology challenges and government RFPs",
      "Scale proven lab prototypes into commercial municipal solutions",
      "Structure public-private partnerships with state and central agencies",
      "Access unified enterprise telemetry, compliance, and impact analytics",
    ],
    cta: "Continue as Industry",
    email: "industry@digisahay.gov.in",
  },
];


export const DASHBOARD_CONTENT = {
  greeting: "Welcome back",
  kicker: "OVERVIEW",
  cards: [
    { icon: "folder", label: "OPEN PROPOSALS", figure: "12", unit: "AWAITING REVIEW" },
    { icon: "clock", label: "IN PILOT", figure: "5", unit: "ACTIVE DEPLOYMENTS" },
    { icon: "check", label: "COMPLETED", figure: "27", unit: "SOLUTIONS SCALED" },
  ],
  activity: [
    { title: "Water quality sensor network", meta: "Pilot review scheduled · Nagpur Municipal Corp" },
    { title: "Solar micro-grid retrofit", meta: "Funding approved · Rural Development Board" },
    { title: "School attendance tracker", meta: "Proposal submitted · Dept. of Education" },
  ],
};

export const CITIZEN_DASHBOARD_DATA = {
  profile: {
    name: "Anvita Chaudhary",
    email: "citizen@digisahay.gov.in",
    id: "SX-CIT-4920",
    ward: "Ward 14 · Central Zone",
    city: "Pune Municipal Area",
    status: "Verified Citizen",
    badge: "Level 4 Civic Champion",
    memberSince: "August 2024",
    avatarInitials: "AC",
  },
  creditScore: {
    score: 785,
    maxScore: 850,
    rating: "Exceptional Standing",
    monthlyChange: "+35 pts this month",
    percentile: "Top 5% in Ward 14",
    tier: "Tier 1 Civic Contributor",
    breakdown: [
      { label: "Verified Accuracy", value: "98%" },
      { label: "Community Upvotes", value: "142" },
      { label: "Pilots Reviewed", value: "12" },
    ],
  },
  navOptions: [
    { id: "problems", label: "My Reported Problems", badge: "4 active" },
    { id: "ward", label: "Ward Challenges & Needs", badge: "12 open" },
    { id: "voting", label: "Civic Polls & Voting", badge: "3 live" },
    { id: "pilots", label: "Local Pilot Deployments", badge: "2 active" },
    { id: "rewards", label: "Civic Perks & Badges", badge: "Unlocked" },
    { id: "notices", label: "Municipal Advisories", badge: "2 new" },
  ],
  categories: [
    "Roads & Transit",
    "Water & Sanitation",
    "Street Lighting",
    "Waste Management",
    "Public Health",
    "Parks & Greenery",
  ],
  initialProblems: [],
};

