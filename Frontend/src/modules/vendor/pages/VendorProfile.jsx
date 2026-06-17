import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateKycDetails } from '../store/vendorSlice';
import { 
  FiUser, FiHome, FiCreditCard, FiShield, FiCheckCircle, 
  FiMapPin, FiFolder, FiFileText, FiUploadCloud 
} from 'react-icons/fi';

export default function VendorProfile() {
  const dispatch = useDispatch();
  const { kycDetails } = useSelector(state => state.vendor);

  const [activeTab, setActiveTab] = useState('Pharmacy Details');

  // Form states
  const [storeName, setStoreName] = useState(kycDetails.storeName || 'MedPlus Wellness Pharmacy');
  const [email, setEmail] = useState('contact@medpluswellness.com');
  const [phone, setPhone] = useState('9876543201');
  const [address, setAddress] = useState('12, Garden View, Link Road, Bandra West, Mumbai, MH - 400050');
  
  const [gstNumber, setGstNumber] = useState(kycDetails.gstNumber || '27AAAAA1111A1Z1');
  const [panNumber, setPanNumber] = useState(kycDetails.panNumber || 'ABCDE1234F');
  const [drugLicense, setDrugLicense] = useState(kycDetails.drugLicense || 'DL-20831/15');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-12-31');
  
  const [bankName, setBankName] = useState(kycDetails.bankName || 'HDFC Bank');
  const [accountHolder, setAccountHolder] = useState(kycDetails.accountHolder || 'MedPlus Wellness Retail Corp');
  const [accountNo, setAccountNo] = useState(kycDetails.accountNo || '501000987654');
  const [ifscCode, setIfscCode] = useState(kycDetails.ifscCode || 'HDFC0000012');
  const [branch, setBranch] = useState(kycDetails.branch || 'Linking Road, Bandra W, Mumbai');
  
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateKycDetails({
      storeName, gstNumber, panNumber, drugLicense,
      bankName, accountHolder, accountNo, ifscCode, branch
    }));
    
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2500);
  };

  const tabs = [
    { name: 'Pharmacy Details', icon: FiHome },
    { name: 'License & GST Info', icon: FiShield },
    { name: 'Bank Account', icon: FiCreditCard },
    { name: 'Service Areas', icon: FiMapPin },
    { name: 'Uploaded Documents', icon: FiFolder }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden max-w-5xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Pharmacy Store Profile</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage your retail identity, compliance licenses, tax parameters, payout channels, and active areas.
          </p>
        </div>
      </div>

      {/* Tabs navigation bar */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 pb-2 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer whitespace-nowrap transition-all ${
              activeTab === tab.name 
                ? 'bg-[#135A5A] text-white shadow-sm' 
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="text-sm" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Profile Form Canvas */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 custom-scrollbar pb-16">
        
        {activeTab === 'Pharmacy Details' && (
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <FiHome className="text-[#135A5A]" /> Store Registry & Coordinates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Pharmacy Store Name *</label>
                <input 
                  type="text" 
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Support Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Contact Phone Line *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Retail Store Address *</label>
                <textarea 
                  required
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none resize-none focus:border-[#135A5A]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'License & GST Info' && (
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <FiShield className="text-[#135A5A]" /> Legal compliance & Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Drug License Number *</label>
                <input 
                  type="text" 
                  required
                  value={drugLicense}
                  onChange={(e) => setDrugLicense(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] uppercase font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Drug License Expiry *</label>
                <input 
                  type="date" 
                  required
                  value={licenseExpiry}
                  onChange={(e) => setLicenseExpiry(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">GST registration Certificate ID *</label>
                <input 
                  type="text" 
                  required
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] uppercase font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Taxation Account PAN *</label>
                <input 
                  type="text" 
                  required
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] uppercase font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Bank Account' && (
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <FiCreditCard className="text-[#135A5A]" /> Bank Remittance Coordinates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Account holder Designation *</label>
                <input 
                  type="text" 
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Remittance Bank Name *</label>
                <input 
                  type="text" 
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">IFSC Routing Code *</label>
                <input 
                  type="text" 
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] uppercase font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Bank Branch Location *</label>
                <input 
                  type="text" 
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Registered Account Number *</label>
                <input 
                  type="text" 
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Service Areas' && (
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <FiMapPin className="text-[#135A5A]" /> Serviceable coverage zones
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <h4 className="text-xs font-extrabold text-slate-800 mb-1">Approved Coverage Cities</h4>
                <p className="text-[9.5px] text-slate-400 font-semibold mb-3">Cities where your pharmacy delivery is approved and active.</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad'].map(city => (
                    <span key={city} className="bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-xl text-xs font-bold">{city}</span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <h4 className="text-xs font-extrabold text-slate-800 mb-1">Active Pincodes Coverage</h4>
                <p className="text-[9.5px] text-slate-400 font-semibold mb-3">Approved ZIP codes where home courier services operate.</p>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                  {['400050', '400051', '400052', '560001', '560002', '110001', '110002', '110003', '411001', '411002'].map(pin => (
                    <span key={pin} className="bg-slate-100 text-slate-650 border border-slate-200/50 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">{pin}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Uploaded Documents' && (
          <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <FiFolder className="text-[#135A5A]" /> Compliance Document Vault
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Drug License Copy.pdf', size: '2.4 MB', type: 'Drug License' },
                { name: 'GST Certificate.pdf', size: '1.8 MB', type: 'GST Registration' },
                { name: 'PAN Card Copy.jpg', size: '850 KB', type: 'PAN Card Verification' },
                { name: 'Cancelled Cheque.jpg', size: '920 KB', type: 'Bank Check' }
              ].map((doc, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                      <FiFileText className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-850">{doc.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <button type="button" className="text-slate-400 hover:text-[#135A5A] text-xs font-black p-2 border-0 bg-transparent cursor-pointer">View</button>
                </div>
              ))}
            </div>

            {/* Upload new document trigger */}
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center mt-3 hover:border-[#135A5A]/50 transition-colors cursor-pointer flex flex-col items-center gap-2">
              <FiUploadCloud className="text-3xl text-slate-400" />
              <span className="text-xs font-extrabold text-slate-800">Upload New Compliance File</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">PDF, JPG, PNG up to 10MB</span>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pb-6">
          <button 
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-premium transition-all cursor-pointer tap-scale text-center border-0"
          >
            Update Profile Data
          </button>
          
          {successMsg && (
            <span className="flex items-center gap-1.5 text-teal-700 font-extrabold text-xs animate-bounce uppercase tracking-wide">
              <FiCheckCircle className="text-sm shrink-0 text-emerald-600" /> Profile updates submitted. Audits pending validation!
            </span>
          )}
        </div>

      </form>

    </div>
  );
}
