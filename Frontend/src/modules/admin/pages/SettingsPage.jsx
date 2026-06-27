import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setGlobalCommission } from '../store/adminSlice';
import { FiSettings, FiSliders, FiShield, FiCreditCard, FiCheckCircle, FiUsers, FiLock } from 'react-icons/fi';

// 1. Admin Users Panel component
function AdminUsersPanel() {
  const [staff, setStaff] = useState([
    { id: 'ADM-001', name: 'Harshita Sharma', role: 'Super Admin', email: 'harshita@emediclub.com' },
    { id: 'ADM-002', name: 'Amit Patel', role: 'Operations Manager', email: 'amit.patel@emediclub.com' },
    { id: 'ADM-003', name: 'Dr. Neha Sen', role: 'Clinical Supervisor', email: 'neha.sen@emediclub.com' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Operations Manager');

  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newStaff = {
        id: `ADM-00${staff.length + 1}`,
        name,
        email,
        role
      };
      setStaff([...staff, newStaff]);
      setName('');
      setEmail('');
      setIsSaving(false);
      setShowAddModal(false);
    }, 600);
  };

  const handleDelete = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
          <div className="admin-settings-section-title flex items-center gap-1.5 font-bold text-slate-800">
            <FiUsers className="text-teal" /> Console User Accounts
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-0"
          >
            Add Staff
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase border-b border-slate-100 pb-2">
                <th className="py-2">Staff ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-extrabold text-slate-800">{s.id}</td>
                  <td className="py-2.5 font-bold text-slate-700">{s.name}</td>
                  <td className="py-2.5 text-slate-500">{s.email}</td>
                  <td className="py-2.5">
                    <span className="bg-[#0D6E56]/5 text-[#0D6E56] px-2 py-0.5 rounded text-[10px] font-bold">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-[11px] border-0 bg-transparent cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-premium border border-slate-100 text-left">
            <div className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Add Console Staff</div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal" 
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal" 
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Access Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Clinical Supervisor">Clinical Supervisor</option>
                  <option value="Support Agent">Support Agent</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-200 rounded-lg font-bold border-0 cursor-pointer text-slate-700">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-teal text-white rounded-lg font-bold border-0 cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Add Staff'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Roles & Permissions Panel component
function RolesPermissionsPanel() {
  const roles = ['Super Admin', 'Operations Manager', 'Clinical Supervisor', 'Support Agent'];
  const permissions = [
    'Manage Vendors',
    'Manage Orders',
    'View Financial Reports',
    'System Configuration',
    'Support Disputes'
  ];

  const [matrix, setMatrix] = useState({
    'Super Admin': ['Manage Vendors', 'Manage Orders', 'View Financial Reports', 'System Configuration', 'Support Disputes'],
    'Operations Manager': ['Manage Vendors', 'Manage Orders', 'View Financial Reports'],
    'Clinical Supervisor': ['Manage Vendors', 'Support Disputes'],
    'Support Agent': ['Manage Orders', 'Support Disputes']
  });

  const togglePermission = (role, perm) => {
    setMatrix(prev => {
      const currentPerms = prev[role] || [];
      const updatedPerms = currentPerms.includes(perm)
        ? currentPerms.filter(p => p !== perm)
        : [...currentPerms, perm];
      return { ...prev, [role]: updatedPerms };
    });
  };

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium animate-fade-in">
      <div className="admin-settings-section-title mb-4 pb-2 border-b border-slate-50 font-bold text-slate-800 flex items-center gap-1.5">
        <FiLock className="text-teal" /> Roles & Permissions Matrix
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
        Assign control access lists for each staff role.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-bold uppercase border-b border-slate-100">
              <th className="py-2.5">Access Permission</th>
              {roles.map(r => (
                <th key={r} className="py-2.5 text-center">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {permissions.map(perm => (
              <tr key={perm} className="hover:bg-slate-50/50">
                <td className="py-3 font-semibold text-slate-700">{perm}</td>
                {roles.map(role => {
                  const hasPerm = matrix[role]?.includes(perm);
                  return (
                    <td key={role} className="py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={hasPerm} 
                        onChange={() => togglePermission(role, perm)}
                        className="w-4 h-4 text-teal accent-teal border-slate-300 rounded cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. Platform Config Panel (original Settings Page content)
function PlatformConfigPanel() {
  const dispatch = useDispatch();
  const { commissionSetting } = useSelector(state => state.admin);

  const [commRate, setCommRate] = useState(commissionSetting || 10);
  const [gatewayUpi, setGatewayUpi] = useState('emediclub@upi');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_Emediclub9871');
  const [otpLength, setOtpLength] = useState(4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      dispatch(setGlobalCommission(Number(commRate)));
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 2000);
    }, 600);
  };

  return (
    <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 animate-fade-in">
      {/* Baseline Commission parameters */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="admin-settings-section-title mb-3 flex items-center gap-1.5">
          <FiSliders className="text-teal" /> Baseline Brokerage Tariffs
        </div>
        <p className="admin-settings-section-subtitle border-b border-slate-50 pb-2 mb-4">
          Adjust the standard percentage commission collected on successful merchant transactions.
        </p>

        <div className="flex flex-col gap-1.5 max-w-xs">
          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Baseline Commission Tariff (%)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="0" 
              max="50"
              value={commRate} 
              onChange={(e) => setCommRate(e.target.value)}
              className="w-24 px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-teal text-center"
            />
            <span className="text-xs font-extrabold text-slate-500 uppercase">% Flat Rate</span>
          </div>
        </div>
      </div>

      {/* Payment Gateways settings */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="admin-settings-section-title mb-3 flex items-center gap-1.5">
          <FiCreditCard className="text-teal" /> Transaction Gateway Integrations
        </div>
        <p className="admin-settings-section-subtitle border-b border-slate-50 pb-2 mb-4">
          Manage credentials routing checkout payments to platform bank accounts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Clinical VPA UPI ID</label>
            <input 
              type="text" 
              value={gatewayUpi} 
              onChange={(e) => setGatewayUpi(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Razorpay Merchant Live Key</label>
            <input 
              type="text" 
              value={razorpayKey} 
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal font-mono"
            />
          </div>
        </div>
      </div>

      {/* Security & OTP settings */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="admin-settings-section-title mb-3 flex items-center gap-1.5">
          <FiShield className="text-teal" /> HIPAA Clinical Security Protocol
        </div>
        <p className="admin-settings-section-subtitle border-b border-slate-50 pb-2 mb-4">
          Adjust licensing parameters securing electronic records and authentication.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">SMS OTP Length</label>
            <select 
              value={otpLength} 
              onChange={(e) => setOtpLength(Number(e.target.value))}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wide outline-none focus:border-teal"
            >
              <option value="4">4 Digits (Standard Simulator)</option>
              <option value="6">6 Digits (Production Grade)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 justify-center pl-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-2">Platform Logging Level</label>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
              <span className="text-[10px] font-black text-teal uppercase tracking-wider">HIPAA Audit Logging Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form triggers */}
      <div className="flex items-center gap-4.5">
        <button 
          type="submit"
          disabled={isSaving}
          className="px-6 py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer border-0 tap-scale disabled:opacity-70 flex items-center justify-center min-w-[200px]"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            'Save configurations'
          )}
        </button>
        
        {savedSuccess && (
          <span className="flex items-center gap-1 text-teal font-extrabold text-xs animate-bounce">
            <FiCheckCircle /> Configurations saved successfully!
          </span>
        )}
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = new URLSearchParams(location.search).get('tab') || 'users';

  const tabs = [
    { id: 'users', label: 'Admin Users', icon: FiUsers },
    { id: 'roles', label: 'Roles & Permissions', icon: FiShield },
    { id: 'config', label: 'Platform Config', icon: FiSettings }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in max-w-3xl">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="admin-page-title">Console Configurations</div>
          <p className="admin-page-subtitle mt-2">
            Define baseline platform commission tariffs, payment API keys, and HIPAA security controls.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex gap-2 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-100/80 self-start">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(`/admin/settings?tab=${tab.id}`)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 ${
                  isActive 
                    ? 'bg-[#0D6E56] text-white shadow-sm font-black' 
                    : 'hover:bg-slate-200/50 text-slate-500 bg-transparent'
                }`}
              >
                <Icon className="text-sm shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditionally Render Active Tab Panel */}
      <div className="flex-1">
        {activeTab === 'users' && <AdminUsersPanel />}
        {activeTab === 'roles' && <RolesPermissionsPanel />}
        {activeTab === 'config' && <PlatformConfigPanel />}
      </div>

    </div>
  );
}
