import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Ticket, 
  Search, 
  CheckCircle, 
  Phone, 
  ArrowRight,
  Check
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/StatusBadge";
import { TICKET_TYPES } from "../../firebase/seedData";

export const AdminTicketsPage = () => {
  const { tickets, closeTicket } = useData();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [closing, setClosing] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = filterStatus === "ALL" || t.status === filterStatus;
    const matchType = filterType === "ALL" || t.ticketType === filterType;
    
    const term = searchTerm.toLowerCase();
    const matchSearch =
      t.ticketId.toLowerCase().includes(term) ||
      t.itemId?.toLowerCase().includes(term) ||
      t.phoneNumber?.toLowerCase().includes(term) ||
      t.itemSnapshot?.itemName?.toLowerCase().includes(term) ||
      t.itemSnapshot?.room?.toLowerCase().includes(term) ||
      t.description?.toLowerCase().includes(term);

    return matchStatus && matchType && matchSearch;
  });

  const handleQuickClose = async () => {
    if (!resolvingTicket) return;
    setClosing(true);
    try {
      await closeTicket(resolvingTicket.ticketId, adminRemarks.trim() || "Resolved on-site by administrator.");
      setResolvingTicket(null);
      setAdminRemarks("");
    } catch (err) {
      alert("Error closing ticket: " + err.message);
    } finally {
      setClosing(false);
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const closedCount = tickets.filter((t) => t.status === "CLOSED").length;

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            TICKETING QUEUE
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            Maintenance Issues & Tickets
          </h1>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setFilterStatus("ALL")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: filterStatus === "ALL" ? "#1A1F2D" : "transparent",
              color: filterStatus === "ALL" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            All ({tickets.length})
          </button>

          <button
            onClick={() => setFilterStatus("OPEN")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: filterStatus === "OPEN" ? "rgba(239, 68, 68, 0.15)" : "transparent",
              color: filterStatus === "OPEN" ? "#F87171" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Open Defect</span>
            <span style={{ background: "rgba(0,0,0,0.4)", padding: "0.05rem 0.35rem", borderRadius: "9999px", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
              {openCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("CLOSED")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              background: filterStatus === "CLOSED" ? "rgba(16, 185, 129, 0.15)" : "transparent",
              color: filterStatus === "CLOSED" ? "#34D399" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Resolved</span>
            <span style={{ background: "rgba(0,0,0,0.4)", padding: "0.05rem 0.35rem", borderRadius: "9999px", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
              {closedCount}
            </span>
          </button>
        </div>

        {/* Search Row */}
        <div className="card-premium" style={{ padding: "0.75rem 1rem", display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <input
              type="text"
              placeholder="Search by ticket ID, asset name, room, phone, or defect description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-refined"
              style={{ width: "100%", padding: "0.45rem 0.75rem 0.45rem 2rem", fontSize: "0.825rem" }}
            />
            <div style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
              <Search size={14} />
            </div>
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-refined"
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem" }}
            >
              <option value="ALL" style={{ background: "#0B0D13" }}>All Defect Categories</option>
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type} style={{ background: "#0B0D13" }}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card-premium" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.825rem" }}>
            <thead>
              <tr style={{ background: "#08090D", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748B", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Ticket ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Target Asset</th>
                <th style={{ padding: "0.75rem 1rem" }}>Defect Type</th>
                <th style={{ padding: "0.75rem 1rem" }}>Reporter Phone</th>
                <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr
                    key={t.ticketId}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "background 0.1s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontWeight: "700", color: "#38BDF8" }}>
                      {t.ticketId}
                      <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: "400" }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: "600", color: "#FFFFFF" }}>
                        {t.itemSnapshot?.itemName || "Asset"}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                        Room {t.itemSnapshot?.room} • {t.itemSnapshot?.building}
                      </div>
                    </td>

                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ background: "#0B0D13", padding: "0.15rem 0.45rem", borderRadius: "0.25rem", fontSize: "0.725rem", border: "1px solid rgba(255, 255, 255, 0.06)", color: "#CBD5E1" }}>
                        {t.ticketType}
                      </span>
                      <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.2rem", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.description}
                      </p>
                    </td>

                    <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", color: "#CBD5E1", fontSize: "0.8rem" }}>
                      <a
                        href={`tel:${t.phoneNumber}`}
                        style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Phone size={12} color="#38BDF8" /> {t.phoneNumber}
                      </a>
                    </td>

                    <td style={{ padding: "0.75rem 1rem" }}>
                      <StatusBadge status={t.status} size="sm" />
                    </td>

                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        {t.status === "OPEN" && (
                          <button
                            onClick={() => {
                              setResolvingTicket(t);
                              setAdminRemarks("");
                            }}
                            className="btn-success"
                            style={{ padding: "0.25rem 0.55rem", fontSize: "0.725rem" }}
                            title="Resolve Ticket"
                          >
                            <Check size={12} /> Resolve
                          </button>
                        )}

                        <Link
                          to={`/admin/tickets/${t.ticketId}`}
                          className="btn-secondary"
                          style={{ padding: "0.25rem 0.55rem", fontSize: "0.725rem" }}
                        >
                          Details <ArrowRight size={11} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                    No tickets found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Modal */}
      {resolvingTicket && (
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
          onClick={() => setResolvingTicket(null)}
        >
          <div
            className="card-premium"
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "1.75rem",
              border: "1px solid rgba(52, 211, 153, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#34D399", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              <CheckCircle size={15} /> Confirm Resolution
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#FFFFFF" }}>
              Resolve {resolvingTicket.ticketId}?
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.825rem", margin: "0.25rem 0 1rem 0" }}>
              For <strong>{resolvingTicket.itemSnapshot?.itemName}</strong> in room {resolvingTicket.itemSnapshot?.room}.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                Resolution Remarks
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Replaced faulty lamp module and verified projection display."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                className="input-refined"
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleQuickClose}
                disabled={closing}
                className="btn-success"
                style={{ flex: 1, padding: "0.55rem" }}
              >
                {closing ? "Updating..." : "Mark as Resolved"}
              </button>
              <button
                onClick={() => setResolvingTicket(null)}
                className="btn-secondary"
                style={{ padding: "0.55rem 0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
