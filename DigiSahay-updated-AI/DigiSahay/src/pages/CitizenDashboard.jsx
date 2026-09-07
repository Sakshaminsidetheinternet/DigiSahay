import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
const CIVIC_CATEGORIES = [
  "Roads & Transit",
  "Water Management",
  "Sanitation",
  "Waste Management",
  "Street Lighting",
  "Public Health",
  "Education",
  "Agriculture",
  "Environment",
  "Energy",
  "Urban Development",
  "Accessibility",
  "Public Administration",
  "Other",
];
import {
  DiamondMark,
  ShieldCheckIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleIcon, 
  CameraIcon,
  PlusIcon,
  CloseIcon,
  LogoutIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  PieChartIcon,
  EditIcon,
  MicIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { createProblem, getMyProblems } from "../api/problemService";
import { getProfile, updateProfile } from "../api/authService";
import apiClient from "../api/apiClient";
import "./CitizenDashboard.css";

const TIMELINE_STAGES = [
  { id: "uploaded", title: "Problem Uploaded", sub: "Logged on Public Ledger" },
  { id: "solutions", title: "Solutions Proposed", sub: "R&D & Innovation Match" },
  { id: "funding", title: "Waiting for Funding", sub: "Grant & Allocation Phase" },
  { id: "resolved", title: "Resolved", sub: "Verified Civic Deployment" },
];

// UI category labels shown in the dropdown <-> backend ProblemCategory enum values.
const CATEGORY_TO_BACKEND = {
  "Roads & Transit":       "ROAD_DAMAGE",
  "Water Management":      "WATER_MANAGEMENT",
  "Sanitation":            "SANITATION",
  "Waste Management":      "GARBAGE",
  "Street Lighting":       "STREETLIGHT",
  "Public Health":         "HEALTHCARE",
  "Education":             "EDUCATION",
  "Agriculture":           "AGRICULTURE",
  "Environment":           "ENVIRONMENT",
  "Energy":                "ENERGY",
  "Urban Development":     "URBAN_DEVELOPMENT",
  "Accessibility":         "ACCESSIBILITY",
  "Public Administration": "PUBLIC_ADMINISTRATION",
  "Other":                 "OTHER",
};

// Reverse map: backend enum -> UI label (also handles legacy backend values)
const BACKEND_CATEGORY_TO_LABEL = {
  ROAD_DAMAGE:          "Roads & Transit",
  WATER_MANAGEMENT:     "Water Management",
  WATER_LEAKAGE:        "Water Management",   // legacy alias
  SANITATION:           "Sanitation",
  GARBAGE:              "Waste Management",
  STREETLIGHT:          "Street Lighting",
  ELECTRICITY_SHORTAGE: "Energy",             // legacy alias
  HEALTHCARE:           "Public Health",
  EDUCATION:            "Education",
  AGRICULTURE:          "Agriculture",
  ENVIRONMENT:          "Environment",
  ENERGY:               "Energy",
  URBAN_DEVELOPMENT:    "Urban Development",
  ACCESSIBILITY:        "Accessibility",
  PUBLIC_ADMINISTRATION:"Public Administration",
  OTHER:                "Other",
};



// Backend ProblemStatus enum -> the display text/badge style this UI already understands.
const STATUS_MAP = {
  OPEN: { status: "Under Municipal Review", statusType: "review", progress: 25 },
  IN_PROGRESS: { status: "In Pilot Deployment", statusType: "pilot", progress: 60 },
  RESOLVED: { status: "Resolved & Verified", statusType: "resolved", progress: 100 },
  REJECTED: { status: "Rejected", statusType: "rejected", progress: 0 },
};

// Converts a backend CivicProblemResponseDto into the shape this dashboard's UI expects.
function mapBackendProblemToUi(bp) {
  const statusInfo = STATUS_MAP[bp.status] || STATUS_MAP.OPEN;
  return {
    id: bp.id,
    title: bp.title,
    category: BACKEND_CATEGORY_TO_LABEL[bp.category] || bp.category,
    ward: [bp.address, bp.city].filter(Boolean).join(" · "),
    date: bp.createdAt
      ? new Date(bp.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    status: statusInfo.status,
    statusType: statusInfo.statusType,
    progress: statusInfo.progress,
    upvotes: 0,
    description: bp.description,
    photo: bp.imageUrl ? `${apiClient.defaults.baseURL}${bp.imageUrl}` : null,
    authority: "Ward Urban Local Body (ULB) Response Cell",
    updates: "Problem submitted & logged in public ledger. Awaiting initial triage.",
  };
}

function getTimelineStageIndex(problem) {
  if (!problem) return 0;
  const statusType = (problem.statusType || "").toLowerCase();
  if (statusType === "resolved") return 3;
  if (statusType === "pilot") return 2;
  if (statusType === "r_and_d") return 1;
  return 0;
}

function getCoordinatesForPercent(percent, radius, cx = 100, cy = 100) {
  const angle = percent * 2 * Math.PI - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

// Derives initials from a real name instead of hardcoding a dummy person's initials.
function getInitials(name) {
  const initials = (name || "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return initials || "U";
}

// Formats the real backend user id as a DigiSahay Citizen ID, e.g. 1 -> "DS-CIT-001".
function formatCitizenId(id) {
  if (!id) return "—";
  return `DS-CIT-${String(id).padStart(3, "0")}`;
}

// "2025-01-12T10:00:00" -> "Jan 2025", for the profile card's "Member Since" field.
function formatMemberSince(createdAt) {
  if (!createdAt) return "—";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

// Converts the backend ProfileResponseDto into the fields this dashboard's
// `profile` state tracks, so a saved profile actually reloads on next login
// instead of resetting to blank every session.
function mapBackendProfileToUi(bp) {
  return {
    name: bp.name || "",
    email: bp.email || "",
    age: bp.age != null ? String(bp.age) : "",
    phone: bp.phone || "",
    street: bp.street || "",
    city: bp.city || "",
    state: bp.state || "",
    pinCode: bp.pinCode || "",
    memberSince: formatMemberSince(bp.createdAt),
    avatarInitials: getInitials(bp.name),
    id: formatCitizenId(bp.id),
  };
}

// Civic credit score is derived entirely from real, verified activity:
// 25 points per problem the user has actually reported, capped at 850.
function computeCreditScore(problemCount) {
  return Math.min(850, problemCount * 25);
}

// A rating label computed from the real score, rather than a fixed fake string.
function getCivicTier(score) {
  if (score >= 750) return "Civic Champion";
  if (score >= 500) return "Active Contributor";
  if (score >= 250) return "Getting Started";
  return "New Citizen";
}

// reportsFiled / reportsResolved derived from the user's real problems list.
function computeReportStats(problemList) {
  const filed = problemList.length;
  const resolved = problemList.filter((p) => p.statusType === "resolved").length;
  const pct = filed ? Math.round((resolved / filed) * 100) : 0;
  return {
    reportsFiled: filed,
    reportsResolved: `${resolved} (${pct}%)`,
  };
}

function getPieSlicePath(startPercent, endPercent, outerRadius, innerRadius = 0, cx = 100, cy = 100) {
  let safeEnd = endPercent;
  if (safeEnd - startPercent >= 0.9999) {
    safeEnd = startPercent + 0.9999;
  }
  const [startX, startY] = getCoordinatesForPercent(startPercent, outerRadius, cx, cy);
  const [endX, endY] = getCoordinatesForPercent(safeEnd, outerRadius, cx, cy);
  const isLargeArc = safeEnd - startPercent > 0.5 ? 1 : 0;

  if (innerRadius <= 0) {
    return `M ${cx} ${cy} L ${startX} ${startY} A ${outerRadius} ${outerRadius} 0 ${isLargeArc} 1 ${endX} ${endY} Z`;
  }

  const [innerEndX, innerEndY] = getCoordinatesForPercent(safeEnd, innerRadius, cx, cy);
  const [innerStartX, innerStartY] = getCoordinatesForPercent(startPercent, innerRadius, cx, cy);

  return `M ${startX} ${startY} A ${outerRadius} ${outerRadius} 0 ${isLargeArc} 1 ${endX} ${endY} L ${innerEndX} ${innerEndY} A ${innerRadius} ${innerRadius} 0 ${isLargeArc} 0 ${innerStartX} ${innerStartY} Z`;
}

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("problems");
  const [filterCategory, setFilterCategory] = useState("All");
  const [problems, setProblems] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [creditScore, setCreditScore] = useState(0);
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeSliceId, setActiveSliceId] = useState(null);
  const [chartType, setChartType] = useState("donut");
  const [bubbleProblem, setBubbleProblem] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setBubbleProblem(null);
        setIsModalOpen(false);
        setIsEditProfileOpen(false);
      }
    };
    if (bubbleProblem || isModalOpen || isEditProfileOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [bubbleProblem, isModalOpen, isEditProfileOpen]);

  // Fetch this citizen's REAL problems from the backend on mount, instead of
  // showing the static dummy CITIZEN_DASHBOARD_DATA.initialProblems.
  useEffect(() => {
    let isMounted = true;

    async function loadMyProblems() {
      setIsLoadingProblems(true);
      try {
        const data = await getMyProblems();
        if (isMounted) {
          const uiProblems = data.map(mapBackendProblemToUi);
          setProblems(uiProblems);
          setCreditScore(computeCreditScore(uiProblems.length));
          setProfile((prev) => ({ ...prev, ...computeReportStats(uiProblems) }));
        }
      } catch (err) {
        console.error("Failed to load your problems:", err);
        if (isMounted) {
          setProblems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProblems(false);
        }
      }
    }

    loadMyProblems();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch this citizen's REAL saved profile from the backend on mount, so
  // details saved via Edit Profile in a previous session actually show up
  // again instead of resetting to blank on every login.
  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (isMounted) {
          setProfile((prev) => ({ ...prev, ...mapBackendProfileToUi(data) }));
        }
      } catch (err) {
        console.error("Failed to load your profile:", err);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // New Problem Form State
  const [newProblem, setNewProblem] = useState({
    title: "",
    category: CIVIC_CATEGORIES[0],
    ward: "",
    urgency: "",
    description: "",
    photo: null,
    photoFile: null,
  });

  const recognitionRef = useRef(null);

  const handleSpeechToText = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setToastMessage("Speech-to-text is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      let initialDescription = newProblem.description || "";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          initialDescription = initialDescription
            ? `${initialDescription.trim()} ${finalTranscript.trim()}`
            : finalTranscript.trim();
        }

        const combinedText = interimTranscript
          ? (initialDescription ? `${initialDescription.trim()} ${interimTranscript.trim()}` : interimTranscript.trim())
          : initialDescription;

        setNewProblem((prev) => ({
          ...prev,
          description: combinedText,
        }));
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        const error = event.error;
        if (error === "not-allowed" || error === "service-not-allowed") {
          setToastMessage("Microphone permission denied. Please allow microphone access in your browser settings.");
        } else if (error === "no-speech") {
          setToastMessage("No speech detected. Please speak clearly into your microphone.");
        } else if (error === "audio-capture") {
          setToastMessage("No microphone found. Please check your audio input device.");
        } else if (error === "network") {
          setToastMessage("Network error occurred during speech recognition.");
        } else {
          setToastMessage("Speech recognition error occurred. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setToastMessage("Failed to start speech recognition.");
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewProblem((prev) => ({ ...prev, photo: reader.result, photoFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const [profile, setProfile] = useState({
    // Only what the user actually provided at sign-up/login.
    name: user?.name || "",
    email: user?.email || "",
    avatarInitials: getInitials(user?.name),
    id: formatCitizenId(user?.id),
    // Not collected at sign-up and not tracked by the backend yet —
    // shown honestly as "not set" until the user fills it in via Edit Profile,
    // or until the backend is extended to store/return these fields.
    age: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    memberSince: "—",
    activeStreak: "—",
    // Derived from the user's real submitted problems once they load (see useEffect below).
    reportsFiled: 0,
    reportsResolved: "0 (0%)",
  });

  const [editProfileForm, setEditProfileForm] = useState({
    name: profile.name,
    age: profile.age,
    email: profile.email,
    phone: profile.phone,
    street: profile.street,
    city: profile.city,
    state: profile.state,
    pinCode: profile.pinCode,
  });

  const handleOpenEditProfile = () => {
    setEditProfileForm({
      name: profile.name,
      age: profile.age,
      email: profile.email,
      phone: profile.phone,
      street: profile.street,
      city: profile.city,
      state: profile.state,
      pinCode: profile.pinCode,
    });
    setIsEditProfileOpen(true);
  };

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const updated = await updateProfile({
        name: editProfileForm.name,
        email: editProfileForm.email,
        age: editProfileForm.age ? Number(editProfileForm.age) : null,
        phone: editProfileForm.phone,
        street: editProfileForm.street,
        city: editProfileForm.city,
        state: editProfileForm.state,
        pinCode: editProfileForm.pinCode,
      });

      // Email is the JWT subject on the backend; if it changed, the server
      // hands back a fresh token so the user doesn't get logged out.
      if (updated.token) {
        localStorage.setItem("token", updated.token);
      }

      setProfile((prev) => ({ ...prev, ...mapBackendProfileToUi(updated) }));
      setIsEditProfileOpen(false);
      setToastMessage("Profile details updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "Could not save profile details. Please try again.";
      setToastMessage(message);
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setToastMessage(""), 4000);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleUpvote = (id) => {
    setProblems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isUpvoted = upvotedIds.has(id);
          const newUpvotes = isUpvoted ? item.upvotes - 1 : item.upvotes + 1;
          return { ...item, upvotes: newUpvotes };
        }
        return item;
      })
    );

    setUpvotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!newProblem.title.trim() || !newProblem.description.trim()) {
      return;
    }
    if (!profile.city) {
      setToastMessage("Please add your city in your profile before reporting a problem.");
      setTimeout(() => setToastMessage(""), 5000);
      return;
    }

    setIsSubmittingProblem(true);

    const formData = new FormData();
    formData.append("title", newProblem.title);
    formData.append("description", newProblem.description);
    formData.append(
      "category",
      CATEGORY_TO_BACKEND[newProblem.category] || "OTHER"
    );
    formData.append("address", newProblem.ward);
    formData.append("city", profile.city);
    if (newProblem.urgency) {
      formData.append("urgency", newProblem.urgency);
    }
    if (newProblem.photoFile) {
      formData.append("image", newProblem.photoFile);
    }

    try {
      const { data: savedProblem, status } = await createProblem(formData);

      setIsModalOpen(false);
      setNewProblem({
        title: "",
        category: CIVIC_CATEGORIES[0],
        ward: "",
        urgency: "",
        description: "",
        photo: null,
        photoFile: null,
      });

      if (status === 200 && savedProblem.duplicate) {
        // This problem already exists — escalate priority, no new card
        setToastMessage(
          savedProblem.message ||
            `This problem has already been reported ${savedProblem.reportCount ?? ""} time(s). Your report has increased its priority to ${savedProblem.priority ?? ""}. Thank you!`
        );
      } else {
        // Genuinely new problem — HTTP 201
        const created = mapBackendProblemToUi(savedProblem);
        setProblems((prev) => {
          const updated = [created, ...prev];
          setProfile((p) => ({ ...p, ...computeReportStats(updated) }));
          return updated;
        });
        setCreditScore((prev) => Math.min(850, prev + 25));
        setToastMessage("Problem reported successfully! +25 Civic Credit Points added to your profile.");
      }
      setTimeout(() => setToastMessage(""), 6000);
    } catch (err) {
      console.error("Failed to submit problem:", err);
      setToastMessage(
        err.response?.data?.message ||
          "Couldn't submit your problem. Please check your connection and try again."
      );
      setTimeout(() => setToastMessage(""), 6000);
    } finally {
      setIsSubmittingProblem(false);
    }
  };



  const filteredProblems =
    filterCategory === "All"
      ? problems
      : problems.filter((p) => p.category === filterCategory || p.statusType === filterCategory);

  const getStatusClass = (type) => {
    switch (type) {
      case "pilot":
        return "sx-status-pilot";
      case "resolved":
        return "sx-status-resolved";
      case "r_and_d":
        return "sx-status-randd";
      default:
        return "sx-status-review";
    }
  };

  const scorePercentage = Math.round((creditScore / 850) * 100);

  // Only real signal the backend tracks today is "problems reported" —
  // no voting/pilot-review/audit features exist yet, so we don't fabricate
  // percentages for them. One honest slice, sized to the user's real score.
  const contributions =
    problems.length > 0
      ? [
          {
            id: "reports",
            label: "Verified Reports",
            percentage: 100,
            points: creditScore,
            color: "#9B3A32",
            description: "Points earned from civic problems you've reported",
          },
        ]
      : [];
  let cumulativePercent = 0;
  const pieSlices = contributions.map((item) => {
    const startPercent = cumulativePercent;
    const endPercent = cumulativePercent + item.percentage / 100;
    cumulativePercent = endPercent;
    return {
      ...item,
      startPercent,
      endPercent,
    };
  });
  const activeSlice = pieSlices.find((s) => s.id === activeSliceId);

  return (
    <div className="sx-citizen-layout">
      {/* HEADER */}
      <header className="sx-portal-header">
        <div className="sx-wrap sx-portal-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark">
              <DiamondMark />
            </div>
            <span>DigiSahay</span>
            <span className="sx-role-badge">CITIZEN</span>
          </Link>
          <div className="sx-header-right-actions">
            <LanguageToggle />
            <button className="sx-portal-back sx-signout-btn" onClick={handleSignOut}>
              <LogoutIcon />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {toastMessage && (
        <div className="sx-toast-alert" role="alert">
          <CheckCircleIcon />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")} aria-label="Dismiss toast">
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="sx-wrap sx-citizen-body">
        {/* ================= LEFT SIDEBAR (PROFILE) ================= */}
        <aside className="sx-citizen-sidebar">
          {/* PROFILE SECTION */}
          <div className="sx-profile-card sx-profile-card-v2">
            {/* Avatar */}
            <div className="sx-pv2-avatar-wrap">
              <div className="sx-pv2-avatar">
                <span>{profile.avatarInitials}</span>
              </div>
              <span className="sx-pv2-shield" title="Verified Resident">
                <ShieldCheckIcon />
              </span>
            </div>

            {/* Name + verified pill */}
            <h3 className="sx-pv2-name">{profile.name}</h3>
            <span className="sx-pv2-kyc-pill">Verified Citizen</span>

            {/* ── Personal details ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Personal details</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Citizen ID</span>
                <span className="sx-pv2-value sx-pv2-mono">{profile.id}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Standing</span>
                <span className="sx-pv2-value sx-pv2-highlight">{getCivicTier(creditScore)}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Member since</span>
                <span className="sx-pv2-value">{profile.memberSince}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Age</span>
                <span className="sx-pv2-value">{profile.age || "Not set"}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Email</span>
                <span className="sx-pv2-value">{profile.email}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Phone</span>
                <span className="sx-pv2-value">{profile.phone || "Not set"}</span>
              </div>
            </div>

            {/* ── Address details ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Address details</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Street</span>
                <span className="sx-pv2-value">{profile.street || "Not set"}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">City</span>
                <span className="sx-pv2-value">{profile.city || "Not set"}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">State</span>
                <span className="sx-pv2-value">{profile.state || "Not set"}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">PIN code</span>
                <span className="sx-pv2-value">{profile.pinCode || "Not set"}</span>
              </div>
            </div>

            {/* ── Reports ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Reports</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon">&#x1F4C4;</span>
                <span className="sx-pv2-report-label">Reports filed</span>
                <span className="sx-pv2-report-val">{profile.reportsFiled}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-green">&#x2713;</span>
                <span className="sx-pv2-report-label">Resolved</span>
                <span className="sx-pv2-report-val sx-pv2-green">{profile.reportsResolved}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-maroon">&#x1F525;</span>
                <span className="sx-pv2-report-label">Active streak</span>
                <span className="sx-pv2-report-val sx-pv2-maroon">{profile.activeStreak}</span>
              </div>
            </div>

            {/* EDIT PROFILE BUTTON */}
            <div className="sx-pv2-edit-wrap">
              <button
                type="button"
                className="sx-btn-edit-profile"
                onClick={handleOpenEditProfile}
              >
                <EditIcon />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ================= MIDDLE / MAIN SECTION ================= */}
        <main key={activeTab} className="sx-citizen-main sx-tab-transition">
          {/* TOP GREETINGS & HERO */}
          <div className="sx-citizen-greeting-hero">
            <div>

              
              <h1 className="sx-citizen-welcome-title">
                Welcome back, {(profile?.name || "Citizen").split(" ")[0]} 👋
              </h1>
              <p className="sx-citizen-welcome-sub">
                Track your submitted civic issues, vote on municipal priorities, and inspect real-time
                pilot resolutions in your neighborhood.
              </p>
            </div>

            {/* NICE ADD NEW PROBLEM BUTTON */}
            <div className="sx-hero-cta-wrap">
              <button
                type="button"
                className="sx-btn-add-problem"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon />
                <span>Report New Problem</span>
              </button>
            </div>
          </div>

          {/* ================= CIVIC CREDIT SCORE CARD ================= */}
          <section className="sx-credit-score-section">
            <div className="sx-credit-score-card">
              <div className="sx-credit-score-left">
                <div className="sx-credit-kicker-row">
                  <span className="sx-credit-kicker">CIVIC CONTRIBUTION METRIC</span>
                  <span className="sx-credit-pill">
                    <TrendingUpIcon /> +25 pts per verified report
                  </span>
                </div>

                <div className="sx-score-num-wrap">
                  <span className="sx-score-big">{creditScore}</span>
                  <span className="sx-score-max">/ 850</span>
                  <span className="sx-score-status-badge">
                    {getCivicTier(creditScore)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="sx-score-bar-track">
                  <div
                    className="sx-score-bar-fill"
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>

                <div className="sx-score-scale">
                  <span>Needs Work (300)</span>
                  <span>Good (650)</span>
                  <span>Champion (850)</span>
                </div>
              </div>

              {/* RIGHT: INTERACTIVE CONTRIBUTION PIE CHART */}
              <div className="sx-credit-score-right sx-pie-chart-container">
                <div className="sx-pie-header">
                  <div className="sx-pie-title-wrap">
                    <PieChartIcon />
                    <span className="sx-factor-heading">CONTRIBUTION COMPOSITION</span>
                  </div>
                  <div className="sx-chart-type-toggle">
                    <button
                      type="button"
                      className={`sx-chart-toggle-btn ${chartType === "donut" ? "active" : ""}`}
                      onClick={() => setChartType("donut")}
                    >
                      Donut
                    </button>
                    <button
                      type="button"
                      className={`sx-chart-toggle-btn ${chartType === "pie" ? "active" : ""}`}
                      onClick={() => setChartType("pie")}
                    >
                      Solid
                    </button>
                  </div>
                </div>

                <div className="sx-pie-content-layout">
                  {/* SVG Pie Chart */}
                  <div className="sx-pie-svg-wrap">
                    <svg
                      viewBox="0 0 200 200"
                      className="sx-pie-svg"
                      role="img"
                      aria-label="Civic contribution breakdown pie chart"
                    >
                      <g className="sx-pie-slices">
                        {pieSlices.map((slice) => {
                          const isHovered = activeSliceId === slice.id;
                          const outerR = isHovered ? 86 : 80;
                          const innerR = chartType === "donut" ? (isHovered ? 47 : 51) : 0;
                          const pathD = getPieSlicePath(
                            slice.startPercent,
                            slice.endPercent,
                            outerR,
                            innerR,
                            100,
                            100
                          );

                          return (
                            <path
                              key={slice.id}
                              d={pathD}
                              fill={slice.color}
                              stroke="#FFFFFF"
                              strokeWidth="2.5"
                              className={`sx-pie-slice ${isHovered ? "is-hovered" : ""}`}
                              onMouseEnter={() => setActiveSliceId(slice.id)}
                              onMouseLeave={() => setActiveSliceId(null)}
                              tabIndex={0}
                              onFocus={() => setActiveSliceId(slice.id)}
                              onBlur={() => setActiveSliceId(null)}
                              aria-label={`${slice.label}: ${slice.percentage}%, ${slice.points} points`}
                            />
                          );
                        })}
                      </g>

                      {/* Donut Center Display */}
                      {chartType === "donut" && (
                        <g className="sx-pie-center-text" pointerEvents="none">
                          <text
                            x="100"
                            y={activeSlice ? "93" : "96"}
                            textAnchor="middle"
                            className="sx-pie-center-figure"
                          >
                            {activeSlice ? `${activeSlice.percentage}%` : creditScore}
                          </text>
                          <text
                            x="100"
                            y={activeSlice ? "114" : "117"}
                            textAnchor="middle"
                            className="sx-pie-center-label"
                          >
                            {activeSlice ? `${activeSlice.points} PTS` : "TOTAL PTS"}
                          </text>
                        </g>
                      )}
                    </svg>

                    {/* Tooltip badge for solid pie view */}
                    {activeSlice && chartType === "pie" && (
                      <div
                        className="sx-pie-tooltip-badge"
                        style={{ borderColor: activeSlice.color }}
                      >
                        <span style={{ color: activeSlice.color, fontWeight: 700 }}>
                          {activeSlice.label}
                        </span>
                        <span>
                          {activeSlice.percentage}% ({activeSlice.points} pts)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Legend */}
                  <div className="sx-pie-legend">
                    {pieSlices.map((slice) => {
                      const isHovered = activeSliceId === slice.id;
                      return (
                        <div
                          key={slice.id}
                          className={`sx-pie-legend-row ${isHovered ? "is-active" : ""}`}
                          onMouseEnter={() => setActiveSliceId(slice.id)}
                          onMouseLeave={() => setActiveSliceId(null)}
                        >
                          <div className="sx-legend-left">
                            <span
                              className="sx-legend-swatch"
                              style={{ backgroundColor: slice.color }}
                            />
                            <div className="sx-legend-meta">
                              <span className="sx-legend-title">{slice.label}</span>
                              <span className="sx-legend-desc">{slice.description}</span>
                            </div>
                          </div>
                          <div className="sx-legend-stats">
                            <span className="sx-legend-pct">{slice.percentage}%</span>
                            <span className="sx-legend-pts">{slice.points} pts</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ALREADY UPLOADED PROBLEMS SECTION ================= */}
          <section className="sx-uploaded-problems-section">
            <div className="sx-section-header">
              <div>
                <h2 className="sx-section-title">Already Uploaded Problems</h2>
                <p className="sx-section-subtitle">
                  Showing {filteredProblems.length} civic bottleneck
                  {filteredProblems.length === 1 ? "" : "s"} submitted from your account.
                </p>
              </div>

              <div className="sx-filter-group">
                <button
                  type="button"
                  className={`sx-filter-pill ${filterCategory === "All" ? "active" : ""}`}
                  onClick={() => setFilterCategory("All")}
                >
                  All ({problems.length})
                </button>
                <button
                  type="button"
                  className={`sx-filter-pill ${filterCategory === "pilot" ? "active" : ""}`}
                  onClick={() => setFilterCategory("pilot")}
                >
                  In Pilot (1)
                </button>
                <button
                  type="button"
                  className={`sx-filter-pill ${filterCategory === "review" ? "active" : ""}`}
                  onClick={() => setFilterCategory("review")}
                >
                  Under Review
                </button>
                <button
                  type="button"
                  className={`sx-filter-pill ${filterCategory === "resolved" ? "active" : ""}`}
                  onClick={() => setFilterCategory("resolved")}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* PROBLEMS CARDS LIST */}
            <div className="sx-problems-list">
              {isLoadingProblems ? (
                <div className="sx-empty-state">
                  <p>Loading your submitted problems...</p>
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="sx-empty-state">
                  <AlertCircleIcon />
                  <p>
                    {problems.length === 0
                      ? "You haven't reported any problems yet."
                      : "No problems found under this category."}
                  </p>
                  <button
                    className="sx-btn-secondary-link"
                    onClick={() => setFilterCategory("All")}
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                filteredProblems.map((prb) => (
                  <article
                    key={prb.id}
                    className="sx-problem-card sx-problem-card-clickable"
                    onClick={() => setBubbleProblem(prb)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setBubbleProblem(prb);
                      }
                    }}
                    title="Click to view detailed description bubble"
                  >
                    <div className="sx-problem-top">
                      <div className="sx-problem-meta-tags">
                        <span className="sx-category-chip">{prb.category}</span>
                        {prb.photo && (
                          <span className="sx-problem-photo-chip">
                            <CameraIcon /> Site Photo Attached
                          </span>
                        )}
                      </div>
                      <span className={`sx-status-pill ${getStatusClass(prb.statusType)}`}>
                        <span className="sx-status-dot" />
                        {prb.status}
                      </span>
                    </div>

                    <h3 className="sx-problem-title">{prb.title}</h3>

                    {/* Card Footer */}
                    <div className="sx-problem-footer">
                      <div className="sx-problem-loc-date">
                        <span>
                          <MapPinIcon /> {prb.ward}
                        </span>
                        <span>•</span>
                        <span>
                          <ClockIcon /> {prb.date}
                        </span>
                      </div>

                      <span className="sx-problem-bubble-badge">
                        <ChatBubbleIcon /> Click for details
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* ================= MODAL: ADD A NEW CIVIC PROBLEM ================= */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="sx-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="sx-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="sx-modal-header">
              <div>
                <p className="sx-kicker">NEW PROBLEM REGISTRATION</p>
                <h2 id="modal-title" className="sx-modal-title">
                  Report a Civic Bottleneck
                </h2>
              </div>
              <button
                type="button"
                className="sx-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="sx-modal-form">
              <label className="sx-modal-field">
                <span>Problem Title *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken drainage culvert causing waterlogging on Ring Road"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                />
              </label>

              <label className="sx-modal-field">
                <span>Category <small>(optional hint — AI makes the final decision)</small></span>
                <select
                  value={newProblem.category}
                  onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                >
                  {CIVIC_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sx-modal-field">
                <span>Exact Location *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 14 · Near Old Bus Stand, Opposite Govt School"
                  value={newProblem.ward}
                  onChange={(e) => setNewProblem({ ...newProblem, ward: e.target.value })}
                />
              </label>

              <div className="sx-modal-field">
                <div className="sx-description-label-row">
                  <span>Detailed Description *</span>
                  <button
                    type="button"
                    className={`sx-mic-button ${isListening ? "is-listening" : ""}`}
                    onClick={handleSpeechToText}
                    disabled={!speechSupported}
                    title={speechSupported ? (isListening ? "Stop listening" : "Speak your problem") : "Speech-to-text unavailable"}
                    aria-label="Speak your problem"
                  >
                    <MicIcon />
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue, its impact on residents, and how long it has persisted..."
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                />
                {isListening && <div className="sx-listening-indicator"><span /> Listening… speak now</div>}
                <small className="sx-ai-help-text">AI checks whether the issue is public, vague or personal, validates the photo, and chooses the final category.</small>
              </div>

              <div className="sx-modal-field">
                <span>Photo of Problem Site (Optional)</span>
                <div className="sx-photo-upload-wrap">
                  {newProblem.photo ? (
                    <div className="sx-photo-preview-card">
                      <img
                        src={newProblem.photo}
                        alt="Problem site preview"
                        className="sx-photo-preview-image"
                      />
                      <button
                        type="button"
                        className="sx-photo-remove-btn"
                        onClick={() => setNewProblem({ ...newProblem, photo: null, photoFile: null })}
                        title="Remove photo"
                      >
                        <CloseIcon />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  ) : (
                    <label className="sx-photo-dropzone">
                      <input
                        type="file"
                        accept="image/*"
                        className="sx-photo-input"
                        onChange={handlePhotoUpload}
                      />
                      <div className="sx-photo-dropzone-content">
                        <div className="sx-photo-icon-circle">
                          <CameraIcon />
                        </div>
                        <div className="sx-photo-text-block">
                          <span className="sx-photo-prompt">Upload a photo of the problem site</span>
                          <span className="sx-photo-hint">Click or drag to attach image (PNG, JPG, WebP)</span>
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="sx-modal-reward-notice">
                <ShieldCheckIcon />
                <span>
                  Reporting verified public issues awards <strong>+25 Civic Credit points</strong>{" "}
                  
                </span>
              </div>

              <div className="sx-modal-footer">
                <button
                  type="button"
                  className="sx-btn-modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sx-btn-modal-submit" disabled={isSubmittingProblem}>
                  <PlusIcon />
                  <span>{isSubmittingProblem ? "Submitting..." : "Submit Problem to ULB"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL: EDIT CITIZEN PROFILE ================= */}
      {isEditProfileOpen && typeof document !== "undefined" && createPortal(
        <div className="sx-modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div
            className="sx-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className="sx-modal-header">
              <div>
                <p className="sx-kicker">CITIZEN PROFILE SETTINGS</p>
                <h2 id="edit-profile-title" className="sx-modal-title">
                  Edit Personal Details
                </h2>
              </div>
              <button
                type="button"
                className="sx-modal-close"
                onClick={() => setIsEditProfileOpen(false)}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="sx-modal-form">
              <div className="sx-modal-section-label">Personal Information</div>
              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Full Name *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.name}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, name: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field" style={{ maxWidth: "130px" }}>
                  <span>Age *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24"
                    value={editProfileForm.age}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, age: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    required
                    value={editProfileForm.email}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, email: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field">
                  <span>Phone Number *</span>
                  <input
                    type="tel"
                    required
                    value={editProfileForm.phone}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, phone: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="sx-modal-section-label" style={{ marginTop: "14px" }}>
                Address Details
              </div>

              <label className="sx-modal-field">
                <span>Street Address *</span>
                <input
                  type="text"
                  required
                  value={editProfileForm.street}
                  onChange={(e) =>
                    setEditProfileForm({ ...editProfileForm, street: e.target.value })
                  }
                />
              </label>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>City *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.city}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, city: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field">
                  <span>State *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.state}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, state: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field" style={{ maxWidth: "130px" }}>
                  <span>PIN Code *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.pinCode}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, pinCode: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="sx-modal-footer" style={{ marginTop: "24px" }}>
                <button
                  type="button"
                  className="sx-btn-modal-cancel"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sx-btn-modal-submit" disabled={isSavingProfile}>
                  <CheckCircleIcon />
                  <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ================= BUBBLE: DETAILED PROBLEM DESCRIPTION ================= */}
      {bubbleProblem && typeof document !== "undefined" && createPortal(
        <div className="sx-bubble-overlay" onClick={() => setBubbleProblem(null)}>
          <div
            className="sx-detail-bubble-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bubble-dialog-title"
          >
            {/* Speech bubble notch */}
            <div className="sx-bubble-dialog-notch" aria-hidden="true" />

            <div className="sx-bubble-dialog-header">
              <div className="sx-bubble-dialog-tags">
                <span className="sx-category-chip">{bubbleProblem.category}</span>
                <span className={`sx-status-pill ${getStatusClass(bubbleProblem.statusType)}`}>
                  <span className="sx-status-dot" />
                  {bubbleProblem.status}
                </span>
              </div>
              <button
                type="button"
                className="sx-bubble-dialog-close"
                onClick={() => setBubbleProblem(null)}
                aria-label="Close detailed description bubble"
              >
                <CloseIcon />
              </button>
            </div>

            <h2 id="bubble-dialog-title" className="sx-bubble-dialog-title">
              {bubbleProblem.title}
            </h2>

            <div className="sx-bubble-dialog-meta">
              <span>
                <MapPinIcon /> {bubbleProblem.ward}
              </span>
              <span>•</span>
              <span>
                <ClockIcon /> {bubbleProblem.date}
              </span>
            </div>

            {/* Speech bubble container showing detailed description */}
            <div className="sx-speech-bubble-container">
              <div className="sx-speech-bubble-kicker">
                <ChatBubbleIcon />
                <span>DETAILED PROBLEM DESCRIPTION</span>
              </div>
              <p className="sx-speech-bubble-text">{bubbleProblem.description}</p>
            </div>

            {/* PROBLEM SITE PHOTO FRAME */}
            <div className="sx-bubble-photo-container">
              <div className="sx-bubble-photo-header">
                <CameraIcon />
                <span>PROBLEM SITE PHOTO</span>
              </div>
              <div className="sx-bubble-photo-frame-wrap">
                {bubbleProblem.photo ? (
                  <img
                    src={bubbleProblem.photo}
                    alt={bubbleProblem.title}
                    className="sx-bubble-photo-img"
                  />
                ) : (
                  <div className="sx-photo-frame-empty">
                    <div className="sx-photo-frame-dashed">
                      <div className="sx-photo-frame-icon-badge">
                        <CameraIcon />
                      </div>
                      <span className="sx-photo-frame-title">Site Photo Frame</span>
                      <span className="sx-photo-frame-subtitle">Empty · No image attached for now</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TIMELINE SECTION */}
            <div className="sx-bubble-timeline-section">
              <div className="sx-bubble-timeline-header">
                <ClockIcon />
                <span>RESOLUTION PROGRESSION TIMELINE</span>
              </div>

              <div className="sx-bubble-timeline-track">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const activeIdx = getTimelineStageIndex(bubbleProblem);
                  const isCompleted =
                    idx < activeIdx ||
                    (idx === activeIdx && bubbleProblem.statusType === "resolved");
                  const isCurrent =
                    idx === activeIdx && bubbleProblem.statusType !== "resolved";

                  return (
                    <div
                      key={stage.id}
                      className={`sx-timeline-step ${
                        isCompleted
                          ? "is-completed"
                          : isCurrent
                          ? "is-current"
                          : "is-pending"
                      }`}
                    >
                      {idx < TIMELINE_STAGES.length - 1 && (
                        <div
                          className={`sx-timeline-connector ${
                            idx < activeIdx ? "connector-filled" : ""
                          }`}
                        />
                      )}

                      <div className="sx-timeline-node">
                        {isCompleted ? (
                          <CheckCircleIcon />
                        ) : isCurrent ? (
                          <span className="sx-timeline-current-dot" />
                        ) : (
                          <span className="sx-timeline-num">{idx + 1}</span>
                        )}
                      </div>

                      <div className="sx-timeline-content">
                        <span className="sx-timeline-step-name">{stage.title}</span>
                        <span className="sx-timeline-step-sub">{stage.sub}</span>
                        <span className="sx-timeline-step-badge">
                          {isCompleted
                            ? "Completed"
                            : isCurrent
                            ? "Active"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sx-bubble-dialog-footer">
              <button
                type="button"
                className="sx-btn-bubble-close"
                onClick={() => setBubbleProblem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

