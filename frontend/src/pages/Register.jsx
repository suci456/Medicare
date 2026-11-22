import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Phone,
  Briefcase,
  DollarSign,
  GraduationCap,
  Building,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus
} from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // 'patient' | 'doctor'
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD',
    experience: '5',
    fee: '120',
    hospital: 'MediCare Multispecialty Hospital',
    bio: 'Dedicated medical practitioner with clinical expertise and patient-centric care.',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all mandatory fields (Name, Email, Password).');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (form.role === 'doctor') {
      if (!form.specialization || !form.experience || !form.fee) {
        setError('Doctors must provide specialization, experience, and consultation fee.');
        return;
      }
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
        specialization: form.specialization,
        qualifications: form.qualifications,
        experience: form.experience,
        fee: form.fee,
        hospital: form.hospital,
        bio: form.bio,
      });

      const isDoc = form.role === 'doctor';
      setSuccessMsg(
        isDoc
          ? 'Doctor profile submitted! Your account has been saved in MongoDB (pending Admin review). Redirecting to Login...'
          : 'Patient account registered successfully in MongoDB! Redirecting to Login to sign in manually...'
      );

      setTimeout(() => {
        navigate('/login', {
          state: {
            email: form.email,
            message: isDoc
              ? 'Doctor registration recorded! Please sign in with your credentials.'
              : 'Patient account created in database! Please sign in to access your dashboard.',
          },
        });
      }, 1600);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. An account with this email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full glass-card rounded-3xl p-6 sm:p-10 border border-white/90 shadow-glass">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] shadow-sm">
              <HeartPulse className="w-5 h-5 text-[#527765]" />
            </div>
            <span className="text-2xl font-extrabold text-[#244C3B] tracking-tight">
              Medi<span className="text-[#527765]">Care</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B] tracking-tight">
            {form.role === 'doctor' ? 'Doctor Professional Registration' : 'Create Patient Account'}
          </h2>
          <p className="text-xs text-[#718278] mt-1">
            {form.role === 'doctor'
              ? 'Join our medical specialist panel. Your profile will be reviewed for accreditation.'
              : 'Book specialist appointments and manage your personal healthcare history'}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, role: 'patient' }))}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2.5 ${
              form.role === 'patient'
                ? 'bg-[#D9EEE1] text-[#244C3B] border-[#88A995]/50 shadow-sm'
                : 'bg-white/60 text-[#718278] border-[#88A995]/20 hover:bg-[#EDF7F0]'
            }`}
          >
            <User className="w-4 h-4 text-[#527765]" />
            <span>Register as Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, role: 'doctor' }))}
            className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2.5 ${
              form.role === 'doctor'
                ? 'bg-[#D9EEE1] text-[#244C3B] border-[#88A995]/50 shadow-sm'
                : 'bg-white/60 text-[#718278] border-[#88A995]/20 hover:bg-[#EDF7F0]'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#527765]" />
            <span>Register as Doctor</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#527765]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={form.role === 'doctor' ? 'Dr. Sarah Jenkins' : 'John Doe'}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full glass-input text-xs pl-10 pr-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@medicare.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full glass-input text-xs pl-10 pr-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="phone"
                placeholder="+1 (555) 234-5678"
                value={form.phone}
                onChange={handleChange}
                className="w-full glass-input text-xs pl-10 pr-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
              />
            </div>
          </div>

          {/* Doctor-Specific Fields */}
          {form.role === 'doctor' && (
            <div className="p-4 bg-[#EDF7F0]/80 rounded-2xl border border-[#88A995]/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#527765] block">
                Doctor Professional Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#244C3B] mb-1">Specialization</label>
                  <select
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full glass-input text-xs px-3 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#244C3B] mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    name="experience"
                    required
                    min="1"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full glass-input text-xs px-3 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#244C3B] mb-1">Fee ($ USD)</label>
                  <input
                    type="number"
                    name="fee"
                    required
                    min="10"
                    value={form.fee}
                    onChange={handleChange}
                    className="w-full glass-input text-xs px-3 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#244C3B] mb-1">
                  Qualifications (e.g. MBBS, MD, FACC)
                </label>
                <input
                  type="text"
                  name="qualifications"
                  value={form.qualifications}
                  onChange={handleChange}
                  className="w-full glass-input text-xs px-3 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Password & Confirm Password with Visibility Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full glass-input text-xs pl-10 pr-10 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#718278] hover:text-[#244C3B] transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full glass-input text-xs pl-10 pr-10 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-[#718278] hover:text-[#244C3B] transition"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-xs mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {loading
                ? 'Saving Record in MongoDB...'
                : form.role === 'doctor'
                ? 'Submit Doctor Application'
                : 'Create Patient Account'}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-[#88A995]/20">
          <p className="text-xs text-[#718278]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#527765] hover:text-[#244C3B] underline">
              Sign In to Your Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
