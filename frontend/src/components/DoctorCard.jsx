import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  Building,
  GraduationCap
} from 'lucide-react';

function DoctorCard({ doctor }) {
  if (!doctor) return null;

  const defaultPhoto =
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="glass-card rounded-3xl p-6 card-hover-sage flex flex-col justify-between border border-white/80 transition-all duration-300">
      <div>
        {/* Doctor Photo & Availability Pill */}
        <div className="relative mb-5 overflow-hidden rounded-2xl group">
          <img
            src={doctor.photoUrl || defaultPhoto}
            alt={doctor.name}
            className="w-full h-56 object-cover object-top rounded-2xl group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = defaultPhoto;
            }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#244C3B] shadow-sm flex items-center gap-1 border border-white">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{doctor.rating || '4.9'}</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-[#244C3B]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#D9EEE1]" />
            <span>Verified Specialist</span>
          </div>
        </div>

        {/* Doctor Identity */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#527765] bg-[#D9EEE1]/80 px-2.5 py-0.5 rounded-full inline-block border border-[#88A995]/20">
            {doctor.specialization || 'General Medicine'}
          </span>
          <h3 className="text-lg font-bold text-[#244C3B] hover:text-[#527765] transition-colors leading-tight">
            {doctor.name}
          </h3>
          <p className="text-xs text-[#718278] flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#527765] shrink-0" />
            <span className="truncate">{doctor.hospital || 'MediCare Multispecialty Hospital'}</span>
          </p>
        </div>

        {/* Professional Metrics */}
        <div className="mt-4 pt-4 border-t border-[#88A995]/20 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#FAF9F4] p-2.5 rounded-xl border border-[#88A995]/15">
            <span className="text-[10px] text-[#718278] uppercase font-bold block">Experience</span>
            <span className="font-bold text-[#244C3B] text-sm">{doctor.experience || 5}+ Years</span>
          </div>
          <div className="bg-[#FAF9F4] p-2.5 rounded-xl border border-[#88A995]/15">
            <span className="text-[10px] text-[#718278] uppercase font-bold block">Consultation</span>
            <span className="font-bold text-[#527765] text-sm">${doctor.fee || 120}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-[#88A995]/15 flex items-center gap-2">
        <Link
          to={`/doctors/${doctor._id}`}
          className="flex-1 text-center py-2.5 px-3 rounded-xl border border-[#88A995]/40 text-xs font-bold text-[#244C3B] hover:bg-[#EDF7F0] transition"
        >
          View Profile
        </Link>
        <Link
          to={`/booking?doctorId=${doctor._id}`}
          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold shadow-sm hover:shadow transition flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Slot</span>
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;
