import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// 10 Pages
import Home from './pages/Home';
import About from './pages/About';
import FindDoctors from './pages/FindDoctors';
import DoctorDetails from './pages/DoctorDetails';
import AppointmentBooking from './pages/AppointmentBooking';
import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* 1. Home Page */}
            <Route path="/" element={<Home />} />

            {/* 2. About Us */}
            <Route path="/about" element={<About />} />

            {/* 3. Find Doctors */}
            <Route path="/doctors" element={<FindDoctors />} />

            {/* 4. Doctor Details */}
            <Route path="/doctors/:id" element={<DoctorDetails />} />

            {/* 5. Dedicated Appointment Booking */}
            <Route path="/booking" element={<AppointmentBooking />} />

            {/* 6. Patient Registration & Login */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* 7. Patient Dashboard (Protected) */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            {/* 8. Doctor Dashboard (Protected) */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            {/* 9. Admin Dashboard (Protected) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 10. Contact Us */}
            <Route path="/contact" element={<Contact />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
