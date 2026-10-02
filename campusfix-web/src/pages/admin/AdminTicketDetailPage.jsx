import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Ticket, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  ExternalLink,
  Box,
  UserCheck
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { StatusBadge } from "../../components/StatusBadge";
import { CampusMap } from "../../components/CampusMap";

export const AdminTicketDetailPage = () => {
  const { ticketId } = useParams();
  const { getTicket, getAsset, updateTicketStatus, closeTicket, loading } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [asset, setAsset] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && ticketId) {
      const foundTicket = getTicket(ticketId);
      setTicket(foundTicket || null);
      if (foundTicket) {
        const foundAsset = getAsset(foundTicket.itemId);
        setAsset(foundAsset || null);
      }
    }
  }, [ticketId, loading, getTicket, getAsset]);

  const handleStatusChange = async (newStatus) => {
    if (!ticket) return;
    if (newStatus === "RESOLVED") {
      const confirmDelete = window.confirm(
        `Are you sure you want to mark ticket ${ticket.ticketId} as RESOLVED?\n\nThis ticket will be entirely and permanently removed from the system.`
      );
      if (!confirmDelete) return;

      try {
        await closeTicket(ticket.ticketId, "Resolved and removed by administrator.");
        navigate("/admin/tickets");
      } catch (err) {
        alert("Failed to resolve ticket: " + (err.message || err));
      }
    } else {
      try {
        await updateTicketStatus(ticket.ticketId, newStatus);
        setTicket((prev) => ({ ...prev, status: newStatus }));
      } catch (err) {
        alert("Failed to update status: " + (err.message || err));
      }
    }
  };

  const handleCloseTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await closeTicket(
        ticket.ticketId, 
        adminNotes.trim() || "Inspected and resolved by campus maintenance team.",
        user?.email || "admin@campusfix.edu"
      );
      setShowCloseModal(false);
      navigate("/admin/tickets");
    } catch (err) {
      alert("Error closing ticket: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ color: "#F8FAFC" }}>Ticket Not Found</h2>
        <p style={{ color: "#94A3B8", margin: "1rem 0" }}>No ticket found with ID {ticketId}</p>
        <Link to="/admin/tickets" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Tickets List
        </Link>
      </div>
    );
  }

  const assetInfo = ticket.itemSnapshot || asset || {};
  const isClosed = ticket.status === "CLOSED";

  return (
    <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Top Header & Close Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            to="/admin/tickets"
            className="btn-secondary"
            style={{ padding: "0.4rem 0.6rem" }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", fontFamily: "var(--font-mono)" }}>
                {ticket.ticketId}
              </h1>
              <select
                value={
                  ticket.status === "IN_PROGRESS" || ticket.status === "IN PROGRESS"
                    ? "IN PROGRESS"
                    : "ACTIVE"
                }
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  outline: "none",
                  border:
                    ticket.status === "IN_PROGRESS" || ticket.status === "IN PROGRESS"
                      ? "1px solid #BAE6FD"
                      : "1px solid #CBD5E1",
                  background:
                    ticket.status === "IN_PROGRESS" || ticket.status === "IN PROGRESS"
                      ? "#F0F9FF"
                      : "#F8FAFC",
                  color:
                    ticket.status === "IN_PROGRESS" || ticket.status === "IN PROGRESS"
                      ? "#0284C7"
                      : "#334155"
                }}
                title="Change ticket status (Selecting RESOLVED will permanently delete this ticket)"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
            <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "0.15rem" }}>
              Reported: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Recently"}
            </p>
          </div>
        </div>

        {/* Action Button: Close Ticket (PRD FR-36) */}
        {!isClosed ? (
          <button
            onClick={() => setShowCloseModal(true)}
            className="btn-success"
            style={{ fontSize: "0.9rem", padding: "0.6rem 1.25rem" }}
          >
            <CheckCircle size={18} /> Resolve & Close Ticket
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "0.5rem 1rem", borderRadius: "0.5rem", color: "#059669", fontSize: "0.85rem", fontWeight: "700" }}>
            <CheckCircle size={16} /> Ticket Resolved (Closed)
          </div>
        )}
      </div>

      {/* Grid: Issue Details & Reporter Information */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Issue Details Card (PRD FR-35) */}
        <div className="card-premium" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#0F172A", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Ticket size={18} color="#EF4444" /> Issue Information
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Issue Category</span>
                <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "1rem", marginTop: "0.15rem" }}>
                  {ticket.ticketType}
                </div>
              </div>

              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Reporter Phone</span>
                <div style={{ marginTop: "0.15rem" }}>
                  <a
                    href={`tel:${ticket.phoneNumber}`}
                    style={{
                      color: "#38BDF8",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontFamily: "var(--font-mono)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      background: "#090A0F",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <Phone size={14} /> {ticket.phoneNumber}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Problem Description</span>
              <div style={{ background: "#090A0F", padding: "1rem", borderRadius: "0.5rem", marginTop: "0.25rem", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#F8FAFC", lineHeight: 1.6 }}>
                "{ticket.description}"
              </div>
            </div>

            {/* Resolution Section if Closed */}
            {isClosed && (
              <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "0.5rem", padding: "1rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#34D399", fontSize: "0.85rem", fontWeight: "700" }}>
                  <Wrench size={15} /> Resolution Summary
                </div>
                <p style={{ color: "#D1FAE5", marginTop: "0.35rem", fontSize: "0.9rem", margin: "0.35rem 0 0 0" }}>
                  {ticket.adminNotes || "Issue resolved on-site."}
                </p>
                <div style={{ fontSize: "0.75rem", color: "#6EE7B7", marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Closed at: {new Date(ticket.closedAt).toLocaleString()}</span>
                  <span>By: {ticket.closedBy || "admin"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Associated Asset Card */}
        <div className="card-premium" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Box size={18} color="#38BDF8" /> Reported Asset Details
            </h3>
            <Link
              to={`/admin/assets/${ticket.itemId}`}
              style={{ fontSize: "0.75rem", color: "#38BDF8", textDecoration: "none", fontWeight: "600" }}
            >
              View Asset Details
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Asset Name</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600" }}>{assetInfo.itemName}</div>
            </div>
            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Asset ID</span>
              <div style={{ color: "#38BDF8", fontFamily: "var(--font-mono)", fontWeight: "700" }}>{ticket.itemId}</div>
            </div>
            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Type</span>
              <div style={{ color: "#CBD5E1" }}>{assetInfo.itemType}</div>
            </div>
            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Room</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600" }}>{assetInfo.room}</div>
            </div>
          </div>

          {/* Map */}
          <div style={{ flex: 1, minHeight: "200px" }}>
            <CampusMap
              assets={[{
                itemId: ticket.itemId,
                itemName: assetInfo.itemName || "Asset",
                room: assetInfo.room,
                building: assetInfo.building,
                latitude: ticket.latitude,
                longitude: ticket.longitude
              }]}
              tickets={[ticket]}
              selectedAsset={{ latitude: ticket.latitude, longitude: ticket.longitude }}
              height="200px"
              zoom={18}
            />
          </div>
        </div>
      </div>

      {/* Close Ticket Modal (PRD FR-36) */}
      {showCloseModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem"
          }}
          onClick={() => setShowCloseModal(false)}
        >
          <div
            className="card-premium"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "1.75rem",
              border: "1px solid rgba(16, 185, 129, 0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34D399", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              <CheckCircle size={18} /> Confirm Issue Resolution
            </div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0F172A" }}>
              Resolve & Remove {ticket.ticketId}?
            </h3>
            <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0.35rem 0 1rem 0" }}>
              Marking this ticket as resolved will entirely and permanently remove it from the system.
            </p>

            <form onSubmit={handleCloseTicket}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Resolution Remarks / Technician Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Replaced faulty lamp module, tested unit for 30 minutes, working normally."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="input-refined"
                  style={{ width: "100%", resize: "vertical" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-success"
                  style={{ flex: 1, padding: "0.75rem" }}
                >
                  {submitting ? "Resolving Ticket..." : "Confirm & Resolve"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCloseModal(false)}
                  className="btn-secondary"
                  style={{ padding: "0.75rem 1.25rem" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
