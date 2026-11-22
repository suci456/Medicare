import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDoctors, fetchDepartments } from '../services/doctor';
import DoctorCard from '../components/DoctorCard';
import { 
  Search, 
  Filter, 
  Stethoscope, 
  SlidersHorizontal, 
  X, 
  DollarSign, 
  Award, 
  RefreshCw 
} from 'lucide-react';

function FindDoctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from URL params if present
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('specialization') || 'All');
  const [maxFee, setMaxFee] = useState(250);

  const loadDoctorsList = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedDept && selectedDept !== 'All') params.specialization = selectedDept;
      if (maxFee < 250) params.maxFee = maxFee;

      const [docsData, deptsData] = await Promise.all([
        fetchDoctors(params),
        fetchDepartments(),
      ]);

      setDoctors(docsData);
      setDepartments(['All', ...deptsData]);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch doctors list. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorsList();
  }, [selectedDept, maxFee]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDoctorsList();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9EEE1] text-[#244C3B] text-xs font-bold uppercase tracking-wider">
            Medical Faculty Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244C3B] tracking-tight">
            Find Accredited Specialists
          </h1>
          <p className="text-xs text-[#718278]">
            Browse certified hospital physicians across all clinical departments with instant slot booking
          </p>
        </div>

        {/* Glass Filter & Search Bar */}
        <div className="glass-card rounded-3xl p-6 border border-white/80 shadow-glass">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Search Doctor or Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#718278] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Dr. Maya, Cardiology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full glass-input text-xs pl-10 pr-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
                Specialty Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full glass-input text-xs px-3.5 py-3 rounded-xl text-[#263B30] focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Range */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#244C3B] uppercase tracking-wider">
                  Max Fee: ${maxFee}
                </label>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-[#527765]"
              />
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-center gap-2.5">
            <span>{error}</span>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-[#527765] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#718278]">Loading verified medical faculty...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-[#718278] text-xs space-y-2 border border-white/80">
            <Stethoscope className="w-8 h-8 text-[#88A995] mx-auto opacity-60" />
            <h3 className="font-bold text-sm text-[#244C3B]">No Doctors Found</h3>
            <p>Try resetting the search terms or department filters to see more medical staff.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindDoctors;
