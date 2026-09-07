import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import {
  DiamondMark,
  CheckCircleIcon,
  AlertCircleIcon,
  LogoutIcon,
  CloseIcon,
  ArrowRightIcon,
  UniversityIcon,
  RocketIcon,
  BranchIcon,
  FolderIcon,
  EditIcon,
  PlusIcon,
  CalendarIcon,
  WarningIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleIcon,
  CameraIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { getRecommendedProblems } from "../api/problemService";
import { createUniversityProposal, getUniversityProposals } from "../api/proposalService";
import { getUniversityProfile, updateUniversityProfile } from "../api/universityService";
import apiClient from "../api/apiClient";
import "./UniversityDashboard.css";

// Backend ProblemCategory enum -> a readable label for this dashboard's filter chips.
const BACKEND_CATEGORY_TO_LABEL = {
  ROAD_DAMAGE: "Road Damage",
  GARBAGE: "Garbage",
  STREETLIGHT: "Streetlight",
  WATER_LEAKAGE: "Water Leakage",
  SANITATION: "Sanitation",
  ELECTRICITY_SHORTAGE: "Electricity Shortage",
  AGRICULTURE: "Agriculture",
  HEALTHCARE: "Healthcare",
  OTHER: "Other",
};

const UNIVERSITY_CIVIC_CATEGORIES = ["All", ...Object.values(BACKEND_CATEGORY_TO_LABEL)];

// Backend ProblemStatus enum -> the status text shown on problem cards.
const BACKEND_STATUS_TO_LABEL = {
  OPEN: "Open for Proposals",
  IN_PROGRESS: "Pilot In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Not Accepted",
};

// Backend Severity enum -> Title Case label for display.
const BACKEND_SEVERITY_TO_LABEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// Converts a backend CivicProblemResponseDto (a problem reported by a citizen)
// into the shape this dashboard's existing UI already knows how to render.
function mapProposalToUi(p) {
  return {
    ...p,
    problemId: Number(p.problemId),
    facultyLead: p.mentor || "—",
    grantSanctioned: p.fundingRequired || "Not specified",
    appliedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—",
    municipalReviewScore: "Pending",
    notes: "Persisted proposal awaiting review.",
    statusColor: "#2B6CB0",
  };
}

function mapBackendProblemToUi(bp) {
  return {
    id: bp.id,
    title: bp.title,
    description: bp.description,
    category: BACKEND_CATEGORY_TO_LABEL[bp.category] || bp.category,
    severity: BACKEND_SEVERITY_TO_LABEL[bp.severity] || bp.severity || "Moderate",
    status: BACKEND_STATUS_TO_LABEL[bp.status] || "Open for Proposals",
    address: bp.address,
    city: bp.city,
    ward: [bp.address, bp.city].filter(Boolean).join(" · "),
    authority: "Ward Urban Local Body (ULB) Response Cell",
    reportedBy: bp.reportedByName || "Citizen Ward Representative",
    reportedDate: bp.createdAt
      ? new Date(bp.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    createdAt: bp.createdAt
      ? new Date(bp.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    image: bp.imageUrl ? `${apiClient.defaults.baseURL}${bp.imageUrl}` : null,
    submissionsCount: bp.submissionsCount || 0,
    studentEligible: true,
  };
}

export default function UniversityDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // University Profile State
  // Real, logged-in-user fields (name/email) come from the backend via useAuth().
  const [profile, setProfile] = useState({
    id: user?.id,
    name: user?.name || "",
    email: user?.email || "",
    shortName: "",
    badge: "",
    naacGrade: "",
    nirfRank: "",
    established: "",
    dean: "",
    street: "",
    sector: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    stats: {},
  });

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    shortName: "",
    dean: "",
    naacGrade: "",
    nirfRank: "",
    established: "",
    street: "",
    sector: "",
    city: "",
    state: "",
    pinCode: "",
    expertise: "",
  });

  const handleOpenEditProfile = () => {
    setEditProfileForm({
      shortName: profile.shortName,
      dean: profile.dean,
      naacGrade: profile.naacGrade,
      nirfRank: profile.nirfRank,
      established: profile.established,
      street: profile.street,
      sector: profile.sector,
      city: profile.city,
      state: profile.state,
      pinCode: profile.pinCode,
      expertise: profile.expertise || "",
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUniversityProfile(editProfileForm);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditProfileForm((prev) => ({ ...prev, ...updated }));
      setIsEditProfileOpen(false);
      showToast("✅ Institution profile updated. Problem routing uses your expertise.");
      const data = await getRecommendedProblems();
      setProblems(data.map(mapBackendProblemToUi));
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Could not update university profile.");
    }
  };

  // State Management
  const [activeTab, setActiveTab] = useState("problems"); // problems | submissions | rating
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [problems, setProblems] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [bubbleProblem, setBubbleProblem] = useState(null);

  // Only AI-routed problems matching this university's registered expertise are shown.
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await getRecommendedProblems();
        if (!ignore) setProblems(data.map(mapBackendProblemToUi));
      } catch (err) {
        console.error("Failed to load recommended civic problems", err);
      } finally {
        if (!ignore) setIsLoadingProblems(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Load real university profile and real proposals from the backend.
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [profileData, proposalData] = await Promise.all([
          getUniversityProfile(),
          user?.id ? getUniversityProposals(user.id) : Promise.resolve([]),
        ]);
        if (!ignore) {
          setProfile((prev) => ({ ...prev, ...profileData }));
          setEditProfileForm((prev) => ({ ...prev, ...profileData }));
          setSubmissions(proposalData.map(mapProposalToUi));
        }
      } catch (err) {
        console.error("Failed to load university data", err);
      }
    })();
    return () => { ignore = true; };
  }, [user?.id]);

  // Student Mode State

  // Solution Submission Modal State
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    problemId: "",
    solutionTitle: "",
    mentor: "",
    studentTeam: "",
    pdfFile: null,
    pdfRawFile: null,
  });

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setSubmissionForm((prev) => ({
        ...prev,
        pdfRawFile: file,
        pdfFile: {
          name: file.name,
          size: `${sizeMb > 0 ? sizeMb : "0.5"} MB`,
        },
      }));
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Open submission modal for a specific problem
  const handleOpenSubmissionForProblem = (problem) => {
    setSubmissionForm((prev) => ({
      ...prev,
      problemId: problem.id,
      solutionTitle: `Innovative Solution for ${problem.title.slice(0, 45)}...`,
      mentor: prev.mentor,
      studentTeam: prev.studentTeam,
      pdfFile: prev.pdfFile,
    }));
    setShowSubmissionModal(true);
  };

  // Persist the proposal in the backend so citizens/government/industry can see the same record.
  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!submissionForm.problemId || !submissionForm.solutionTitle.trim()) {
      alert("Please select a problem statement and enter a solution title.");
      return;
    }
    if (!user?.id) {
      showToast("University account ID is missing. Please sign in again.");
      return;
    }

    setIsSubmittingProposal(true);
    try {
      const created = await createUniversityProposal({
        universityId: user.id,
        problemId: submissionForm.problemId,
        solutionTitle: submissionForm.solutionTitle,
        mentor: submissionForm.mentor,
        studentTeam: submissionForm.studentTeam,
        trlLevel: submissionForm.trlLevel || "TRL 5",
        fundingRequired: submissionForm.fundingRequired || "",
        pdfFile: submissionForm.pdfRawFile,
      });
      setSubmissions((prev) => [mapProposalToUi(created), ...prev]);
      setProblems((prev) => prev.map((p) => p.id === Number(submissionForm.problemId) ? { ...p, submissionsCount: (p.submissionsCount || 0) + 1 } : p));
      setShowSubmissionModal(false);
      setActiveTab("submissions");
      showToast(`🎉 Proposal submitted for problem #${submissionForm.problemId}.`);
    } catch (err) {
      console.error("Proposal submission failed", err);
      showToast(err?.response?.data?.message || "Could not submit proposal.");
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Filter Problems by Category
  const filteredProblems = problems.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesCategory;
  });

  const getSeverityBadgeClass = (sev) => {
    switch ((sev || "").toLowerCase()) {
      case "critical":
        return "sx-sev-critical";
      case "high":
        return "sx-sev-high";
      case "medium":
      case "moderate":
        return "sx-sev-moderate";
      case "low":
        return "sx-sev-low";
      default:
        return "sx-sev-moderate";
    }
  };

  return (
    <div className="sx-univ-layout">
      {/* ================= HEADER ================= */}
      <header className="sx-portal-header">
        <div className="sx-wrap sx-portal-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark">
              <DiamondMark />
            </div>
            <span>DigiSahay</span>
            <span className="sx-role-badge sx-badge-univ">
              UNIVERSITY
            </span>
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

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="sx-toast-alert">
          <CheckCircleIcon />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage("")}>
            <CloseIcon />
          </button>
        </div>
      )}

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <div className="sx-wrap sx-univ-body">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="sx-univ-sidebar">
          {/* UNIVERSITY PROFILE CARD — styled like citizen pv2 card */}
          <div className="sx-profile-card sx-profile-card-v2 sx-univ-pv2-card">
            {/* Avatar */}
            <div className="sx-pv2-avatar-wrap">
              <div className="sx-pv2-avatar sx-univ-pv2-avatar">
                <UniversityIcon />
              </div>
            </div>

            {/* Name + badge */}
            <h3 className="sx-pv2-name">{profile.shortName}</h3>
            <span className="sx-pv2-kyc-pill sx-univ-badge-pill">{profile.badge}</span>

            {/* ── Institution details ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Institution Details</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">University ID</span>
                <span className="sx-pv2-value sx-pv2-mono">{profile.id}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Accreditation</span>
                <span className="sx-pv2-value sx-pv2-highlight">{profile.naacGrade}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">NIRF Standing</span>
                <span className="sx-pv2-value sx-pv2-highlight">{profile.nirfRank}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Established</span>
                <span className="sx-pv2-value">{profile.established}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Lead Dean</span>
                <span className="sx-pv2-value">{profile.dean}</span>
              </div>
            </div>

            {/* ── Address Details ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Address Details</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Street</span>
                <span className="sx-pv2-value">{profile.street}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Sector / Area</span>
                <span className="sx-pv2-value">{profile.sector}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">City</span>
                <span className="sx-pv2-value">{profile.city}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">State</span>
                <span className="sx-pv2-value">{profile.state}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">PIN Code</span>
                <span className="sx-pv2-value sx-pv2-mono">{profile.pinCode}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Country</span>
                <span className="sx-pv2-value">{profile.country}</span>
              </div>
            </div>

            {/* ── Research Stats ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Research Stats</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon">📄</span>
                <span className="sx-pv2-report-label">Solutions Submitted</span>
                <span className="sx-pv2-report-val">{submissions.length}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-green">🚀</span>
                <span className="sx-pv2-report-label">Pilots Active</span>
                <span className="sx-pv2-report-val sx-pv2-green">—</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-maroon">🏅</span>
                <span className="sx-pv2-report-label">Patents Filed</span>
                <span className="sx-pv2-report-val sx-pv2-maroon">—</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon">💰</span>
                <span className="sx-pv2-report-label">Total Grants</span>
                <span className="sx-pv2-report-val">—</span>
              </div>
            </div>

            {/* EDIT PROFILE BUTTON BUBBLE */}
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

          {/* ================= ALREADY SUBMITTED PROBLEMS CARD ================= */}
          <div className="sx-submitted-problems-card">
            <div className="sx-submitted-card-top">
              <div>
                <p className="sx-submitted-kicker">INSTITUTIONAL TRACKER</p>
                <h4 className="sx-submitted-title">Already Submitted Problems</h4>
              </div>
              <span className="sx-submitted-count-badge">
                {submissions.length}
              </span>
            </div>

            <div className="sx-pv2-divider" />

            {submissions.length === 0 ? (
              <div className="sx-submitted-empty">
                <span>No solutions submitted yet</span>
              </div>
            ) : (
              <div className="sx-submitted-list">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="sx-submitted-item"
                    onClick={() => {
                      const matchedProb = problems.find((p) => p.id === sub.problemId);
                      if (matchedProb) {
                        setBubbleProblem(matchedProb);
                      } else {
                        setActiveTab("submissions");
                      }
                    }}
                    title="Click to view problem details"
                  >
                    <div className="sx-submitted-item-header">
                      <span className="sx-submitted-prob-id">#{sub.problemId}</span>
                      <span
                        className="sx-submitted-status-pill"
                        style={{
                          color: sub.statusColor || "#1A365D",
                          background: `${sub.statusColor || "#1A365D"}14`,
                          borderColor: `${sub.statusColor || "#1A365D"}35`,
                        }}
                      >
                        ● {sub.status}
                      </span>
                    </div>
                    <h5 className="sx-submitted-item-title">{sub.problemTitle}</h5>
                    <p className="sx-submitted-item-solution">💡 {sub.solutionTitle}</p>
                    <div className="sx-submitted-item-meta">
                      <span>Ref: {sub.id}</span>
                      <span>·</span>
                      <span>{sub.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="sx-btn-view-all-submissions"
              onClick={() => setActiveTab("submissions")}
            >
              <span>View All Proposals ({submissions.length})</span>
              <ArrowRightIcon />
            </button>
          </div>
        </aside>

        {/* ================= MIDDLE / MAIN CONTENT ================= */}
        <main key={activeTab} className="sx-univ-main sx-tab-transition">
          {/* TOP GREETING & PRIMARY ACTION */}
          <div className="sx-univ-greeting-hero">
            <div>
              
              <h1 className="sx-univ-welcome-title">Welcome, {profile.name || "University Partner"} 🏛️</h1>
              <p className="sx-univ-welcome-sub">Discover AI-routed civic challenges matched to your registered university expertise.</p>
            </div>
          </div>

          {activeTab === "problems" && (
            <div className="sx-rating-widget-card sx-rating-inline" onClick={() => setActiveTab("rating")}>
              <div className="sx-rating-widget-header"><div><p className="sx-widget-kicker">LIVE UNIVERSITY ACTIVITY</p><div className="sx-rating-stars-flex"><span className="sx-rating-big-score">{submissions.length}</span><span className="sx-rating-max">proposals</span></div></div><span className="sx-rating-pill-tier">LIVE DATA</span></div>
              <p className="sx-rating-subtext">{problems.length} civic problems currently routed to this university.</p>
            </div>
          )}

          {/* ================= TAB 1: BROWSE PROBLEMS ================= */}
          {activeTab === "problems" && (
            <div className="sx-problems-view">
              {/* CATEGORY FILTER BAR */}
              <div className="sx-problem-filter-bar">
                <div className="sx-category-filter-group">
                  <span className="sx-filter-label">Category:</span>
                  {UNIVERSITY_CIVIC_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`sx-severity-filter-chip sx-cat-chip ${categoryFilter.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* PROBLEMS GRID */}
              <div className="sx-problem-cards-grid">
                {isLoadingProblems ? (
                  <div className="sx-empty-state-card">
                    <p className="sx-empty-title">Loading civic problems…</p>
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="sx-empty-state-card">
                    <p className="sx-empty-title">No problem statements found in this category.</p>
                    <p className="sx-empty-sub">Try selecting another category or "All" to view available problems.</p>
                    <button
                      type="button"
                      className="sx-btn-reset-filter"
                      onClick={() => setCategoryFilter("All")}
                    >
                      Reset to All Categories
                    </button>
                  </div>
                ) : (
                  filteredProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="sx-civic-problem-card sx-problem-card-clickable"
                      onClick={() => setBubbleProblem(prob)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setBubbleProblem(prob);
                        }
                      }}
                      title="Click to view detailed problem description bubble"
                    >
                      {/* Top row: Problem ID in left top, Severity tag in right top */}
                      <div className="sx-prob-card-header">
                        <span className="sx-prob-id-tag">#{prob.id}</span>
                        <span className={`sx-severity-badge ${getSeverityBadgeClass(prob.severity)}`}>
                          <WarningIcon />
                          <span>{prob.severity} Severity</span>
                        </span>
                      </div>

                      {/* Problem title as large heading */}
                      <h3 className="sx-prob-title">{prob.title}</h3>

                      {/* Description paragraph in muted gray text */}
                      <p className="sx-prob-desc">{prob.description}</p>

                      {/* Single small pill showing 'X proposals received' */}
                      <div className="sx-prob-meta-pill-wrap">
                        <span className="sx-prob-proposals-pill">
                          {prob.submissionsCount} proposals received
                        </span>
                      </div>

                      {/* Horizontal divider line */}
                      <div className="sx-prob-divider" />

                      {/* Bottom footer: Reported date, address, and Submit Proposal button shifted below address */}
                      <div className="sx-prob-card-footer">
                        <div className="sx-prob-meta-item">
                          <CalendarIcon />
                          <span>Reported {prob.reportedDate || "recently"}</span>
                        </div>
                        <div className="sx-prob-meta-item">
                          <MapPinIcon />
                          <span>{prob.ward} · {prob.authority}</span>
                        </div>

                        <div className="sx-prob-actions-wrap">
                          <button
                            type="button"
                            className="sx-btn-submit-proposal"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSubmissionForProblem(prob);
                            }}
                          >
                            <span>Submit Proposal</span>
                            <ArrowRightIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: SUBMITTED SOLUTIONS ================= */}
          {activeTab === "submissions" && (
            <div className="sx-submissions-view">
              <div className="sx-tab-intro-card">
                <div>
                  <h2 className="sx-tab-title">University Solution Track & Deployments</h2>
                  <p className="sx-tab-sub">
                    Track the lifecycle of proposals submitted by faculty labs and student researchers to urban local bodies.
                  </p>
                </div>
                <button
                  type="button"
                  className="sx-btn-submit-solution"
                  onClick={() => setShowSubmissionModal(true)}
                >
                  + New Proposal Submission
                </button>
              </div>

              <div className="sx-submissions-list">
                {submissions.map((sub) => (
                  <div key={sub.id} className="sx-submission-card">
                    <div className="sx-sub-header">
                      <div>
                        <span className="sx-sub-id">{sub.id}</span>
                        <span className="sx-sub-prob-ref">Ref: {sub.problemId}</span>
                      </div>
                      <span
                        className="sx-sub-status-pill"
                        style={{
                          background: `${sub.statusColor}15`,
                          color: sub.statusColor,
                          borderColor: `${sub.statusColor}40`,
                        }}
                      >
                        ● {sub.status}
                      </span>
                    </div>

                    <h3 className="sx-sub-title">{sub.solutionTitle}</h3>
                    <p className="sx-sub-prob-title">Target Problem: {sub.problemTitle}</p>

                    <div className="sx-sub-details-grid">
                      <div className="sx-sub-detail-col">
                        <span className="sx-sub-label">Faculty Principal Investigator</span>
                        <span className="sx-sub-val">{sub.facultyLead}</span>
                      </div>
                      <div className="sx-sub-detail-col">
                        <span className="sx-sub-label">Student Co-Investigators</span>
                        <span className="sx-sub-val">{sub.studentTeam}</span>
                      </div>
                      <div className="sx-sub-detail-col">
                        <span className="sx-sub-label">TRL Readiness</span>
                        <span className="sx-sub-val">{sub.trlLevel}</span>
                      </div>
                      <div className="sx-sub-detail-col">
                        <span className="sx-sub-label">Sanctioned / Requested Grant</span>
                        <span className="sx-sub-val sx-grant-highlight">{sub.grantSanctioned}</span>
                      </div>
                    </div>

                    <div className="sx-sub-notes-box">
                      <strong>Reviewer Status & Telemetry:</strong> {sub.notes}
                    </div>

                    <div className="sx-sub-footer">
                      <span>Submitted on {sub.appliedDate}</span>
                      <span>Municipal Review Score: <strong>{sub.municipalReviewScore}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= LIVE UNIVERSITY METRICS ================= */}
          {activeTab === "rating" && (
            <div className="sx-rating-view">
              <div className="sx-rating-nav-bar">
                <button type="button" className="sx-btn-back-problems" onClick={() => setActiveTab("problems")}>← Back to Problem Statements</button>
              </div>
              <div className="sx-rd-accred-card">
                <div className="sx-rd-accred-top">
                  <div>
                    <p className="sx-rd-kicker">LIVE UNIVERSITY PERFORMANCE</p>
                    <h2 className="sx-rd-title">Real Proposal Activity</h2>
                    <p className="sx-rd-desc">These metrics are calculated from records currently stored in DigiSahay.</p>
                  </div>
                  <div className="sx-rd-score-wrap">
                    <span className="sx-rd-score">{submissions.length}</span>
                    <span className="sx-rd-score-sub">proposals</span>
                  </div>
                </div>
              </div>
              <div className="sx-rd-badges-card">
                <h3 className="sx-rd-badges-title">Live Metrics</h3>
                <div className="sx-rd-badges-grid">
                  <div className="sx-rd-badge-item"><div className="sx-rd-badge-icon">📨</div><div><h4 className="sx-rd-badge-name">Submitted</h4><p className="sx-rd-badge-desc">{submissions.length} persisted proposals</p></div></div>
                  <div className="sx-rd-badge-item"><div className="sx-rd-badge-icon">🧩</div><div><h4 className="sx-rd-badge-name">Matched Problems</h4><p className="sx-rd-badge-desc">{problems.length} AI-routed problems available to this university</p></div></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* ================= MODAL: EDIT UNIVERSITY PROFILE ================= */}
      {isEditProfileOpen && typeof document !== "undefined" && createPortal(
        <div className="sx-modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div
            className="sx-modal-content sx-edit-profile-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-modal-title"
          >
            <div className="sx-modal-header">
              <div>
                <p className="sx-kicker">INSTITUTION PROFILE SETTINGS</p>
                <h2 id="edit-profile-modal-title" className="sx-modal-title">
                  Edit University Profile &amp; Address
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
              <div className="sx-modal-section-label">Institution Information</div>
              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>University Short Name *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.shortName}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, shortName: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field">
                  <span>Lead Dean / Director *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.dean}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, dean: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>NAAC Accreditation *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.naacGrade}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, naacGrade: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field">
                  <span>NIRF Standing *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.nirfRank}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, nirfRank: e.target.value })
                    }
                  />
                </label>
                <label className="sx-modal-field" style={{ maxWidth: "120px" }}>
                  <span>Established *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.established}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, established: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="sx-modal-section-label" style={{ marginTop: "14px" }}>
                Campus Address Details
              </div>

              <div className="sx-modal-row">
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
                <label className="sx-modal-field">
                  <span>Sector / Campus Area *</span>
                  <input
                    type="text"
                    required
                    value={editProfileForm.sector}
                    onChange={(e) =>
                      setEditProfileForm({ ...editProfileForm, sector: e.target.value })
                    }
                  />
                </label>
              </div>

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
                <label className="sx-modal-field">
                  <span>Expertise Categories *</span>
                  <input type="text" required value={editProfileForm.expertise || ""} onChange={(e) => setEditProfileForm({ ...editProfileForm, expertise: e.target.value })} placeholder="e.g. ROAD_DAMAGE,WATER_LEAKAGE,HEALTHCARE" />
                  <small>Use backend category codes, comma-separated. Only matching civic problems will be routed here.</small>
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
                <button type="submit" className="sx-btn-modal-submit">
                  <CheckCircleIcon />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ================= BUBBLE: SUBMIT PROPOSAL ================= */}
      {showSubmissionModal && typeof document !== "undefined" && createPortal(
        <div className="sx-bubble-overlay" onClick={() => setShowSubmissionModal(false)}>
          <div
            className="sx-detail-bubble-dialog sx-submit-proposal-bubble"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-bubble-title"
          >
            {/* Speech bubble notch */}
            <div className="sx-bubble-dialog-notch" aria-hidden="true" />

            <div className="sx-bubble-dialog-header">
              <div className="sx-bubble-dialog-tags">
                <span className="sx-prob-id-tag">
                  {submissionForm.problemId ? `#${submissionForm.problemId}` : "SELECT PROBLEM"}
                </span>
                <span className="sx-bubble-status-pill">
                  <span className="sx-status-dot" />
                  R&D Proposal Form
                </span>
              </div>
              <button
                type="button"
                className="sx-bubble-dialog-close"
                onClick={() => setShowSubmissionModal(false)}
                aria-label="Close submit proposal bubble"
              >
                <CloseIcon />
              </button>
            </div>

            <h2 id="proposal-bubble-title" className="sx-bubble-dialog-title">
              Submit Solution Proposal
            </h2>

            {/* Speech bubble container with instructions */}
            <div className="sx-speech-bubble-container">
              <div className="sx-speech-bubble-kicker">
                <ChatBubbleIcon />
                <span>INNOVATION & CIVIC R&D PROPOSAL</span>
              </div>
              <p className="sx-speech-bubble-text">
                Submit your institution's innovative solution, mentor credentials, student team, and comprehensive technical PDF proposal to the municipal review board.
              </p>
            </div>

            <form onSubmit={handleSubmitSolution} className="sx-proposal-bubble-form">
              {/* 1. Problem ID */}
              <div className="sx-bubble-field">
                <label className="sx-bubble-label">Problem ID *</label>
                <select
                  className="sx-bubble-input sx-bubble-select"
                  value={submissionForm.problemId}
                  onChange={(e) => {
                    const sel = problems.find((p) => p.id === e.target.value);
                    setSubmissionForm({
                      ...submissionForm,
                      problemId: e.target.value,
                      solutionTitle: sel ? `Innovative Solution for ${sel.title.slice(0, 40)}...` : submissionForm.solutionTitle,
                    });
                  }}
                  required
                >
                  <option value="">Select target problem ID...</option>
                  {problems.map((prob) => (
                    <option key={prob.id} value={prob.id}>
                      #{prob.id} · {prob.title} ({prob.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Title of Solution */}
              <div className="sx-bubble-field">
                <label className="sx-bubble-label">Title of Solution *</label>
                <input
                  type="text"
                  className="sx-bubble-input"
                  placeholder="e.g. Ultra-Acoustic Multi-Spectral Contaminant Localization Array"
                  value={submissionForm.solutionTitle}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, solutionTitle: e.target.value })}
                  required
                />
              </div>

              {/* 3. Mentor */}
              <div className="sx-bubble-field">
                <label className="sx-bubble-label">Mentor (Faculty Guide / PI) *</label>
                <input
                  type="text"
                  className="sx-bubble-input"
                  placeholder="e.g. Dr. Savita Ramanathan (Dept. of Instrumentation)"
                  value={submissionForm.mentor}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, mentor: e.target.value })}
                  required
                />
              </div>

              {/* 4. Students in the team */}
              <div className="sx-bubble-field">
                <label className="sx-bubble-label">Students in the Team *</label>
                <input
                  type="text"
                  className="sx-bubble-input"
                  placeholder="e.g. Rohan Verma (CS-084), Priya Sen (EC-012)"
                  value={submissionForm.studentTeam}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, studentTeam: e.target.value })}
                  required
                />
              </div>

              {/* 5. PDF File of Detailed Solution */}
              <div className="sx-bubble-field">
                <label className="sx-bubble-label">PDF File of Detailed Solution *</label>
                <div className="sx-pdf-bubble-upload">
                  {submissionForm.pdfFile ? (
                    <div className="sx-pdf-attached-card">
                      <div className="sx-pdf-card-left">
                        <span className="sx-pdf-doc-icon">📑</span>
                        <div className="sx-pdf-file-details">
                          <span className="sx-pdf-filename">{submissionForm.pdfFile.name}</span>
                          <span className="sx-pdf-filesize">{submissionForm.pdfFile.size} · PDF Attached</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="sx-pdf-remove-btn"
                        onClick={() => setSubmissionForm({ ...submissionForm, pdfFile: null })}
                        title="Remove attached PDF"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ) : (
                    <label className="sx-pdf-dropzone-box">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="sx-pdf-file-input"
                        onChange={handlePdfUpload}
                      />
                      <div className="sx-pdf-dropzone-content">
                        <div className="sx-pdf-icon-circle">📄</div>
                        <span className="sx-pdf-upload-title">Upload Detailed Solution PDF</span>
                        <span className="sx-pdf-upload-sub">Click to browse or drag & drop document (PDF format, up to 25 MB)</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Bubble Footer */}
              <div className="sx-bubble-dialog-footer">
                <button
                  type="button"
                  className="sx-btn-modal-cancel"
                  onClick={() => setShowSubmissionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sx-btn-submit-proposal"
                >
                  <span>Submit Proposal</span>
                  <ArrowRightIcon />
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ================= BUBBLE: CIVIC PROBLEM DETAILS ================= */}
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
                <span className="sx-prob-id-tag">#{bubbleProblem.id}</span>
                <span className="sx-prob-category-tag">{bubbleProblem.category}</span>
                <span className={`sx-severity-badge ${getSeverityBadgeClass(bubbleProblem.severity)}`}>
                  <WarningIcon />
                  <span>{bubbleProblem.severity} Severity</span>
                </span>
                <span className="sx-bubble-status-pill">
                  <span className="sx-status-dot" />
                  {bubbleProblem.status || "Open for Proposals"}
                </span>
              </div>
              <button
                type="button"
                className="sx-bubble-dialog-close"
                onClick={() => setBubbleProblem(null)}
                aria-label="Close problem details bubble"
              >
                <CloseIcon />
              </button>
            </div>

            <h2 id="bubble-dialog-title" className="sx-bubble-dialog-title">
              {bubbleProblem.title}
            </h2>

            {/* Problem Details Meta Table */}
            <div className="sx-bubble-meta-table">
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Category:</span>
                <span className="sx-bubble-meta-val">{bubbleProblem.category}</span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Status:</span>
                <span className="sx-bubble-meta-val sx-status-highlight">{bubbleProblem.status || "Open for Proposals"}</span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Address:</span>
                <span className="sx-bubble-meta-val">
                  <MapPinIcon /> {bubbleProblem.address || bubbleProblem.ward}
                </span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">City:</span>
                <span className="sx-bubble-meta-val">🏙️ {bubbleProblem.city || "—"}</span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Reported by:</span>
                <span className="sx-bubble-meta-val">👤 {bubbleProblem.reportedBy || "Citizen Ward Representative"}</span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Created at:</span>
                <span className="sx-bubble-meta-val">
                  <CalendarIcon /> {bubbleProblem.createdAt || bubbleProblem.reportedDate || "—"}
                </span>
              </div>
            </div>

            {/* Speech bubble container showing detailed description */}
            <div className="sx-speech-bubble-container">
              <div className="sx-speech-bubble-kicker">
                <ChatBubbleIcon />
                <span>DETAILED PROBLEM DESCRIPTION</span>
              </div>
              <p className="sx-speech-bubble-text">{bubbleProblem.description}</p>
            </div>

            {/* PROBLEM SITE PHOTO / IMAGE */}
            <div className="sx-bubble-photo-container">
              <div className="sx-bubble-photo-header">
                <CameraIcon />
                <span>PROBLEM SITE PHOTO / EVIDENCE</span>
              </div>
              <div className="sx-bubble-photo-frame-wrap">
                {bubbleProblem.image || bubbleProblem.photo ? (
                  <img
                    src={bubbleProblem.image || bubbleProblem.photo}
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

            {/* Bubble Footer */}
            <div className="sx-bubble-dialog-footer">
              <button
                type="button"
                className="sx-btn-modal-cancel"
                onClick={() => setBubbleProblem(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="sx-btn-submit-proposal"
                onClick={() => {
                  handleOpenSubmissionForProblem(bubbleProblem);
                  setBubbleProblem(null);
                }}
              >
                <span>Submit Proposal</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
