import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReusableTable from '../../admin/components/ReusableTable';
import { addLabTest } from '../store/vendorSlice';
import { FiActivity, FiPlus, FiCheck, FiLayers, FiFileText } from 'react-icons/fi';

export default function VendorLabTestsManagement() {
  const dispatch = useDispatch();
  const { labTests } = useSelector(state => state.vendor);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newParams, setNewParams] = useState("");
  const [newSample, setNewSample] = useState("Blood");

  const handleAddTest = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    
    dispatch(addLabTest({
      name: newName,
      price: Number(newPrice),
      parameters: Number(newParams) || 10,
      sampleType: newSample,
      homeCollection: 'Yes',
      durationHours: 24
    }));
    
    setShowAddModal(false);
    // resets
    setNewName("");
    setNewPrice("");
    setNewParams("");
  };

  // Define Columns
  const columns = [
    { 
      key: 'name', 
      header: 'Diagnostic Package',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
            🧪
          </div>
          <div>
            <span className="font-extrabold text-slate-800 block text-xs truncate max-w-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Home Collection Available</span>
          </div>
        </div>
      )
    },
    { 
      key: 'parameters', 
      header: 'Parameters covered',
      render: (row) => <span className="font-extrabold text-slate-700">{row.parameters || 12} parameters</span>
    },
    { key: 'sampleType', header: 'Sample Type' },
    { 
      key: 'durationHours', 
      header: 'TAT Report',
      render: (row) => <span className="font-extrabold text-slate-500">{row.durationHours || 24} Hours</span>
    },
    { 
      key: 'price', 
      header: 'Listing Price',
      render: (row) => <span className="font-black text-slate-800">₹{row.price}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header deck */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Diagnostic Lab Packages</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Configure health diagnostic tests pricing, Covered clinical parameters, and home collections details.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-teal text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm hover:bg-teal-dark transition-all cursor-pointer tap-scale"
        >
          <FiPlus /> Add Package
        </button>
      </div>

      {/* Grid view */}
      <ReusableTable 
        columns={columns}
        data={labTests}
        searchPlaceholder="Search diagnostic test panel..."
        searchKey="name"
        fileName="emediclub-vendor-labtests"
      />

      {/* Add package modal dialog */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-10 relative overflow-hidden"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiLayers className="text-teal" /> Create Health Package
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3 mb-6">
                Publish a new diagnostic test list to customers.
              </p>

              <form onSubmit={handleAddTest} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Test Package Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Complete Liver Scan Panel"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Listing Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g., 599"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Parameters Covered</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 18"
                      value={newParams}
                      onChange={(e) => setNewParams(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Sample Type</label>
                  <select 
                    value={newSample} 
                    onChange={(e) => setNewSample(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wide outline-none focus:border-teal"
                  >
                    <option value="Blood">Blood Sample</option>
                    <option value="Urine">Urine Sample</option>
                    <option value="Swab">Nasal Swab</option>
                    <option value="Blood / Urine">Blood & Urine Panel</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 border-t border-slate-50 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                  >
                    Publish Package
                  </button>
                </div>
              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
