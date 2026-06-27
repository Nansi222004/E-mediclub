import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlusCircle, FiTrash2, FiEdit, FiPercent } from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';

export default function TestPackages() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  
  // Modals/Forms State
  const [showAddForm, setShowAddForm] = useState(tab === 'add');
  const [editingPkg, setEditingPkg] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", discountPrice: "", turnaround: "24 Hours", fastingRequired: "Not Required", tests: []
  });

  const fetchPackagesAndTests = async () => {
    try {
      setLoading(true);
      const pkgRes = await apiClient.get('/api/labs/vendor/packages');
      setPackages(pkgRes.data.data);
      
      const testsRes = await apiClient.get('/api/labs/vendor/tests');
      setTests(testsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackagesAndTests();
    if (tab === 'add') {
      setShowAddForm(true);
      setEditingPkg(null);
    } else {
      setShowAddForm(false);
    }
  }, [tab]);

  const handleAddPkg = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/labs/vendor/packages', formData);
      fetchPackagesAndTests();
      setShowAddForm(false);
      setFormData({ name: "", description: "", price: "", discountPrice: "", turnaround: "24 Hours", fastingRequired: "Not Required", tests: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePkg = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/api/labs/vendor/packages/${editingPkg.id}`, editingPkg);
      fetchPackagesAndTests();
      setEditingPkg(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await apiClient.delete(`/api/labs/vendor/packages/${id}`);
      fetchPackagesAndTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTestSelection = (testName, isEdit = false) => {
    if (isEdit) {
      const selected = editingPkg.tests.includes(testName)
        ? editingPkg.tests.filter(t => t !== testName)
        : [...editingPkg.tests, testName];
      setEditingPkg({ ...editingPkg, tests: selected });
    } else {
      const selected = formData.tests.includes(testName)
        ? formData.tests.filter(t => t !== testName)
        : [...formData.tests, testName];
      setFormData({ ...formData, tests: selected });
    }
  };

  const getFilteredPackages = () => {
    const matchesSearch = packages.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );
    return matchesSearch;
  };

  const filteredPkgs = getFilteredPackages();

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Diagnostic Packages</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Configure wellness checks and offer customized discounts.
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingPkg(null); }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
        >
          <FiPlusCircle className="text-sm" /> Add New Package
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddPkg} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Add Wellness Package</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Package Name</label>
              <input 
                type="text" 
                placeholder="e.g. Executive Full Body Checkup"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Original Price (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 1999"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Discount Offer Price (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 1499"
                value={formData.discountPrice}
                onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Fasting Required</label>
              <select
                value={formData.fastingRequired}
                onChange={(e) => setFormData({...formData, fastingRequired: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="Not Required">Not Required</option>
                <option value="8 Hours Fasting Required">8 Hours Fasting Required</option>
                <option value="12 Hours Fasting Required">12 Hours Fasting Required</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Report Delivery Time</label>
              <select
                value={formData.turnaround}
                onChange={(e) => setFormData({...formData, turnaround: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="12 Hours">12 Hours</option>
                <option value="24 Hours">24 Hours</option>
                <option value="48 Hours">48 Hours</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Description</label>
              <textarea 
                rows="2"
                placeholder="Brief description of the health check parameters covered..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full resize-none"
              />
            </div>

            {/* Select tests list */}
            <div className="sm:col-span-3 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Associate Tests inside Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                {tests.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.tests.includes(t.name)}
                      onChange={() => handleToggleTestSelection(t.name)}
                      className="accent-teal w-4 h-4 cursor-pointer"
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
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
              Create Package
            </button>
          </div>
        </form>
      )}

      {/* Edit Form */}
      {editingPkg && (
        <form onSubmit={handleUpdatePkg} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
          <h3 className="text-xs font-black text-slate-855 uppercase tracking-wider">Edit Package</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Package Name</label>
              <input 
                type="text" 
                value={editingPkg.name}
                onChange={(e) => setEditingPkg({...editingPkg, name: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Original Price (INR)</label>
              <input 
                type="number" 
                value={editingPkg.price}
                onChange={(e) => setEditingPkg({...editingPkg, price: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Discount Offer Price (INR)</label>
              <input 
                type="number" 
                value={editingPkg.discountPrice || ''}
                onChange={(e) => setEditingPkg({...editingPkg, discountPrice: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Fasting Required</label>
              <select
                value={editingPkg.fastingRequired}
                onChange={(e) => setEditingPkg({...editingPkg, fastingRequired: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="Not Required">Not Required</option>
                <option value="8 Hours Fasting Required">8 Hours Fasting Required</option>
                <option value="12 Hours Fasting Required">12 Hours Fasting Required</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Report Delivery Time</label>
              <select
                value={editingPkg.turnaround}
                onChange={(e) => setEditingPkg({...editingPkg, turnaround: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="12 Hours">12 Hours</option>
                <option value="24 Hours">24 Hours</option>
                <option value="48 Hours">48 Hours</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Description</label>
              <textarea 
                rows="2"
                value={editingPkg.description || ''}
                onChange={(e) => setEditingPkg({...editingPkg, description: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full resize-none"
              />
            </div>

            {/* Select tests list */}
            <div className="sm:col-span-3 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Associate Tests inside Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto no-scrollbar">
                {tests.map(t => (
                  <label key={t.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingPkg.tests.includes(t.name)}
                      onChange={() => handleToggleTestSelection(t.name, true)}
                      className="accent-teal w-4 h-4 cursor-pointer"
                    />
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setEditingPkg(null)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Packages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPkgs.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium flex flex-col justify-between gap-5 relative overflow-hidden group">
            
            {/* Discount Badge */}
            {pkg.discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                <FiPercent /> {pkg.discountPercent}% OFF
              </div>
            )}

            <div>
              <span className="text-[9px] text-slate-405 font-black uppercase tracking-wider block">Diagnostics package</span>
              <h3 className="text-base font-black text-slate-800 tracking-tight mt-1 group-hover:text-teal transition-colors">{pkg.name}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed line-clamp-2">{pkg.description || 'Complete health parameter checkup.'}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[10px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{pkg.fastingRequired}</span>
                <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1"><FiClock /> {pkg.turnaround} Reports</span>
              </div>

              {/* Sub-tests covered */}
              {pkg.tests && pkg.tests.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-50">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">Parameters Covered ({pkg.tests.length}):</span>
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto no-scrollbar">
                    {pkg.tests.map((test, index) => (
                      <span key={index} className="text-[9.5px] font-bold text-slate-600 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-lg">{test}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
              <div className="flex flex-col">
                {pkg.discountPrice ? (
                  <>
                    <span className="text-[9px] text-slate-400 font-bold uppercase line-through">₹{pkg.price}</span>
                    <strong className="text-base font-black text-[#135A5A]">₹{pkg.discountPrice}</strong>
                  </>
                ) : (
                  <strong className="text-base font-black text-[#135A5A]">₹{pkg.price}</strong>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingPkg(pkg); setShowAddForm(false); }}
                  className="p-2.5 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer border-0 tap-scale"
                  title="Edit Package"
                >
                  <FiEdit className="text-xs" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer border-0 tap-scale"
                  title="Delete Package"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
