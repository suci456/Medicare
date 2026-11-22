import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { 
  HeartPulse, 
  User, 
  LogOut, 
  Calendar, 
  Menu, 
  X, 
  ShieldCheck, 
  Stethoscope,
  ChevronRight,
  PhoneCall,
  Activity,
  Plus
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-semibold transition-all px-3.5 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-[#244C3B] bg-[#D9EEE1] font-bold shadow-sm'
        : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]/80'
    }`;

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 glass-nav-sage transition-all">
      {/* Top Clinical & Emergency Banner */}
      <div className="hidden lg:block bg-[#EDF7F0]/90 border-b border-[#88A995]/20 py-2 text-xs text-[#718278]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#244C3B] font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-[#527765]" />
              <span>24/7 Clinical Emergency: <strong>+1 (800) 456-7890</strong></span>
            </span>
            <span className="text-[#88A995]/40">•</span>
            <span className="text-[#718278]">Accredited Healthcare & Multispecialty Hospital</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#718278]">Mon - Sat: 8:00 AM - 8:00 PM</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#527765] animate-pulse"></span>
              Emergency OPD Open
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Medical Cross Symbol */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] shadow-sm group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-[#527765]" />
                <Plus className="w-3 h-3 text-[#244C3B] absolute -top-1 -right-1 font-extrabold stroke-[3]" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#244C3B] flex items-center">
                Medi<span className="text-[#527765]">Care</span>
                <span className="text-[10px] font-bold uppercase ml-1.5 px-2 py-0.5 rounded-md bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/30">
                  Hospital
                </span>
              </span>
              <p className="text-[10px] text-[#718278] tracking-wider uppercase font-semibold">
                Healthcare & Clinical Center
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkStyle}>
              About
            </NavLink>
            <NavLink to="/doctors" className={navLinkStyle}>
              Find Doctors
            </NavLink>
            <NavLink to="/booking" className={navLinkStyle}>
              Book Appointment
            </NavLink>
            <NavLink to="/contact" className={navLinkStyle}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Action & Profile Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-[#88A995]/30 shadow-sm transition hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#D9EEE1] text-[#244C3B] flex items-center justify-center font-bold text-xs">
                    {user.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-[#244C3B]" />
                    ) : user.role === 'doctor' ? (
                      <Stethoscope className="w-4 h-4 text-[#244C3B]" />
                    ) : (
                      <User className="w-4 h-4 text-[#244C3B]" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#244C3B] block leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-[#527765] block">
                      {user.role} Dashboard
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0] border border-transparent hover:border-[#88A995]/30 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-xs font-bold text-[#244C3B] hover:text-[#527765] px-4 py-2.5 rounded-xl hover:bg-[#EDF7F0] transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="text-xs font-bold bg-[#D9EEE1] hover:bg-[#BFDEC9] text-[#244C3B] border border-[#88A995]/30 px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow"
                >
                  Register
                </Link>

                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#527765] hover:bg-[#3D5B4D] text-white px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow-md ml-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#244C3B] hover:bg-[#EDF7F0] border border-[#88A995]/30 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic) */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-modal border-t border-[#88A995]/20 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#244C3B] py-2.5 px-3 rounded-xl hover:bg-[#EDF7F0]"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#244C3B] py-2.5 px-3 rounded-xl hover:bg-[#EDF7F0]"
          >
            About Us
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#244C3B] py-2.5 px-3 rounded-xl hover:bg-[#EDF7F0]"
          >
            Find Specialists
          </Link>
          <Link
            to="/booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#244C3B] py-2.5 px-3 rounded-xl hover:bg-[#EDF7F0]"
          >
            Book Appointment
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-[#244C3B] py-2.5 px-3 rounded-xl hover:bg-[#EDF7F0]"
          >
            Hospital Contact
          </Link>

          <div className="pt-4 border-t border-[#88A995]/20 space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-[#527765] text-white text-xs font-bold"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-[#88A995]/30 text-xs font-bold text-[#244C3B] hover:bg-[#EDF7F0]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-[#527765] text-white text-xs font-bold shadow"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
