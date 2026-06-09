import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReusableTable from '../../admin/components/ReusableTable';
import { editAppointmentStatus } from '../store/vendorSlice';
import { FiActivity, FiCheck, FiClock } from 'react-icons/fi';

export default function VendorAppointmentsPage() {
  const dispatch = useDispatch();
  const { appointments } = useSelector(state => state.vendor);

  const handleConfirm = (id) => {
    dispatch(editAppointmentStatus({ id, status: 'confirmed' }));
  };

  // Define table column descriptors
  const columns = [
    { 
      key: 'patientName', 
      header: 'Patient Profile',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
            👤
          </div>
          <span className="font-extrabold text-slate-800 text-xs">{row.patientName}</span>
        </div>
      )
    },
    { key: 'doctorName', header: 'Assigned Clinician' },
    { 
      key: 'slot', 
      header: 'Assigned Slot',
      render: (row) => <span className="font-extrabold text-teal">{row.slot}</span>
    },
    { 
      key: 'date', 
      header: 'Booking Date',
      render: (row) => <span className="font-bold text-slate-500">{row.date}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => {
        if (row.status === 'confirmed') return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Confirmed</span>;
        return <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Slot</span>;
      }
    }
  ];

  // Actions column trigger
  const tableActions = (row) => {
    if (row.status === 'pending') {
      return (
        <button 
          onClick={() => handleConfirm(row.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-teal-dark shadow-sm transition-all cursor-pointer tap-scale"
        >
          <FiCheck /> Confirm Slot
        </button>
      );
    }
    return (
      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1 select-none pr-3">
        <FiCheckCircle className="text-teal text-xs" /> CONFIRMED
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Consultations Roster</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor client doctor consultations, verify appointment requests, and schedule outpatients lists.
          </p>
        </div>
      </div>

      {/* Roster Grid */}
      <ReusableTable 
        columns={columns}
        data={appointments}
        searchPlaceholder="Search outpatient by name..."
        searchKey="patientName"
        filterOptions={{ key: 'status', label: 'Status', options: ['confirmed', 'pending'] }}
        actions={tableActions}
        fileName="emediclub-consultations-roster"
      />

    </div>
  );
}
import { FiCheckCircle } from 'react-icons/fi';
