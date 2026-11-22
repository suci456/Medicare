import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDoctorById } from '../services/doctor';
import { fetchAvailabilityByDoctor } from '../services/availability';
import { bookAppointment } from '../services/appointment';
import { getCurrentUser } from '../services/auth';
import { 
  Star, 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Stethoscope, 
  ShieldCheck, 
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Building,
  GraduationCap
} from 'lucide-react';

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [doctor, setDoctor] = useState(null);
  const [availabilityList, setAvailabilityList] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadDoctorData = async () => {
      setLoading(true);
      setError('');
      try {
        const [docData, availData] = await Promise.all([
          fetchDoctorById(id).catch(() => null),
          fetchAvailabilityByDoctor(id).catch(() => []),
        ]);
        setDoctor(docData);
        const validAvail = Array.isArray(availData) ? availData : [];
        setAvailabilityList(validAvail);

        if (validAvail.length > 0) {
          const firstDateStr = new Date(validAvail[0].date).toISOString().split('T')[0];
          setSelectedDate(firstDateStr);
          setAvailableSlots(Array.isArray(validAvail[0].slots) ? validAvail[0].slots : []);
        } else {
          setSelectedDate('');
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error(err);
        setAvailabilityList([]);
        setAvailableSlots([]);
        setError('Doctor details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, [id]);

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedSlot('');
    setError('');

    const targetDate = new Date(dateStr);
    const validAvailList = Array.isArray(availabilityList) ? availabilityList : [];
    const match = validAvailList.find((av) => {
      const avDate = new Date(av.date);
      return avDate.toDateString() === targetDate.toDateString();
    });

    if (match && Array.isArray(match.slots)) {
      setAvailableSlots(match.slots);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleDirectBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      navigate(`/login?redirect=/doctors/${id}`);
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setError('Please select both a consultation date and an open time slot.');
      return;
    }

    setSubmitting(true);
    try {
      await bookAppointment({
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedSlot,
        slot: selectedSlot,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        reason: reason || 'Specialist Consultation',
      });

      setSuccessMsg('Your appointment has been booked! Redirecting to Patient Dashboard...');
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book slot. It may have just been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#527765] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-[#244C3B]">Doctor Profile Not Found</h2>
        <Link to="/doctors" className="inline-block px-4 py-2 bg-[#527765] text-white rounded-xl text-xs font-bold">
          Back to Specialists
        </Link>
      </div>
    );
  }

  const defaultPhoto =
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718278] hover:text-[#244C3B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Specialists</span>
        </Link>

        {/* Doctor Header Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/80 shadow-glass">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4">
              <img
                src={doctor.photoUrl || defaultPhoto}
                alt={doctor.name}
                className="w-full h-80 object-cover object-top rounded-2xl border border-[#88A995]/30 shadow-sm"
              />
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-[#D9EEE1] text-[#244C3B] px-3 py-1 rounded-full border border-[#88A995]/30">
                  {doctor.specialization}
                </span>
                <span className="text-xs font-bold bg-[#FAF9F4] text-[#527765] px-2.5 py-1 rounded-full border border-[#88A995]/20 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{doctor.rating || '4.9'} Rating</span>
                </span>
                <span className="text-xs font-semibold bg-[#EDF7F0] text-[#244C3B] px-2.5 py-1 rounded-full border border-[#88A995]/20">
                  Accredited Specialist
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244C3B]">{doctor.name}</h1>
              <p className="text-xs text-[#718278] leading-relaxed max-w-xl">
                {doctor.bio || 'Dedicated medical practitioner with clinical expertise and patient-centric care.'}
              </p>

              <div className="pt-4 border-t border-[#88A995]/20 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#718278] block">Clinical Experience</span>
                  <span className="font-bold text-base text-[#244C3B]">{doctor.experience}+ Years</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#718278] block">Consultation Fee</span>
                  <span className="font-bold text-base text-[#527765]">${doctor.fee}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#718278] block">Hospital</span>
                  <span className="font-bold text-xs text-[#244C3B] truncate block">{doctor.hospital || 'MediCare Hospital'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Available Slots Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/80 shadow-glass space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#244C3B]">Book Consultation with {doctor.name}</h3>
            <p className="text-xs text-[#718278] mt-1">
              Select an available calendar day and choose your consultation time slot
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-3.5 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleDirectBooking} className="space-y-6">
            {/* Days Selector */}
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Available Consultation Dates
              </label>

              {!Array.isArray(availabilityList) || availabilityList.length === 0 ? (
                <p className="text-xs text-[#718278] italic">No published availability slots for this physician.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {availabilityList.map((av) => {
                    const dStr = new Date(av.date).toISOString().split('T')[0];
                    const isSelected = selectedDate === dStr;
                    return (
                      <button
                        type="button"
                        key={av._id}
                        onClick={() => handleDateSelect(dStr)}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isSelected
                            ? 'bg-[#527765] text-white border-[#527765] shadow-xs'
                            : 'bg-white/80 border-[#88A995]/20 text-[#263B30] hover:bg-[#EDF7F0]'
                        }`}
                      >
                        <span className={`block text-[10px] uppercase font-bold ${isSelected ? 'text-[#D9EEE1]' : 'text-[#718278]'}`}>
                          {new Date(av.date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <span className="block text-base font-extrabold my-0.5">
                          {new Date(av.date).getDate()}
                        </span>
                        <span className={`block text-[10px] font-semibold ${isSelected ? 'text-[#D9EEE1]' : 'text-[#527765]'}`}>
                          {Array.isArray(av.slots) ? av.slots.length : 0} Slots
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Available Time Slots
              </label>

              {!Array.isArray(availableSlots) || availableSlots.length === 0 ? (
                <p className="text-xs text-[#718278] italic">
                  {selectedDate ? 'No time slots left on this date.' : 'Select a date above to display available times.'}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
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

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1.5">
                Consultation Reason (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. cardiac evaluation, routine health consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full glass-input text-xs px-3.5 py-2.5 rounded-xl text-[#263B30] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="bg-[#527765] hover:bg-[#3D5B4D] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm text-xs transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{submitting ? 'Confirming...' : 'Book This Appointment'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
