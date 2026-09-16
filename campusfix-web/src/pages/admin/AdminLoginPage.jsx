import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 130px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem"
      }}
    >
      <div
        className="card-premium"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "0.625rem",
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem auto",
              boxShadow: "0 0 20px rgba(2, 132, 199, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            <Shield size={22} />
          </div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em" }}>
            Admin Portal
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "0.15rem" }}>
            Campus Asset & Maintenance Management
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#F87171",
              padding: "0.65rem 0.75rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Administrator Email
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                placeholder="admin@campusfix.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-refined"
                style={{ width: "100%", paddingLeft: "2.25rem" }}
                required
              />
              <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
                <Mail size={15} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-refined"
                style={{ width: "100%", paddingLeft: "2.25rem" }}
                required
              />
              <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
                <Lock size={15} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "0.65rem", marginTop: "0.25rem" }}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Portal"}
          </button>
        </form>
      </div>
    </div>
  );
};
