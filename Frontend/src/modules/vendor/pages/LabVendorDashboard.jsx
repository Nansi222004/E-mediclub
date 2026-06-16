import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiCalendar, FiFileText, FiDroplet, FiDollarSign, 
  FiMoreVertical, FiPlus, FiSettings, FiImage, FiAward, FiEye, FiUpload, FiX, FiCheck
} from 'react-icons/fi';
import { FaShieldAlt, FaLungs, FaVial, FaCheckCircle } from 'react-icons/fa';
import { updateLabProfile, updateLabGallery, updateLabBanner, toggleLabFacility } from '../store/vendorSlice';
import { updateLabInCatalog } from '../../user/store/productSlice';

export default function LabVendorDashboard() {
  const dispatch = useDispatch();
  const { labBookings = [] } = useSelector(state => state.products || {});
  const { user } = useSelector(state => state.auth || {});
  const { labProfile } = useSelector(state => state.vendor || { labProfile: { gallery: [], banner: {}, facilities: {} } });
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'gallery', 'banner'

  // Form states
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [bannerForm, setBannerForm] = useState(labProfile?.banner || {});

  const syncToCatalog = (updates) => {
    dispatch(updateLabInCatalog({
      labId: 'lab-pun-1', // Mock ID
      updates
    }));
  };

  const handleFacilityToggle = (key) => {
    dispatch(toggleLabFacility(key));
    const newFacilities = { ...labProfile.facilities, [key]: !labProfile.facilities[key] };
    
    // Unpack facilities to top-level for User Panel syncing
    syncToCatalog({ 
      facilities: newFacilities,
      homeCollection: newFacilities.homeCollection,
      nablCertified: newFacilities.nablCertified
    });
  };

  const handleBannerSave = () => {
    dispatch(updateLabBanner(bannerForm));
    syncToCatalog({ banner: bannerForm });
    setActiveModal(null);
  };

  const testCategories = [
    { name: 'Thyroid Profile', subs: 4, icon: FaShieldAlt, color: 'text-coral', bg: 'bg-coral-light/20' },
    { name: 'Diabetes', subs: 8, icon: FaVial, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Respiratory', subs: 6, icon: FaLungs, color: 'text-[#135A5A]', bg: 'bg-[#135A5A]/10' },
  ];

  const baseBookings = [
    { initials: 'AK', name: 'Amit Kumar', test: 'CBC & Lipid Profile', time: '09:30 AM', status: 'Pending', statusColor: 'bg-coral-light/30 text-coral' },
    { initials: 'SR', name: 'Sunita Rao', test: 'Thyroid Screening', time: '10:15 AM', status: 'In Progress', statusColor: 'bg-teal-light text-teal' },
  ];

  const mappedLabBookings = labBookings.map(bk => ({
    initials: (user?.name || 'User').substring(0, 2).toUpperCase(),
    name: user?.name || 'User Patient',
    test: bk.packageName || 'Lab Test',
    time: bk.timeSlot || '10:00 AM',
    status: bk.status === 'confirmed' ? 'In Progress' : 'Pending',
    statusColor: bk.status === 'confirmed' ? 'bg-teal-light text-teal' : 'bg-coral-light/30 text-coral'
  }));

  const recentBookings = [...mappedLabBookings, ...baseBookings];

  const todaysBookingsCount = labBookings.length > 0 ? labBookings.length + 42 : 42;
  const pendingReportsCount = labBookings.length > 0 ? Math.floor(labBookings.length / 2) + 8 : 8;
  const sampleCollectionsCount = labBookings.length > 0 ? labBookings.length + 15 : 15;
  const monthlyRevenueText = labBookings.length > 0 ? `₹${(2.8 + (labBookings.length * 0.05)).toFixed(1)}L` : '₹2.8L';

  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex flex-col gap-1.5 animate-fade-in font-sans relative">
      
      {/* Top Section: Lab Identity Card & Quick Actions */}
      <section className="flex flex-col lg:flex-row gap-1.5 lg:gap-2">
        
        {/* Lab Identity Card */}
        <div className="lg:w-1/3 bg-white rounded-lg p-3 md:p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#135A5A] to-[#319C9B]" />
          <div className="relative w-16 h-16 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden mb-2 mt-4">
            <img src="https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80" alt="Lab Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Central Diagnostics <FaCheckCircle className="text-teal text-sm" />
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
              ★ 4.8
            </span>
            {labProfile?.facilities?.nablCertified && (
              <span className="bg-[#135A5A]/10 text-[#135A5A] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                NABL Accredited
              </span>
            )}
          </div>
          <button onClick={() => window.open('/lab-tests', '_blank')} className="mt-6 flex items-center gap-2 text-sm font-medium text-[#135A5A] hover:underline bg-transparent border-0 cursor-pointer">
            <FiEye /> Customer View Preview
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-1.5">
          <div 
            onClick={() => setActiveModal('profile')}
            className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#135A5A] transition-all group tap-scale"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-1.5 group-hover:bg-[#135A5A] group-hover:text-white text-slate-400 transition-colors">
              <FiSettings className="text-sm" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Facilities</span>
          </div>

          <div 
            onClick={() => setActiveModal('gallery')}
            className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#135A5A] transition-all group tap-scale"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-1.5 group-hover:bg-[#135A5A] group-hover:text-white text-slate-400 transition-colors">
              <FiImage className="text-sm" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Gallery</span>
          </div>

          <div 
            onClick={() => setActiveModal('banner')}
            className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#135A5A] transition-all group tap-scale"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-1.5 group-hover:bg-[#135A5A] group-hover:text-white text-slate-400 transition-colors">
              <FiAward className="text-sm" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Banner</span>
          </div>

          <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#135A5A] transition-all group tap-scale">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mb-1.5 group-hover:bg-[#135A5A] group-hover:text-white text-slate-400 transition-colors">
              <FiUpload className="text-sm" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Upload Report</span>
          </div>
        </div>
      </section>

      {/* KPI Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
        
        {/* KPI 1 - Solid Teal */}
        <div className="bg-[#135A5A] rounded-lg p-3 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <FiCalendar className="text-white text-lg" />
            <span className="bg-white/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-0.5">Bookings</h3>
            <p className="text-white text-xl font-black leading-none">{todaysBookingsCount}</p>
          </div>
        </div>

        {/* Pending Reports Card */}
        <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col justify-between border border-slate-100">
          <div className="mb-1.5">
            <FiFileText className="text-coral text-sm" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Pending Reports</h3>
            <p className="text-coral text-xl font-black leading-none">{pendingReportsCount < 10 ? `0${pendingReportsCount}` : pendingReportsCount}</p>
          </div>
        </div>

        {/* Sample Collections Card */}
        <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col justify-between border border-slate-100">
          <div className="mb-1.5">
            <FiDroplet className="text-[#135A5A] text-sm" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Samples</h3>
            <p className="text-[#135A5A] text-xl font-black leading-none">{sampleCollectionsCount}</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col justify-between border border-slate-100">
          <div className="mb-1.5">
            <FiDollarSign className="text-[#135A5A] text-sm" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Revenue</h3>
            <p className="text-[#135A5A] text-xl font-black leading-none">{monthlyRevenueText}</p>
          </div>
        </div>

      </section>

      {/* Middle Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
        
        {/* Weekly Volume Chart (Left) */}
        <div className="lg:col-span-2 bg-white rounded-lg p-3 shadow-sm border border-slate-100 flex flex-col min-h-[180px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-800">Volume</h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button className="px-2 lg:px-3 py-1 text-[8px] lg:text-[9px] font-black rounded-md bg-white shadow-sm text-[#135A5A] cursor-pointer border-0">Weekly</button>
              <button className="px-2 lg:px-3 py-1 text-[8px] lg:text-[9px] font-bold rounded-md text-slate-500 hover:text-slate-700 bg-transparent cursor-pointer border-0 transition-colors">Monthly</button>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-1 pt-8 relative h-full">
            {chartDays.map((day, idx) => {
              const heightValue = [40, 65, 45, 80, 55, 90, 75][idx];
              const currentDayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
              const isToday = idx === currentDayIdx;
              return (
                <div key={day} className="flex flex-col items-center gap-1.5 w-full h-full justify-end group cursor-pointer">
                  <div className="w-5 relative flex items-end h-[80px] bg-slate-50 rounded overflow-visible">
                    <div 
                      className={`w-full rounded transition-all duration-300 ease-out bg-[#135A5A] ${isToday ? 'opacity-100 shadow-sm' : 'opacity-20 group-hover:opacity-100 group-hover:shadow-sm'}`}
                      style={{ height: `${heightValue}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-20 pointer-events-none shadow-md">
                      {heightValue * 2} Tests
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                  <span className={`text-[8px] tracking-wide mt-auto transition-colors duration-200 ${isToday ? 'text-slate-800 font-black' : 'text-slate-400 group-hover:text-slate-700 font-semibold'}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Categories (Right) */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 mb-3">Test Categories</h3>
            
            <div className="flex flex-col gap-2">
              {testCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg} ${cat.color}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <h4 className="text-xs text-slate-800 font-bold">{cat.name}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{cat.subs} Sub-categories</p>
                      </div>
                    </div>
                    <FiMoreVertical size={14} className="text-slate-300" />
                  </div>
                );
              })}
            </div>
          </div>
          
          <button className="w-full mt-3 py-2 bg-[#135A5A]/5 text-[#135A5A] font-medium text-[10px] rounded-lg hover:bg-[#135A5A]/10 transition-colors border-0 cursor-pointer">
            View All
          </button>
        </div>

      </section>

      {/* Bottom Section: Recent Bookings */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-2 lg:p-3 border-b border-slate-50">
          <h3 className="text-xs font-extrabold text-slate-800">Recent Bookings</h3>
          <button className="text-[#135A5A] text-[9px] font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer hover:underline">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Test Type</th>
                <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.slice(0, 4).map((bk, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="py-2 px-4 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-[#135A5A]/10 text-[#135A5A] text-[8px] font-bold">
                        {bk.initials}
                      </div>
                      <span className="text-[10px] text-slate-800 font-bold">{bk.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-slate-50 text-[10px] text-slate-500">{bk.test}</td>
                  <td className="py-2 px-4 border-b border-slate-50 text-[10px] text-slate-500">{bk.time}</td>
                  <td className="py-2 px-4 border-b border-slate-50">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide ${bk.statusColor}`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-slate-50 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0.5">
                        <FiMoreVertical size={14} />
                      </button>
                      <button className="w-6 h-6 rounded bg-[#135A5A] text-white flex items-center justify-center hover:bg-[#0F4A4A] transition-colors border-0 cursor-pointer shadow-sm">
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- MODALS --- */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><FiSettings /> Manage Facilities</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors border-0 bg-transparent cursor-pointer">
                <FiX className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6">Toggle the facilities available at your laboratory. These will be visible to users when booking tests.</p>
              <div className="space-y-4">
                {[
                  { key: 'homeCollection', label: 'Free Home Collection' },
                  { key: 'nablCertified', label: 'NABL Certified' },
                  { key: 'digitalReports', label: 'Digital Reports via WhatsApp/Email' },
                  { key: 'sameDayReports', label: 'Same Day Reporting' },
                  { key: 'parking', label: 'Free Parking Available' },
                  { key: 'wheelchair', label: 'Wheelchair Accessible' }
                ].map(fac => (
                  <label key={fac.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#135A5A]/30 cursor-pointer transition-colors bg-white">
                    <span className="text-sm font-medium text-slate-700">{fac.label}</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-[#135A5A] cursor-pointer"
                      checked={!!labProfile?.facilities?.[fac.key]}
                      onChange={() => handleFacilityToggle(fac.key)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 bg-[#135A5A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0F4A4A] transition-colors shadow-md border-0 cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'banner' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><FiAward /> Promotional Banner</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors border-0 bg-transparent cursor-pointer">
                <FiX className="text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              
              {/* Live Preview */}
              <div className="mb-6 rounded-2xl overflow-hidden relative h-32 bg-slate-800 shadow-inner group">
                <img src={bannerForm.image || "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"} alt="Banner Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 p-4 flex flex-col justify-center">
                  <h4 className="text-white font-bold text-lg shadow-sm">{bannerForm.title || 'Enter Title'}</h4>
                  <p className="text-white/90 text-xs mt-1 shadow-sm max-w-[80%]">{bannerForm.subtitle || 'Enter Subtitle'}</p>
                  <div className="mt-2 text-[10px] font-bold bg-white text-slate-800 px-3 py-1 rounded-full self-start inline-block shadow-md">
                    {bannerForm.ctaText || 'Button Text'}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white text-xs font-bold flex items-center gap-2"><FiUpload /> Change Image</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Banner Title</label>
                  <input type="text" value={bannerForm.title || ''} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#135A5A] focus:ring-1 focus:ring-[#135A5A] outline-none transition-all text-sm" placeholder="e.g. Free Home Collection" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle / Offer Text</label>
                  <input type="text" value={bannerForm.subtitle || ''} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#135A5A] focus:ring-1 focus:ring-[#135A5A] outline-none transition-all text-sm" placeholder="e.g. Get 20% off on all full body checkups this month." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Button (CTA) Text</label>
                  <input type="text" value={bannerForm.ctaText || ''} onChange={e => setBannerForm({...bannerForm, ctaText: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#135A5A] focus:ring-1 focus:ring-[#135A5A] outline-none transition-all text-sm" placeholder="e.g. Book Now" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-slate-500 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 rounded-xl transition-colors border-0 cursor-pointer bg-transparent">Cancel</button>
              <button onClick={handleBannerSave} className="px-6 py-2.5 bg-[#135A5A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#0F4A4A] transition-colors shadow-md border-0 cursor-pointer">
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'gallery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl h-[80vh] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><FiImage /> Manage Gallery</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-bold">{labProfile?.gallery?.length || 0} / 15 Images Uploaded</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors border-0 bg-transparent cursor-pointer">
                <FiX className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 relative">
              {/* Uploader Box */}
              <div className="border-2 border-dashed border-[#135A5A]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#135A5A]/5 hover:bg-[#135A5A]/10 transition-colors cursor-pointer mb-8">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#135A5A]">
                  <FiUpload className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-700">Click to upload or drag & drop</h4>
                <p className="text-xs text-slate-500 mt-2">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>

              {/* Grid of images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(labProfile?.gallery || []).map((img, idx) => (
                  <div 
                    key={img.id} 
                    draggable 
                    onDragStart={() => setDraggedIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      const newGallery = [...labProfile.gallery];
                      const item = newGallery.splice(draggedIdx, 1)[0];
                      newGallery.splice(idx, 0, item);
                      dispatch(updateLabGallery(newGallery));
                      syncToCatalog({ gallery: newGallery.map(g => g.url) });
                      setDraggedIdx(null);
                    }}
                    className="relative aspect-video rounded-xl overflow-hidden group border-2 border-transparent hover:border-[#135A5A] transition-all shadow-sm cursor-move bg-slate-100"
                  >
                    <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[9px] bg-white text-slate-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          {img.category || 'General'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {!img.isFeatured && (
                          <button 
                            onClick={() => {
                              const updated = labProfile.gallery.map(g => ({ ...g, isFeatured: g.id === img.id }));
                              dispatch(updateLabGallery(updated));
                              syncToCatalog({ gallery: updated.map(g => g.url) });
                            }}
                            className="w-7 h-7 bg-white/20 hover:bg-white text-white hover:text-amber-500 backdrop-blur-md rounded-lg flex items-center justify-center transition-colors border-0 cursor-pointer tooltip-trigger"
                            title="Set as Featured"
                          >
                            <FiAward size={12} />
                          </button>
                        )}
                        <button className="w-7 h-7 bg-coral/80 hover:bg-coral text-white backdrop-blur-md rounded-lg flex items-center justify-center transition-colors border-0 cursor-pointer" title="Delete">
                          <FiX size={12} />
                        </button>
                      </div>
                    </div>
                    {img.isFeatured && (
                      <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <FiAward /> Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
