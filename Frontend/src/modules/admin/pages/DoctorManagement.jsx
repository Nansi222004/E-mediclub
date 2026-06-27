import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useAdminLocation } from '../context/AdminLocationContext';
import { deleteDoctor, approveDoctor, rejectDoctor } from '../../user/store/productSlice';
import { FiCheckCircle, FiXCircle, FiTrash2, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function DoctorManagement() {
  const dispatch = useDispatch();
  const { doctorSpecialties } = useSelector(state => state.products);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { locationFilter, getQueryString, isFiltered } = useAdminLocation();
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  // Filter States
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/doctors', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setDoctorsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  // Modals state
  const [docToDelete, setDocToDelete] = useState(null);
  const [docToReject, setDocToReject] = useState(null);

  const handleDelete = () => {
    if (!docToDelete) return;
    dispatch(deleteDoctor(docToDelete.id));
    setDoctorsList(prev => prev.filter(doc => doc.id !== docToDelete.id));
    setDocToDelete(null);
  };

  const handleApprove = (id) => {
    dispatch(approveDoctor(id));
    setDoctorsList(prev => prev.map(doc => doc.id === id ? { ...doc, status: 'approved' } : doc));
  };

  const handleReject = () => {
    if (!docToReject) return;
    dispatch(rejectDoctor(docToReject.id));
    setDoctorsList(prev => prev.map(doc => doc.id === docToReject.id ? { ...doc, status: 'rejected' } : doc));
    setDocToReject(null);
  };

  // Get unique hospital names for filter dropdown
  const uniqueHospitals = Array.from(
    new Set(doctorsList.map(doc => doc.hospital).filter(Boolean))
  );

  const categories = ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "General Medicine"];

  const mapDropdownSpecialtyToDb = (spec) => {
    if (spec === "Cardiologist") return "Cardiology";
    if (spec === "Dermatologist") return "Dermatology";
    if (spec === "Pediatrician") return "Paediatrics";
    if (spec === "Orthopedic") return "Orthopaedics";
    if (spec === "Neurologist") return "Neurology";
    if (spec === "General Physician") return "General Physician";
    return spec;
  };

  const mapCategoryToDb = (cat) => {
    if (cat === "Pediatrics") return "Paediatrics";
    if (cat === "Orthopedics") return "Orthopaedics";
    if (cat === "General Medicine") return "General Physician";
    return cat;
  };

  // Filter Logic
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter(doc => {
      const matchesName = doc.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "all" ? true : doc.specialty === mapDropdownSpecialtyToDb(selectedSpecialty);
      const matchesHospital = selectedHospital === "all" ? true : doc.hospital === selectedHospital;
      const matchesCategory = selectedCategory === "all" ? true : doc.specialty === mapCategoryToDb(selectedCategory);
      const matchesMode = selectedMode === "all" ? true : doc.consultationMode === selectedMode;
      const matchesStatus = selectedStatus === "all" ? true :
                            selectedStatus === "Active" ? doc.status === "approved" :
                            selectedStatus === "Pending" ? (doc.status === "pending" || !doc.status) :
                            selectedStatus === "Rejected" ? doc.status === "rejected" : true;

      return matchesName && matchesSpecialty && matchesHospital && matchesCategory && matchesMode && matchesStatus;
    });
  }, [doctorsList, searchName, selectedSpecialty, selectedHospital, selectedCategory, selectedMode, selectedStatus]);

  // Export to CSV
  const handleExportCSV = () => {
    if (doctors.length === 0) return;
    const headers = ["Doctor Name", "Speciality", "Hospital / Clinic Name", "Status", "Experience", "Fee", "Mode"];
    const csvContent = [
      headers.join(','),
      ...doctors.map(d => [
        `"${d.name}"`,
        `"${d.specialty}"`,
        `"${d.hospital || 'Private Clinic'}"`,
        `"${d.status === 'approved' ? 'Active' : d.status === 'rejected' ? 'Rejected' : 'Pending'}"`,
        `"${d.experience}"`,
        d.fee,
        `"${d.consultationMode}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `emediclub-doctors-directory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3.5 overflow-hidden font-sans">
      
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-100 pb-2 shrink-0">
        <div>
          <div className="admin-page-title">Clinical Practitioners Listings</div>
          <p className="admin-page-subtitle mt-2">
            Review registered doctors directory, specialty profiles, schedules, and active consultation fees.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-teal hover:bg-teal-dark text-white text-[10px] font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer tap-scale shrink-0"
        >
          <FiDownload className="text-xs" />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* Location Filter Bar */}
      <LocationFilter />
      <LocationBanner />

      {/* Filter Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-premium shrink-0">
        
        {/* Search Doctor Name */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedSpecialty} 
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Specialties</option>
            {doctorSpecialties.map((spec, idx) => (
              <option key={idx} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Hospital Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedHospital} 
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Hospitals</option>
            {uniqueHospitals.map((hosp, idx) => (
              <option key={idx} value={hosp}>{hosp}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Consultation Mode Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedMode} 
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* License Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Main Listings */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && doctorsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && doctorsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">👨‍⚕️</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Doctors Registered Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no doctors registered in the system yet.</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4.5 px-6">Doctor Name</th>
                    <th className="py-4.5 px-6">Hospital / Clinic Name</th>
                    <th className="py-4.5 px-6">Speciality</th>
                    <th className="py-4.5 px-6">License Auditing</th>
                    <th className="py-4.5 px-6">Experience</th>
                    <th className="py-4.5 px-6">Consultation Fee</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={doc.avatar || doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80'} 
                            alt={doc.name} 
                            className="w-8 h-8 rounded-xl object-cover border border-slate-100 shrink-0 select-none"
                          />
                          <div>
                            <span className="font-extrabold text-slate-800 block text-xs truncate max-w-[150px]">{doc.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">{doc.qualification || 'MBBS, MD'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td className="py-4.5 px-6 text-slate-700 font-bold">
                        {doc.hospital || 'Private Clinic'}
                      </td>

                      {/* Specialty */}
                      <td className="py-4.5 px-6">
                        <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-650 uppercase tracking-wide">
                          {doc.specialty}
                        </span>
                      </td>

                      {/* License Badge */}
                      <td className="py-4.5 px-6">
                        {doc.status === 'approved' && (
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Approved License</span>
                        )}
                        {(doc.status === 'pending' || !doc.status) && (
                          <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Audit</span>
                        )}
                        {doc.status === 'rejected' && (
                          <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Rejected</span>
                        )}
                      </td>

                      {/* Experience */}
                      <td className="py-4.5 px-6 font-bold text-slate-600 text-2xs">
                        {doc.experience}
                      </td>

                      {/* Consultation Fee */}
                      <td className="py-4.5 px-6 font-black text-slate-850">
                        ₹{doc.fee}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Approve (Accept) Button */}
                          <button
                            disabled={doc.status === 'approved'}
                            onClick={() => handleApprove(doc.id)}
                            title="Accept Practitioner"
                            className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <FiCheckCircle className="text-sm shrink-0" />
                          </button>

                          {/* Reject Button */}
                          <button
                            disabled={doc.status === 'rejected'}
                            onClick={() => setDocToReject(doc)}
                            title="Reject Practitioner"
                            className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <FiXCircle className="text-sm shrink-0" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDocToDelete(doc)}
                            title="Delete Doctor"
                            className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale"
                          >
                            <FiTrash2 className="text-sm shrink-0" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-100 p-4.5 rounded-[24px] shadow-premium flex flex-col gap-3.5 hover-lift">
                  <div className="flex gap-3">
                    <img 
                      src={doc.avatar || doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80'} 
                      alt={doc.name} 
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                       <div className="font-extrabold text-slate-800 text-sm leading-tight truncate">{doc.name}</div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 truncate">{doc.qualification || 'MBBS, MD'}</p>
                      <p className="text-[9px] text-slate-550 mt-1 font-bold truncate">🏥 {doc.hospital || 'Private Clinic'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-150/40 grid grid-cols-3 gap-1 text-center items-center text-[10px]">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Speciality</span>
                      <span className="font-extrabold text-slate-800 leading-tight truncate text-[9px]">{doc.specialty}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Fee</span>
                      <span className="font-black text-slate-800 leading-tight truncate text-[9px]">₹{doc.fee}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Audit Status</span>
                      <span className="font-black text-slate-800 leading-tight truncate text-[9px]">
                        {doc.status === 'approved' ? 'Approved' : doc.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <button
                      disabled={doc.status === 'approved'}
                      onClick={() => handleApprove(doc.id)}
                      className="flex items-center justify-center gap-1 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <FiCheckCircle />
                      <span>Accept</span>
                    </button>
                    <button
                      disabled={doc.status === 'rejected'}
                      onClick={() => setDocToReject(doc)}
                      className="flex items-center justify-center gap-1 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <FiXCircle />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="flex items-center justify-center gap-1 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 p-12 text-center rounded-3xl shadow-premium">
            <p className="text-slate-400 font-bold text-sm uppercase">No doctor registry matching that selection.</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!docToReject}
        onClose={() => setDocToReject(null)}
        onConfirm={handleReject}
        title="Reject Doctor?"
        message={`Are you sure you want to reject Dr. ${docToReject?.name}?`}
        isDanger={true}
      />
      <ConfirmationModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Doctor?"
        message={`Are you sure you want to permanently delete Dr. ${docToDelete?.name}?`}
        isDanger={true}
      />
    </div>
  );
}
