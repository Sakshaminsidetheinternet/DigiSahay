import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import {
  DiamondMark,
  IndustryIcon,
  LogoutIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MapPinIcon,
  CalendarIcon,
  TrendingUpIcon,
  CloseIcon,
  EditIcon,
  WarningIcon,
  ChatBubbleIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { getAllProblems } from "../api/problemService";
import { getAllProposals } from "../api/proposalService";
import { getIndustryProfile, updateIndustryProfile } from "../api/industryService";

import "./IndustryDashboard.css";

export default function IndustryDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    id: user?.id, name: user?.name || "", email: user?.email || "", companyName: user?.name || "", shortName: "",
    sector: "", nodalOfficer: "", designation: "", cin: "", established: "", street: "", sectorArea: "", city: "", state: "", pinCode: "",
    partnershipScore: 0, stats: {},
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    companyName: "", shortName: "", sector: "", nodalOfficer: "", designation: "", cin: "", established: "", street: "", sectorArea: "", city: "", state: "", pinCode: "",
  });

  const [activeTab, setActiveTab] = useState("opportunities");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [toast, setToast] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleOpenEditProfile = () => {
    setEditProfileForm({ ...profile });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateIndustryProfile(editProfileForm);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditProfileForm((prev) => ({ ...prev, ...updated }));
      setIsEditProfileOpen(false);
      showToast("Organization profile updated.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Could not update organization profile.");
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [profileData, problemData, proposalData] = await Promise.all([
          getIndustryProfile(), getAllProblems(), getAllProposals(),
        ]);
        if (!ignore) {
          setProfile((prev) => ({ ...prev, ...profileData }));
          setEditProfileForm((prev) => ({ ...prev, ...profileData }));
          setOpportunities(problemData.map((p) => ({
            ...p,
            location: [p.address, p.city].filter(Boolean).join(" · "),
            authority: "DigiSahay Civic Problem Ledger",
            scale: "Community scale", duration: "To be determined", procurement: "—",
            tags: [p.category || "OTHER"],
            severity: p.severity || "MEDIUM", solutionsSubmitted: p.submissionsCount || 0,
            reportedOn: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "",
          })));
          setProposals(proposalData);
        }
      } catch (err) {
        console.error("Failed to load industry data", err);
      } finally { if (!ignore) setIsLoadingData(false); }
    })();
    return () => { ignore = true; };
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.authority.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search));

      const matchesSeverity =
        severityFilter === "All" ||
        item.severity.toLowerCase() === severityFilter.toLowerCase();

      return matchesSearch && matchesSeverity;
    });
  }, [opportunities, searchQuery, severityFilter]);

  const handleProposal = (opportunity) => {
    setSelectedOpportunity(null);
    showToast(
      `Proposal started for "${opportunity.title}". Complete the commercial proposal to submit.`
    );
  };

  return (
    <div className="sx-industry-layout">
      {/* HEADER */}
      <header className="sx-portal-header">
        <div className="sx-wrap sx-portal-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark">
              <DiamondMark />
            </div>

            <span>DigiSahay</span>

            <span className="sx-role-badge sx-badge-industry">
              INDUSTRY PARTNER
            </span>
          </Link>

          <div className="sx-header-right-actions">
            <LanguageToggle />
            <button
              className="sx-portal-back sx-signout-btn"
              onClick={handleSignOut}
            >
              <LogoutIcon />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className="sx-industry-toast">
          <CheckCircleIcon />
          <span>{toast}</span>

          <button onClick={() => setToast("")}>
            <CloseIcon />
          </button>
        </div>
      )}

      <main className="sx-wrap sx-industry-body">
        {/* SIDEBAR — ONLY THE INDUSTRY ORG CARD */}
        <aside className="sx-industry-sidebar">
          <div className="sx-profile-card sx-profile-card-v2 sx-industry-pv2-card">
            {/* Avatar */}
            <div className="sx-pv2-avatar-wrap">
              <div className="sx-pv2-avatar sx-industry-pv2-avatar">
                <IndustryIcon />
              </div>
            </div>

            {/* Name + badge */}
            <h3 className="sx-pv2-name">{profile.shortName}</h3>
            <span className="sx-pv2-kyc-pill sx-industry-badge-pill">{profile.badge}</span>

            {/* ── Organization details ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">Organization Details</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Industry ID</span>
                <span className="sx-pv2-value sx-pv2-mono">{profile.industryId}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Sector</span>
                <span className="sx-pv2-value sx-pv2-highlight">{profile.sector}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">CIN</span>
                <span className="sx-pv2-value sx-pv2-mono">{profile.cin}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Established</span>
                <span className="sx-pv2-value">{profile.established}</span>
              </div>
              <div className="sx-pv2-row">
                <span className="sx-pv2-label">Nodal Officer</span>
                <span className="sx-pv2-value">{profile.nodalOfficer}</span>
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
                <span className="sx-pv2-value">{profile.sectorArea}</span>
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

            {/* ── CSR & Deployment Stats ── */}
            <div className="sx-pv2-section">
              <p className="sx-pv2-section-title">CSR & Deployment Stats</p>
              <div className="sx-pv2-divider" />
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-green">🚀</span>
                <span className="sx-pv2-report-label" title="Pilots currently running in the field">Active Deployments</span>
                <span className="sx-pv2-report-val sx-pv2-green">{profile.stats?.activeDeployments || "0"}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon">📑</span>
                <span className="sx-pv2-report-label" title="Total solutions/bids the company has put forward">Proposals Submitted</span>
                <span className="sx-pv2-report-val">{profile.stats?.proposalsSubmitted || String(proposals.length)}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon sx-pv2-maroon">🎯</span>
                <span className="sx-pv2-report-label" title="Proposals accepted ÷ proposals submitted (credibility signal)">Win Rate / Acceptance Rate</span>
                <span className="sx-pv2-report-val sx-pv2-maroon">{profile.stats?.winRate || "—"}</span>
              </div>
              <div className="sx-pv2-row sx-pv2-report-row">
                <span className="sx-pv2-report-icon">💰</span>
                <span className="sx-pv2-report-label" title="Cumulative ₹ awarded across projects">Total Grant Value Secured</span>
                <span className="sx-pv2-report-val sx-grant-highlight">{profile.stats?.totalGrantSecured || "—"}</span>
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

        {/* MAIN CONTENT */}
        <section className="sx-industry-content">
          <div className="sx-industry-heading">
            <div>
              <h1>
                Welcome back,{" "}
                <span>{profile.shortName}</span>
              </h1>

              <p>
                Discover civic opportunities, submit commercial
                solutions, and scale technologies that create measurable
                public impact.
              </p>
            </div>
          </div>

          {/* ================= INDUSTRY PARTNERSHIP RATING CARD ================= */}
          <div className="sx-rating-widget-card sx-industry-rating-card">
            <div className="sx-rating-widget-header">
              <div>
                <p className="sx-widget-kicker">NATIONAL CIVIC INDUSTRY ACCREDITATION &amp; RATING</p>
                <div className="sx-rating-stars-flex">
                  <span className="sx-rating-big-score">{profile.partnershipScore || 0}</span>
                  <span className="sx-rating-max">/ 100</span>
                  <span className="sx-star-badge">★★★★★</span>
                </div>
              </div>
              <span className="sx-rating-pill-tier">Tier-1 Prime Partner</span>
            </div>

            <p className="sx-rating-subtext">
              Official Urban Civic Partnership Standing. Validated for municipal procurement fast-tracking, government pilot deployments, and smart city commercial integrations.
            </p>

            <div className="sx-rating-mini-meter">
              <div
                className="sx-rating-mini-fill"
                style={{ width: `${profile.partnershipScore || 0}%` }}
              />
            </div>

            <div className="sx-industry-rating-metrics">
              <div className="sx-ind-rating-item">
                <span className="sx-ind-m-label">Procurement Clearance</span>
                <span className="sx-ind-m-val sx-green">Grade A+ Fast-Track</span>
              </div>
              <div className="sx-ind-rating-item">
                <span className="sx-ind-m-label">Municipal Trust Index</span>
                <span className="sx-ind-m-val">96.4%</span>
              </div>
              <div className="sx-ind-rating-item">
                <span className="sx-ind-m-label">Quarterly Trajectory</span>
                <span className="sx-ind-m-val sx-green">
                  <TrendingUpIcon /> +4 pts growth
                </span>
              </div>
              <div className="sx-ind-rating-item">
                <span className="sx-ind-m-label">Field Reliability SLA</span>
                <span className="sx-ind-m-val">99.1%</span>
              </div>
            </div>

            <div className="sx-rating-widget-footer">
              <span className="sx-accred-id">Accreditation ID: IND-ACCR-2026-88</span>
              <div className="sx-rating-footer-tabs">
                <button
                  type="button"
                  className={`sx-rating-tab-link ${activeTab === "opportunities" ? "active" : ""}`}
                  onClick={() => setActiveTab("opportunities")}
                >
                  Opportunities (12)
                </button>
                <button
                  type="button"
                  className={`sx-rating-tab-link ${activeTab === "proposals" ? "active" : ""}`}
                  onClick={() => setActiveTab("proposals")}
                >
                  Proposals (5)
                </button>
                <button
                  type="button"
                  className={`sx-rating-tab-link ${activeTab === "pilots" ? "active" : ""}`}
                  onClick={() => setActiveTab("pilots")}
                >
                  Pilots (3)
                </button>
                <button
                  type="button"
                  className={`sx-rating-tab-link ${activeTab === "contracts" ? "active" : ""}`}
                  onClick={() => setActiveTab("contracts")}
                >
                  Contracts (2)
                </button>
                <button
                  type="button"
                  className={`sx-rating-tab-link ${activeTab === "analytics" ? "active" : ""}`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* OPPORTUNITIES */}
          {activeTab === "opportunities" && (
            <section>
              <div className="sx-section-heading">
                <div>
                  <h2>Open Civic Opportunities</h2>
                  <p>
                    Government-vetted challenges available for
                    commercial solutions.
                  </p>
                </div>
              </div>

              <div className="sx-industry-toolbar">
                <div className="sx-toolbar-meta">
                  <span className="sx-toolbar-count">
                    Showing <strong>{filteredOpportunities.length}</strong> Active Opportunities
                  </span>
                </div>

                <div className="sx-toolbar-filter-wrap">
                  <label htmlFor="priority-filter" className="sx-filter-inline-label">Priority:</label>
                  <select
                    id="priority-filter"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="sx-industry-severity-select"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Moderate">Moderate Priority</option>
                  </select>
                </div>
              </div>

              <div className="sx-opportunity-list">
                {filteredOpportunities.map((item) => (
                  <article
                    className="sx-problem-card sx-problem-card-clickable sx-opportunity-card"
                    key={item.id}
                    onClick={() => setSelectedOpportunity(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedOpportunity(item);
                      }
                    }}
                    title="Click to view opportunity details"
                  >
                    <div className="sx-problem-top">
                      <span className="sx-problem-id">#{item.id}</span>

                      <span className={`sx-severity-badge sx-sev-${item.severity.toLowerCase()}`}>
                        <WarningIcon />
                        <span>{item.severity} Severity</span>
                      </span>
                    </div>

                    <h3 className="sx-problem-title">{item.title}</h3>

                    <p className="sx-problem-desc">
                      {item.authority} — Civic challenge for {item.scale} with a {item.duration} pilot deployment.
                    </p>

                    <div className="sx-opportunity-meta-pill-wrap">
                      <span className="sx-opportunity-proposals-pill">
                        {item.solutionsSubmitted ?? 0} solutions submitted
                      </span>
                    </div>

                    <div className="sx-problem-footer">
                      <div className="sx-opportunity-meta-item">
                        <MapPinIcon />
                        <span>{item.location} · {item.procurement}</span>
                      </div>
                      <div className="sx-opportunity-meta-item">
                        <CalendarIcon />
                        <span>Reported on {item.reportedOn || "—"}</span>
                      </div>

                      <div className="sx-opportunity-actions-wrap">
                        <button
                          type="button"
                          className="sx-btn-view-opportunity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOpportunity(item);
                          }}
                        >
                          <span>View Opportunity</span>
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* PROPOSALS */}
          {activeTab === "proposals" && (
            <section>
              <div className="sx-section-heading">
                <div>
                  <h2>University Proposals</h2>
                  <p>
                    View solution proposals submitted by universities for civic problems.
                  </p>
                </div>
              </div>

              <div className="sx-proposal-list">
                {proposals.map((proposal) => (
                  <article
                    className="sx-proposal-card"
                    key={proposal.id}
                  >
                    <div>
                      <span className="sx-opportunity-id">
                        {proposal.id}
                      </span>

                      <h3>{proposal.solutionTitle}</h3>

                      <p>Problem #{proposal.problemId} · University #{proposal.universityId}</p>
                    </div>

                    <div className="sx-proposal-value">
                      <span>PROPOSAL VALUE</span>
                      <strong>{proposal.fundingRequired || "Not specified"}</strong>
                    </div>

                    <div className="sx-proposal-status">
                      <span>{proposal.status}</span>
                      <small>
                        Submitted {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString("en-IN") : ""}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* PILOTS */}
          {activeTab === "pilots" && (
            <section>
              <div className="sx-section-heading">
                <div>
                  <h2>Active Pilots</h2>
                  <p>
                    Monitor field deployments and civic outcomes.
                  </p>
                </div>
              </div>

              <div className="sx-pilot-list">
                {[].map((pilot) => (
                  <article
                    className="sx-pilot-card"
                    key={pilot.title}
                  >
                    <div className="sx-pilot-heading">
                      <div>
                        <h3>{pilot.title}</h3>
                        <p>
                          {pilot.authority} · {pilot.location}
                        </p>
                      </div>

                      <strong>{pilot.progress}%</strong>
                    </div>

                    <div className="sx-progress">
                      <div
                        style={{
                          width: `${pilot.progress}%`,
                        }}
                      />
                    </div>

                    <div className="sx-pilot-metrics">
                      <div>
                        <span>DEPLOYMENT</span>
                        <strong>{pilot.sensors}</strong>
                      </div>

                      <div>
                        <span>ISSUES DETECTED</span>
                        <strong>{pilot.detected}</strong>
                      </div>

                      <div>
                        <span>WATER SAVED</span>
                        <strong>{pilot.waterSaved}</strong>
                      </div>

                      <div>
                        <span>SYSTEM UPTIME</span>
                        <strong>{pilot.uptime}</strong>
                      </div>

                      <div>
                        <span>COMPLAINT REDUCTION</span>
                        <strong>{pilot.complaints}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* CONTRACTS */}
          {activeTab === "contracts" && (
            <section>
              <div className="sx-section-heading">
                <div>
                  <h2>Contracts & Procurement</h2>
                  <p>
                    Track government procurement and deployment
                    milestones.
                  </p>
                </div>
              </div>

              <div className="sx-contract-list">
                {[].map((contract) => (
                  <article
                    className="sx-contract-card"
                    key={contract.id}
                  >
                    <div>
                      <span className="sx-opportunity-id">
                        {contract.id}
                      </span>

                      <h3>{contract.title}</h3>

                      <p>{contract.authority}</p>
                    </div>

                    <div>
                      <span>CONTRACT VALUE</span>
                      <strong>{contract.value}</strong>
                    </div>

                    <div>
                      <span>START DATE</span>
                      <strong>{contract.startDate}</strong>
                    </div>

                    <div className="sx-contract-stage">
                      <span>{contract.stage}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <section>
              <div className="sx-section-heading">
                <div>
                  <h2>Impact & Analytics</h2>
                  <p>
                    Measure the public value created through your
                    deployments.
                  </p>
                </div>
              </div>

              <div className="sx-impact-grid">
                <div>
                  <span>PROJECTS DEPLOYED</span>
                  <strong>27</strong>
                  <small>Across 8 municipalities</small>
                </div>

                <div>
                  <span>CITIZENS IMPACTED</span>
                  <strong>3.8M</strong>
                  <small>Estimated direct impact</small>
                </div>

                <div>
                  <span>AVERAGE ISSUE REDUCTION</span>
                  <strong>27%</strong>
                  <small>Across completed pilots</small>
                </div>

                <div>
                  <span>DEPLOYMENT SUCCESS</span>
                  <strong>94.6%</strong>
                  <small>Successful field deployments</small>
                </div>
              </div>

              <div className="sx-analytics-panel">
                <TrendingUpIcon />

                <div>
                  <h3>Partnership performance is trending upward</h3>
                  <p>
                    Your civic technology deployments have generated
                    measurable improvements across water, energy and
                    waste-management programs.
                  </p>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* ================= BUBBLE: CIVIC OPPORTUNITY / PROBLEM DETAILS ================= */}
      {selectedOpportunity && typeof document !== "undefined" && createPortal(
        <div className="sx-bubble-overlay" onClick={() => setSelectedOpportunity(null)}>
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
                <span className="sx-prob-id-tag">#{selectedOpportunity.id}</span>
                {selectedOpportunity.tags && selectedOpportunity.tags.map((tag) => (
                  <span key={tag} className="sx-prob-category-tag">{tag}</span>
                ))}
                <span className={`sx-severity-badge sx-sev-${selectedOpportunity.severity?.toLowerCase()}`}>
                  <WarningIcon />
                  <span>{selectedOpportunity.severity} Severity</span>
                </span>
                <span className="sx-bubble-status-pill">
                  <span className="sx-status-dot" />
                  {selectedOpportunity.procurement || "Active Tender"}
                </span>
              </div>
              <button
                type="button"
                className="sx-bubble-dialog-close"
                onClick={() => setSelectedOpportunity(null)}
                aria-label="Close opportunity details bubble"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Title */}
            <h2 id="bubble-dialog-title" className="sx-bubble-dialog-title">
              {selectedOpportunity.title}
            </h2>

            {/* Problem Details Meta Table */}
            <div className="sx-bubble-meta-table">
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Reported by:</span>
                <span className="sx-bubble-meta-val">
                  👤 {selectedOpportunity.reportedBy || selectedOpportunity.authority}
                </span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Reported at:</span>
                <span className="sx-bubble-meta-val">
                  <MapPinIcon /> {selectedOpportunity.reportedAt || selectedOpportunity.location}
                </span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Reported on:</span>
                <span className="sx-bubble-meta-val">
                  <CalendarIcon /> {selectedOpportunity.reportedOn || "04 Sep 2026"}
                </span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Authority:</span>
                <span className="sx-bubble-meta-val">
                  🏛️ {selectedOpportunity.authority}
                </span>
              </div>
              <div className="sx-bubble-meta-row">
                <span className="sx-bubble-meta-lbl">Procurement & Scale:</span>
                <span className="sx-bubble-meta-val sx-status-highlight">
                  {selectedOpportunity.procurement} · {selectedOpportunity.scale}
                </span>
              </div>
            </div>

            {/* Speech bubble container showing detailed description */}
            <div className="sx-speech-bubble-container">
              <div className="sx-speech-bubble-kicker">
                <ChatBubbleIcon />
                <span>Civic Problem & Challenge Description</span>
              </div>
              <p className="sx-speech-bubble-text">{selectedOpportunity.description}</p>
            </div>

            {/* University Solutions Section */}
            <div className="sx-bubble-univ-solutions-section">
              <div className="sx-univ-solutions-header">
                <div className="sx-univ-solutions-title-group">
                  <span className="sx-univ-solutions-kicker">ACADEMIC & RESEARCH PROPOSALS</span>
                  <h3 className="sx-univ-solutions-heading">
                    Solutions Submitted by Universities ({selectedOpportunity.universitySolutions?.length || 0})
                  </h3>
                  <p className="sx-univ-solutions-subtext">
                    Vetted technical solutions and prototypes submitted by accredited research universities, including requested grant funding.
                  </p>
                </div>
              </div>

              <div className="sx-univ-solutions-list">
                {selectedOpportunity.universitySolutions && selectedOpportunity.universitySolutions.length > 0 ? (
                  selectedOpportunity.universitySolutions.map((sol) => (
                    <div key={sol.id} className="sx-univ-solution-card">
                      <div className="sx-univ-sol-top">
                        <div className="sx-univ-sol-badges">
                          <span className="sx-univ-badge-pill">🎓 {sol.universityName}</span>
                          <span className="sx-univ-trl-badge">{sol.trlLevel}</span>
                        </div>
                        <span className="sx-univ-sol-id">#{sol.id}</span>
                      </div>

                      <h4 className="sx-univ-sol-title">{sol.solutionTitle}</h4>
                      <p className="sx-univ-sol-summary">{sol.summary}</p>

                      <div className="sx-univ-sol-meta-grid">
                        <div className="sx-univ-sol-meta-col">
                          <span className="sx-univ-meta-label">LEAD RESEARCHER & TEAM</span>
                          <strong className="sx-univ-meta-value">{sol.facultyLead}</strong>
                          <span className="sx-univ-meta-sub">{sol.studentTeam}</span>
                        </div>

                        <div className="sx-univ-sol-funding-box">
                          <span className="sx-univ-funding-label">FUNDING REQUIRED</span>
                          <strong className="sx-univ-funding-amount">{sol.fundingRequired}</strong>
                          <span className="sx-univ-funding-sub">Pilot Duration: {sol.pilotDuration}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sx-univ-solutions-empty">
                    <p>No university solutions submitted yet for this challenge.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bubble Footer */}
            <div className="sx-bubble-dialog-footer">
              <button
                type="button"
                className="sx-btn-modal-cancel"
                onClick={() => setSelectedOpportunity(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="sx-btn-submit-proposal"
                onClick={() => handleProposal(selectedOpportunity)}
              >
                <span>Start Commercial Proposal</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL: EDIT INDUSTRY ORG PROFILE ================= */}
      {isEditProfileOpen && typeof document !== "undefined" && createPortal(
        <div className="sx-modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div
            className="sx-modal-content sx-edit-profile-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-industry-profile-title"
          >
            <div className="sx-modal-header">
              <div>
                <p className="sx-kicker">INDUSTRY ORGANIZATION PROFILE SETTINGS</p>
                <h3 id="edit-industry-profile-title" className="sx-modal-title">
                  Edit Corporate & Address Details
                </h3>
              </div>
              <button
                type="button"
                className="sx-modal-close"
                onClick={() => setIsEditProfileOpen(false)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="sx-modal-form">
              <div className="sx-modal-section-label">Organization Information</div>
              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Company Legal Name *</span>
                  <input
                    type="text"
                    value={editProfileForm.companyName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, companyName: e.target.value })}
                    required
                  />
                </label>
                <label className="sx-modal-field">
                  <span>Display / Short Name *</span>
                  <input
                    type="text"
                    value={editProfileForm.shortName}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, shortName: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Industry Sector *</span>
                  <input
                    type="text"
                    value={editProfileForm.sector}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, sector: e.target.value })}
                    required
                  />
                </label>
                <label className="sx-modal-field">
                  <span>Corporate CIN *</span>
                  <input
                    type="text"
                    value={editProfileForm.cin}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, cin: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Nodal Officer / Spoc *</span>
                  <input
                    type="text"
                    value={editProfileForm.nodalOfficer}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, nodalOfficer: e.target.value })}
                    required
                  />
                </label>
                <label className="sx-modal-field">
                  <span>Designation</span>
                  <input
                    type="text"
                    value={editProfileForm.designation}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, designation: e.target.value })}
                  />
                </label>
              </div>

              <div className="sx-modal-section-label">Corporate Address Details</div>
              <div className="sx-modal-field">
                <span>Registered Street Address *</span>
                <input
                  type="text"
                  value={editProfileForm.street}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, street: e.target.value })}
                  required
                />
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>Sector / Tech Zone</span>
                  <input
                    type="text"
                    value={editProfileForm.sectorArea}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, sectorArea: e.target.value })}
                  />
                </label>
                <label className="sx-modal-field">
                  <span>City *</span>
                  <input
                    type="text"
                    value={editProfileForm.city}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, city: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="sx-modal-row">
                <label className="sx-modal-field">
                  <span>State *</span>
                  <input
                    type="text"
                    value={editProfileForm.state}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, state: e.target.value })}
                    required
                  />
                </label>
                <label className="sx-modal-field">
                  <span>PIN Code *</span>
                  <input
                    type="text"
                    value={editProfileForm.pinCode}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, pinCode: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="sx-modal-footer">
                <button
                  type="button"
                  className="sx-btn-modal-cancel"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sx-btn-modal-submit">
                  Save Corporate Profile
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}