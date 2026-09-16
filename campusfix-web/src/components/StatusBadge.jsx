import React from "react";

export const StatusBadge = ({ status, size = "md" }) => {
  const isOpen = status === "OPEN";

  const sizeStyles = {
    sm: { padding: "0.15rem 0.5rem", fontSize: "0.7rem", gap: "0.35rem" },
    md: { padding: "0.25rem 0.65rem", fontSize: "0.75rem", gap: "0.4rem" },
    lg: { padding: "0.35rem 0.85rem", fontSize: "0.8125rem", gap: "0.5rem" }
  };

  if (isOpen) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "9999px",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          color: "#F87171",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          fontFamily: "var(--font-mono)",
          fontWeight: "600",
          letterSpacing: "0.04em",
          boxShadow: "0 0 10px rgba(239, 68, 68, 0.1)",
          ...sizeStyles[size]
        }}
        className="select-none"
      >
        <span
          style={{
            width: size === "lg" ? "7px" : "5px",
            height: size === "lg" ? "7px" : "5px",
            borderRadius: "50%",
            backgroundColor: "#EF4444",
            boxShadow: "0 0 6px #EF4444"
          }}
          className="pulse-open"
        />
        OPEN
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
        color: "#34D399",
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
