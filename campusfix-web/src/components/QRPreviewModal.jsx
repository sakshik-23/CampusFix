import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const QRPreviewModal = ({ asset, isOpen, onClose }) => {
  const qrRef = useRef(null);
  if (!isOpen || !asset) return null;

  const publicUrl = `${window.location.origin}/report/${asset.itemId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 25, 25, 350, 350);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${asset.itemId}_${asset.room}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="card-premium"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "1.5rem"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#FFFFFF" }}>Physical QR Label</h3>
            <p style={{ fontSize: "0.75rem", color: "#64748B" }}>Ready for laser/thermal attachment</p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: "0.3rem" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Physical Sticker Card Preview */}
        <div
          ref={qrRef}
          className="qr-label-card"
          style={{
            background: "#FFFFFF",
            color: "#0F172A",
            borderRadius: "0.75rem",
            padding: "1.25rem 1rem",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            border: "2px solid #E2E8F0",
            marginBottom: "1.25rem"
          }}
        >
          <div style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "1.1rem", letterSpacing: "0.025em", color: "#0F172A" }}>
            {asset.itemName}
          </div>
          <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#475569", marginBottom: "0.5rem" }}>
            ROOM: {asset.room} • {asset.building}
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "0.4rem 0" }}>
            <div style={{ padding: "0.5rem", background: "#ffffff", borderRadius: "0.375rem", border: "1px solid #E2E8F0" }}>
              <QRCodeSVG
                value={publicUrl}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <div style={{ marginTop: "0.5rem", fontWeight: "800", fontSize: "0.75rem", color: "#DC2626", letterSpacing: "0.025em", lineHeight: 1.3 }}>
            IF BROKEN SCAN THIS QR<br />AND RAISE A TICKET
          </div>

          <div style={{ marginTop: "0.35rem", fontFamily: "var(--font-mono)", fontWeight: "800", fontSize: "0.95rem", color: "#0F172A" }}>
            {asset.itemId}
          </div>
        </div>

        {/* Link preview */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#08090D", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", marginBottom: "1rem", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
            {publicUrl}
          </span>
          <Link
            to={`/report/${asset.itemId}`}
            target="_blank"
            style={{ color: "#38BDF8", display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.7rem", fontWeight: "600", textDecoration: "none" }}
          >
            Open <ExternalLink size={10} />
          </Link>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          <button
            onClick={handleDownload}
            className="btn-secondary"
            style={{ width: "100%", fontSize: "0.8rem", padding: "0.5rem" }}
          >
            <Download size={14} /> Download
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary"
            style={{ width: "100%", fontSize: "0.8rem", padding: "0.5rem" }}
          >
            <Printer size={14} /> Print Label
          </button>
        </div>
      </div>
    </div>
  );
};
