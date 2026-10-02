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
  const { tickets, updateTicketStatus } = useData();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusNotice, setStatusNotice] = useState("");

  const activeCount = tickets.filter(
    (t) => (t.status || "ACTIVE") === "ACTIVE" || t.status === "OPEN"
  ).length;

  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS" || t.status === "IN PROGRESS"
  ).length;

  const formatTicketDate = (val) => {
    if (!val) return "";
    try {
      if (val?.toDate && typeof val.toDate === "function") {
        return val.toDate().toLocaleDateString();
      }
      if (val?.seconds) {
        return new Date(val.seconds * 1000).toLocaleDateString();
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
      return "";
    } catch {
      return "";
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const normStatus = (t.status || "ACTIVE").toUpperCase().replace("-", "_").trim();
    let matchStatus = true;
    if (filterStatus === "ACTIVE") {
      matchStatus = normStatus === "ACTIVE" || normStatus === "OPEN";
    } else if (filterStatus === "IN_PROGRESS") {
      matchStatus = normStatus === "IN_PROGRESS" || normStatus === "IN PROGRESS";
    }

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

  const handleStatusChange = async (ticket, newStatus) => {
    if (newStatus === "RESOLVED") {
      const confirmDelete = window.confirm(
        `Are you sure you want to mark ticket ${ticket.ticketId} as RESOLVED?\n\nThis will entirely and permanently delete this ticket from the system.`
      );
      if (!confirmDelete) return;

      try {
        await updateTicketStatus(ticket.ticketId, "RESOLVED");
        setStatusNotice(`Ticket ${ticket.ticketId} has been resolved and permanently removed from the system.`);
        setTimeout(() => setStatusNotice(""), 4500);
      } catch (err) {
        alert("Failed to delete ticket: " + (err.message || err));
      }
    } else {
      try {
        await updateTicketStatus(ticket.ticketId, newStatus);
        setStatusNotice(`Ticket ${ticket.ticketId} status updated to ${newStatus}.`);
        setTimeout(() => setStatusNotice(""), 3000);
      } catch (err) {
        alert("Failed to update ticket status: " + (err.message || err));
      }
    }
  };

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#0284C7", fontWeight: "700", letterSpacing: "0.06em" }}>
            MAINTENANCE QUEUE
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            Maintenance Issues & Tickets
          </h1>
        </div>
      </div>

      {statusNotice && (
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            color: "#166534",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          <span>✓ {statusNotice}</span>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setFilterStatus("ALL")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: filterStatus === "ALL" ? "1px solid #0F172A" : "1px solid #E2E8F0",
              background: filterStatus === "ALL" ? "#0F172A" : "#FFFFFF",
              color: filterStatus === "ALL" ? "#FFFFFF" : "#64748B"
            }}
          >
            All Active ({tickets.length})
          </button>

          <button
            onClick={() => setFilterStatus("ACTIVE")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: filterStatus === "ACTIVE" ? "1px solid #334155" : "1px solid #E2E8F0",
              background: filterStatus === "ACTIVE" ? "#F1F5F9" : "#FFFFFF",
              color: filterStatus === "ACTIVE" ? "#0F172A" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>Active Issues</span>
            <span style={{ background: filterStatus === "ACTIVE" ? "#E2E8F0" : "rgba(0,0,0,0.06)", padding: "0.05rem 0.35rem", borderRadius: "9999px", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("IN_PROGRESS")}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              border: filterStatus === "IN_PROGRESS" ? "1px solid rgba(2, 132, 199, 0.4)" : "1px solid #E2E8F0",
              background: filterStatus === "IN_PROGRESS" ? "rgba(2, 132, 199, 0.12)" : "#FFFFFF",
              color: filterStatus === "IN_PROGRESS" ? "#0284C7" : "#64748B",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <span>In Progress</span>
            <span style={{ background: "rgba(0,0,0,0.08)", padding: "0.05rem 0.35rem", borderRadius: "9999px", fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
              {inProgressCount}
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
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem", background: "#FFFFFF" }}
            >
              <option value="ALL">All Defect Categories</option>
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
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
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
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
                filteredTickets.map((t) => {
                  const isProg = t.status === "IN_PROGRESS" || t.status === "IN PROGRESS";
                  const dateStr = formatTicketDate(t.createdAt);
                  return (
                    <tr
                      key={t.ticketId}
                      style={{
                        borderBottom: "1px solid #E2E8F0",
                        transition: "background 0.1s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontWeight: "700", color: "#0284C7" }}>
                        {t.ticketId}
                        {dateStr && (
                          <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: "400" }}>
                            {dateStr}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ fontWeight: "600", color: "#0F172A" }}>
                          {t.itemSnapshot?.itemName || "Asset"}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#64748B" }}>
                          Room {t.itemSnapshot?.room} • {t.itemSnapshot?.building}
                        </div>
                      </td>

                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ background: "#F1F5F9", padding: "0.15rem 0.45rem", borderRadius: "0.25rem", fontSize: "0.725rem", border: "1px solid #E2E8F0", color: "#475569" }}>
                          {t.ticketType}
                        </span>
                        <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.2rem", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.description}
                        </p>
                      </td>

                      <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", color: "#334155", fontSize: "0.8rem" }}>
                        <a
                          href={`tel:${t.phoneNumber}`}
                          style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <Phone size={12} color="#0284C7" /> {t.phoneNumber}
                        </a>
                      </td>

                      <td style={{ padding: "0.75rem 1rem" }}>
                        <select
                          value={isProg ? "IN PROGRESS" : "ACTIVE"}
                          onChange={(e) => handleStatusChange(t, e.target.value)}
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: "700",
                            fontFamily: "var(--font-mono)",
                            padding: "0.22rem 0.6rem",
                            borderRadius: "9999px",
                            cursor: "pointer",
                            outline: "none",
                            border: isProg
                              ? "1px solid #BAE6FD"
                              : "1px solid #CBD5E1",
                            background: isProg
                              ? "#F0F9FF"
                              : "#F8FAFC",
                            color: isProg ? "#0284C7" : "#334155"
                          }}
                          title="Change status (Selecting RESOLVED will permanently delete this ticket)"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>

                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                        <Link
                          to={`/admin/tickets/${t.ticketId}`}
                          className="btn-secondary"
                          style={{ padding: "0.25rem 0.55rem", fontSize: "0.725rem" }}
                        >
                          Details <ArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
};

export default AdminTicketsPage;
