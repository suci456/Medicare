import React, { useEffect, useState } from 'react';
import { fetchDoctorAppointments, updateAppointmentStatus } from '../services/appointment';
import { fetchMyAvailability, addAvailability, removeAvailabilitySlot } from '../services/availability';
import { fetchMyDoctorProfile, updateMyDoctorProfile } from '../services/doctor';
import { getCurrentUser } from '../services/auth';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Plus, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Phone, 
  Building, 
  Edit, 
  DollarSign, 
  Award, 
  Check, 
  X 
} from 'lucide-react';

function DoctorDashboard() {
  const user = getCurrentUser();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Active appointment tab: 'today' | 'upcoming' | 'all'
  const [appointmentTab, setAppointmentTab] = useState('upcoming');

  // Form for adding new slots
  const [newDate, setNewDate] = useState('');
  const [newSlotsInput, setNewSlotsInput] = useState('09:00 AM, 10:30 AM, 02:00 PM, 04:00 PM');
  const [submittingSlot, setSubmittingSlot] = useState(false);

  // Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fee: '',
    phone: '',
    hospital: '',
    experience: '',
    qualifications: '',
    bio: '',
  });

  const loadDoctorData = async () => {
    setLoading(true);
    setError('');
    try {
      const [apptsData, availData, profData] = await Promise.all([
        fetchDoctorAppointments().catch(() => []),
        fetchMyAvailability().catch(() => []),
        fetchMyDoctorProfile().catch(() => null),
      ]);
      setAppointments(Array.isArray(apptsData) ? apptsData : []);
      setAvailability(Array.isArray(availData) ? availData : []);
      if (profData) {
        setDoctorProfile(profData);
        setProfileForm({
          fee: profData.fee || '',
          phone: profData.phone || '',
          hospital: profData.hospital || '',
          experience: profData.experience || '',
          qualifications: Array.isArray(profData.qualifications)
            ? profData.qualifications.join(', ')
            : profData.qualifications || '',
          bio: profData.bio || '',
        });
      }
    } catch (err) {
      console.error(err);
      setAppointments([]);
      setAvailability([]);
      setError('Unable to load doctor appointments and clinical schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setActionMsg('');
    try {
      await updateAppointmentStatus(id, newStatus);
      setActionMsg(`Appointment marked as ${newStatus.toUpperCase()}.`);
      loadDoctorData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newDate) {
      alert('Please choose a date to add availability.');
      return;
    }

    const slotsArr = newSlotsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (slotsArr.length === 0) {
      alert('Please enter at least one time slot.');
      return;
    }

    setSubmittingSlot(true);
    try {
      await addAvailability({ date: newDate, slots: slotsArr });
      setActionMsg('New consultation availability added to patient booking calendar.');
      setNewDate('');
      loadDoctorData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add availability.');
    } finally {
      setSubmittingSlot(false);
    }
  };

  const handleRemoveSlot = async (availId, availDate, slotToRemove) => {
    if (!window.confirm(`Remove slot ${slotToRemove}?`)) return;
    try {
      await removeAvailabilitySlot({ id: availId, date: availDate, slot: slotToRemove });
      setActionMsg(`Slot "${slotToRemove}" removed successfully.`);
      loadDoctorData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove slot.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateMyDoctorProfile(profileForm);
      setDoctorProfile(updated);
      setIsProfileModalOpen(false);
      setActionMsg('Doctor profile details updated successfully.');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  // Filter appointments
  const validAppointments = Array.isArray(appointments) ? appointments : [];
  const validAvailability = Array.isArray(availability) ? availability : [];

  const todayStr = new Date().toDateString();
  const todayAppointments = validAppointments.filter((a) => new Date(a.date).toDateString() === todayStr);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingAppointments = validAppointments.filter((a) => {
    const d = new Date(a.date);
    return d >= now && a.status !== 'cancelled' && a.status !== 'rejected';
  });

  const pendingAppointments = validAppointments.filter((a) => a.status === 'pending');
  const acceptedAppointments = validAppointments.filter((a) => a.status === 'accepted');

  const displayedAppointments =
    appointmentTab === 'today'
      ? todayAppointments
      : appointmentTab === 'upcoming'
      ? upcomingAppointments
      : validAppointments;

  const doctorStatus = doctorProfile?.status || 'approved';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] shadow-sm">
              <Stethoscope className="w-8 h-8 text-[#527765]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold text-[#527765] tracking-wider">
                  Physician & Clinical Portal
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    doctorStatus === 'approved'
                      ? 'bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/40'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  }`}
                >
                  {doctorStatus === 'approved' ? 'Accredited Specialist' : 'Pending Approval'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B] mt-1">
                {doctorProfile?.name || user?.name || 'Dr. Specialist'}
              </h1>
              <p className="text-xs text-[#718278] mt-1">
                {doctorProfile?.specialization || 'Clinical Specialist'} • {doctorProfile?.hospital || 'MediCare Hospital'} • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Doctor Profile</span>
            </button>
            <button
              onClick={loadDoctorData}
              className="p-2.5 rounded-xl bg-white hover:bg-[#EDF7F0] text-[#244C3B] text-xs transition border border-[#88A995]/30 shadow-sm"
              title="Sync Schedule"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Doctor Pending Approval Alert */}
        {doctorStatus === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-sm text-amber-950">Application Pending Admin Review</h4>
              <p className="text-amber-800">
                Your credentials are under verification by the MediCare clinical director. You can manage your profile and slots, but patients will only be able to book after an Admin marks your profile as Approved.
              </p>
            </div>
          </div>
        )}

        {actionMsg && (
          <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
            <span className="font-semibold">{actionMsg}</span>
          </div>
        )}

        {/* 4 Statistics Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Today's Visits</span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Clock className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">{todayAppointments.length}</span>
            <span className="text-[11px] text-[#527765] font-semibold mt-2 block">Scheduled for today</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Upcoming Visits</span>
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F0] flex items-center justify-center text-[#527765]">
                <Calendar className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">{upcomingAppointments.length}</span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">Next 7 days outpatient</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Pending Confirmation</span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <AlertCircle className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-amber-700 mt-3 block">{pendingAppointments.length}</span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">Requires your action</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">Consultation Fee</span>
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F0] flex items-center justify-center text-[#527765]">
                <DollarSign className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#527765] mt-3 block">${doctorProfile?.fee || 120}</span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">Per outpatient slot</span>
          </div>
        </div>

        {/* Main Grid: Appointments Table on Left, Availability Manager on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Appointments List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#244C3B]">Consultation Schedule</h3>
                  <p className="text-xs text-[#718278] mt-0.5">Manage patient consultations and confirm requests</p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF9F4] p-1.5 rounded-xl border border-[#88A995]/20 text-xs">
                  <button
                    onClick={() => setAppointmentTab('today')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      appointmentTab === 'today'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    Today ({todayAppointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentTab('upcoming')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      appointmentTab === 'upcoming'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    Upcoming ({upcomingAppointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentTab('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      appointmentTab === 'all'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    All ({appointments.length})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#EDF7F0]/80 text-[#244C3B] font-bold uppercase tracking-wider rounded-xl">
                      <th className="py-3 px-4 rounded-l-xl">Patient</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#88A995]/15">
                    {displayedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-[#718278]">
                          No appointments found for this view.
                        </td>
                      </tr>
                    ) : (
                      displayedAppointments.map((app) => {
                        const appStatus = app.status || 'pending';
                        return (
                          <tr key={app._id} className="hover:bg-white/60 transition">
                            <td className="py-4 px-4 font-bold text-[#244C3B]">
                              <span>{app.patient?.name || 'Registered Patient'}</span>
                            </td>
                            <td className="py-4 px-4 text-[#718278]">
                              <span>{app.patient?.phone || app.patient?.email || '—'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-[#244C3B] block">
                                {new Date(app.date).toLocaleDateString()}
                              </span>
                              <span className="text-[11px] text-[#527765] font-semibold">{app.timeSlot || app.slot}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  appStatus === 'accepted'
                                    ? 'bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/40'
                                    : appStatus === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : appStatus === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {appStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {appStatus === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                      className="p-1.5 rounded-lg bg-[#D9EEE1] hover:bg-[#BFDEC9] text-[#244C3B] font-bold text-[11px] px-2.5 transition flex items-center gap-1"
                                      title="Accept Appointment"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Accept</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2 transition flex items-center gap-1"
                                      title="Reject Appointment"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Decline</span>
                                    </button>
                                  </>
                                )}

                                {appStatus === 'accepted' && (
                                  <button
                                    onClick={() => handleStatusUpdate(app._id, 'completed')}
                                    className="p-1.5 rounded-lg bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold text-[11px] px-2.5 transition flex items-center gap-1"
                                    title="Mark Consultation Complete"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Complete</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Availability Slot Planner */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#244C3B]">Availability Slot Planner</h3>
                <p className="text-xs text-[#718278] mt-0.5">
                  Configure slots for patient appointment bookings
                </p>
              </div>

              {/* Add Slots Form */}
              <form onSubmit={handleAddSchedule} className="space-y-3 bg-[#FAF9F4] p-4 rounded-2xl border border-[#88A995]/20">
                <div>
                  <label className="block text-[11px] font-bold text-[#244C3B] uppercase mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full glass-input text-xs px-3 py-2 rounded-xl text-[#263B30] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-[#244C3B] uppercase">
                      Time Slots (comma-separated)
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="09:00 AM, 10:30 AM, 02:00 PM"
                    value={newSlotsInput}
                    onChange={(e) => setNewSlotsInput(e.target.value)}
                    className="w-full glass-input text-xs px-3 py-2 rounded-xl text-[#263B30] focus:outline-none"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] text-[#718278] mr-1 self-center">Quick Add:</span>
                    {['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'].map((slotPreset) => (
                      <button
                        type="button"
                        key={slotPreset}
                        onClick={() => {
                          const currentSlots = newSlotsInput.split(',').map((s) => s.trim()).filter(Boolean);
                          if (!currentSlots.includes(slotPreset)) {
                            setNewSlotsInput([...currentSlots, slotPreset].join(', '));
                          }
                        }}
                        className="text-[10px] font-semibold bg-[#EDF7F0] hover:bg-[#D9EEE1] text-[#244C3B] px-2 py-0.5 rounded-md border border-[#88A995]/30 transition"
                      >
                        +{slotPreset}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingSlot}
                  className="w-full bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submittingSlot ? 'Saving Slots...' : 'Publish Slots'}</span>
                </button>
              </form>

              {/* Active Slots by Day */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#244C3B] uppercase tracking-wider">
                  Active Consultation Days ({validAvailability.length})
                </h4>

                {validAvailability.length === 0 ? (
                  <p className="text-xs text-[#718278] italic">No active availability slots published.</p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {validAvailability.map((avail) => (
                      <div
                        key={avail._id}
                        className="bg-white/80 p-3 rounded-xl border border-[#88A995]/20 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-[#244C3B]">
                          <span>{new Date(avail.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className="text-[10px] text-[#527765] font-semibold">{Array.isArray(avail.slots) ? avail.slots.length : 0} Slots</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(avail.slots) && avail.slots.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1.5 bg-[#D9EEE1] text-[#244C3B] px-2.5 py-1 rounded-md text-[10px] font-semibold border border-[#88A995]/30"
                            >
                              <span>{s}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSlot(avail._id, avail.date, s)}
                                className="text-[#718278] hover:text-rose-600 transition p-0.5"
                                title={`Remove ${s} slot`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#244C3B]/40 backdrop-blur-sm">
            <div className="glass-modal rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#88A995]/20 pb-3">
                <h3 className="text-base font-bold text-[#244C3B]">Update Doctor Profile</h3>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-1.5 text-[#718278] hover:text-[#244C3B] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#244C3B] mb-1">Consultation Fee ($ USD)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={profileForm.fee}
                    onChange={(e) => setProfileForm({ ...profileForm, fee: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-[#263B30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#244C3B] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-[#263B30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#244C3B] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-[#263B30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#244C3B] mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={profileForm.hospital}
                    onChange={(e) => setProfileForm({ ...profileForm, hospital: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-[#263B30]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#244C3B] mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={profileForm.qualifications}
                    onChange={(e) => setProfileForm({ ...profileForm, qualifications: e.target.value })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-[#263B30]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#88A995]/20">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#88A995]/30 text-[#718278]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#527765] hover:bg-[#3D5B4D] text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
