import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const QRPreviewModal = ({ asset, isOpen, onClose }) => {
  const qrRef = useRef(null);
  if (!isOpen || !asset) return null;

  const publicUrl = `${window.location.origin}/report/${asset.itemId}`;

  const handlePrint = () => {
    const sticker = qrRef.current;
    if (!sticker) return;

    // Create an isolated hidden iframe for printing ONLY the sticker
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const svgElement = sticker.querySelector("svg");
    const svgHtml = svgElement ? svgElement.outerHTML : "";

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label - ${asset.itemId}</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              background: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .print-sticker {
              width: 320px;
              max-width: 100%;
              border: 2px solid #0f172a;
              border-radius: 12px;
              padding: 20px 16px;
              text-align: center;
              background: #ffffff;
              color: #0f172a;
              page-break-inside: avoid;
            }
            .sticker-title {
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
              color: #0f172a;
            }
            .sticker-location {
              font-size: 13px;
              font-weight: 600;
              color: #475569;
              margin-bottom: 12px;
            }
            .sticker-qr {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 10px 0;
            }
            .sticker-qr svg {
              display: block;
              margin: 0 auto;
            }
            .sticker-alert {
              color: #dc2626;
              font-size: 12px;
              font-weight: 800;
              line-height: 1.3;
              margin-top: 12px;
              letter-spacing: 0.5px;
            }
            .sticker-id {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 16px;
              font-weight: 800;
              color: #0284c7;
              margin-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="print-sticker">
            <div class="sticker-title">${asset.itemName || "Campus Asset"}</div>
            <div class="sticker-location">ROOM: ${asset.room || "Campus"} &bull; ${asset.building || ""}</div>
            <div class="sticker-qr">
              ${svgHtml}
            </div>
            <div class="sticker-alert">IF BROKEN SCAN THIS QR<br>AND RAISE A TICKET</div>
            <div class="sticker-id">${asset.itemId}</div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger print after iframe renders
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
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
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
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
          padding: "1.5rem",
          background: "#FFFFFF",
          borderRadius: "1rem",
          border: "1px solid #E2E8F0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", margin: 0 }}>
              Physical QR Label
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#64748B", margin: "0.2rem 0 0 0" }}>
              Ready for laser/thermal attachment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{
              padding: "0.35rem",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B"
            }}
            aria-label="Close"
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            border: "1.5px solid #E2E8F0",
            marginBottom: "1rem"
          }}
        >
          <div style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "1.05rem", letterSpacing: "0.025em", color: "#0F172A" }}>
            {asset.itemName}
          </div>
          <div style={{ fontWeight: "600", fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>
            ROOM: {asset.room} • {asset.building}
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "0.4rem 0" }}>
            <div style={{ padding: "0.5rem", background: "#FFFFFF", borderRadius: "0.5rem", border: "1px solid #E2E8F0" }}>
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

          <div style={{ marginTop: "0.35rem", fontFamily: "var(--font-mono)", fontWeight: "800", fontSize: "0.95rem", color: "#0284C7" }}>
            {asset.itemId}
          </div>
        </div>

        {/* Link preview bar (Clean Light Campus Theme) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F8FAFC",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #E2E8F0"
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "#475569",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "260px"
            }}
          >
            {publicUrl}
          </span>
          <Link
            to={`/report/${asset.itemId}`}
            target="_blank"
            style={{
              color: "#0284C7",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Open <ExternalLink size={12} />
          </Link>
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-secondary"
            style={{ width: "100%", fontSize: "0.85rem", padding: "0.55rem" }}
          >
            <Download size={15} /> Download
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary"
            style={{ width: "100%", fontSize: "0.85rem", padding: "0.55rem" }}
          >
            <Printer size={15} /> Print Label
          </button>
        </div>
      </div>
    </div>
  );
};
