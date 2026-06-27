import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vendorLogout, vendorUpdateKycStatus } from '../../auth/vendor/store/vendorAuthSlice';
import Logo from '../../../shared/components/Logo';
import { FiClock, FiCheck, FiRefreshCw, FiLogOut, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import apiClient from '../../../shared/services/apiClient';

export default function OnboardingPending() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorUser } = useSelector(state => state.vendorAuth || { vendorUser: null });

  const [loading, setLoading] = useState(false);
  const [appDetails, setAppDetails] = useState(null);

  const role = vendorUser?.role || vendorUser?.vendorType || 'pharmacy_vendor';

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get('/api/vendor/status');
        if (res.data.success) {
          setAppDetails(res.data);
          const currentStatus = res.data.status;
          
          if (currentStatus === 'approved') {
            dispatch(vendorUpdateKycStatus('verified'));
            navigate('/vendor/approved');
          } else if (currentStatus === 'rejected') {
            dispatch(vendorUpdateKycStatus('rejected'));
            navigate('/vendor/rejected', { 
              state: { 
                rejectionReason: res.data.rejectionReason, 
                missingDocs: ['Drug License Certificate', 'Pharmacist Certificate']
              } 
            });
          }
        }
      } catch (err) {
        console.error('Error fetching vendor status:', err);
      }
    };
    fetchStatus();
  }, [dispatch, navigate]);

  const contentMap = {
    pharmacy_vendor: {
      subHeader: 'We are verifying your pharmacy license and compliance documents.',
      steps: [
        { label: 'Pharmacy Registration Completed', status: 'completed' },
        { label: 'Documents Uploaded', status: 'completed' },
        { label: 'Drug License Verification', status: 'pending' },
        { label: 'Pharmacist Registration Verification', status: 'pending' },
        { label: 'Dashboard Activation Pending', status: 'locked' }
      ],
      estimatedTime: 'Most applications are approved within 24 hours.',
      complianceText: 'CDSCO and Drugs & Cosmetics compliance regulations require manual review of all pharmaceutical registries. The process takes less than 24 hours.'
    },
    lab_vendor: {
      subHeader: 'We are verifying your lab registration details',
      steps: [
        { label: 'Lab Registration Completed', status: 'completed' },
        { label: 'Lab registration certificate uploaded', status: 'completed' },
        { label: 'Admin auditing NABL/ISO certificate and lab documents', status: 'pending' },
        { label: 'Lab dashboard access after admin approval', status: 'locked' }
      ],
      estimatedTime: 'Most applications are approved within 24-48 hours.',
      complianceText: 'NABL and Clinical Establishments compliance regulations require manual review of all laboratory registries. The process takes less than 24 hours.'
    },
    doctor_vendor: {
      subHeader: 'We are verifying your medical registration details',
      steps: [
        { label: 'Doctor Registration Completed', status: 'completed' },
        { label: 'Medical registration certificate uploaded', status: 'completed' },
        { label: 'Admin auditing degree, registration number and license documents', status: 'pending' },
        { label: 'Doctor dashboard access after admin approval', status: 'locked' }
      ],
      estimatedTime: 'Most applications are approved within 24-48 hours.',
      complianceText: 'National Medical Commission (NMC) compliance regulations require manual review of all medical registrations. The process takes less than 24 hours.'
    }
  };

  const currentContent = contentMap[role] || contentMap.pharmacy_vendor;

  const handleLogout = () => {
    dispatch(vendorLogout());
    if (role === 'doctor_vendor' || role === 'doctor') {
      navigate('/vendor/doctor/login');
    } else if (role === 'lab_vendor' || role === 'lab') {
      navigate('/vendor/lab/login');
    } else {
      navigate('/vendor/pharmacy/login');
    }
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/vendor/status');
      if (res.data.success) {
        setAppDetails(res.data);
        const currentStatus = res.data.status;
        
        if (currentStatus === 'approved') {
          dispatch(vendorUpdateKycStatus('verified'));
          navigate('/vendor/approved');
        } else if (currentStatus === 'rejected') {
          dispatch(vendorUpdateKycStatus('rejected'));
          navigate('/vendor/rejected', { 
            state: { 
              rejectionReason: res.data.rejectionReason,
              missingDocs: ['Drug License Certificate', 'Pharmacist Certificate']
            } 
          });
        } else {
          alert('Application is still under review.');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Application is still under review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] p-8 border border-slate-100/60 shadow-premium relative overflow-hidden text-center flex flex-col gap-6"
      >
        {/* Decorative highlights */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gold-light/20 rounded-full filter blur-xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-light/20 rounded-full filter blur-xl opacity-60 pointer-events-none" />

        <div className="flex justify-center mb-2">
          <Logo showText={true} />
        </div>

        {/* Dynamic Status indicators */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gold-light/40 text-gold-dark flex items-center justify-center text-3xl shrink-0 select-none animate-pulse-subtle border border-gold/10">
            ⏳
          </div>
          <div>
            <span className="bg-gold-light text-gold-dark border border-gold/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider leading-none">
              KYC Audit Pending
            </span>
            <h3 className="text-lg font-black text-slate-800 tracking-tight mt-3">
              {currentContent.subHeader}
            </h3>
            <p className="text-2xs text-slate-400 font-bold uppercase mt-1 tracking-wider leading-relaxed">
              Applicant Store: <strong className="text-slate-700">{appDetails?.pharmacy?.name || vendorUser?.storeName || vendorUser?.name || 'Wellness Store'}</strong>
            </p>
          </div>
        </div>

        {/* Timeline Progress steps */}
        <div className="text-left bg-slate-50 border border-slate-100/80 rounded-2xl p-4.5 flex flex-col gap-3.5">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 mb-1">
            Store Onboarding Progress
          </h4>

          {currentContent.steps.map((stepItem, index) => (
            <div key={index} className={`flex items-center gap-3 ${stepItem.status === 'locked' ? 'opacity-40' : ''}`}>
              {stepItem.status === 'completed' && (
                <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-xs shrink-0 select-none">
                  <FiCheck />
                </span>
              )}
              {stepItem.status === 'pending' && (
                <span className="w-5 h-5 rounded-full bg-gold-light text-gold-dark border border-gold/10 flex items-center justify-center text-xs shrink-0 select-none font-bold">
                  <FiClock className="animate-spin text-2xs" />
                </span>
              )}
              {stepItem.status === 'locked' && (
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-450 flex items-center justify-center text-xs shrink-0 select-none">
                  <FiLock className="text-2xs" />
                </span>
              )}
              <span className={`text-xs ${stepItem.status === 'pending' ? 'font-black text-slate-850 uppercase tracking-wide flex items-center gap-1.5' : 'font-semibold text-slate-700'}`}>
                {stepItem.label}
                {stepItem.status === 'pending' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-dark animate-ping" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Estimated Approval Time */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-left flex gap-3">
          <FiAlertCircle className="text-amber-600 text-lg shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Estimated Approval Time</span>
            <span className="text-xs font-semibold text-slate-650 mt-0.5">{currentContent.estimatedTime}</span>
          </div>
        </div>

        {/* Application Information Card */}
        <div className="text-left bg-slate-50 border border-slate-100/80 rounded-2xl p-4.5 flex flex-col gap-2.5">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 mb-1">
            Application Information
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] font-semibold text-slate-600">
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Registration ID</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.pharmacy?.id || 'PHARM-PENDING'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Pharmacy Name</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.pharmacy?.name || vendorUser?.storeName || 'Wellness Store'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">City</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.pharmacy?.city || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">State</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.pharmacy?.state || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Submission Date</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.submittedAt ? new Date(appDetails.submittedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider block">Last Updated</span>
              <span className="text-slate-800 font-extrabold">{appDetails?.submittedAt ? new Date(appDetails.submittedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#135A5A]/5 border border-[#135A5A]/10 rounded-2xl p-4 text-center flex flex-col gap-1">
          <span className="text-[10px] font-black text-[#135A5A] uppercase tracking-wider">Need Help?</span>
          <span className="text-[11px] font-bold text-slate-600">Vendor Support</span>
          <a href="mailto:support@emediclub.com" className="text-xs font-black text-[#135A5A] hover:underline">
            support@emediclub.com
          </a>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed px-2">
          {currentContent.complianceText.toUpperCase()}
        </p>

        {/* Actions deck */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-5 mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
          >
            <FiLogOut /> Log Out
          </button>
          <button
            onClick={handleCheckStatus}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale min-h-[46px]"
          >
            {loading ? <FiRefreshCw className="animate-spin text-sm" /> : <><FiRefreshCw /> Check status</>}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
