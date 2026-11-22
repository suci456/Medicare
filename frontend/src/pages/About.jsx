import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  Award, 
  Users, 
  Target, 
  Eye, 
  CheckCircle, 
  Activity, 
  ArrowRight, 
  Clock, 
  Building 
} from 'lucide-react';

function About() {
  const values = [
    {
      title: 'Clinical Integrity',
      desc: 'We adhere to the highest ethical and professional medical standards in every patient interaction and diagnosis.',
      icon: ShieldCheck,
    },
    {
      title: 'Compassionate Care',
      desc: 'Treating patients with deep empathy, dignity, and personalized attention tailored to their unique physical and emotional needs.',
      icon: HeartPulse,
    },
    {
      title: 'Modern Innovation',
      desc: 'Leveraging cutting-edge medical technologies, minimally invasive procedures, and continuous medical research.',
      icon: Award,
    },
    {
      title: 'Patient-First Focus',
      desc: 'Transparent consultations, zero hidden fees, and accessible healthcare scheduling available round the clock.',
      icon: Users,
    },
  ];

  const milestones = [
    { year: '2010', title: 'Founded MediCare Center', desc: 'Started with 25 specialists and an urgent care clinic.' },
    { year: '2015', title: 'Heart & Neuro Center', desc: 'Inaugurated full-fledged surgical suites and catheterization labs.' },
    { year: '2020', title: 'Digital Health Platform', desc: 'Launched real-time appointment booking and clinical portal.' },
    { year: '2026', title: 'Accredited Hospital Network', desc: 'Over 65+ certified physicians serving 25,000+ patients annually.' },
  ];

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider">
          About MediCare Hospital
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#244C3B] tracking-tight">
          Caring For You & Your Family’s Health
        </h1>
        <p className="text-sm sm:text-base text-[#718278] leading-relaxed">
          Founded with a vision to make premium clinical diagnosis and treatment accessible, transparent, and compassionate for all.
        </p>
      </section>

      {/* Hospital Overview Card (2 Columns) */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-glass">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B]">
              A Center of Healing & Medical Excellence
            </h2>
            <p className="text-xs sm:text-sm text-[#718278] leading-relaxed">
              MediCare Multispecialty Hospital is equipped with state-of-the-art diagnostic imaging, clinical laboratories, modern operating theaters, and inpatient recuperation rooms.
            </p>
            <p className="text-xs sm:text-sm text-[#718278] leading-relaxed">
              Our multidisciplinary medical team includes cardiologists, dermatologists, neurologists, orthopedic surgeons, and pediatricians committed to collaborative medicine.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition"
              >
                <span>Meet Our Physicians</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
              alt="Hospital Facility"
              className="w-full h-80 object-cover rounded-2xl border border-[#88A995]/30 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">Our Core Principles</h2>
          <p className="text-xs text-[#718278]">The clinical values guiding every consultation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                  <Icon className="w-6 h-6 text-[#527765]" />
                </div>
                <h4 className="text-base font-bold text-[#244C3B]">{v.title}</h4>
                <p className="text-xs text-[#718278] leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Milestones */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/80 shadow-glass space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-[#244C3B]">Hospital Journey & Milestones</h2>
          <p className="text-xs text-[#718278]">Over 16 years of patient care and technology adoption</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="bg-[#FAF9F4] p-5 rounded-2xl border border-[#88A995]/20 space-y-2">
              <span className="text-2xl font-extrabold text-[#527765] block">{m.year}</span>
              <h4 className="text-sm font-bold text-[#244C3B]">{m.title}</h4>
              <p className="text-xs text-[#718278] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
