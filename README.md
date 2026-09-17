# CampusFix — QR-Based Campus Asset & Issue Management System

> **Campus Asset & Issue Management System**  
> Modern campus asset tracking and issue management with Firebase, React 19, and Flutter.

---

## Overview

CampusFix associates physical campus assets (projectors, ACs, ceiling fans, smart boards, water coolers, lab PCs) with unique high-contrast QR code labels (`AST-000001`, `AST-000002`...). 

When any student or faculty spots a defect:
1. They scan the physical QR sticker with their smartphone camera.
2. The public web reporting page automatically loads the asset's specifications and room location.
3. The user enters the problem category, description, and their phone number without installing any app.
4. A unique ticket (`TKT-2026-000001`) with an **OPEN** status is created.
5. Administrators track open tickets on web/mobile with OpenStreetMap GPS coordinates, repair the asset, and mark the ticket **CLOSED**.

---

## Repository Structure

```
CampusFix/
├── firebase/
│   ├── firestore.rules          # Production security rules (Admin RBAC + Public reporting)
│   └── firestore.indexes.json   # Query optimization composite indexes
│
├── campusfix-web/               # React 19 + Vite Web Portal (Admin + Public QR Pages)
│   ├── src/
│   │   ├── components/          # Leaflet Maps, QR Sticker Labels, Navbar, Status Badges
│   │   ├── pages/               # Landing, Public Report, Public Ticket, Admin Dashboard, CRUD
│   │   ├── context/             # AuthContext (Admin session) & DataContext (Firestore sync)
│   │   ├── firebase/            # Firebase SDK config + Initial demo dataset
│   │   └── App.jsx              # Application router
│   └── package.json
│
└── campusfix_admin/             # Flutter Mobile App (Android / iOS Admin Scanner)
    ├── lib/
    │   ├── models/              # Asset & Ticket models
    │   ├── screens/             # QR Camera Scanner, GPS location tagger, Ticket resolution
    │   ├── services/            # LocationService (Geolocator), Firebase
    │   └── main.dart
    └── pubspec.yaml
```

---

## Running the Project

### 1. React Web Portal (`campusfix-web`)

```bash
cd campusfix-web
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

- **Public Scanner**: Look up any asset ID (e.g. `AST-000001`) to test issue reporting.
- **Admin Portal**: Click **Admin Login** in the navbar (`admin@campusfix.edu` / `admin123`) to access the dashboard, map, and resolution tools.

### 2. Flutter Admin App (`campusfix_admin`)

```bash
cd campusfix_admin
flutter pub get
flutter run
```

---

## Firebase Integration & Security Rules

To link your live Firebase cloud instance:
1. Copy `campusfix-web/.env.example` to `campusfix-web/.env` and configure your Firebase credentials.
2. Deploy the rules from `firebase/firestore.rules` in the Firebase Console.
