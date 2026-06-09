import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReusableTable from '../components/ReusableTable';
import { toggleUserStatus } from '../store/adminSlice';
import { FiUserCheck, FiSlash, FiCheck, FiUsers } from 'react-icons/fi';

export default function UsersManagement() {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.admin);

  const handleToggleBlock = (id) => {
    dispatch(toggleUserStatus(id));
  };

  // Define table column mappings
  const columns = [
    { 
      key: 'name', 
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-extrabold text-slate-800 block">{row.name}</span>
            <span className="text-[9px] text-slate-400 font-semibold block uppercase">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'phone', header: 'Contact Mobile' },
    { 
      key: 'joinedDate', 
      header: 'Joined Date',
      render: (row) => <span className="font-bold text-slate-500">{row.joinedDate}</span>
    },
    { 
      key: 'totalOrders', 
      header: 'Orders',
      render: (row) => <span className="font-extrabold text-slate-700">{row.totalOrders} bookings</span>
    },
    { 
      key: 'spent', 
      header: 'Total Spent',
      render: (row) => <span className="font-black text-slate-800">₹{row.spent.toLocaleString()}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => {
        if (row.status === 'active') {
          return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Active</span>;
        }
        return <span className="bg-coral-light text-coral px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Blocked</span>;
      }
    }
  ];

  // Action column triggers
  const tableActions = (row) => (
    <button 
      onClick={() => handleToggleBlock(row.id)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale shadow-sm
        ${row.status === 'active' 
          ? 'bg-coral-light/40 hover:bg-coral-light text-coral' 
          : 'bg-teal-light hover:bg-teal-light/80 text-teal'
        }
      `}
    >
      {row.status === 'active' ? (
        <>
          <FiSlash className="shrink-0" /> Block
        </>
      ) : (
        <>
          <FiCheck className="shrink-0" /> Unblock
        </>
      )}
    </button>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Customer Core Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review active clients registries, spent history totals, and toggle platform access controls.
          </p>
        </div>
      </div>

      {/* Main Table Grid */}
      <ReusableTable 
        columns={columns}
        data={users}
        searchPlaceholder="Search customer by name or email..."
        searchKey="name"
        filterOptions={{ key: 'status', label: 'Status', options: ['active', 'blocked'] }}
        actions={tableActions}
        fileName="emediclub-customer-base"
      />

    </div>
  );
}
