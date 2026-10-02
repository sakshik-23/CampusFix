import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Printer, CheckSquare, Square } from "lucide-react";
import { useData } from "../../context/DataContext";

export const AdminPrintQRPage = () => {
  const { assets } = useData();
  const [selectedRoom, setSelectedRoom] = useState("ALL");
  const [selectedBuilding, setSelectedBuilding] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState(assets.map((a) => a.itemId));

  const rooms = Array.from(new Set(assets.map((a) => a.room))).filter(Boolean);
  const buildings = Array.from(new Set(assets.map((a) => a.building))).filter(Boolean);

  const filteredAssets = assets.filter((a) => {
    const matchRoom = selectedRoom === "ALL" || a.room === selectedRoom;
    const matchBuilding = selectedBuilding === "ALL" || a.building === selectedBuilding;
    return matchRoom && matchBuilding && a.status === "ACTIVE";
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssets.map((a) => a.itemId));
    }
  };

  const toggleSelectId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePrint = () => {
    if (printableAssets.length === 0) return;

    // Remove any previous print iframe
    const existingIframe = document.getElementById("qr-print-iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "qr-print-iframe";
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

    const cardsHtml = printableAssets
      .map((asset) => {
        const cardEl = document.getElementById(`qr-card-${asset.itemId}`);
        const svgEl = cardEl ? cardEl.querySelector("svg") : null;
        const svgHtml = svgEl ? svgEl.outerHTML : "";

        return `
          <div class="qr-label-card">
            <div class="asset-title">${asset.itemName}</div>
            <div class="asset-location">ROOM: ${asset.room || "N/A"} &bull; ${asset.building || "Campus"}</div>
            <div class="qr-svg-wrapper">
              ${svgHtml}
            </div>
            <div class="warning-text">IF BROKEN SCAN THIS QR<br />AND RAISE A TICKET</div>
            <div class="asset-id">${asset.itemId}</div>
          </div>
        `;
      })
      .join("");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CampusFix - Print ${printableAssets.length} Selected QR Labels</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background: #ffffff;
              color: #0f172a;
              padding: 0;
            }
            .labels-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8mm;
              width: 100%;
            }
            .qr-label-card {
              border: 2px solid #0f172a;
              border-radius: 10px;
              padding: 14px 10px;
              text-align: center;
              background: #ffffff;
              page-break-inside: avoid;
              break-inside: avoid;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .asset-title {
              font-size: 13px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #0f172a;
              margin-bottom: 2px;
            }
            .asset-location {
              font-size: 11px;
              font-weight: 700;
              color: #475569;
              margin-bottom: 8px;
            }
            .qr-svg-wrapper {
              padding: 6px;
              background: #ffffff;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
              margin-bottom: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
            .qr-svg-wrapper svg {
              display: block;
              width: 130px;
              height: 130px;
            }
            .warning-text {
              font-size: 10px;
              font-weight: 800;
              color: #dc2626;
              line-height: 1.25;
              letter-spacing: 0.3px;
              margin-bottom: 4px;
            }
            .asset-id {
              font-family: monospace;
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: 0.5px;
            }
          </style>
        </head>
        <body>
          <div class="labels-container">
            ${cardsHtml}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 250);
  };

  const printableAssets = filteredAssets.filter((a) => selectedIds.includes(a.itemId));

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top Header Controls (Hidden on Print) */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#0284C7", fontWeight: "700", letterSpacing: "0.06em" }}>
            PHYSICAL LABEL GENERATOR
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            QR Label Print Studio
          </h1>
        </div>

        <button
          onClick={handlePrint}
          disabled={printableAssets.length === 0}
          className="btn-primary"
          style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
        >
          <Printer size={15} /> Print {printableAssets.length} Selected Labels
        </button>
      </div>

      {/* Filter and Selection Tools (Hidden on Print) */}
      <div className="no-print card-premium" style={{ padding: "0.75rem 1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="input-refined"
              style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
            >
              <option value="ALL" style={{ background: "#0B0D13" }}>All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b} style={{ background: "#0B0D13" }}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="input-refined"
              style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
            >
              <option value="ALL" style={{ background: "#0B0D13" }}>All Rooms</option>
              {rooms.map((r) => (
                <option key={r} value={r} style={{ background: "#0B0D13" }}>{r}</option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleSelectAll}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.4rem 0.65rem" }}
          >
            {selectedIds.length === filteredAssets.length ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><CheckSquare size={13} /> Deselect All</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Square size={13} /> Select All</span>
            )}
          </button>
        </div>

        <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#94A3B8" }}>
          Showing <strong>{printableAssets.length}</strong> of {filteredAssets.length} labels
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="printable-area">
        <div
          className="printable-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem"
          }}
        >
          {printableAssets.map((asset) => {
            const publicUrl = `${window.location.origin}/report/${asset.itemId}`;
            const isSelected = selectedIds.includes(asset.itemId);

            return (
              <div
                key={asset.itemId}
                id={`qr-card-${asset.itemId}`}
                className="qr-label-card"
                style={{
                  background: "#FFFFFF",
                  color: "#0F172A",
                  borderRadius: "0.5rem",
                  padding: "1.1rem 0.85rem",
                  textAlign: "center",
                  border: "2px solid #CBD5E1",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div className="no-print" style={{ position: "absolute", top: "0.4rem", right: "0.4rem" }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectId(asset.itemId)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                </div>

                <div style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "1rem", letterSpacing: "0.02em", color: "#0F172A" }}>
                  {asset.itemName}
                </div>
                <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                  ROOM: {asset.room} • {asset.building}
                </div>

                <div style={{ display: "flex", justifyContent: "center", margin: "0.4rem 0" }}>
                  <div style={{ padding: "0.4rem", background: "#ffffff", borderRadius: "0.3rem", border: "1px solid #E2E8F0" }}>
                    <QRCodeSVG
                      value={publicUrl}
                      size={140}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "0.4rem", fontWeight: "800", fontSize: "0.75rem", color: "#DC2626", letterSpacing: "0.02em", lineHeight: 1.25 }}>
                  IF BROKEN SCAN THIS QR<br />AND RAISE A TICKET
                </div>

                <div style={{ marginTop: "0.3rem", fontFamily: "var(--font-mono)", fontWeight: "800", fontSize: "0.95rem", color: "#0F172A" }}>
                  {asset.itemId}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
