import React, { useState } from 'react';
import api from '../services/api';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Building
} from 'lucide-react';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Please enter your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/contact', form);
      setSuccessMsg(data.message || 'Thank you! Your inquiry has been submitted to the MediCare clinical team.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider">
          Hospital Contact & Inquiries
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#244C3B] tracking-tight">
          Get in Touch With Our Care Team
        </h1>
        <p className="text-sm text-[#718278]">
          Have questions about medical departments, doctor accreditation, or your appointments? We are here to assist.
        </p>
      </section>

      {/* Main Grid: Contact Info on Left, Inquiry Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
            <h3 className="text-base font-bold text-[#244C3B]">Hospital Headquarters</h3>

            <div className="space-y-3 text-xs text-[#263B30]">
              <div className="flex items-start gap-3 p-3 bg-[#FAF9F4] rounded-2xl border border-[#88A995]/20">
                <MapPin className="w-5 h-5 text-[#527765] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#244C3B] block">Main Hospital Campus</span>
                  <span className="text-[#718278]">450 Healthcare Boulevard, Clinical District, NY 10021</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF9F4] rounded-2xl border border-[#88A995]/20">
                <Phone className="w-5 h-5 text-[#527765] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#244C3B] block">Telephone Helplines</span>
                  <span className="text-[#718278]">Emergency: +1 (800) 456-7890</span>
                  <span className="text-[#718278] block">OPD Scheduling: +1 (800) 456-7891</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF9F4] rounded-2xl border border-[#88A995]/20">
                <Mail className="w-5 h-5 text-[#527765] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#244C3B] block">Direct Clinical Email</span>
                  <span className="text-[#718278]">appointments@medicare-hospital.org</span>
                  <span className="text-[#718278] block">contact@medicare-hospital.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#FAF9F4] rounded-2xl border border-[#88A995]/20">
                <Clock className="w-5 h-5 text-[#527765] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#244C3B] block">Operating Hours</span>
                  <span className="text-[#718278]">Emergency Unit: 24 Hours / 7 Days</span>
                  <span className="text-[#718278] block">Specialist Outpatient: Mon - Sat 8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/80 shadow-glass space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#244C3B]">Send a Message</h3>
              <p className="text-xs text-[#718278] mt-1">
                Fill in the form below and our medical administration will respond within 24 hours.
              </p>
            </div>

            {successMsg && (
              <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-4 rounded-2xl flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full glass-input text-xs px-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@medicare.com"
                    className="w-full glass-input text-xs px-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Appointment rescheduling, doctor accreditation..."
                  className="w-full glass-input text-xs px-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Type your message or inquiry here..."
                  className="w-full glass-input text-xs p-3.5 rounded-xl text-[#263B30] focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm text-xs transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Submit Clinical Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
