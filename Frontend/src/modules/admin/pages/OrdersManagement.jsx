import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import Logo from '../../../shared/components/Logo';
import { FiShoppingBag, FiFileText, FiPrinter, FiXCircle, FiCheckCircle, FiTruck } from 'react-icons/fi';

const mockGlobalOrders = [
  { id: 'EM-OD-9081', customerName: 'Ramesh Kumar', items: 'Organic Ashvagandha Daily Tablets x 2, Paracetamol 650mg x 1', totalAmount: 630, status: 'pending', date: '2026-05-26', email: 'ramesh@gmail.com', phone: '9876543201', address: '12, Garden View, Link Road, Bandra, Mumbai, MH - 400050' },
  { id: 'EM-OD-9065', customerName: 'Vijay Chawla', items: 'Chyawanprash Awaleha Immune x 1', totalAmount: 304, status: 'shipped', date: '2026-05-25', email: 'vijay@gmail.com', phone: '9876543204', address: 'Plot 45, Tech Park, Sector V, Salt Lake, New Delhi, DL - 110001' },
  { id: 'EM-OD-8991', customerName: 'Anoop Singh', items: 'Amoxicillin 500mg Capsules x 2', totalAmount: 212, status: 'delivered', date: '2026-05-20', email: 'anoop@gmail.com', phone: '9876543202', address: '12, Garden View, Link Road, Bandra, Mumbai, MH - 400050' },
  { id: 'EM-OD-8772', customerName: 'Sunita Sharma', items: 'Multivitamins Daily Care x 1', totalAmount: 450, status: 'cancelled', date: '2026-05-18', email: 'sunita@gmail.com', phone: '9876543203', address: 'Apartment 34, City Heights, Sector 62, Gurgaon, HR - 122001' },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState(mockGlobalOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleOpenInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // Define table column descriptors
  const columns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customerName', header: 'Customer' },
    { 
      key: 'items', 
      header: 'Prescribed Items',
      render: (row) => <span className="truncate max-w-xs block font-medium">{row.items}</span>
    },
    { 
      key: 'date', 
      header: 'Booking Date',
      render: (row) => <span className="font-extrabold text-slate-500">{row.date}</span>
    },
    { 
      key: 'status', 
      header: 'Fulfillment',
      render: (row) => {
        if (row.status === 'pending') return <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Pending</span>;
        if (row.status === 'shipped') return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit"><FiTruck /> Shipped</span>;
        if (row.status === 'delivered') return <span className="bg-forest/10 text-forest px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Delivered</span>;
        return <span className="bg-coral-light text-coral px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Cancelled</span>;
      }
    },
    { 
      key: 'totalAmount', 
      header: 'Total Paid',
      render: (row) => <span className="font-black text-slate-800">₹{row.totalAmount}</span>
    }
  ];

  // Action column JSX elements
  const tableActions = (row) => (
    <>
      <button 
        onClick={() => handleOpenInvoice(row)}
        className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
      >
        <FiFileText /> Invoice
      </button>

      {row.status === 'pending' && (
        <button 
          onClick={() => handleUpdateStatus(row.id, 'shipped')}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-teal-dark shadow-sm transition-all cursor-pointer tap-scale"
        >
          Dispatch
        </button>
      )}
    </>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Global Orders Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor patient bookings, process dispatch dispatches, and print compliance invoices.
          </p>
        </div>
      </div>

      {/* Main Table grid */}
      <ReusableTable 
        columns={columns}
        data={orders}
        searchPlaceholder="Search order ID or client name..."
        searchKey="customerName"
        filterOptions={{ key: 'status', label: 'Fulfillment', options: ['pending', 'shipped', 'delivered', 'cancelled'] }}
        actions={tableActions}
        fileName="emediclub-global-orders"
      />

      {/* 4. High Fidelity Print Invoice Glassmorphic Modal */}
      <AnimatePresence>
        {showInvoiceModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-2xl w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col justify-between"
            >
              
              {/* Dynamic Invoice sheet container */}
              <div id="invoice-sheet" className="p-4 sm:p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-5">
                
                {/* Header branding */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div className="flex flex-col gap-1">
                    <Logo showText={true} />
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">Hospital Care & Diagnostic Corp</span>
                  </div>
                  <div className="text-right">
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-wide leading-none">INVOICE SHEET</h3>
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 block uppercase tracking-wider">RECPT: #{selectedOrder.id}</span>
                  </div>
                </div>

                {/* Patient metadata */}
                <div className="grid grid-cols-2 gap-4 text-2xs font-semibold text-slate-600">
                  <div className="flex flex-col gap-1 border-r border-slate-200 pr-4">
                    <span className="text-slate-400 font-black uppercase tracking-wider">Patient Details</span>
                    <span className="font-extrabold text-slate-800 text-xs mt-0.5">{selectedOrder.customerName}</span>
                    <span className="text-[10px]">{selectedOrder.email}</span>
                    <span className="text-[10px] mt-0.5">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <span className="text-slate-400 font-black uppercase tracking-wider">Delivery Coordinates</span>
                    <p className="text-[10px] leading-relaxed mt-0.5 text-slate-600">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Items breakdowns table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-2">
                  <div className="grid grid-cols-12 bg-slate-100 text-[8px] font-black uppercase tracking-widest p-2 border-b border-slate-200 text-slate-400">
                    <span className="col-span-8 pl-2">Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right pr-2">Total</span>
                  </div>
                  
                  {/* Item rows details */}
                  <div className="flex flex-col text-2xs font-bold text-slate-700 divide-y divide-slate-100">
                    {selectedOrder.items.split(',').map((it, index) => {
                      const parts = it.trim().split('x');
                      const name = parts[0].trim();
                      const qty = parts[1] ? parts[1].trim() : '1';
                      return (
                        <div key={index} className="grid grid-cols-12 p-3 font-medium">
                          <span className="col-span-8 pl-2 font-black text-slate-800">{name}</span>
                          <span className="col-span-2 text-center">{qty}</span>
                          <span className="col-span-2 text-right pr-2">Calculated</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total receipt calculations */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4.5 mt-2 font-black text-xs text-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Transaction Date: {selectedOrder.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-black uppercase">Net Total:</span>
                    <span className="text-base text-teal">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-50 pt-5">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                >
                  Close Receipt
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1.5 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                >
                  <FiPrinter /> Print Receipt
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
