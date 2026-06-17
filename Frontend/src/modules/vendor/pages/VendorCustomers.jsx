import React, { useState } from 'react';
import { 
  FiUsers, FiShoppingBag, FiStar, FiFileText, FiSearch, FiEye, FiActivity, FiTrendingUp, FiArrowUpRight
} from 'react-icons/fi';

export default function VendorCustomers() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // High quality mock data for customers list
  const customers = [
    { id: 'CUST-001', name: 'Rahul Mehta', email: 'rahul.mehta@gmail.com', phone: '+91 98765 43210', totalOrders: 14, totalSpent: 12400, city: 'Mumbai', lastActive: '2 mins ago', loyaltyTier: 'Platinum' },
    { id: 'CUST-002', name: 'Sara Jacob', email: 'sara.jacob@yahoo.com', phone: '+91 87654 32109', totalOrders: 8, totalSpent: 6200, city: 'Bengaluru', lastActive: '15 mins ago', loyaltyTier: 'Gold' },
    { id: 'CUST-003', name: 'Karan Singh', email: 'karan.singh@outlook.com', phone: '+91 76543 21098', totalOrders: 3, totalSpent: 2800, city: 'Delhi NCR', lastActive: '1 hour ago', loyaltyTier: 'Silver' },
    { id: 'CUST-004', name: 'Anita Desai', email: 'anita.d@gmail.com', phone: '+91 65432 10987', totalOrders: 19, totalSpent: 18450, city: 'Pune', lastActive: '1 day ago', loyaltyTier: 'Platinum' },
    { id: 'CUST-005', name: 'Vikram Sharma', email: 'v.sharma@gmail.com', phone: '+91 99887 76655', totalOrders: 12, totalSpent: 9800, city: 'Hyderabad', lastActive: '2 days ago', loyaltyTier: 'Gold' },
    { id: 'CUST-006', name: 'Sneha Kapoor', email: 'sneha.k@yahoo.com', phone: '+91 88776 65544', totalOrders: 2, totalSpent: 1450, city: 'Mumbai', lastActive: '3 days ago', loyaltyTier: 'Silver' },
    { id: 'CUST-007', name: 'Amit K.', email: 'amit.k@outlook.com', phone: '+91 77665 54433', totalOrders: 6, totalSpent: 5120, city: 'Delhi NCR', lastActive: '4 days ago', loyaltyTier: 'Gold' },
    { id: 'CUST-008', name: 'Megha Patel', email: 'megha.p@gmail.com', phone: '+91 66554 43322', totalOrders: 22, totalSpent: 24300, city: 'Pune', lastActive: '1 week ago', loyaltyTier: 'Platinum' }
  ];

  // Mock data for order history
  const orderHistory = [
    { orderId: '#EMC-89212', customerName: 'Rahul Mehta', items: 'Amoxicillin 500mg x2, Paracetamol x1', date: '2026-06-17', status: 'Delivered', amount: 1240 },
    { orderId: '#EMC-89211', customerName: 'Sara Jacob', items: 'Metformin 1000mg x3', date: '2026-06-17', status: 'Ready for Dispatch', amount: 450.50 },
    { orderId: '#EMC-89210', customerName: 'Karan Singh', items: 'Multivitamins Gold x1, Cough Syrup x2', date: '2026-06-16', status: 'Delivered', amount: 2800 },
    { orderId: '#EMC-89209', customerName: 'Anita Desai', items: 'BP Monitor Device x1, Sanitizer x5', date: '2026-06-15', status: 'Delivered', amount: 4200 },
    { orderId: '#EMC-89208', customerName: 'Megha Patel', items: 'Insulin Pen x2, Needles pack x1', date: '2026-06-14', status: 'Delivered', amount: 3500 },
    { orderId: '#EMC-89207', customerName: 'Vikram Sharma', items: 'Asthma Inhaler x2', date: '2026-06-12', status: 'Cancelled', amount: 1100 }
  ];

  // Filter and sort for Frequent Customers
  const frequentCustomers = [...customers]
    .filter(c => c.totalOrders >= 5)
    .sort((a, b) => b.totalOrders - a.totalOrders);

  // Mock data for prescription history
  const prescriptionHistory = [
    { rxId: 'RX-9081', customerName: 'Amit K.', doctor: 'Dr. Nitin Verma', date: '2026-06-17', status: 'Converted to Order', medicine: 'Amoxicillin 500mg' },
    { rxId: 'RX-9080', customerName: 'Rahul Mehta', doctor: 'Dr. Archana Sen', date: '2026-06-16', status: 'Approved & Quoted', medicine: 'Atorvastatin 20mg' },
    { rxId: 'RX-9079', customerName: 'Sara Jacob', doctor: 'Dr. Nitin Verma', date: '2026-06-15', status: 'Pending Verification', medicine: 'Metformin 1000mg' },
    { rxId: 'RX-9078', customerName: 'Megha Patel', doctor: 'Self Uploaded', date: '2026-06-12', status: 'Converted to Order', medicine: 'Lantus Insulin 100IU' }
  ];

  // Filtering logic based on search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 flex flex-col gap-5">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 leading-none">Customer Management</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Track user profiles, complete order records, repeat purchasers, and prescription archives.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by name, ID, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#135A5A] rounded-xl text-xs font-semibold outline-none shadow-sm transition-colors"
          />
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-slate-100 shrink-0">
        {[
          { id: 'list', name: 'Customer List', icon: FiUsers },
          { id: 'orders', name: 'Order History', icon: FiShoppingBag },
          { id: 'frequent', name: 'Frequent Customers', icon: FiStar },
          { id: 'prescriptions', name: 'Prescription History', icon: FiFileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedCustomer(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-0 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-[#135A5A] text-white shadow-sm' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-850'
            }`}
          >
            <tab.icon className="text-sm" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Main content display based on tab */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* TAB 1: CUSTOMER LIST */}
        {activeTab === 'list' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Details</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Info</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Region</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Tier</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500 font-mono">{cust.id}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-slate-850">{cust.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{cust.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-650">{cust.phone}</td>
                      <td className="p-4 text-xs font-semibold text-slate-650">{cust.city}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          cust.loyaltyTier === 'Platinum' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          cust.loyaltyTier === 'Gold' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {cust.loyaltyTier}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-[#135A5A] hover:text-white text-slate-650 text-xs font-bold uppercase tracking-wider border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                        >
                          <FiEye className="text-xs shrink-0" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Order ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Name</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Items Ordered</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Order Date</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map(order => (
                    <tr key={order.orderId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-800 font-mono">{order.orderId}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-850">{order.customerName}</td>
                      <td className="p-4 text-xs font-semibold text-slate-600 truncate max-w-[200px]" title={order.items}>{order.items}</td>
                      <td className="p-4 text-xs font-semibold text-slate-500">{order.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-extrabold text-slate-850">₹{order.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FREQUENT CUSTOMERS */}
        {activeTab === 'frequent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frequentCustomers.map(cust => (
              <div key={cust.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#135A5A] border border-teal-100 flex items-center justify-center font-extrabold text-sm">
                      {cust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-805">{cust.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{cust.email}</p>
                    </div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-indigo-100">
                    {cust.loyaltyTier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
                  <div>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Total Orders</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5 block">{cust.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Total Value</span>
                    <span className="text-sm font-black text-[#135A5A] mt-0.5 block">₹{cust.totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-slate-450 font-bold uppercase">Active {cust.lastActive}</span>
                  <button 
                    onClick={() => setSelectedCustomer(cust)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent"
                  >
                    <span>Analyze Profile</span>
                    <FiArrowUpRight className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PRESCRIPTION HISTORY */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Rx ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Name</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Prescribing Clinician</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Medicine Invoiced</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Upload Date</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptionHistory.map(rx => (
                    <tr key={rx.rxId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500 font-mono">{rx.rxId}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-850">{rx.customerName}</td>
                      <td className="p-4 text-xs font-semibold text-slate-650">{rx.doctor}</td>
                      <td className="p-4 text-xs font-semibold text-slate-600">{rx.medicine}</td>
                      <td className="p-4 text-xs font-semibold text-slate-500">{rx.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          rx.status === 'Converted to Order' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          rx.status === 'Approved & Quoted' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DETAILS MODAL */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col gap-5 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#135A5A] border border-teal-100 flex items-center justify-center font-extrabold text-lg">
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-805">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{selectedCustomer.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg p-1 border-0 bg-transparent cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Email Address</span>
                  <span className="text-xs font-semibold text-slate-700">{selectedCustomer.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Phone Number</span>
                  <span className="text-xs font-semibold text-slate-700">{selectedCustomer.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Location City</span>
                  <span className="text-xs font-semibold text-slate-700">{selectedCustomer.city}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Loyalty Badge</span>
                  <span className="text-xs font-bold text-indigo-600">{selectedCustomer.loyaltyTier}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="flex-1 text-center border-r border-slate-200">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lifetime Orders</span>
                  <span className="text-lg font-black text-slate-800 block mt-1">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Contribution</span>
                  <span className="text-lg font-black text-[#135A5A] block mt-1">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider border-0 rounded-2xl cursor-pointer shadow-premium transition-all"
                >
                  Close Profile View
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
