import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Check } from "lucide-react";

const pickerIcon = L.divIcon({
  className: "picker-marker",
  html: `
    <div style="
      background-color: #3B82F6;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-dot 2s infinite ease-in-out;
    ">
      <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const MapEventsHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapCenterPan = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, 18, { duration: 1 });
    }
  }, [position, map]);
  return null;
};

export const LocationPicker = ({ 
  initialLat = 18.520430, 
  initialLng = 73.856744, 
  onLocationChange 
}) => {
  const [position, setPosition] = useState([initialLat, initialLng]);
  const [isLocating, setIsLocating] = useState(false);
  const [locateSuccess, setLocateSuccess] = useState(false);

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  const handleSelect = (lat, lng) => {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));
    setPosition([roundedLat, roundedLng]);
    if (onLocationChange) {
      onLocationChange(roundedLat, roundedLng);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setPosition([lat, lng]);
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
        setIsLocating(false);
        setLocateSuccess(true);
        setTimeout(() => setLocateSuccess(false), 3000);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not fetch GPS location: " + err.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Controls and current coordinates display */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "#94A3B8" }}>
          <MapPin size={16} color="#3B82F6" />
          <span>Lat: <strong style={{ color: "#F8FAFC" }}>{position[0]}</strong></span>
          <span>Lng: <strong style={{ color: "#F8FAFC" }}>{position[1]}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="btn-secondary"
          style={{ fontSize: "0.8125rem", padding: "0.375rem 0.75rem", background: locateSuccess ? "rgba(16, 185, 129, 0.2)" : "#1E293B" }}
        >
          {isLocating ? (
            <span>Fetching GPS...</span>
          ) : locateSuccess ? (
            <span style={{ color: "#10B981", display: "flex", alignItems: "center", gap: "0.25rem" }}><Check size={14} /> GPS Detected</span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}><Navigation size={14} /> Use Current GPS</span>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div style={{ height: "260px", width: "100%", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid #1E293B" }}>
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEventsHandler onLocationSelect={handleSelect} />
          <MapCenterPan position={position} />
          <Marker position={position} icon={pickerIcon} />
        </MapContainer>
      </div>
      <p style={{ fontSize: "0.75rem", color: "#64748B", margin: 0 }}>
        Click or drag anywhere on the map to pinpoint the exact location of the asset inside campus.
      </p>
    </div>
  );
};
