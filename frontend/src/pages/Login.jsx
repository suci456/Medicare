import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { login } from '../services/auth';
import {
  HeartPulse,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  Plus
} from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessNotice(location.state.message);
    }
    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(form);

      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }

      // Role-based redirect
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid credentials. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full glass-card rounded-3xl overflow-hidden shadow-glass border border-white/90 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Split Panel: Healthcare Visual & Soft Sage Overlay */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 text-white bg-[#244C3B] overflow-hidden">
          {/* Background Image with Sage Overlay */}
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
            alt="Healthcare professionals"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#244C3B]/90 via-[#3D5B4D]/85 to-[#244C3B]/95"></div>

          {/* Top Logo */}
          <div className="relative z-10 space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D9EEE1]">
                <HeartPulse className="w-5 h-5 text-[#D9EEE1]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Medi<span className="text-[#D9EEE1]">Care</span>
              </span>
            </Link>
            <p className="text-xs text-[#D9EEE1]/80">Accredited Clinical Network</p>
          </div>

          {/* Middle Healthcare Tagline */}
          <div className="relative z-10 space-y-3 my-12">
            <div className="w-10 h-1 rounded-full bg-[#D9EEE1]"></div>
            <h3 className="text-2xl font-bold text-white leading-tight">
              Care That Connects. <br />
              Health That Matters.
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Sign in to manage appointments, clinical schedules, or hospital operations.
            </p>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#D9EEE1]/90">
            <ShieldCheck className="w-4 h-4 text-[#D9EEE1]" />
            <span>Encrypted HIPAA-compliant portal</span>
          </div>
        </div>

        {/* Right Split Panel: Glassmorphic Login Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white/70 backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-[#718278] mt-1">
              Sign in using your registered email and password
            </p>
          </div>

          {successNotice && (
            <div className="mb-5 bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#527765]" />
              <span className="font-medium">{successNotice}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-xs mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[#88A995]/20">
            <p className="text-xs text-[#718278]">
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#527765] hover:text-[#244C3B] underline">
                Register as Patient or Doctor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
