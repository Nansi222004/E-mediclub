import { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiPlusCircle, FiTrash2, FiEdit2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';

export default function LabVendorSlots() {
  const [activeTab, setActiveTab] = useState('slots');
  const [loading, setLoading] = useState(true);

  // Slots State
  const [slots, setSlots] = useState([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ timeRange: '', maxBookings: 10 });

  // Holidays State
  const [holidays, setHolidays] = useState([]);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });
  const [weeklyOff, setWeeklyOff] = useState(['Sunday']);

  const fetchData = async () => {
    setLoading(true);
    // Bypass API for dummy data
    setTimeout(() => {
      setSlots([
        { id: 'SLT-1', timeRange: '06:00 AM - 09:00 AM', maxBookings: 15, currentBookings: 12, isActive: true },
        { id: 'SLT-2', timeRange: '09:00 AM - 12:00 PM', maxBookings: 20, currentBookings: 20, isActive: false },
        { id: 'SLT-3', timeRange: '12:00 PM - 03:00 PM', maxBookings: 10, currentBookings: 3, isActive: true },
        { id: 'SLT-4', timeRange: '03:00 PM - 06:00 PM', maxBookings: 15, currentBookings: 0, isActive: true }
      ]);
      setHolidays([
        { id: 'HOL-1', date: '2026-08-15', reason: 'Independence Day' },
        { id: 'HOL-2', date: '2026-11-01', reason: 'Diwali Closed' }
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Slot Handlers
  const handleAddSlot = (e) => {
    e.preventDefault();
    const slot = {
      id: `SLT-${slots.length + 1}`,
      timeRange: newSlot.timeRange,
      maxBookings: Number(newSlot.maxBookings),
      currentBookings: 0,
      isActive: true
    };
    setSlots([...slots, slot]);
    setShowAddSlot(false);
    setNewSlot({ timeRange: '', maxBookings: 10 });
  };

  const toggleSlotStatus = (id) => {
    setSlots(slots.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const deleteSlot = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  // Holiday Handlers
  const handleAddHoliday = (e) => {
    e.preventDefault();
    const holiday = {
      id: `HOL-${holidays.length + 1}`,
      date: newHoliday.date,
      reason: newHoliday.reason
    };
    setHolidays([...holidays, holiday].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setShowAddHoliday(false);
    setNewHoliday({ date: '', reason: '' });
  };

  const deleteHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const toggleWeeklyOff = (day) => {
    if (weeklyOff.includes(day)) {
      setWeeklyOff(weeklyOff.filter(d => d !== day));
    } else {
      setWeeklyOff([...weeklyOff, day]);
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Availability & Time Slots</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage daily collection slots and holiday schedules.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('slots')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-colors border-0 cursor-pointer ${
            activeTab === 'slots' ? 'border-teal text-teal bg-teal-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 bg-transparent'
          }`}
        >
          <FiClock className="text-sm" /> Collection Slots
        </button>
        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-colors border-0 cursor-pointer ${
            activeTab === 'holidays' ? 'border-teal text-teal bg-teal-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 bg-transparent'
          }`}
        >
          <FiCalendar className="text-sm" /> Holidays & Leaves
        </button>
      </div>

      {/* SLOTS TAB */}
      {activeTab === 'slots' && (
        <div className="flex flex-col gap-6 animate-slideUp">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSlot(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale"
            >
              <FiPlusCircle className="text-sm" /> Add New Slot
            </button>
          </div>

          {showAddSlot && (
            <form onSubmit={handleAddSlot} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Create Collection Slot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Time Range</label>
                  <input 
                    type="text" 
                    value={newSlot.timeRange}
                    onChange={(e) => setNewSlot({...newSlot, timeRange: e.target.value})}
                    required
                    placeholder="e.g. 06:00 AM - 09:00 AM"
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Max Bookings</label>
                  <input 
                    type="number" 
                    value={newSlot.maxBookings}
                    onChange={(e) => setNewSlot({...newSlot, maxBookings: e.target.value})}
                    required
                    min="1"
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowAddSlot(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Save Slot</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div key={slot.id} className={`bg-white border rounded-[32px] p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300 ${!slot.isActive ? 'border-rose-100 bg-rose-50/20' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border ${slot.isActive ? 'bg-teal-50 text-teal border-teal-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                      <FiClock />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">{slot.timeRange}</h3>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">{slot.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Status</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${slot.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' : 'bg-rose-50 text-rose-500 border-rose-200/50'}`}>
                      {slot.isActive ? 'Active' : 'Disabled / Full'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-slate-50 px-3 py-2 rounded-xl mt-2 border border-slate-100">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">Bookings limit:</span>
                    <span className="text-slate-800 font-black text-sm">
                      <span className={slot.currentBookings >= slot.maxBookings ? 'text-rose-500' : 'text-teal'}>{slot.currentBookings}</span> / {slot.maxBookings}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${slot.currentBookings >= slot.maxBookings ? 'bg-rose-500' : 'bg-teal'}`} 
                      style={{ width: `${Math.min((slot.currentBookings / slot.maxBookings) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <button 
                    onClick={() => toggleSlotStatus(slot.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border-0 ${
                      slot.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    {slot.isActive ? <><FiXCircle /> Disable</> : <><FiCheckCircle /> Enable</>}
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer border-0 tap-scale">
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button onClick={() => deleteSlot(slot.id)} className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer border-0 tap-scale">
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOLIDAYS TAB */}
      {activeTab === 'holidays' && (
        <div className="flex flex-col gap-8 animate-slideUp">
          
          {/* Weekly Off Settings */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider mb-4 border-b border-slate-50 pb-3">Weekly Off Days</h3>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleWeeklyOff(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    weeklyOff.includes(day) 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {day} {weeklyOff.includes(day) && ' (Closed)'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-3">Selected days will automatically block bookings every week.</p>
          </div>

          {/* Special Holidays */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Special Holidays & Dates</h3>
              <button
                onClick={() => setShowAddHoliday(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale"
              >
                <FiPlusCircle className="text-sm" /> Add Holiday
              </button>
            </div>

            {showAddHoliday && (
              <form onSubmit={handleAddHoliday} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 mb-6">
                <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Add Holiday Date</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Date</label>
                    <input 
                      type="date" 
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                      required
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Reason / Occasion</label>
                    <input 
                      type="text" 
                      value={newHoliday.reason}
                      onChange={(e) => setNewHoliday({...newHoliday, reason: e.target.value})}
                      required
                      placeholder="e.g. Diwali Closed"
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setShowAddHoliday(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Save Holiday</button>
                </div>
              </form>
            )}

            {holidays.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
                <span className="text-4xl">🏖️</span>
                <h3 className="font-extrabold text-slate-700 text-sm mt-3">No Holidays Scheduled</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-xl shadow-inner border border-rose-100">
                        <FiCalendar />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{new Date(holiday.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h4>
                        <span className="text-[10px] font-bold text-slate-500">{holiday.reason}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteHoliday(holiday.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border-0"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
