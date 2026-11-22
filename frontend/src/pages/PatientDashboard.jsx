import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyAppointments, cancelAppointment } from '../services/appointment';
import { getCurrentUser } from '../services/auth';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  RefreshCw, 
  FileText, 
  DollarSign, 
  Building, 
  Phone, 
  ArrowRight 
} from 'lucide-react';

function PatientDashboard() {
  const user = getCurrentUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
      setError('Unable to load your appointment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? The doctor slot will be returned to the calendar.')) {
      return;
    }
    try {
      await cancelAppointment(id);
      setActionMsg('Appointment cancelled. The time slot has been returned to the doctor schedule.');
      loadAppointments();
      setTimeout(() => setActionMsg(''), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validAppointments = Array.isArray(appointments) ? appointments : [];

  const upcomingList = validAppointments.filter((app) => {
    const d = new Date(app.date);
    return d >= today && app.status !== 'cancelled' && app.status !== 'rejected' && app.status !== 'completed';
  });

  const historyList = validAppointments.filter((app) => {
    const d = new Date(app.date);
    return d < today || app.status === 'cancelled' || app.status === 'rejected' || app.status === 'completed';
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/40">
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF9F4] text-[#718278] border border-[#88A995]/30">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] font-extrabold text-2xl shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold text-[#527765] tracking-wider">
                  Patient Health Records
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/30">
                  Verified Patient
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B] mt-1">
                Hello, {user?.name || 'Patient'}
              </h1>
              <p className="text-xs text-[#718278] mt-1">
                {user?.email} • Track your upcoming clinical consultations and appointment history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Visit</span>
            </Link>
            <button
              onClick={loadAppointments}
              className="p-2.5 rounded-xl bg-white hover:bg-[#EDF7F0] text-[#244C3B] border border-[#88A995]/30 shadow-sm transition"
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {actionMsg && (
          <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
            <span className="font-semibold">{actionMsg}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Upcoming Visits</span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Calendar className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">{upcomingList.length}</span>
            <span className="text-[11px] text-[#527765] font-semibold mt-2 block">Confirmed or pending review</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Total Bookings</span>
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F0] flex items-center justify-center text-[#527765]">
                <FileText className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">{appointments.length}</span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">Recorded in hospital database</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Completed Care</span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <CheckCircle className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#527765] mt-3 block">
              {appointments.filter((a) => a.status === 'completed').length}
            </span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">Past specialist consultations</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="glass-card rounded-2xl p-2 border border-white/80 flex gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Visits ({upcomingList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Past History ({historyList.length})</span>
          </button>
        </div>

        {/* Appointments Display */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-[#527765] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-[#718278]">Loading your healthcare records...</p>
            </div>
          ) : (activeTab === 'upcoming' ? upcomingList : historyList).length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Calendar className="w-10 h-10 text-[#88A995] mx-auto opacity-50" />
              <h4 className="text-base font-bold text-[#244C3B]">
                {activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Consultation History'}
              </h4>
              <p className="text-xs text-[#718278] max-w-sm mx-auto">
                {activeTab === 'upcoming'
                  ? 'You currently have no scheduled outpatient visits. Explore our specialist physicians and book a consultation slot.'
                  : 'You have no archived or past appointment records in the database.'}
              </p>
              {activeTab === 'upcoming' && (
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Appointment Now</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'upcoming' ? upcomingList : historyList).map((app) => (
                <div
                  key={app._id}
                  className="bg-white/80 p-5 rounded-2xl border border-[#88A995]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-[#88A995]/50 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        app.doctor?.photoUrl ||
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
                      }
                      alt={app.doctor?.name || 'Doctor'}
                      className="w-12 h-12 rounded-2xl object-cover object-top border border-[#88A995]/30 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#244C3B]">{app.doctor?.name || 'Physician'}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-[#527765] font-semibold">
                        {app.doctor?.specialization || 'Clinical Medicine'} • {app.doctor?.hospital || 'MediCare Hospital'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#718278] pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#527765]" />
                          <span>{new Date(app.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#244C3B]">
                          <Clock className="w-3.5 h-3.5 text-[#527765]" />
                          <span>{app.timeSlot || app.slot}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#527765] font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>${app.doctor?.fee || 120} Consultation</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && app.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => handleCancel(app._id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
