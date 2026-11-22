import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchDoctors, fetchDoctorById } from '../services/doctor';
import { fetchAvailabilityByDoctor } from '../services/availability';
import { bookAppointment } from '../services/appointment';
import { getCurrentUser } from '../services/auth';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  FileText,
  DollarSign,
  Building,
  Check
} from 'lucide-react';

function AppointmentBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || '';
  const currentUser = getCurrentUser();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const [patientDetails, setPatientDetails] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Load Doctors list on mount
  useEffect(() => {
    const init = async () => {
      try {
        const docs = await fetchDoctors();
        setDoctors(docs);
        if (initialDoctorId) {
          const chosen = docs.find((d) => d._id === initialDoctorId);
          if (chosen) setSelectedDoctor(chosen);
        } else if (docs.length > 0) {
          setSelectedDoctorId(docs[0]._id);
          setSelectedDoctor(docs[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch doctors list.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [initialDoctorId]);

  // 2. When selected doctor changes, fetch their availability schedule
  useEffect(() => {
    if (!selectedDoctorId) return;

    const loadDoctorSchedule = async () => {
      try {
        const [docData, availData] = await Promise.all([
          fetchDoctorById(selectedDoctorId),
          fetchAvailabilityByDoctor(selectedDoctorId),
        ]);
        setSelectedDoctor(docData);
        setAvailability(availData);

        if (availData.length > 0) {
          const firstDateStr = new Date(availData[0].date).toISOString().split('T')[0];
          setSelectedDate(firstDateStr);
          setAvailableSlots(availData[0].slots || []);
        } else {
          setSelectedDate('');
          setAvailableSlots([]);
        }
        setSelectedSlot('');
      } catch (e) {
        console.error('Error fetching availability:', e);
      }
    };

    loadDoctorSchedule();
  }, [selectedDoctorId]);

  // 3. When date selection changes, update time slots
  const handleDateChange = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedSlot('');

    const matched = availability.find((a) => {
      const aDate = new Date(a.date).toISOString().split('T')[0];
      return aDate === dateStr;
    });

    if (matched) {
      setAvailableSlots(matched.slots || []);
    } else {
      setAvailableSlots([]);
    }
  };

  // 4. Handle Booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      navigate('/login?redirect=/booking');
      return;
    }

    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setError('Please select doctor, consultation date, and an available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        doctorId: selectedDoctorId,
        date: selectedDate,
        timeSlot: selectedSlot,
        slot: selectedSlot,
        patientName: patientDetails.name || currentUser.name,
        patientEmail: patientDetails.email || currentUser.email,
        patientPhone: patientDetails.phone,
        reason: reason || 'Specialist Consultation',
      });

      setSuccess('Appointment confirmed successfully! Redirecting to your Patient Dashboard...');
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to book appointment. This slot may have just been reserved by another patient.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Compute active step (1 to 4)
  const currentStep = !selectedDoctorId
    ? 1
    : !selectedDate
    ? 2
    : !selectedSlot
    ? 3
    : 4;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider">
            Clinical Outpatient Scheduling
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244C3B] tracking-tight">
            Book Specialist Appointment
          </h1>
          <p className="text-xs text-[#718278]">
            Select your accredited physician, verify available calendar slots, and confirm your visit.
          </p>
        </div>

        {/* Multi-step Glassmorphic Progress Indicator */}
        <div className="glass-card rounded-2xl p-4 border border-white/80 shadow-glass">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-xl transition ${currentStep >= 1 ? 'bg-[#D9EEE1] text-[#244C3B] font-bold' : 'text-[#718278]'}`}>
              <span className="block text-[10px] uppercase font-bold text-[#527765]">Step 1</span>
              <span>Select Doctor</span>
            </div>
            <div className={`p-2 rounded-xl transition ${currentStep >= 2 ? 'bg-[#D9EEE1] text-[#244C3B] font-bold' : 'text-[#718278]'}`}>
              <span className="block text-[10px] uppercase font-bold text-[#527765]">Step 2</span>
              <span>Pick Date</span>
            </div>
            <div className={`p-2 rounded-xl transition ${currentStep >= 3 ? 'bg-[#D9EEE1] text-[#244C3B] font-bold' : 'text-[#718278]'}`}>
              <span className="block text-[10px] uppercase font-bold text-[#527765]">Step 3</span>
              <span>Choose Slot</span>
            </div>
            <div className={`p-2 rounded-xl transition ${currentStep >= 4 ? 'bg-[#527765] text-white font-bold' : 'text-[#718278]'}`}>
              <span className="block text-[10px] uppercase font-bold opacity-80">Step 4</span>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        {/* Global Alerts */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        {/* Booking Form Layout */}
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Doctor Selector */}
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#244C3B]">
                <Stethoscope className="w-4 h-4 text-[#527765]" />
                <span>1. Select Attending Physician</span>
              </div>

              {doctors.length === 0 ? (
                <p className="text-xs text-[#718278]">No approved doctors available currently.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {doctors.map((doc) => (
                    <div
                      key={doc._id}
                      onClick={() => setSelectedDoctorId(doc._id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        selectedDoctorId === doc._id
                          ? 'bg-[#D9EEE1] border-[#88A995]/60 shadow-xs'
                          : 'bg-white/70 border-[#88A995]/20 hover:bg-[#EDF7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover object-top border border-[#88A995]/30"
                        />
                        <div>
                          <span className="font-bold text-xs text-[#244C3B] block">{doc.name}</span>
                          <span className="text-[11px] text-[#718278]">{doc.specialization} • {doc.experience}y Exp</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#527765]">${doc.fee}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Available Date Selector */}
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#244C3B]">
                <Calendar className="w-4 h-4 text-[#527765]" />
                <span>2. Select Consultation Date</span>
              </div>

              {availability.length === 0 ? (
                <div className="p-4 bg-[#FAF9F4] rounded-2xl border border-[#88A995]/20 text-xs text-[#718278]">
                  This physician has no open consultation slots listed. Please select another doctor.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availability.map((avail) => {
                    const dStr = new Date(avail.date).toISOString().split('T')[0];
                    const isSelected = selectedDate === dStr;
                    return (
                      <button
                        type="button"
                        key={avail._id}
                        onClick={() => handleDateChange(dStr)}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isSelected
                            ? 'bg-[#527765] text-white border-[#527765] shadow-xs'
                            : 'bg-white/80 border-[#88A995]/20 text-[#263B30] hover:bg-[#EDF7F0]'
                        }`}
                      >
                        <span className={`block text-[10px] uppercase font-bold ${isSelected ? 'text-[#D9EEE1]' : 'text-[#718278]'}`}>
                          {new Date(avail.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <span className="block text-sm font-extrabold my-0.5">
                          {new Date(avail.date).getDate()}
                        </span>
                        <span className={`block text-[10px] font-semibold ${isSelected ? 'text-[#D9EEE1]' : 'text-[#527765]'}`}>
                          {avail.slots?.length || 0} Slots
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Time Slot Cards */}
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#244C3B]">
                <Clock className="w-4 h-4 text-[#527765]" />
                <span>3. Select Consultation Time Slot</span>
              </div>

              {availableSlots.length === 0 ? (
                <p className="text-xs text-[#718278] italic">
                  {selectedDate ? 'No open slots on this date.' : 'Select a date above to display available times.'}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-[#527765] text-white border-[#527765] shadow-xs'
                            : 'bg-[#D9EEE1]/80 hover:bg-[#D9EEE1] text-[#244C3B] border-[#88A995]/30'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Patient Contact Details & Booking Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Patient Form Fields */}
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4">
              <h3 className="font-bold text-sm text-[#244C3B]">Patient Information</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#244C3B] uppercase mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                    className="w-full glass-input text-xs px-3.5 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#244C3B] uppercase mb-1">
                    Patient Phone
                  </label>
                  <input
                    type="text"
                    value={patientDetails.phone}
                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                    className="w-full glass-input text-xs px-3.5 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#244C3B] uppercase mb-1">
                    Reason for Consultation (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full glass-input text-xs p-3 rounded-xl text-[#263B30] focus:outline-none"
                    placeholder="e.g. routine checkup, heart symptom evaluation..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Booking Summary Panel */}
            <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass space-y-4 bg-gradient-to-br from-[#D9EEE1]/50 to-[#EDF7F0]/80">
              <h3 className="font-bold text-sm text-[#244C3B]">Booking Summary</h3>

              <div className="space-y-2.5 text-xs text-[#263B30]">
                <div className="flex justify-between border-b border-[#88A995]/20 pb-2">
                  <span className="text-[#718278]">Specialist:</span>
                  <span className="font-bold text-[#244C3B]">{selectedDoctor?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between border-b border-[#88A995]/20 pb-2">
                  <span className="text-[#718278]">Specialty:</span>
                  <span className="font-semibold text-[#527765]">{selectedDoctor?.specialization || '—'}</span>
                </div>
                <div className="flex justify-between border-b border-[#88A995]/20 pb-2">
                  <span className="text-[#718278]">Consultation Date:</span>
                  <span className="font-bold text-[#244C3B]">{selectedDate || 'Not selected'}</span>
                </div>
                <div className="flex justify-between border-b border-[#88A995]/20 pb-2">
                  <span className="text-[#718278]">Time Slot:</span>
                  <span className="font-bold text-[#527765]">{selectedSlot || 'Not selected'}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold text-[#244C3B]">
                  <span>Consultation Fee:</span>
                  <span className="text-[#527765]">${selectedDoctor?.fee || 120}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{submitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}</span>
              </button>

              <p className="text-[10px] text-center text-[#718278]">
                Instant reservation in hospital database with real-time slot synchronization.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentBooking;
