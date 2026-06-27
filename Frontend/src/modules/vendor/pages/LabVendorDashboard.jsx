import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiCalendar, FiFileText, FiDroplet, FiDollarSign, FiImage, FiAward, FiEye, FiUpload, FiPlusCircle, FiUsers, FiStar, FiActivity, FiLayers, FiCheckCircle
} from 'react-icons/fi';
import { FaCheckCircle, FaStar, FaChevronRight } from 'react-icons/fa';
import apiClient from '../../../shared/services/apiClient';

export default function LabVendorDashboard() {
  const navigate = useNavigate();
  const { vendorUser } = useSelector(state => state.vendorAuth);
  
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const profileRes = await apiClient.get('/api/labs/vendor/profile');
        setLab(profileRes.data.data);
        
        const bookingsRes = await apiClient.get('/api/labs/vendor/bookings');
        setBookings(bookingsRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Format today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate real metrics
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const pendingReports = bookings.filter(b => b.status === 'in_progress');
  const homeCollectionsToday = bookings.filter(b => b.date === todayStr && b.address !== 'Walk-in Diagnostic Center');
  const samplesCollected = bookings.filter(b => ['sample_collected', 'in_progress', 'report_uploaded', 'completed'].includes(b.status));
  const completedTests = bookings.filter(b => b.status === 'completed');
  
  const monthlyRevenue = completedTests
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const activePackagesCount = lab?.packagesList?.length || 0;
  const averageRating = lab?.rating || 5.0;

  // Recent Bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const quickActions = [
    { name: 'Upload Report', icon: FiUpload, path: '/vendor/lab/reports/upload', color: 'bg-teal/10 text-teal hover:bg-teal hover:text-white' },
    { name: 'Assign Collector', icon: FiUsers, path: '/vendor/lab/collections/new', color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' },
    { name: 'Add Test Package', icon: FiPlusCircle, path: '/vendor/lab/packages/add', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' },
    { name: 'Manage Gallery', icon: FiImage, path: '/vendor/lab/profile/gallery', color: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white' },
    { name: 'Update Banner', icon: FiAward, path: '/vendor/lab/profile/banner', color: 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' },
    { name: 'Manage Tests', icon: FiActivity, path: '/vendor/lab/tests/all', color: 'bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white' },
    { name: 'View User Preview', icon: FiEye, path: '/vendor/lab/profile/preview', color: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white' }
  ];

  // Tasks Lists
  const pendingUploads = bookings.filter(b => b.status === 'in_progress');
  const scheduledCollections = bookings.filter(b => ['confirmed', 'collector_assigned'].includes(b.status) && b.address !== 'Walk-in Diagnostic Center');
  const newBookings = bookings.filter(b => b.status === 'new_booking');
  const packagesReview = lab?.packagesList?.filter(p => !p.isActive) || [];

  return (
    <div className="flex flex-col gap-4 md:gap-6 font-sans animate-fade-in p-2 md:p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      
      {/* Profile Card & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Lab Profile Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-premium border border-slate-100 flex flex-col relative group">
          {/* Banner Image */}
          <div className="h-28 md:h-32 bg-slate-200 relative overflow-hidden">
            <img 
              src={lab?.promotionalBanner?.image || lab?.labBanner || "https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=800&q=80"} 
              alt="Lab Banner" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="px-5 md:px-6 pb-6 relative flex-1 flex flex-col items-center text-center">
            {/* Lab Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden -mt-10 md:-mt-12 mb-3 z-10">
              <span className="text-4xl md:text-5xl">🔬</span>
            </div>

            <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-1.5 justify-center leading-tight">
              {lab?.name} <FaCheckCircle className="text-teal text-sm shrink-0" />
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border border-emerald-100">
                <FaStar className="text-[10px]" /> {averageRating.toFixed(1)}
              </span>
              {lab?.facilitiesList?.nablCertified && (
                <span className="bg-[#135A5A]/10 text-[#135A5A] px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-[#135A5A]/20">
                  NABL Certified
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 w-full text-xs font-semibold text-slate-500">
              {lab?.facilitiesList?.homeCollection && (
                <div className="bg-teal-50 text-teal px-3 py-2 rounded-xl border border-teal-100 font-black tracking-wide">
                  🏠 Home Collection Available
                </div>
              )}
              <div className="text-slate-400 mt-1 truncate max-w-xs mx-auto text-[11px] font-bold">{lab?.address || 'Main Center Road, Hub'}</div>
            </div>

            <button 
              onClick={() => navigate('/vendor/lab/profile/basic')}
              className="mt-6 w-full py-3 md:py-3.5 bg-[#1FA7A5] hover:bg-[#135A5A] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm border-0 cursor-pointer outline-none"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div 
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className={`rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${action.color}`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm text-lg md:text-xl group-hover:bg-transparent group-hover:text-white transition-colors">
                      <Icon />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight">{action.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Deck */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: "Today's Bookings", val: todayBookings.length, icon: FiCalendar, color: 'text-teal bg-teal-50' },
          { title: "Pending Reports", val: pendingReports.length, icon: FiFileText, color: 'text-rose-600 bg-rose-50' },
          { title: "Home Collections", val: homeCollectionsToday.length, icon: FiDroplet, color: 'text-[#1FA7A5] bg-teal-50' },
          { title: "Samples Collected", val: samplesCollected.length, icon: FiActivity, color: 'text-indigo-600 bg-indigo-50' },
          { title: "Completed Tests", val: completedTests.length, icon: FiCheckCircle, color: 'text-emerald-600 bg-emerald-50' },
          { title: "Monthly Revenue", val: `₹${monthlyRevenue}`, icon: FiDollarSign, color: 'text-amber-600 bg-amber-50' },
          { title: "Average Rating", val: `${averageRating.toFixed(1)} / 5`, icon: FiStar, color: 'text-orange-500 bg-orange-50' },
          { title: "Active Packages", val: activePackagesCount, icon: FiLayers, color: 'text-purple-600 bg-purple-50' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-4 md:p-5 shadow-premium flex items-center gap-3 md:gap-4 group hover:shadow-lg transition-shadow">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 text-lg md:text-xl group-hover:scale-110 transition-transform ${card.color}`}>
                <Icon />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 truncate">{card.title}</span>
                <span className="text-lg md:text-xl font-black text-slate-800 leading-none block">{card.val}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Tasks Widget & Recent Bookings */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Today's Tasks Widget */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between">
          <div>
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-50 pb-3">Today's Tasks</h3>
            
            <div className="flex flex-col gap-3">
              {[
                { title: "Reports Pending Upload", count: pendingUploads.length, desc: "Schedules currently in progress.", path: "/vendor/lab/reports/upload", color: "text-rose-500 bg-rose-50 border-rose-100" },
                { title: "Home Collections", count: scheduledCollections.length, desc: "Requires drawing samples today.", path: "/vendor/lab/collections/assigned", color: "text-teal bg-teal-50 border-teal-100" },
                { title: "New Bookings", count: newBookings.length, desc: "Action needed to confirm bookings.", path: "/vendor/lab/orders/new", color: "text-amber-600 bg-amber-50 border-amber-100" },
                { title: "Packages Needing Review", count: packagesReview.length, desc: "Inactive checkup packages.", path: "/vendor/lab/packages/all", color: "text-purple-600 bg-purple-50 border-purple-100" }
              ].map((task, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate(task.path)}
                  className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-2xl cursor-pointer border border-slate-100 hover:border-slate-200 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border ${task.color} shadow-sm group-hover:scale-105 transition-transform`}>
                      {task.count}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-snug">{task.title}</h4>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{task.desc}</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-slate-300 text-[10px] shrink-0 group-hover:text-[#135A5A] transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-premium flex flex-col overflow-hidden">
          <div className="p-5 md:p-6 pb-0 flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest">Recent bookings</h3>
            <button 
              onClick={() => navigate('/vendor/lab/orders/new')}
              className="text-[#135A5A] hover:underline text-[10px] md:text-xs font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
            >
              View All
            </button>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-wider">No recent bookings found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto p-2 pt-0 w-full">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="py-4 px-4">Booking ID</th>
                      <th className="py-4 px-4">Patient Name</th>
                      <th className="py-4 px-4">Package</th>
                      <th className="py-4 px-4">Slot</th>
                      <th className="py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                        <td className="py-4 px-4 font-black text-[#135A5A]">#{b.id.substring(0, 8)}</td>
                        <td className="py-4 px-4 font-black text-slate-800 flex items-center gap-2">
                           <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b.patientName || 'Walk-in')}&background=random`} alt={b.patientName} className="w-6 h-6 rounded-full" />
                           {b.patientName || 'Walk-in'}
                        </td>
                        <td className="py-4 px-4 truncate max-w-[150px]">{b.packageName}</td>
                        <td className="py-4 px-4 text-slate-500">{b.date} • {b.timeSlot?.split(' ')[0]}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border
                            ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              b.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              b.status === 'in_progress' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'}`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-3 p-4 pt-0 bg-slate-50/30">
                {recentBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b.patientName || 'Walk-in')}&background=random`} alt={b.patientName} className="w-10 h-10 rounded-full border border-slate-200" />
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-xs">{b.patientName || 'Walk-in'}</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-0.5">#{b.id.substring(0, 8)}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border
                            ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              b.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              b.status === 'in_progress' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-600 truncate">{b.packageName}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#135A5A] bg-teal-50 px-2 py-1 rounded-md">{b.date} • {b.timeSlot?.split(' ')[0]}</span>
                        <button className="text-[10px] font-black text-[#135A5A] uppercase tracking-wider bg-transparent border-0 cursor-pointer flex items-center gap-1">
                          Details <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </section>

    </div>
  );
}
