import React from "react";

export const StatusBadge = ({ status = "ACTIVE", size = "md" }) => {
  const norm = (status || "ACTIVE").toUpperCase().replace("-", "_").trim();
  const isActive = norm === "ACTIVE" || norm === "OPEN";
  const isInProgress = norm === "IN_PROGRESS" || norm === "IN PROGRESS";

  const sizeStyles = {
    sm: { padding: "0.15rem 0.5rem", fontSize: "0.7rem", gap: "0.35rem" },
    md: { padding: "0.25rem 0.65rem", fontSize: "0.75rem", gap: "0.4rem" },
    lg: { padding: "0.35rem 0.85rem", fontSize: "0.8125rem", gap: "0.5rem" }
  };

  if (isActive) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "9999px",
          backgroundColor: "#F1F5F9",
          color: "#334155",
          border: "1px solid #CBD5E1",
          fontFamily: "var(--font-mono)",
          fontWeight: "700",
          letterSpacing: "0.04em",
          ...sizeStyles[size]
        }}
        className="select-none"
      >
        <span
          style={{
            width: size === "lg" ? "7px" : "5px",
            height: size === "lg" ? "7px" : "5px",
            borderRadius: "50%",
            backgroundColor: "#64748B"
          }}
        />
        ACTIVE
      </span>
    );
  }

  if (isInProgress) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "9999px",
          backgroundColor: "rgba(2, 132, 199, 0.08)",
          color: "#0284C7",
          border: "1px solid rgba(2, 132, 199, 0.25)",
          fontFamily: "var(--font-mono)",
          fontWeight: "600",
          letterSpacing: "0.04em",
          ...sizeStyles[size]
        }}
        className="select-none"
      >
        <span
          style={{
            width: size === "lg" ? "7px" : "5px",
            height: size === "lg" ? "7px" : "5px",
            borderRadius: "50%",
            backgroundColor: "#0284C7",
            boxShadow: "0 0 6px #0284C7"
          }}
        />
        IN PROGRESS
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        color: "#10B981",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        fontFamily: "var(--font-mono)",
        fontWeight: "600",
        letterSpacing: "0.04em",
        ...sizeStyles[size]
      }}
      className="select-none"
    >
      <span
        style={{
          width: size === "lg" ? "7px" : "5px",
          height: size === "lg" ? "7px" : "5px",
          borderRadius: "50%",
          backgroundColor: "#10B981"
        }}
      />
      RESOLVED
    </span>
  );
};
