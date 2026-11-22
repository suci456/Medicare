import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../services/doctor';
import DoctorCard from '../components/DoctorCard';
import { 
  HeartPulse, 
  Search, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Activity,
  Stethoscope,
  Smile,
  Users,
  ChevronRight,
  PhoneCall,
  MapPin,
  Mail,
  Sparkles,
  Building,
  Check,
  ChevronDown,
  UserCheck,
  Microscope,
  HelpCircle,
  Plus
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const [searchForm, setSearchForm] = useState({
    specialization: 'All',
    date: '',
    search: '',
  });

  const loadFeatured = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const docs = await fetchDoctors();
      const validDocs = Array.isArray(docs) ? docs : [];
      setFeaturedDoctors(validDocs.slice(0, 4));
    } catch (e) {
      console.error('Failed to load doctors:', e);
      setFeaturedDoctors([]);
      setLoadError(
        e.message || 'Unable to connect to the medical server. Please verify backend service is active.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.specialization && searchForm.specialization !== 'All') {
      params.append('specialization', searchForm.specialization);
    }
    if (searchForm.search) {
      params.append('search', searchForm.search);
    }
    navigate(`/doctors?${params.toString()}`);
  };

  const services = [
    {
      title: 'General Medicine',
      desc: 'Comprehensive primary care, health screenings, routine diagnostics, and preventative consultations.',
      icon: Stethoscope,
      dept: 'General Medicine',
    },
    {
      title: 'Cardiology',
      desc: 'Advanced ECG diagnostics, non-invasive cardiac evaluation, bypass recovery, and heart rhythm care.',
      icon: HeartPulse,
      dept: 'Cardiology',
    },
    {
      title: 'Dermatology',
      desc: 'Clinical dermatology, pediatric skin health, allergy assessments, and advanced laser therapies.',
      icon: Sparkles,
      dept: 'Dermatology',
    },
    {
      title: 'Neurology',
      desc: 'Specialized neuro-diagnostic tests, migraine management, EEG monitoring, and spine care.',
      icon: Activity,
      dept: 'Neurology',
    },
    {
      title: 'Orthopedics',
      desc: 'Joint replacement, fracture triage, sports injury recovery, and minimally invasive surgeries.',
      icon: Award,
      dept: 'Orthopedics',
    },
    {
      title: 'Pediatrics',
      desc: 'Dedicated infant care, vaccination programs, growth assessments, and pediatric emergencies.',
      icon: Smile,
      dept: 'Pediatrics',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Find a Specialist',
      desc: 'Browse certified hospital physicians by specialty, clinical experience, and ratings.',
    },
    {
      num: '02',
      title: 'Select a Date',
      desc: 'Choose your preferred calendar day with real-time OPD hospital availability.',
    },
    {
      num: '03',
      title: 'Choose Time Slot',
      desc: 'Select from available morning or afternoon consultation slots with zero waiting.',
    },
    {
      num: '04',
      title: 'Confirm Appointment',
      desc: 'Receive immediate booking confirmation synchronized across patient and doctor desks.',
    },
  ];

  const testimonials = [
    {
      quote:
        'The online booking with Dr. Maya was completely seamless. I walked in, was seen on time, and received outstanding cardiology care.',
      author: 'Eleanor Vance',
      role: 'Cardiac Patient',
      rating: 5,
    },
    {
      quote:
        'Finding a trusted pediatrician for my child used to take days. MediCare showed real available slots and the consultation was top tier.',
      author: 'David Chen',
      role: 'Parent & Patient',
      rating: 5,
    },
    {
      quote:
        'From dermatology prescription review to appointment status updates, MediCare gives you genuine peace of mind.',
      author: 'Sophia Martinez',
      role: 'Outpatient Care',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How do I book an appointment with a specialist?',
      a: 'Select your preferred doctor from our "Find Doctors" page or use the booking tab, choose your available date and time slot, and confirm. Your booking is recorded directly in our hospital database.',
    },
    {
      q: 'Can doctors manage their own consultation slots?',
      a: 'Yes. Once accredited by the Admin, doctors can sign in to their personal Doctor Dashboard to add, remove, or customize available daily morning and evening slots.',
    },
    {
      q: 'How does doctor accreditation work?',
      a: 'Doctors who register online remain in "Pending Review" status until our Chief Medical Officer approves their license in the Admin Console.',
    },
    {
      q: 'Is emergency consultation available 24/7?',
      a: 'Yes. Our clinical trauma unit and emergency department operate around the clock at 450 Healthcare Boulevard with zero-delay triage.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION (Sage & Mint Glassmorphism 2-Column) */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand & Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9EEE1] border border-[#88A995]/30 text-[#244C3B] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#527765] animate-pulse"></span>
              Your Health, Our Priority
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#244C3B] tracking-tight leading-[1.12]">
              Care That Connects. <br />
              <span className="text-[#527765]">Health That Matters.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#718278] leading-relaxed max-w-xl">
              Experience modern, patient-first medicine. Connect with board-certified physicians, explore real-time consultation slots, and manage hospital visits in one secure healthcare ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/booking"
                className="bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition transform active:scale-95 flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              <Link
                to="/doctors"
                className="bg-[#D9EEE1] hover:bg-[#BFDEC9] text-[#244C3B] border border-[#88A995]/30 font-bold py-3.5 px-6 rounded-2xl transition flex items-center gap-2 text-sm shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Find a Doctor</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#88A995]/20 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <span className="text-2xl font-extrabold text-[#244C3B]">24+</span>
                <span className="text-xs text-[#718278] block font-medium">Specialties</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#244C3B]">99.4%</span>
                <span className="text-xs text-[#718278] block font-medium">Positive Care</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#244C3B]">0 Min</span>
                <span className="text-xs text-[#718278] block font-medium">Queue Delay</span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Hospital Visual with Floating Glass Cards */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Sage Glow Blob */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#D9EEE1]/70 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#88A995]/20 rounded-full blur-2xl -z-10 pointer-events-none"></div>

            {/* Main Rounded Image Container */}
            <div className="relative rounded-3xl overflow-hidden glass-card p-3 border border-white/90 shadow-glass">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Hospital Medical Specialist"
                className="w-full h-[440px] object-cover object-top rounded-2xl"
              />

              {/* Floating Glass Appointment Card */}
              <div className="absolute top-6 left-6 glass-card rounded-2xl p-3.5 border border-white/90 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                  <CheckCircle className="w-5 h-5 text-[#527765]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#244C3B] block">Dr. Sarah Jenkins</span>
                  <span className="text-[10px] text-[#718278] block">Cardiology • 4.9 ★ (120+ visits)</span>
                </div>
              </div>

              {/* Floating Doctor Availability Indicator */}
              <div className="absolute bottom-6 right-6 glass-card rounded-2xl p-3.5 border border-white/90 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#527765] text-white flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#D9EEE1]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#244C3B] block">Available Today</span>
                  <span className="text-[10px] text-[#527765] font-semibold block">12 Verified Slots Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SEARCH & BOOKING BAR (Glassmorphism) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Specialty Department
              </label>
              <select
                value={searchForm.specialization}
                onChange={(e) => setSearchForm({ ...searchForm, specialization: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-3 text-xs text-[#263B30] focus:outline-none"
              >
                <option value="All">All Medical Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Preferred Consultation Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={searchForm.date}
                onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-3 text-xs text-[#263B30] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Doctor Name or Condition
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Dr. Maya, heart care..."
                  value={searchForm.search}
                  onChange={(e) => setSearchForm({ ...searchForm, search: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-3.5 py-3 text-xs text-[#263B30] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search Available Doctors</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. HEALTHCARE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider">
            Clinical Centers of Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#244C3B]">
            Hospital Specialties & Departments
          </h2>
          <p className="text-sm text-[#718278]">
            Equipped with modern diagnostics, operating theaters, and compassionate specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="glass-card rounded-3xl p-7 card-hover-sage border border-white/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D9EEE1] flex items-center justify-center text-[#527765] mb-5">
                    <Icon className="w-6 h-6 text-[#527765]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#244C3B] mb-2">{svc.title}</h3>
                  <p className="text-xs text-[#718278] leading-relaxed">{svc.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#88A995]/20">
                  <Link
                    to={`/doctors?specialization=${svc.dept}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#527765] hover:text-[#244C3B]"
                  >
                    <span>View Specialist Faculty</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED APPROVED DOCTORS (Real Database Integration) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider mb-2">
              Medical Faculty
            </div>
            <h2 className="text-3xl font-extrabold text-[#244C3B]">
              Featured Specialist Physicians
            </h2>
            <p className="text-xs text-[#718278] mt-1">
              Accredited doctors verified by our hospital board
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#244C3B] bg-[#D9EEE1] hover:bg-[#BFDEC9] border border-[#88A995]/30 px-4 py-2.5 rounded-xl transition"
          >
            <span>Explore All Specialists</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-[#527765] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#718278]">Loading verified hospital doctors...</p>
          </div>
        ) : loadError ? (
          <div className="glass-card rounded-2xl p-8 text-center text-xs space-y-3 border border-amber-200/60 bg-amber-50/40 max-w-xl mx-auto">
            <p className="text-[#263B30] font-semibold">{loadError}</p>
            <button
              onClick={loadFeatured}
              className="px-4 py-2 rounded-xl bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold transition shadow-sm inline-flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Retry Medical Connection</span>
            </button>
          </div>
        ) : !Array.isArray(featuredDoctors) || featuredDoctors.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-[#718278] text-xs">
            No doctors currently listed. Register as doctor or check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE MEDICARE? (4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-glass">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl font-extrabold text-[#244C3B]">
              Why Choose MediCare Hospital?
            </h2>
            <p className="text-xs text-[#718278]">
              Delivering dependable, empathetic, and clinical healthcare excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF9F4]/80 p-5 rounded-2xl border border-[#88A995]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#244C3B]">Qualified Doctors</h4>
              <p className="text-xs text-[#718278] leading-relaxed">
                Every physician on our panel undergoes stringent credential verification and hospital board accreditation.
              </p>
            </div>

            <div className="bg-[#FAF9F4]/80 p-5 rounded-2xl border border-[#88A995]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#244C3B]">Easy Appointment Booking</h4>
              <p className="text-xs text-[#718278] leading-relaxed">
                Choose doctor, date, and exact consultation slot in seconds without traditional waiting line delays.
              </p>
            </div>

            <div className="bg-[#FAF9F4]/80 p-5 rounded-2xl border border-[#88A995]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#244C3B]">Secure Patient Records</h4>
              <p className="text-xs text-[#718278] leading-relaxed">
                HIPAA-compliant, encrypted database management safeguarding personal health and consultation histories.
              </p>
            </div>

            <div className="bg-[#FAF9F4]/80 p-5 rounded-2xl border border-[#88A995]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#244C3B]">Convenient Healthcare</h4>
              <p className="text-xs text-[#718278] leading-relaxed">
                Comprehensive patient dashboards, cancellation management, and 24/7 emergency trauma response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">How It Works</h2>
          <p className="text-xs text-[#718278]">
            Four quick steps to your verified specialist medical consultation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage space-y-3 relative"
            >
              <span className="text-3xl font-extrabold text-[#88A995]/40 block">{st.num}</span>
              <h4 className="text-base font-bold text-[#244C3B]">{st.title}</h4>
              <p className="text-xs text-[#718278] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">
            Patient Experiences & Outcomes
          </h2>
          <p className="text-xs text-[#718278]">
            Read testimonials from patients treated across our hospital clinics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-7 border border-white/80 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(Math.max(1, t.rating || 5))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#263B30] italic leading-relaxed">"{t.quote}"</p>
              <div className="pt-3 border-t border-[#88A995]/20">
                <span className="text-xs font-bold text-[#244C3B] block">{t.author}</span>
                <span className="text-[10px] text-[#718278]">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#718278]">
            Everything you need to know about booking, doctor approvals, and hospital care
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left text-xs sm:text-sm font-bold text-[#244C3B] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#527765] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#718278] leading-relaxed border-t border-[#88A995]/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. APPOINTMENT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 text-center space-y-4 bg-gradient-to-br from-[#D9EEE1]/60 to-[#EDF7F0]/80">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">
            Ready to Consult with a Medical Specialist?
          </h2>
          <p className="text-xs text-[#718278] max-w-xl mx-auto">
            Book your consultation now or register as a doctor to join our accredited medical faculty.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/booking"
              className="bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm text-xs transition"
            >
              Book an Appointment
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-[#FAF9F4] text-[#244C3B] border border-[#88A995]/30 font-bold py-3.5 px-6 rounded-2xl text-xs transition shadow-sm"
            >
              Join Medical Panel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
