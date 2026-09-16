import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Components
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";

// Public Pages
import { LandingPage } from "./pages/LandingPage";
import { PublicReportPage } from "./pages/PublicReportPage";
import { PublicTicketPage } from "./pages/PublicTicketPage";
import { PublicTrackPage } from "./pages/PublicTrackPage";

// Admin Pages
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAssetsPage } from "./pages/admin/AdminAssetsPage";
import { AdminAssetCreatePage } from "./pages/admin/AdminAssetCreatePage";
import { AdminAssetDetailPage } from "./pages/admin/AdminAssetDetailPage";
import { AdminAssetEditPage } from "./pages/admin/AdminAssetEditPage";
import { AdminTicketsPage } from "./pages/admin/AdminTicketsPage";
import { AdminTicketDetailPage } from "./pages/admin/AdminTicketDetailPage";
import { AdminPrintQRPage } from "./pages/admin/AdminPrintQRPage";

// Protected Admin Layout Guard
const ProtectedAdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="pulse-red" style={{ width: "24px", height: "24px", background: "#3B82F6", borderRadius: "50%" }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, backgroundColor: "#0B0F19", minWidth: 0, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Public Layout
const PublicLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public User Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/report/:itemId" element={<PublicReportPage />} />
              <Route path="/ticket/:ticketId" element={<PublicTicketPage />} />
              <Route path="/track" element={<PublicTrackPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="assets" element={<AdminAssetsPage />} />
              <Route path="assets/new" element={<AdminAssetCreatePage />} />
              <Route path="assets/:itemId" element={<AdminAssetDetailPage />} />
              <Route path="assets/:itemId/edit" element={<AdminAssetEditPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="tickets/:ticketId" element={<AdminTicketDetailPage />} />
              <Route path="print-qr" element={<AdminPrintQRPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
