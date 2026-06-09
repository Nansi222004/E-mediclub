import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateKycDetails } from '../store/vendorSlice';
import { FiUser, FiHome, FiCreditCard, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function VendorProfile() {
  const dispatch = useDispatch();
  const { kycDetails } = useSelector(state => state.vendor);

  // Form states
  const [storeName, setStoreName] = useState(kycDetails.storeName);
  const [gstNumber, setGstNumber] = useState(kycDetails.gstNumber);
  const [panNumber, setPanNumber] = useState(kycDetails.panNumber);
  const [drugLicense, setDrugLicense] = useState(kycDetails.drugLicense);
  
  const [bankName, setBankName] = useState(kycDetails.bankName);
  const [accountHolder, setAccountHolder] = useState(kycDetails.accountHolder);
  const [accountNo, setAccountNo] = useState(kycDetails.accountNo);
  const [ifscCode, setIfscCode] = useState(kycDetails.ifscCode);
  
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateKycDetails({
      storeName, gstNumber, panNumber, drugLicense,
      bankName, accountHolder, accountNo, ifscCode
    }));
    
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2500);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-5 overflow-hidden max-w-4xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Seller Store Profile</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review licensing credentials, tax compliance PAN parameters, and verified payout bank coordinates.
          </p>
        </div>
      </div>

      {/* Internally Scrollable Form to eliminate global double scrollbars */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 custom-scrollbar pb-16">
        
        {/* Core KYC Information */}
        <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiShield className="text-teal" /> GST & Drug Licensing Compliance
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Licensing folders authorizing active clinical sales on E Mediclub. Alterations place profile back in pending status.
          </p>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Store Designation Designation *</label>
              <input 
                type="text" 
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Drug License ID ID *</label>
              <input 
                type="text" 
                required
                value={drugLicense}
                onChange={(e) => setDrugLicense(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal font-mono uppercase"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">GST tax Certificate ID ID *</label>
              <input 
                type="text" 
                required
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal uppercase font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">PAN ID Account ID *</label>
              <input 
                type="text" 
                required
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal uppercase font-mono"
              />
            </div>
          </div>
        </div>

        {/* Banking Coordinates */}
        <div className="bg-white border border-slate-100 p-5 sm:p-6 rounded-3xl shadow-premium shrink-0">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiCreditCard className="text-teal" /> Remittance Bank coordinates
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Verified banking details routing available store withdrawals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Bank Designation Name *</label>
              <input 
                type="text" 
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">IFSC Routing Code Code *</label>
              <input 
                type="text" 
                required
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal uppercase font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Account holder Designation Designation *</label>
              <input 
                type="text" 
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Account Number Number *</label>
              <input 
                type="text" 
                required
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pb-6">
          <button 
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-premium transition-all cursor-pointer tap-scale text-center"
          >
            Update profile
          </button>
          
          {successMsg && (
            <span className="flex items-center gap-1.5 text-teal font-extrabold text-xs animate-bounce uppercase tracking-wide">
              <FiCheckCircle className="text-sm shrink-0" /> Store configurations updated. Audits are pending validation!
            </span>
          )}
        </div>

      </form>

    </div>
  );
}
