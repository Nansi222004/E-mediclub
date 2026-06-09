import React, { useState } from 'react';
import { FiCheckCircle, FiShield, FiFileText, FiLock, FiInfo } from 'react-icons/fi';

export default function LabVendorProfile() {
  const [profile, setProfile] = useState({
    labName: 'Diagnostics Lab (Central Hub)',
    director: 'Dr. Archana Sen',
    email: 'lab@emediclub.com',
    phone: '8888888890',
    accreditationCode: 'NABL-MC-5412-A',
    gstNumber: '27GSTR1112A1Z3',
    panNumber: 'LABPL1234E',
    address: 'Plot 45, Biotech Tech Park, Sector V, Salt Lake, Kolkata, WB - 700091',
    bankName: 'ICICI Bank',
    accountNo: '302010998877',
    ifscCode: 'ICIC0000302'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [labName, setLabName] = useState(profile.labName);
  const [director, setDirector] = useState(profile.director);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(prev => ({ ...prev, labName, director }));
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">KYC Partner Profile</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review your laboratory credentials, licensing status, and settlement bank accounts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main profile form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Laboratory Particulars</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-teal hover:underline text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setLabName(profile.labName); setDirector(profile.director); }}
                    className="text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-teal hover:underline text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Accredited Laboratory Name</label>
                <input 
                  type="text" 
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  disabled={!isEditing}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-teal w-full disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Medical Director / Pathologist</label>
                <input 
                  type="text" 
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  disabled={!isEditing}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:border-teal w-full disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Communication Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none w-full opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Contact Mobile</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  disabled
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none w-full opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs mt-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Lab Dispatch Coordinates</label>
              <textarea 
                value={profile.address}
                disabled
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none w-full opacity-70 cursor-not-allowed h-16 resize-none"
              />
            </div>
          </form>

          {/* Settlement Details */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-2">
              Payout Bank Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Clearing Bank</span>
                <span className="text-slate-800 font-extrabold text-sm">{profile.bankName}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Account Number</span>
                <span className="text-slate-800 font-extrabold text-sm">{profile.accountNo}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">IFSC Routing Code</span>
                <span className="text-slate-800 font-extrabold text-sm">{profile.ifscCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Compliance details */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
              Security & Verifications
            </h3>
            
            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100/50 p-3 rounded-2xl">
                <FiCheckCircle className="text-lg shrink-0" />
                <div>
                  <span className="font-extrabold text-[11px] block">NABL Approved Partner</span>
                  <span className="text-[8px] font-black uppercase tracking-wider">{profile.accreditationCode}</span>
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl p-3 flex flex-col gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">GST IN Code</span>
                  <span className="text-slate-850 font-extrabold">{profile.gstNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mt-1">PAN Card Number</span>
                  <span className="text-slate-850 font-extrabold">{profile.panNumber}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-[9px] text-slate-400 font-extrabold uppercase flex gap-1.5 items-start">
                <FiLock className="text-xs shrink-0 text-slate-400 mt-0.5" />
                <span>To revise compliance records or drug authorizations, contact super-admin audit terminal desk.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
