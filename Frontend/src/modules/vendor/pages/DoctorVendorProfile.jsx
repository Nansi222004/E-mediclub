import { useState } from 'react';
import { FiCheckCircle, FiShield, FiFileText, FiLock, FiImage, FiClock, FiMapPin, FiUploadCloud } from 'react-icons/fi';

export default function DoctorVendorProfile() {
  const [profile, setProfile] = useState({
    name: 'Dr. Ramesh',
    specialty: 'General Physician',
    experience: '12 Years',
    qualification: 'MBBS, MD',
    gender: 'Male',
    dob: '1980-05-15',
    about: 'Experienced physician with a demonstrated history of working in the medical practice industry.',
    medicalRegNo: 'MCI-20831/A',
    medicalCouncil: 'Medical Council of India',
    languages: 'English, Hindi, Telugu',
    
    // Consultation Details
    onlineAvailable: true,
    inClinicAvailable: true,
    onlineFee: 600,
    inClinicFee: 800,
    consultationDuration: 15,
    
    // Availability
    morningSlots: '09:00 AM - 01:00 PM',
    eveningSlots: '05:00 PM - 09:00 PM',
    emergencyAvailability: true,
    
    // Clinic Details
    hospital: 'Metro Wellness Clinic',
    address: '123 Health Avenue, Medical District',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    googleMaps: 'https://maps.google.com/?q=Metro+Wellness+Clinic',
    
    // Contact Info
    email: 'doctor@emediclub.com',
    phone: '8888888891',
    bankName: 'HDFC Bank',
    accountNo: '501000987654',
    ifscCode: 'HDFC0000012'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...profile});

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({...formData});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const InputField = ({ label, name, type = "text", disabled = !isEditing, ...props }) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={disabled}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-teal w-full disabled:opacity-70 disabled:cursor-not-allowed resize-none"
          {...props}
        />
      ) : (
        <input 
          type={type} 
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={disabled}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-teal w-full disabled:opacity-70 disabled:cursor-not-allowed"
          {...props}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Complete Professional Profile</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage your personal, professional, clinic, and availability details.
          </p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-md transition-colors border-0 cursor-pointer">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setIsEditing(false); setFormData({...profile}); }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black rounded-xl transition-colors border-0 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-md transition-colors border-0 cursor-pointer">
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main profile form */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiFileText className="text-teal" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Physician Name" name="name" />
              <InputField label="Gender" name="gender" />
              <InputField label="Date of Birth" name="dob" type="date" />
              <InputField label="Languages Spoken" name="languages" />
              <div className="sm:col-span-2">
                <InputField label="About Doctor" name="about" type="textarea" rows="3" />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiShield className="text-teal" /> Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Specialty" name="specialty" />
              <InputField label="Qualifications" name="qualification" />
              <InputField label="Experience (Years)" name="experience" />
              <InputField label="Medical Council" name="medicalCouncil" />
              <InputField label="Medical Registration No." name="medicalRegNo" disabled={true} />
            </div>
          </div>

          {/* Section 3: Consultation & Availability */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiClock className="text-teal" /> Consultation & Availability
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="onlineAvailable" checked={formData.onlineAvailable} onChange={handleChange} disabled={!isEditing} className="w-4 h-4 text-teal rounded" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-teal transition-colors">Online Consultation Available</span>
                </label>
                {formData.onlineAvailable && <InputField label="Online Fee (₹)" name="onlineFee" type="number" />}
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="inClinicAvailable" checked={formData.inClinicAvailable} onChange={handleChange} disabled={!isEditing} className="w-4 h-4 text-teal rounded" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-teal transition-colors">In-Clinic Consultation Available</span>
                </label>
                {formData.inClinicAvailable && <InputField label="In-Clinic Fee (₹)" name="inClinicFee" type="number" />}
              </div>
            </div>

            <div className="w-full h-px bg-slate-50 my-2"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Consultation Duration (Mins)" name="consultationDuration" type="number" />
              <div className="flex items-center h-full pt-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="emergencyAvailability" checked={formData.emergencyAvailability} onChange={handleChange} disabled={!isEditing} className="w-4 h-4 text-coral rounded" />
                  <span className="text-sm font-bold text-coral group-hover:text-red-600 transition-colors">Emergency Availability 24/7</span>
                </label>
              </div>
              <InputField label="Morning Slots" name="morningSlots" placeholder="e.g. 09:00 AM - 01:00 PM" />
              <InputField label="Evening Slots" name="eveningSlots" placeholder="e.g. 05:00 PM - 09:00 PM" />
            </div>
          </div>

          {/* Section 4: Clinic Details */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiMapPin className="text-teal" /> Clinic Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Clinic/Hospital Name" name="hospital" />
              </div>
              <div className="sm:col-span-2">
                <InputField label="Address" name="address" type="textarea" rows="2" />
              </div>
              <InputField label="City" name="city" />
              <InputField label="State" name="state" />
              <InputField label="Pincode" name="pincode" />
              <InputField label="Google Maps Location URL" name="googleMaps" />
            </div>
          </div>

          {/* Section 5: Clinic Media Uploads */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-2">
              <FiImage className="text-teal" /> Clinic Media
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Clinic Logo', 'Clinic Images', 'Reception', 'Consultation Room'].map((label, idx) => (
                <div key={idx} className={`border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 ${isEditing ? 'cursor-pointer hover:border-teal hover:bg-teal-50 transition-all' : 'opacity-60 cursor-not-allowed'}`}>
                  <FiUploadCloud className="text-xl text-slate-400" />
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Verification Badge */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <FiCheckCircle className="text-4xl mb-3 opacity-90" />
            <h3 className="text-lg font-black mb-1">Verified Partner</h3>
            <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider mb-4">
              MCI Reg: {profile.medicalRegNo}
            </p>
            <div className="bg-black/20 p-3 rounded-xl text-[10px] font-bold leading-relaxed">
              Your professional documents, medical license, and identity proofs have been verified by the E Mediclub Compliance Team.
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
              Contact Details
            </h3>
            <div className="flex flex-col gap-4">
              <InputField label="Communication Email" name="email" disabled={true} />
              <InputField label="Contact Phone" name="phone" disabled={true} />
              <div className="p-3 bg-slate-50 rounded-2xl text-[9px] text-slate-400 font-extrabold uppercase flex gap-1.5 items-start mt-2">
                <FiLock className="text-xs shrink-0 text-slate-400 mt-0.5" />
                <span>Contact admin support to revise verified contact channels.</span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
              Payout Credentials
            </h3>
            <div className="flex flex-col gap-4">
              <InputField label="Bank Name" name="bankName" disabled={true} />
              <InputField label="Account Number" name="accountNo" disabled={true} />
              <InputField label="IFSC Code" name="ifscCode" disabled={true} />
              <div className="p-3 bg-amber-50 rounded-2xl text-[9px] text-amber-600 font-extrabold uppercase flex gap-1.5 items-start mt-2">
                <FiLock className="text-xs shrink-0 mt-0.5" />
                <span>Bank credentials are locked for security. Submit a ticket to update.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
