# MediCare - Multispecialty Hospital Management System

A full-stack healthcare web platform and hospital management system featuring a **Sage & Mint Glassmorphism** user experience, persistent MongoDB Atlas integration, real-time conflict-free appointment booking, and role-based operational workspaces for **Patients**, **Doctors**, and **Administrators**.

---

## 🌟 Key Highlights & Design System

### 🎨 Sage & Mint Glassmorphism Palette
- **Ivory (`#FAF9F4`)** & **Light Mint (`#EDF7F0`)**: Clean, calm, welcoming background.
- **Deep Sage (`#527765`)**: Primary action buttons, active states, and focal points.
- **Soft Mint (`#D9EEE1`)**: Badges, active tabs, and secondary buttons.
- **Forest Green (`#244C3B`)**: Headings, branding, and high-impact titles.
- **Sage Green (`#88A995`)**: Subtle borders, icons, and ambient glows.
- **Main Text (`#263B30`)** & **Grey Green (`#718278`)**: High-contrast body text and secondary metadata.
- **Glassmorphism Panels**: `backdrop-filter: blur(16px)` cards with soft white borders (`rgba(255,255,255,0.85)`).

### 🛡️ Core Capabilities
- **Real MongoDB Atlas Integration**: All records (patients, doctors, appointments, availability) persist in live collections with zero automatic demo seed dependencies.
- **Separate Registration & Manual Login**: Public registration for Patients and Doctors, followed by manual authentication.
- **Doctor Accreditation Workflow**: Doctors register with credentials and remain `Pending Review` until approved by the Admin before appearing in public searches.
- **Availability Slot Planner**: Accredited doctors can configure consultation dates, use 1-click slot presets, and delete individual slots.
- **Atomic Double-Booking Prevention**: Slots are atomically claimed upon booking and automatically released if an appointment is cancelled.
- **Admin Operational Console**: Filtered Patient Directory (strictly patients by default, with role switchers), Doctor Management with status updates, and a real-time hospital event audit log.
- **Responsive Across Devices**: Fully responsive for Desktop, Laptop, Tablet, and Mobile.

---

## 🖥️ Complete Application Pages

1. **Home Page (`/`)**:
   - Sticky glass navbar with 24/7 OPD emergency indicator.
   - 2-Column Hero Section with medical visuals, floating doctor accreditation card, and availability indicators.
   - Quick specialist search widget (department, date, and doctor name).
   - 6 Healthcare Specialty Departments (Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics, General Medicine).
   - Real-time Featured Approved Doctors from MongoDB.
   - "Why Choose MediCare" clinical pillars, How It Works timeline, Patient Testimonials, FAQ accordion, and footer.

2. **Find Specialists Directory (`/doctors`)**:
   - Filter by specialty department and consultation fee slider.
   - Real-time search by doctor name or condition.
   - Doctor cards with verified ratings, experience, and direct booking links.

3. **Doctor Profile Page (`/doctors/:id`)**:
   - Complete doctor bio, hospital affiliation, clinical experience, and consultation fees.
   - Interactive calendar with live availability days and time slot pills.
   - Direct appointment booking form.

4. **Multi-Step Appointment Booking Flow (`/booking`)**:
   - Step 1: Select Attending Physician.
   - Step 2: Choose Consultation Date.
   - Step 3: Select Available Time Slot.
   - Step 4: Patient Details & Instant Booking Confirmation.

5. **Patient Dashboard (`/patient/dashboard`)**:
   - Patient profile banner with account details.
   - Statistics for upcoming consultations, total bookings, and completed visits.
   - Tabbed appointments (`Upcoming Visits` vs `Past History`).
   - One-click cancellation with automatic slot restoration.

6. **Doctor Dashboard (`/doctor/dashboard`)**:
   - Physician accreditation badge (`Accredited Specialist` vs `Pending Approval`).
   - Consultation Schedule tabs (`Today`, `Upcoming`, `All`) with `Accept`, `Decline`, and `Complete` actions.
   - Availability Slot Planner with date picker, quick slot presets (`+09:00 AM`, `+10:00 AM`, `+02:00 PM`), and one-click slot removal (`x`).
   - Profile editor modal (fee, phone, hospital, qualifications).

7. **Admin Dashboard (`/admin/dashboard`)**:
   - Executive metrics: Total Doctors, Total Patients, Total Appointments, Consultation Value.
   - **Doctor Management**: Approve, reject, edit, or delete doctors. Add doctor modal with automatic login account provisioning.
   - **Patient Directory**: Shows **only registered patients** by default, with instant search and role filter pills (`Patients Only`, `All Accounts`, `Doctors`, `Admins`).
   - **Hospital Appointments**: Audit log of all bookings across specialties with status controls.
   - **Recent Activity**: Live hospital operational timeline showing booked consultations, new patient signups, and doctor accreditations.

8. **Patient & Doctor Registration (`/register`)**:
   - Role selector cards for Patient vs Doctor.
   - Professional credential fields for doctors (Specialization, Experience, Fee, Qualifications).
   - Show/Hide password toggle on both Password and Confirm Password.
   - Saves directly to MongoDB and redirects to `/login`.

9. **Secure Login (`/login`)**:
   - Split-screen layout with healthcare visuals and soft sage overlay.
   - Show/Hide password eye icon, form validation, and role-based redirect.

10. **About Us (`/about`) & Contact (`/contact`)**:
    - Hospital history, clinical principles, campus locations, emergency hotlines, and inquiry form.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router DOM 6, Axios, Lucide React Icons |
| **Design & UI** | Tailwind CSS (Custom Sage & Mint design tokens, Glassmorphism utilities, Plus Jakarta Sans typography) |
| **Backend** | Node.js, Express.js REST API |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Database** | MongoDB Atlas / Mongoose (persistent schema models, no automatic seeding) |

---

## 🚀 Quick Start & Local Execution

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### 2. Backend Setup
```powershell
cd D:\Medicare\backend
npm install
npm start
```
*The API server starts on **`http://localhost:5000`** with masked MongoDB Atlas connection logging.*

*(To create or update the first Administrator account, run `node scripts/createAdmin.js` inside the `backend` folder).*

### 3. Frontend Setup
In a new terminal:
```powershell
cd D:\Medicare\frontend
npm install
npm run dev
```
*Open **[http://localhost:3000](http://localhost:3000)** in your browser.*

---

## 🌐 Live Website Deployment & Submission Guide

### 1. Production Build
```powershell
cd D:\Medicare\frontend
npm run build
```
Generates production-optimized static assets in `frontend/dist`.

### 2. Live Hosting Deployment (1-Click)
- **Frontend (Vercel / Netlify)**:
  - Framework: `Vite`
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`
- **Backend (Render / Railway / Heroku)**:
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `node server.js`
  - Environment variables:
    - `PORT=5000`
    - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medicare?retryWrites=true&w=majority`
    - `JWT_SECRET=YourSuperSecretKeyHere`

---

## 📦 Project Submission Details

### 1. Source Code Repository
To push this project to your GitHub repository:
```powershell
# From the project root (D:\Medicare)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

### 2. Default Credentials for Testing
- **Administrator**: `admin@medicare.com` / `admin123`
- **Doctor**: Register a new doctor account on `/register` or log in with an approved doctor.
- **Patient**: Register a new patient account on `/register` or book appointments directly.

### 3. Submission Checklist
- [x] Responsive design across Desktop, Tablet, and Mobile screens.
- [x] Full-stack functionality: Patient registration, Doctor approval, Slot management, Real-time appointment booking.
- [x] Sage & Mint Glassmorphism UI redesign with medical cross symbols and healthcare badges.
- [x] Patient Directory displays only registered patients with role switchers.
- [x] Recent Activity displays real hospital operational events.
- [x] MongoDB Atlas integration without automatic demo data insertion.

