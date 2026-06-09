import React, { useState } from 'react';
import { FiPlusCircle, FiActivity, FiTrash2, FiSearch } from 'react-icons/fi';

export default function LabVendorTests() {
  const [tests, setTests] = useState([
    { id: 1, name: 'Complete Blood Count (CBC)', category: 'Blood Test', price: 350, turnaround: '12 Hours', code: 'TC-CBC-10' },
    { id: 2, name: 'Lipid Profile Screen', category: 'Cholesterol Test', price: 800, turnaround: '24 Hours', code: 'TC-LIP-22' },
    { id: 3, name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 650, turnaround: '12 Hours', code: 'TC-LIV-08' },
    { id: 4, name: 'Thyroid Panel (T3, T4, TSH)', category: 'Hormones', price: 499, turnaround: '18 Hours', code: 'TC-THY-14' },
    { id: 5, name: 'Renal Function Panel (KFT)', category: 'Kidney Profile', price: 750, turnaround: '12 Hours', code: 'TC-REN-05' },
  ]);

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("Blood Test");
  const [newPrice, setNewPrice] = useState("");
  const [newTurnaround, setNewTurnaround] = useState("12 Hours");

  const handleAddTest = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    setTests(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        category: newCat,
        price: Number(newPrice),
        turnaround: newTurnaround,
        code: `TC-${newCat.substring(0,3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`
      }
    ]);

    setNewName("");
    setNewPrice("");
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Diagnostic Test Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Register and configure diagnostic panel tests offered by your Laboratory.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
        >
          <FiPlusCircle className="text-sm" /> Add New Test
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTest} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col gap-4 animate-fade-in">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Add Clinical Diagnostic Test</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Test Name</label>
              <input 
                type="text" 
                placeholder="e.g. Vitamin D3 (25-Hydroxy)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Thyroid">Thyroid Test</option>
                <option value="Hormones">Hormonal Test</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Imaging">Imaging Scan</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Pricing (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 500"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Turnaround Time</label>
              <select
                value={newTurnaround}
                onChange={(e) => setNewTurnaround(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="6 Hours">6 Hours</option>
                <option value="12 Hours">12 Hours</option>
                <option value="18 Hours">18 Hours</option>
                <option value="24 Hours">24 Hours</option>
                <option value="48 Hours">48 Hours</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3.5 mt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm"
            >
              Register Test
            </button>
          </div>
        </form>
      )}

      {/* Listings */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-2xl mb-5 max-w-sm">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search test panel name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <th className="py-4.5 px-6">Test Code</th>
                <th className="py-4.5 px-6">Name</th>
                <th className="py-4.5 px-6">Category</th>
                <th className="py-4.5 px-6">Turnaround</th>
                <th className="py-4.5 px-6">Price</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-650">
              {filteredTests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-800">{t.code}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-700">{t.name}</td>
                  <td className="py-4 px-6 text-slate-500 font-bold">{t.category}</td>
                  <td className="py-4 px-6 font-bold text-slate-500">{t.turnaround}</td>
                  <td className="py-4 px-6 font-black text-slate-850">₹{t.price}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer border-0 tap-scale"
                      title="Deregister Test"
                    >
                      <FiTrash2 className="text-sm shrink-0" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
