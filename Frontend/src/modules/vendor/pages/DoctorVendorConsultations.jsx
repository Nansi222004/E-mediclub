import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FiVideo, FiMic, FiMicOff, FiCameraOff, FiPhoneOff, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DoctorVendorConsultations() {
  const { tab } = useParams();
  const activeTab = tab || 'video';
  const [activeCall, setActiveCall] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  // Auto-start a call for demonstration purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveCall({
        patientName: 'Rahul Sharma',
        age: 32,
        concern: 'Fever and cold for 3 days',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80'
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (activeCall) {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  if (!activeCall) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 leading-none">Consultations</h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
              Manage your live video calls and chat consultations.
            </p>
          </div>
        </div>

        <div className="flex bg-slate-50 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar border border-slate-100">
          {[
            { id: 'video', label: 'Video Calls' },
            { id: 'chat', label: 'Chat Consultations' }
          ].map(t => (
            <NavLink
              key={t.id}
              to={`/vendor/doctor/consultations/${t.id}`}
              className={({ isActive }) => `flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer text-center ${
                isActive || (activeTab === t.id) ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
              }`}
            >
              {t.label}
            </NavLink>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 bg-white rounded-3xl border border-slate-100 p-6 text-center shadow-premium">
        <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-2">
          <FiVideo className="text-3xl" />
        </div>
        <h2 className="text-lg font-black text-slate-700">No Active Consultations</h2>
        <p className="text-sm font-bold text-slate-400 max-w-sm">
          You have no ongoing video calls or chat sessions right now. Please check your appointments tab to start a call.
        </p>
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Consultations</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage your live video calls and chat consultations.
          </p>
        </div>
      </div>

      <div className="flex bg-slate-50 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar border border-slate-100">
        {[
          { id: 'video', label: 'Video Calls' },
          { id: 'chat', label: 'Chat Consultations' }
        ].map(t => (
          <NavLink
            key={t.id}
            to={`/vendor/doctor/consultations/${t.id}`}
            className={({ isActive }) => `flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer text-center ${
              isActive || (activeTab === t.id) ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
            }`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px] flex flex-col md:flex-row gap-4">
      
      {/* Video Call Area */}
      <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative shadow-premium flex flex-col">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <h3 className="font-black text-sm tracking-wider uppercase">Live Consultation</h3>
          </div>
          <div className="bg-black/50 px-4 py-1.5 rounded-xl border border-white/10 font-mono font-black text-emerald-400 tracking-widest text-sm">
            {formatTime(callTimer)}
          </div>
        </div>

        {/* Main Feed (Patient) */}
        <div className="flex-1 relative flex items-center justify-center">
          <img 
            src={activeCall.avatar} 
            alt="Patient Feed" 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
          
          <div className="z-10 flex flex-col items-center gap-4 text-center p-6">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/50 p-1 bg-black shadow-2xl">
              <img src={activeCall.avatar} alt="Patient Avatar" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{activeCall.patientName}</h2>
              <p className="text-sm font-bold text-slate-300 mt-1">Patient • {activeCall.age} Yrs</p>
              <div className="mt-3 inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-semibold text-slate-200">
                Concern: {activeCall.concern}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Picture in Picture */}
        <div className="absolute bottom-24 right-6 w-32 h-44 bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl z-20">
          {isCamOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800">
              <FiCameraOff className="text-2xl mb-2" />
              <span className="text-[10px] font-black tracking-wider">CAM OFF</span>
            </div>
          ) : (
            <div className="w-full h-full bg-slate-800 relative">
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80" alt="Doctor self" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent z-10 flex items-center justify-center gap-4">
          <button 
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer border-0 ${isMicMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
          >
            {isMicMuted ? <FiMicOff /> : <FiMic />}
          </button>
          
          <button 
            onClick={() => setIsCamOff(!isCamOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer border-0 ${isCamOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
          >
            {isCamOff ? <FiCameraOff /> : <FiVideo />}
          </button>

          <button 
            onClick={() => setActiveCall(null)}
            className="w-16 h-12 rounded-2xl flex items-center justify-center text-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer border-0 shadow-lg px-8"
          >
            <FiPhoneOff />
          </button>

          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`hidden md:flex w-12 h-12 rounded-full items-center justify-center text-xl transition-all cursor-pointer border-0 ${chatOpen ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
          >
            <FiMessageSquare />
          </button>
        </div>
      </div>

      {/* Right Side Panel (Chat & Notes) */}
      {chatOpen && (
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 340 }}
          className="hidden md:flex flex-col bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden shrink-0"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-indigo-600 border-b-2 border-indigo-600 bg-white">Chat</button>
            <button className="flex-1 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 border-b-2 border-transparent hover:bg-white transition-colors cursor-pointer">Rx Notes</button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
            <div className="text-center my-2">
              <span className="text-[9px] bg-slate-100 text-slate-400 font-bold uppercase tracking-wider px-2 py-1 rounded-md">Today</span>
            </div>
            <div className="self-start max-w-[85%] bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-xs font-semibold text-slate-700">
              Hello Doctor, I have been having fever since Monday.
            </div>
            <div className="self-start max-w-[85%] bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-xs font-semibold text-slate-700">
              Also slight throat pain. I uploaded my past records in the locker.
            </div>
            <div className="self-end max-w-[85%] bg-indigo-50 border border-indigo-100 p-3 rounded-2xl rounded-tr-sm text-xs font-semibold text-indigo-900">
              I'm checking them now. Please let me know your current temperature.
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <input type="text" placeholder="Type message..." className="flex-1 bg-transparent border-none outline-none text-xs font-semibold text-slate-700 px-3 py-2" />
              <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer border-0">
                <FiMessageSquare className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
