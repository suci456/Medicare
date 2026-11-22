import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#FAF9F4] border-t border-[#88A995]/25 text-[#263B30] mt-auto">
      {/* Top Clinical Accreditation Banner */}
      <div className="bg-[#EDF7F0] border-b border-[#88A995]/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#88A995]/30 flex items-center justify-center text-[#527765] shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#527765]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#244C3B]">JCI & NABH Accredited</h4>
                <p className="text-xs text-[#718278]">Global healthcare safety & clinical benchmarks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#88A995]/30 flex items-center justify-center text-[#527765] shadow-sm">
                <Award className="w-6 h-6 text-[#527765]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#244C3B]">Certified Specialist Faculty</h4>
                <p className="text-xs text-[#718278]">Board-certified doctors across 24 specialties</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#88A995]/30 flex items-center justify-center text-[#527765] shadow-sm">
                <Clock className="w-6 h-6 text-[#527765]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#244C3B]">24/7 Trauma & Emergency</h4>
                <p className="text-xs text-[#718278]">Zero-delay triage, ICU & urgent surgery care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Hospital Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] shadow-sm">
                <div className="relative flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-[#527765]" />
                  <Plus className="w-2.5 h-2.5 text-[#244C3B] absolute -top-1 -right-1 font-extrabold stroke-[3]" />
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[#244C3B]">
                Medi<span className="text-[#527765]">Care</span>
              </span>
            </Link>

            <p className="text-xs text-[#718278] leading-relaxed max-w-sm">
              MediCare Hospital & Clinical Research Institute provides patient-centered, technology-driven clinical excellence with compassion, integrity, and verified outcomes.
            </p>

            <div className="pt-2 text-xs text-[#718278] space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#527765] shrink-0" />
                <span>450 Healthcare Boulevard, Clinical District, NY 10021</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#527765] shrink-0" />
                <span>Emergency: +1 (800) 456-7890 | Desk: +1 (800) 456-7891</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#527765] shrink-0" />
                <span>appointments@medicare-hospital.org</span>
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-4">
              Hospital Portal
            </h4>
            <ul className="space-y-2 text-xs text-[#718278]">
              <li>
                <Link to="/" className="hover:text-[#244C3B] hover:translate-x-1 inline-block transition-transform">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#244C3B] hover:translate-x-1 inline-block transition-transform">
                  About Our Hospital
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-[#244C3B] hover:translate-x-1 inline-block transition-transform">
                  Find Specialist Doctors
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#244C3B] hover:translate-x-1 inline-block transition-transform">
                  Book Consultation Slot
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#244C3B] hover:translate-x-1 inline-block transition-transform">
                  Contact & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div>
            <h4 className="text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-4">
              Clinical Specialties
            </h4>
            <ul className="space-y-2 text-xs text-[#718278]">
              <li>
                <Link to="/doctors?specialization=Cardiology" className="hover:text-[#244C3B]">
                  Cardiology & Heart Care
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Dermatology" className="hover:text-[#244C3B]">
                  Dermatology & Skin Laser
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Neurology" className="hover:text-[#244C3B]">
                  Neurology & Spine
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Orthopedics" className="hover:text-[#244C3B]">
                  Orthopedics & Joint Care
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Pediatrics" className="hover:text-[#244C3B]">
                  Pediatrics & Child Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Access */}
          <div>
            <h4 className="text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-4">
              Patient Access
            </h4>
            <ul className="space-y-2 text-xs text-[#718278]">
              <li>
                <Link to="/login" className="hover:text-[#244C3B]">
                  Patient Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#244C3B]">
                  Register New Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#244C3B]">
                  Doctor Accreditation
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#244C3B]">
                  Admin Operational Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#88A995]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718278] gap-4">
          <p>© {new Date().getFullYear()} MediCare Multispecialty Hospital System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#244C3B] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#244C3B] cursor-pointer">HIPAA Compliance</span>
            <span className="hover:text-[#244C3B] cursor-pointer">Terms of Healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
