import React, { useEffect, useState } from 'react';
import {
  fetchAdminStats,
  fetchAllUsers,
  deleteUser,
  fetchAdminDoctors,
  createDoctor,
  updateDoctor,
  updateDoctorStatus,
  deleteDoctor,
} from '../services/admin';
import { fetchAllAppointments, updateAppointmentStatus } from '../services/appointment';
import { getCurrentUser } from '../services/auth';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Check,
  Ban,
  Clock,
  Phone,
  Building,
  UserCheck,
  User,
  Activity,
  ChevronRight
} from 'lucide-react';

function AdminDashboard() {
  const adminUser = getCurrentUser();

  const [stats, setStats] = useState({
    totalDoctors: 0,
    pendingDoctors: 0,
    approvedDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });

  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'patients' | 'appointments' | 'activity'
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  
  // Patient Directory filter: default to 'patient' so only registered patients are shown!
  const [patientRoleFilter, setPatientRoleFilter] = useState('patient'); // 'patient' | 'all' | 'doctor' | 'admin'
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  const [doctorsList, setDoctorsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Doctor Modal State (Add or Edit)
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'doctor123',
    specialization: 'Cardiology',
    experience: '8',
    fee: '120',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    qualifications: 'MBBS, MD',
    bio: 'Dedicated medical faculty specialist providing evidence-based healthcare treatments.',
    hospital: 'MediCare Multispecialty Hospital',
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, docsData, usersData, apptsData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminDoctors(),
        fetchAllUsers(),
        fetchAllAppointments(),
      ]);

      setStats(statsData);
      setDoctorsList(docsData);
      setUsersList(usersData);
      setAppointmentsList(apptsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administrator records from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const openCreateDoctorModal = () => {
    setEditingDoctorId(null);
    setDoctorForm({
      name: '',
      email: '',
      password: 'doctor123',
      phone: '',
      specialization: 'Cardiology',
      experience: '8',
      fee: '120',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      qualifications: 'MBBS, MD',
      bio: 'Dedicated medical faculty specialist providing evidence-based healthcare treatments.',
      hospital: 'MediCare Multispecialty Hospital',
    });
    setIsDoctorModalOpen(true);
  };

  const openEditDoctorModal = (doc) => {
    setEditingDoctorId(doc._id);
    setDoctorForm({
      name: doc.name || '',
      email: doc.email || '',
      phone: doc.phone || '',
      password: '',
      specialization: doc.specialization || 'General Medicine',
      experience: doc.experience || 5,
      fee: doc.fee || 100,
      photoUrl: doc.photoUrl || '',
      qualifications: Array.isArray(doc.qualifications)
        ? doc.qualifications.join(', ')
        : doc.qualifications || '',
      bio: doc.bio || '',
      hospital: doc.hospital || 'MediCare Hospital',
    });
    setIsDoctorModalOpen(true);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        await updateDoctor(editingDoctorId, doctorForm);
        setMsg('Doctor record updated successfully.');
      } else {
        await createDoctor(doctorForm);
        setMsg('New doctor registered with automatic login account created.');
      }
      setIsDoctorModalOpen(false);
      loadAllAdminData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving doctor details.');
    }
  };

  const handleDoctorStatus = async (id, newStatus) => {
    try {
      await updateDoctorStatus(id, newStatus);
      setMsg(`Doctor status successfully set to: ${newStatus.toUpperCase()}`);
      loadAllAdminData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update doctor status.');
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${name}?`)) return;
    try {
      await deleteDoctor(id);
      setMsg('Doctor removed from hospital database.');
      loadAllAdminData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete doctor.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user account "${name}"?`)) return;
    try {
      await deleteUser(id);
      setMsg('User record removed.');
      loadAllAdminData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleUpdateAppointment = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setMsg(`Appointment status set to ${status}.`);
      loadAllAdminData();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      alert('Failed to update appointment.');
    }
  };

  // Filter Doctors
  const filteredDoctors = doctorsList.filter((doc) => {
    if (doctorStatusFilter === 'all') return true;
    const docStatus = doc.status || 'approved';
    return docStatus === doctorStatusFilter;
  });

  // Filter Patient Directory: Fixes the issue where all users (Doctor, Admin) were mixed together!
  const patientsCount = usersList.filter((u) => u.role === 'patient').length;
  
  const filteredUsers = usersList.filter((u) => {
    // Role filter
    if (patientRoleFilter !== 'all' && u.role !== patientRoleFilter) {
      return false;
    }
    // Search filter
    if (patientSearchTerm) {
      const term = patientSearchTerm.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(term);
      const matchEmail = u.email?.toLowerCase().includes(term);
      const matchPhone = u.phone?.toLowerCase().includes(term);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner in Glassmorphic Sage & Forest Green */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D9EEE1] to-[#EDF7F0] border border-[#88A995]/40 flex items-center justify-center text-[#527765] shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#527765]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold text-[#527765] tracking-wider">
                  Operational Control
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/30">
                  Hospital Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244C3B] mt-1">
                Executive Health Console
              </h1>
              <p className="text-xs text-[#718278] mt-1">
                Signed in as: <strong>{adminUser?.email || 'admin@medicare.com'}</strong> • Live Database Synchronized
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateDoctorModal}
              className="inline-flex items-center gap-2 bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register Doctor</span>
            </button>
            <button
              onClick={loadAllAdminData}
              className="p-2.5 rounded-xl bg-white hover:bg-[#EDF7F0] text-[#244C3B] border border-[#88A995]/30 shadow-sm transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {msg && (
          <div className="bg-[#D9EEE1] border border-[#88A995]/40 text-[#244C3B] text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-[#527765] shrink-0" />
            <span className="font-semibold">{msg}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Statistics Metric Cards (Sage & Mint Glassmorphism) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Doctors */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">
                Total Doctors
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Stethoscope className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">
              {stats.totalDoctors}
            </span>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#718278]">
              <span className="font-bold text-[#527765]">{stats.approvedDoctors} Approved</span>
              <span>•</span>
              <span className="font-bold text-amber-700">{stats.pendingDoctors} Pending</span>
            </div>
          </div>

          {/* Registered Patients */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">
                Total Patients
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F0] flex items-center justify-center text-[#527765]">
                <Users className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">
              {stats.totalPatients}
            </span>
            <span className="text-[11px] text-[#527765] font-semibold mt-2 block">
              Registered patient profiles
            </span>
          </div>

          {/* Appointments */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">
                Appointments
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                <Calendar className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#244C3B] mt-3 block">
              {stats.totalAppointments}
            </span>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#718278]">
              <span className="font-bold text-amber-700">{stats.pendingAppointments} Pending</span>
              <span>•</span>
              <span className="font-bold text-[#527765]">{stats.acceptedAppointments} Confirmed</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="glass-card rounded-2xl p-6 border border-white/80 card-hover-sage">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718278] uppercase tracking-wider">
                Consultation Value
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#EDF7F0] flex items-center justify-center text-[#527765]">
                <DollarSign className="w-5 h-5 text-[#527765]" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[#527765] mt-3 block">
              ${stats.totalRevenue || 0}
            </span>
            <span className="text-[11px] text-[#718278] font-medium mt-2 block">
              From confirmed patient visits
            </span>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="glass-card rounded-2xl p-2 border border-white/80 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'doctors'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Management ({doctorsList.length})</span>
          </button>

          {/* FIX: Tab label now shows actual PATIENT count! */}
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'patients'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patient Directory ({patientsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Hospital Appointments ({appointmentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'bg-[#527765] text-white shadow-sm'
                : 'text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Recent Activity</span>
          </button>
        </div>

        {/* Tab 1: DOCTOR MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#244C3B]">
                  Medical Faculty & Specialists
                </h3>
                <p className="text-xs text-[#718278] mt-0.5">
                  Review doctor registrations, approve credentials, and configure consultation availability
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 bg-[#FAF9F4] p-1.5 rounded-xl border border-[#88A995]/20 text-xs">
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setDoctorStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                      doctorStatusFilter === st
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EDF7F0]/80 text-[#244C3B] font-bold uppercase tracking-wider rounded-xl">
                    <th className="py-3 px-4 rounded-l-xl">Doctor</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#88A995]/15">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#718278]">
                        No doctors match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doc) => {
                      const docStatus = doc.status || 'approved';
                      return (
                        <tr key={doc._id} className="hover:bg-white/60 transition">
                          <td className="py-4 px-4 font-bold text-[#244C3B]">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  doc.photoUrl ||
                                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
                                }
                                alt={doc.name}
                                className="w-9 h-9 rounded-xl object-cover object-top border border-[#88A995]/30"
                              />
                              <div>
                                <span className="block text-sm font-bold text-[#244C3B]">{doc.name}</span>
                                <span className="text-[11px] text-[#718278]">{doc.email || '—'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#263B30] font-medium">
                            <span className="bg-[#D9EEE1] text-[#244C3B] px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                              {doc.specialization}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[#718278]">{doc.experience} Years</td>
                          <td className="py-4 px-4 font-bold text-[#527765]">${doc.fee}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                docStatus === 'approved'
                                  ? 'bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/40'
                                  : docStatus === 'pending'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {docStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {docStatus !== 'approved' && (
                                <button
                                  onClick={() => handleDoctorStatus(doc._id, 'approved')}
                                  className="p-1.5 rounded-lg bg-[#D9EEE1] hover:bg-[#BFDEC9] text-[#244C3B] font-bold text-[11px] flex items-center gap-1 px-2.5 transition"
                                  title="Approve Doctor"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {docStatus !== 'rejected' && (
                                <button
                                  onClick={() => handleDoctorStatus(doc._id, 'rejected')}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center gap-1 px-2.5 transition"
                                  title="Reject Doctor"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}

                              <button
                                onClick={() => openEditDoctorModal(doc)}
                                className="p-1.5 rounded-lg text-[#718278] hover:text-[#244C3B] hover:bg-[#EDF7F0] transition"
                                title="Edit Doctor Profile"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                                title="Delete Doctor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
        )}

        {/* Tab 2: PATIENT DIRECTORY (SOLVED: Shows ONLY patients by default with role filters!) */}
        {activeTab === 'patients' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#244C3B]">
                    Registered Patients Directory
                  </h3>
                  <span className="bg-[#D9EEE1] text-[#244C3B] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#88A995]/30">
                    {patientsCount} Verified Patients
                  </span>
                </div>
                <p className="text-xs text-[#718278] mt-0.5">
                  Access patient contact profiles, registration timestamps, and account administration
                </p>
              </div>

              {/* Search & Role Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#718278] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, email, phone..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="glass-input text-xs pl-8 pr-3 py-1.5 rounded-xl text-[#263B30] w-56 focus:outline-none"
                  />
                  {patientSearchTerm && (
                    <button
                      onClick={() => setPatientSearchTerm('')}
                      className="absolute right-2.5 top-2 text-[#718278] hover:text-[#244C3B]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Role Switcher Pills */}
                <div className="flex items-center gap-1 bg-[#FAF9F4] p-1 rounded-xl border border-[#88A995]/20 text-xs">
                  <button
                    onClick={() => setPatientRoleFilter('patient')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      patientRoleFilter === 'patient'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    Patients Only ({patientsCount})
                  </button>

                  <button
                    onClick={() => setPatientRoleFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      patientRoleFilter === 'all'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    All Accounts ({usersList.length})
                  </button>

                  <button
                    onClick={() => setPatientRoleFilter('doctor')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      patientRoleFilter === 'doctor'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    Doctors
                  </button>

                  <button
                    onClick={() => setPatientRoleFilter('admin')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      patientRoleFilter === 'admin'
                        ? 'bg-[#527765] text-white shadow-xs'
                        : 'text-[#718278] hover:text-[#244C3B]'
                    }`}
                  >
                    Admins
                  </button>
                </div>
              </div>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EDF7F0]/80 text-[#244C3B] font-bold uppercase tracking-wider rounded-xl">
                    <th className="py-3 px-4 rounded-l-xl">Patient Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">System Role</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#88A995]/15">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#718278]">
                        No user accounts match the current directory filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-white/60 transition">
                        <td className="py-3.5 px-4 font-bold text-[#244C3B]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#D9EEE1] text-[#244C3B] flex items-center justify-center font-bold text-xs uppercase">
                              {u.name?.charAt(0) || 'P'}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#263B30]">{u.email}</td>
                        <td className="py-3.5 px-4 text-[#718278]">{u.phone || '—'}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : u.role === 'doctor'
                                ? 'bg-[#EDF7F0] text-[#527765] border border-[#88A995]/30'
                                : 'bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#718278]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="text-rose-600 hover:text-rose-800 font-bold hover:underline"
                            >
                              Delete Account
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#244C3B]">
                Hospital Clinical Consultations
              </h3>
              <p className="text-xs text-[#718278] mt-0.5">
                All patient appointments booked across hospital specialties
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#EDF7F0]/80 text-[#244C3B] font-bold uppercase tracking-wider rounded-xl">
                    <th className="py-3 px-4 rounded-l-xl">Patient</th>
                    <th className="py-3 px-4">Doctor & Department</th>
                    <th className="py-3 px-4">Date & Time Slot</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#88A995]/15">
                  {appointmentsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#718278]">
                        No appointment bookings in the database yet.
                      </td>
                    </tr>
                  ) : (
                    appointmentsList.map((app) => {
                      const appStatus = app.status || 'pending';
                      return (
                        <tr key={app._id} className="hover:bg-white/60 transition">
                          <td className="py-4 px-4 font-bold text-[#244C3B]">
                            <span>{app.patient?.name || 'Walk-in Patient'}</span>
                            <span className="block text-[11px] font-normal text-[#718278]">
                              {app.patient?.phone || app.patient?.email || ''}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-[#263B30]">
                            <span className="font-bold text-[#244C3B] block">
                              {app.doctor?.name || 'Doctor'}
                            </span>
                            <span className="text-[11px] text-[#718278]">
                              {app.doctor?.specialization || 'Clinical'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#244C3B] block">
                              {new Date(app.date).toLocaleDateString()}
                            </span>
                            <span className="text-[11px] text-[#527765] font-semibold">{app.timeSlot || app.slot}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#527765]">
                            ${app.doctor?.fee || 120}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                appStatus === 'accepted'
                                  ? 'bg-[#D9EEE1] text-[#244C3B] border border-[#88A995]/40'
                                  : appStatus === 'pending'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : appStatus === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {appStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <select
                              value={appStatus}
                              onChange={(e) => handleUpdateAppointment(app._id, e.target.value)}
                              className="text-xs bg-white border border-[#88A995]/30 rounded-lg px-2.5 py-1 text-[#263B30] focus:ring-1 focus:ring-[#527765]"
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: RECENT ACTIVITY (Real Hospital Operational Events) */}
        {activeTab === 'activity' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-glass space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#244C3B]">Recent Hospital Activity</h3>
              <p className="text-xs text-[#718278] mt-0.5">Live timeline of clinical bookings, patient registrations, and doctor accreditations</p>
            </div>

            <div className="space-y-3">
              {/* Combine and sort recent events */}
              {(() => {
                const events = [];

                // 1. Appointments events
                appointmentsList.forEach((app) => {
                  events.push({
                    id: `app-${app._id}`,
                    type: 'Appointment',
                    title: `Consultation Booked: ${app.patient?.name || 'Patient'} with ${app.doctor?.name || 'Physician'}`,
                    desc: `Date: ${new Date(app.date).toLocaleDateString()} at ${app.timeSlot || app.slot || 'TBD'} • Fee: $${app.doctor?.fee || 120} • Status: ${(app.status || 'pending').toUpperCase()}`,
                    time: app.createdAt || app.date,
                    badge: app.status === 'accepted' ? 'bg-[#D9EEE1] text-[#244C3B]' : 'bg-amber-100 text-amber-800',
                    icon: Calendar,
                  });
                });

                // 2. Patient registration events
                usersList
                  .filter((u) => u.role === 'patient')
                  .forEach((p) => {
                    events.push({
                      id: `patient-${p._id}`,
                      type: 'Patient Account',
                      title: `New Patient Registered: ${p.name}`,
                      desc: `Email: ${p.email} • Contact: ${p.phone || 'None provided'}`,
                      time: p.createdAt || new Date(),
                      badge: 'bg-[#EDF7F0] text-[#527765]',
                      icon: Users,
                    });
                  });

                // 3. Doctor registration events
                doctorsList.forEach((d) => {
                  events.push({
                    id: `doc-${d._id}`,
                    type: 'Medical Staff',
                    title: `Doctor Profile: ${d.name} (${d.specialization})`,
                    desc: `Accreditation Status: ${(d.status || 'approved').toUpperCase()} • Hospital: ${d.hospital || 'MediCare Hospital'}`,
                    time: d.createdAt || new Date(),
                    badge: d.status === 'approved' ? 'bg-[#D9EEE1] text-[#244C3B]' : 'bg-amber-100 text-amber-800',
                    icon: Stethoscope,
                  });
                });

                // Sort descending
                events.sort((a, b) => new Date(b.time) - new Date(a.time));

                if (events.length === 0) {
                  return (
                    <div className="py-12 text-center text-[#718278] text-xs">
                      No operational activities recorded yet.
                    </div>
                  );
                }

                return events.slice(0, 15).map((evt) => {
                  const IconComp = evt.icon;
                  return (
                    <div
                      key={evt.id}
                      className="flex items-start gap-3.5 p-4 bg-white/70 rounded-2xl border border-[#88A995]/20 hover:border-[#88A995]/40 transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765] shrink-0 mt-0.5">
                        <IconComp className="w-4 h-4 text-[#527765]" />
                      </div>
                      <div className="flex-1 text-xs space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-[#244C3B] text-sm">{evt.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${evt.badge}`}>
                            {evt.type}
                          </span>
                        </div>
                        <p className="text-[#718278] leading-relaxed">{evt.desc}</p>
                        <span className="text-[10px] text-[#718278]/80 block">
                          {evt.time ? new Date(evt.time).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Add/Edit Doctor Modal (Glassmorphic) */}
        {isDoctorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#244C3B]/40 backdrop-blur-sm">
            <div className="glass-modal rounded-3xl max-w-2xl w-full p-6 sm:p-8 overflow-y-auto max-h-[90vh] space-y-5">
              <div className="flex items-center justify-between border-b border-[#88A995]/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D9EEE1] flex items-center justify-center text-[#527765]">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#244C3B]">
                      {editingDoctorId ? 'Edit Doctor Profile' : 'Register New Doctor'}
                    </h3>
                    <p className="text-xs text-[#718278]">
                      {editingDoctorId ? 'Update doctor credentials' : 'Provisions login account and clinical profile'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="p-2 text-[#718278] hover:text-[#244C3B] rounded-xl hover:bg-[#EDF7F0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Sarah Jenkins"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Email Address (Login)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="doctor@medicare.com"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>
                </div>

                {!editingDoctorId && (
                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Initial Password for Doctor Login
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="doctor123"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                    <p className="text-[10px] text-[#718278] mt-1">
                      The doctor can use this password to sign in to their personal Doctor Dashboard.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Specialization
                    </label>
                    <select
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Oncology">Oncology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={doctorForm.fee}
                      onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      placeholder="MBBS, MD, FACC"
                      value={doctorForm.qualifications}
                      onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={doctorForm.photoUrl}
                    onChange={(e) => setDoctorForm({ ...doctorForm, photoUrl: e.target.value })}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-[#263B30]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#88A995]/20">
                  <button
                    type="button"
                    onClick={() => setIsDoctorModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#88A995]/30 text-xs font-bold text-[#718278] hover:bg-[#EDF7F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#527765] hover:bg-[#3D5B4D] text-white text-xs font-bold shadow-sm"
                  >
                    {editingDoctorId ? 'Save Changes' : 'Register Doctor'}
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

export default AdminDashboard;
