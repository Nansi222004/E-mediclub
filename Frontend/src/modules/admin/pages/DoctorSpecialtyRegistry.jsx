import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiPlus, FiX, FiCheckCircle, FiUser } from 'react-icons/fi';
import { addDoctorSpecialty, addNewDoctor } from '../../user/store/productSlice';

export default function DoctorSpecialtyRegistry() {
  const dispatch = useDispatch();
  const { doctors, doctorSpecialties } = useSelector(state => state.products);

  // States
  const [newSpecialtyName, setNewSpecialtyName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Add Doctor Form Fields
  const [docName, setDocName] = useState("");
  const [docSpecialty, setDocSpecialty] = useState(doctorSpecialties[0] || "General Physician");
  const [docHospital, setDocHospital] = useState("");
  const [docExperience, setDocExperience] = useState("");
  const [docFee, setDocFee] = useState("");
  const [docQualification, setDocQualification] = useState("");
  const [docBio, setDocBio] = useState("");
  const [docImage, setDocImage] = useState("");

  // Validation
  const [formErrors, setFormErrors] = useState({});

  const handleAddSpecialty = (e) => {
    e.preventDefault();
    if (!newSpecialtyName.trim()) return;
    if (doctorSpecialties.includes(newSpecialtyName.trim())) {
      setSuccessToast("Specialty already exists!");
      setTimeout(() => setSuccessToast(""), 3000);
      return;
    }
    dispatch(addDoctorSpecialty(newSpecialtyName.trim()));
    setSuccessToast(`Specialty "${newSpecialtyName.trim()}" registered!`);
    setNewSpecialtyName("");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!docName) errors.name = "Doctor name is required";
    if (!docHospital) errors.hospital = "Clinic/Hospital name is required";
    if (!docExperience) errors.experience = "Experience is required (e.g. 10 Years)";
    if (!docFee || isNaN(docFee) || Number(docFee) <= 0) errors.fee = "Enter a valid consultation fee";
    if (!docQualification) errors.qualification = "Qualification is required (e.g. MBBS, MD)";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      name: docName,
      specialty: docSpecialty,
      hospital: docHospital,
      experience: docExperience,
      fee: Number(docFee),
      qualification: docQualification,
      bio: docBio || "Dedicated clinical medical professional.",
      image: docImage || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      status: "approved"
    };

    dispatch(addNewDoctor(payload));
    
    // Clear Form
    setDocName("");
    setDocHospital("");
    setDocExperience("");
    setDocFee("");
    setDocQualification("");
    setDocBio("");
    setDocImage("");
    setFormErrors({});
    
    setShowAddModal(false);
    setSuccessToast(`Dr. ${docName} registered successfully!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in relative font-sans">
      
      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-teal text-white py-3 px-5 rounded-2xl shadow-premium flex items-center gap-2 font-black text-xs uppercase tracking-wider"
          >
            <FiCheckCircle className="text-sm shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="text-xl font-extrabold text-slate-800 leading-none">Specialty & Doctor Registry</div>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Register and audit physician specialities, consult classes, and register clinical practitioners.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
          >
            <FiPlus className="text-sm" /> Register Doctor
          </button>
        </div>
      </div>

      {/* Specialty View Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left list: registered Specialties */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <FiGrid className="text-teal" /> Registered Clinical Specialities
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{doctorSpecialties.length} specialities</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {doctorSpecialties.map((spec, idx) => {
              const count = doctors.filter(d => d.specialty === spec).length;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-slate-100 hover:border-teal/30 p-4.5 rounded-2xl transition-all duration-350 flex flex-col gap-1 hover:shadow-premium-hover"
                >
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide truncate">{spec}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{count} Registered {count === 1 ? 'Doctor' : 'Doctors'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Add New Specialty */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">
            Add Specialty Core
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Register a new physician category.
          </p>

          <form onSubmit={handleAddSpecialty} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g. Dermatologist, Oncologist..." 
              value={newSpecialtyName}
              onChange={(e) => setNewSpecialtyName(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none transition-all"
            />
            <button 
              type="submit"
              className="py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1 tap-scale"
            >
              <FiPlus /> Add Specialty Tag
            </button>
          </form>
        </div>

      </section>

      {/* Centering glassmorphic modal / slide up sheet */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            {/* Container */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-slate-100 shadow-premium max-w-2xl w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 shrink-0">
                <div>
                  <div className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <FiUser className="text-teal" /> Register New Practitioner
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                    Add certified physician credentials, fees, and schedule.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-xl transition-colors cursor-pointer"
                >
                  <FiX className="text-lg shrink-0" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-4 flex flex-col gap-4">
                
                {/* Doctor Name & Specialty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Doctor Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Archana Sen"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.name ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.name && <span className="text-coral text-[9px] font-black">{formErrors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Specialty Core *</label>
                    <select
                      value={docSpecialty}
                      onChange={(e) => setDocSpecialty(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    >
                      {doctorSpecialties.map((spec, idx) => (
                        <option key={idx} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Qualification & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Qualification *</label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS, MD, MS"
                      value={docQualification}
                      onChange={(e) => setDocQualification(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.qualification ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.qualification && <span className="text-coral text-[9px] font-black">{formErrors.qualification}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Experience *</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Years"
                      value={docExperience}
                      onChange={(e) => setDocExperience(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.experience ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.experience && <span className="text-coral text-[9px] font-black">{formErrors.experience}</span>}
                  </div>
                </div>

                {/* Clinic/Hospital & Consultation Fee */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Primary Clinic / Hospital *</label>
                    <input
                      type="text"
                      placeholder="e.g. Metro Clinical Diagnostics"
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.hospital ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.hospital && <span className="text-coral text-[9px] font-black">{formErrors.hospital}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Consultation Fee (₹) *</label>
                    <input
                      type="number"
                      placeholder="Fee in ₹"
                      value={docFee}
                      onChange={(e) => setDocFee(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.fee ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.fee && <span className="text-coral text-[9px] font-black">{formErrors.fee}</span>}
                  </div>
                </div>

                {/* Brief Biography */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Doctor Biography / Clinical Profile</label>
                  <textarea
                    placeholder="Short biography, special accolades, medical certifications description..."
                    value={docBio}
                    onChange={(e) => setDocBio(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal h-16 resize-none"
                  />
                </div>

                {/* Custom Image URL */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Doctor Portrait Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/doctor-avatar.jpg"
                    value={docImage}
                    onChange={(e) => setDocImage(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

              </form>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer text-center"
                >
                  Complete Registration
                </button>
              </div>

            </motion.div>
            
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
