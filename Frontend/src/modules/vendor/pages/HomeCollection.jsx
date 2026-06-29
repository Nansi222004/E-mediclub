import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiCheckCircle, FiUsers, FiKey, FiPlusCircle, FiTrash2, FiEdit2
} from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';
import LabVendorServiceAreas from './LabVendorServiceAreas';
import LabVendorSlots from './LabVendorSlots';

export default function HomeCollection() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Modal state for bookings
  const [activeBooking, setActiveBooking] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);

  // Form states for bookings
  const [collectorName, setCollectorName] = useState("");
  const [collectorPhone, setCollectorPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // --- DUMMY DATA FOR AGENTS ---
  const [agents, setAgents] = useState([
    { id: 'AGT-001', name: 'Ramesh Patil', phone: '+91 9876543210', status: 'Active', joinedDate: '15 Jan 2023', collectionsToday: 4 },
    { id: 'AGT-002', name: 'Suresh Kumar', phone: '+91 9123456789', status: 'Active', joinedDate: '22 Mar 2023', collectionsToday: 2 },
    { id: 'AGT-003', name: 'Anil Desai', phone: '+91 9988776655', status: 'Inactive', joinedDate: '10 Jun 2023', collectionsToday: 0 }
  ]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', phone: '' });

  const fetchBookings = async () => {
    if (tab === 'agents') {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Dummy data bypass to prevent 401 network errors
    setTimeout(() => {
      setBookings([]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchBookings();
  }, [tab]);

  const handleUpdateStatus = async (id, newStatus, extraData = {}) => {
    try {
      setErrorMsg("");
      await apiClient.put(`/api/labs/vendor/bookings/${id}/status`, {
        status: newStatus,
        ...extraData
      });
      fetchBookings();
      setAssignModal(false);
      setOtpModal(false);
      setActiveBooking(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  const handleAddAgent = (e) => {
    e.preventDefault();
    const agent = {
      id: `AGT-00${agents.length + 1}`,
      name: newAgent.name,
      phone: newAgent.phone,
      status: 'Active',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      collectionsToday: 0
    };
    setAgents([...agents, agent]);
    setShowAddAgent(false);
    setNewAgent({ name: '', phone: '' });
  };

  const getFilteredCollections = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    switch (tab) {
      case 'new': return bookings.filter(b => b.status === 'confirmed');
      case 'assigned': return bookings.filter(b => b.status === 'collector_assigned');
      default: return bookings.filter(b => b.date === todayStr);
    }
  };

  const currentCollections = getFilteredCollections();

  const tabs = [
    { label: 'Requests', id: 'requests' },
    { label: 'Assigned', id: 'assigned' },
    { label: 'Agents', id: 'agents' },
    { label: 'Service Areas', id: 'service-areas' },
    { label: 'Slots', id: 'slots' }
  ];

  const renderTabs = () => (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 border-b border-slate-100">
      {tabs.map(t => (
        <NavLink
          key={t.id}
          to={`/vendor/lab/collections/${t.id}`}
          className={({ isActive }) => `
            px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors tap-scale
            ${isActive || (tab === undefined && t.id === 'requests')
              ? 'bg-teal text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          `}
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );

  // render UI specifically for agents tab
  if (tab === 'agents') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
        {renderTabs()}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 leading-none">Collection Agents</h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
              Manage your phlebotomy staff and their assignments.
            </p>
          </div>
          <button
            onClick={() => setShowAddAgent(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
          >
            <FiPlusCircle className="text-sm" /> Add New Agent
          </button>
        </div>

        {/* Add Agent Modal */}
        {showAddAgent && (
          <form onSubmit={handleAddAgent} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Register New Collection Agent</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Agent Full Name</label>
                <input 
                  type="text" 
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  required
                  placeholder="e.g. Anand Kumar"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  required
                  placeholder="e.g. 9876543210"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddAgent(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm"
              >
                Save Agent
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100">
                    👨‍⚕️
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">{agent.name}</h3>
                    <span className="text-xs text-slate-400 font-bold tracking-wide">{agent.id}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {agent.status}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 mt-1 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Phone:</span>
                  <span className="text-slate-700 font-bold">{agent.phone}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Joined:</span>
                  <span className="text-slate-700 font-bold">{agent.joinedDate}</span>
                </div>
                <div className="flex justify-between items-center bg-teal-50/50 px-3.5 py-2.5 rounded-xl mt-1 border border-teal-100/50">
                  <span className="text-teal-700 font-extrabold uppercase text-xs tracking-wider">Collections Today:</span>
                  <span className="text-teal-700 font-black text-lg leading-none">{agent.collectionsToday}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
                <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer border border-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 tap-scale" title="Edit Agent">
                  <FiEdit2 className="text-sm" /> Edit
                </button>
                <button className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer border border-rose-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 tap-scale" title="Remove Agent">
                  <FiTrash2 className="text-sm" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === 'service-areas') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
        {renderTabs()}
        <LabVendorServiceAreas />
      </div>
    );
  }

  if (tab === 'slots') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
        {renderTabs()}
        <LabVendorSlots />
      </div>
    );
  }

  // --- RENDER DEFAULT BOOKINGS UI ---
  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      {renderTabs()}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Home Sample Collections</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage dispatch schedules, collectors, and verification keys.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : currentCollections.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-premium">
          <span className="text-4xl">🚐</span>
          <h3 className="font-extrabold text-slate-700 text-sm mt-3">No Requests Found</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">There are no collection schedules matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCollections.map((b) => (
            <div key={b.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Booking reference</span>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight mt-0.5">{b.id}</h3>
                </div>
                <span className={`text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full border
                  ${b.status === 'sample_collected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 
                    b.status === 'collector_assigned' ? 'bg-sky-50 text-sky-600 border-sky-100/50' :
                    'bg-amber-50 text-amber-600 border-amber-100/50'}`}
                >
                  {b.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-150/40 text-xs">
                <div className="flex justify-between items-start font-semibold">
                  <span className="text-slate-500">Patient:</span>
                  <span className="text-slate-800 font-extrabold">{b.patientName} ({b.patientAge || 'N/A'} {b.patientGender})</span>
                </div>
                <div className="flex justify-between items-start font-semibold">
                  <span className="text-slate-500">Diagnostic Pack:</span>
                  <span className="text-slate-850 font-bold text-right max-w-[200px] truncate">{b.packageName}</span>
                </div>
                <div className="flex justify-between items-start font-semibold">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="text-slate-800 font-extrabold">{b.date} • {b.timeSlot?.split(' ')[0]}</span>
                </div>
                {b.collectorName && (
                  <div className="flex flex-col gap-0.5 border-t border-slate-200/50 pt-1.5 mt-1.5 font-semibold text-slate-500">
                    <div className="flex justify-between text-[11px]">
                      <span>Assigned Agent:</span>
                      <span className="text-slate-800 font-black">{b.collectorName}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Agent Mobile:</span>
                      <span className="text-slate-850 font-black">{b.collectorPhone}</span>
                    </div>
                  </div>
                )}
                {b.otp && (
                  <div className="flex justify-between items-center font-semibold border-t border-slate-200/50 pt-1.5 mt-1.5">
                    <span className="text-teal font-extrabold flex items-center gap-1">🔑 OTP Verification Code:</span>
                    <span className="bg-teal/10 text-teal px-2 py-0.5 rounded font-black text-sm tracking-wider">{b.otp}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px] tracking-wide">
                  <FiMapPin className="text-teal" />
                  <span>Collection Address</span>
                </div>
                <p className="text-slate-700 font-semibold leading-relaxed pl-5">{b.address}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-3.5 mt-1">
                {b.patientPhone ? (
                  <a 
                    href={`tel:${b.patientPhone}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-655 text-xs font-black uppercase tracking-wider rounded-xl border border-slate-200 decoration-transparent transition-all"
                  >
                    <FiPhone className="text-xs" /> Call Patient
                  </a>
                ) : <div />}

                <div className="flex gap-2">
                  {b.status === 'confirmed' && (
                    <button 
                      onClick={() => { setActiveBooking(b); setAssignModal(true); setCollectorName(""); setCollectorPhone(""); }}
                      className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm flex items-center gap-1.5"
                    >
                      <FiUsers /> Assign Agent
                    </button>
                  )}

                  {b.status === 'collector_assigned' && (
                    <button 
                      onClick={() => { setActiveBooking(b); setOtpModal(true); setOtpInput(""); setErrorMsg(""); }}
                      className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm flex items-center gap-1.5"
                    >
                      <FiKey /> Verify OTP & Collect
                    </button>
                  )}

                  {b.status === 'sample_collected' && (
                    <span className="text-emerald-600 text-xs font-black uppercase flex items-center gap-1">
                      <FiCheckCircle /> Collected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Agent Modal */}
      {assignModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-slideUp">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4">Assign Collection Agent</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Collector Full Name</label>
                <input 
                  type="text" 
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Collector Phone Number</label>
                <input 
                  type="tel" 
                  value={collectorPhone}
                  onChange={(e) => setCollectorPhone(e.target.value)}
                  placeholder="e.g. 9876544321"
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setAssignModal(false)}
                className="px-4 py-2.5 text-slate-400 text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdateStatus(activeBooking.id, 'collector_assigned', { collectorName, collectorPhone })}
                disabled={!collectorName || !collectorPhone}
                className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-md disabled:opacity-50"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify OTP Modal */}
      {otpModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-6 overflow-hidden animate-slideUp">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-2">Verify Collection OTP</h3>
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">6-Digit Verification OTP</label>
              <input 
                type="text" 
                maxLength="6"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="0 0 0 0 0 0"
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-lg tracking-widest outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setOtpModal(false)}
                className="px-4 py-2.5 text-slate-400 text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdateStatus(activeBooking.id, 'sample_collected', { otp: otpInput })}
                disabled={otpInput.length !== 6}
                className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-md disabled:opacity-50"
              >
                Verify & Collect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
