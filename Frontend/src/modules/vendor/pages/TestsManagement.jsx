import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FiPlusCircle, FiTrash2, FiSearch, FiEdit, FiFolder } from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';

export default function TestsManagement() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  
  // Modals/Forms State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", category: "Blood Test", price: "", turnaround: "12 Hours", code: ""
  });

  // --- DUMMY DATA FOR CATEGORIES ---
  const [categories, setCategories] = useState([
    { id: 'CAT-001', name: 'Blood Test', description: 'Comprehensive blood profiles and markers', testCount: 45, status: 'Active' },
    { id: 'CAT-002', name: 'Urine Test', description: 'Urine analysis and toxicology', testCount: 12, status: 'Active' },
    { id: 'CAT-003', name: 'Imaging Scan', description: 'MRI, X-Ray, CT Scans, and Ultrasound', testCount: 8, status: 'Inactive' }
  ]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const fetchTests = async () => {
    if (tab === 'categories') {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Dummy data bypass to prevent 401 network errors
    setTimeout(() => {
      setTests([
        { id: 'TST-001', code: 'LP-01', name: 'Lipid Profile', category: 'Blood Test', turnaround: '12 Hours', price: 500, isActive: true },
        { id: 'TST-002', code: 'CBC-01', name: 'Complete Blood Count', category: 'Blood Test', turnaround: '6 Hours', price: 350, isActive: true }
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchTests();
  }, [tab]);

  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/labs/vendor/tests', formData);
      fetchTests();
      setShowAddForm(false);
      setFormData({ name: "", category: "Blood Test", price: "", turnaround: "12 Hours", code: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTest = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/api/labs/vendor/tests/${editingTest.id}`, editingTest);
      fetchTests();
      setEditingTest(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await apiClient.delete(`/api/labs/vendor/tests/${id}`);
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await apiClient.put(`/api/labs/vendor/tests/${id}`, {
        isActive: !currentStatus
      });
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const cat = {
      id: `CAT-00${categories.length + 1}`,
      name: newCategory.name,
      description: newCategory.description,
      testCount: 0,
      status: 'Active'
    };
    setCategories([...categories, cat]);
    setShowAddCategory(false);
    setNewCategory({ name: '', description: '' });
  };

  const getFilteredTests = () => {
    const matchesSearch = tests.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
    );
    if (tab === 'pricing') {
      return matchesSearch;
    }
    return matchesSearch;
  };

  const filteredTests = getFilteredTests();

  const tabs = [
    { label: 'All Tests', id: 'all' },
    { label: 'Categories', id: 'categories' },
    { label: 'Pricing', id: 'pricing' }
  ];

  const renderTabs = () => (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 border-b border-slate-100">
      {tabs.map(t => (
        <NavLink
          key={t.id}
          to={`/vendor/lab/tests/${t.id}`}
          className={({ isActive }) => `
            px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors tap-scale
            ${isActive || (tab === undefined && t.id === 'all')
              ? 'bg-teal text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }
          `}
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );

  // render UI specifically for categories tab
  if (tab === 'categories') {
    return (
      <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
        {renderTabs()}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 leading-none">Test Categories</h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
              Manage functional groupings for diagnostic tests.
            </p>
          </div>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
          >
            <FiPlusCircle className="text-sm" /> Add New Category
          </button>
        </div>

        {showAddCategory && (
          <form onSubmit={handleAddCategory} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Create Test Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                  placeholder="e.g. Hormonal Panel"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Brief Description</label>
                <input 
                  type="text" 
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="e.g. Endocrine system and hormone checks"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddCategory(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Save Category</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner border border-slate-100">
                    <FiFolder className="text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">{cat.name}</h3>
                    <span className="text-xs text-slate-400 font-bold tracking-wide">{cat.id}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${cat.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {cat.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed mt-1">{cat.description}</p>
              <div className="flex justify-between items-center bg-slate-50/80 px-3.5 py-2.5 rounded-xl border border-slate-200/50 mt-1">
                <span className="text-slate-500 font-extrabold uppercase text-xs tracking-wider">Associated Tests:</span>
                <span className="text-slate-800 font-black text-lg leading-none">{cat.testCount}</span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
                <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer border border-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 tap-scale" title="Edit">
                  <FiEdit className="text-sm" /> Edit
                </button>
                <button className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer border border-rose-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 tap-scale" title="Delete">
                  <FiTrash2 className="text-sm" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER DEFAULT TESTS REGISTRY UI ---
  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      {renderTabs()}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Diagnostic Test Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Register individual clinical tests, set parameters, and activate slots.
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingTest(null); }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
        >
          <FiPlusCircle className="text-sm" /> Add New Test
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTest} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Register Diagnostic Test</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Test Name</label>
              <input 
                type="text" 
                placeholder="e.g. Vitamin D3 (25-Hydroxy)"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Turnaround Time</label>
              <select
                value={formData.turnaround}
                onChange={(e) => setFormData({...formData, turnaround: e.target.value})}
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
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Register Test</button>
          </div>
        </form>
      )}

      {editingTest && (
        <form onSubmit={handleUpdateTest} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Edit Diagnostic Test</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Test Name</label>
              <input 
                type="text" 
                value={editingTest.name}
                onChange={(e) => setEditingTest({...editingTest, name: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Category</label>
              <select
                value={editingTest.category}
                onChange={(e) => setEditingTest({...editingTest, category: e.target.value})}
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
                value={editingTest.price}
                onChange={(e) => setEditingTest({...editingTest, price: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 tracking-wide">Turnaround Time</label>
              <select
                value={editingTest.turnaround}
                onChange={(e) => setEditingTest({...editingTest, turnaround: e.target.value})}
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
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => setEditingTest(null)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Save Changes</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-2xl mb-5 max-w-sm">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search test panel name, category, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-450 font-bold uppercase">No diagnostic tests registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  <th className="py-4.5 px-6">Test Code</th>
                  <th className="py-4.5 px-6">Name</th>
                  <th className="py-4.5 px-6">Category</th>
                  <th className="py-4.5 px-6">Turnaround</th>
                  <th className="py-4.5 px-6">Price</th>
                  <th className="py-4.5 px-6">Status</th>
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
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleToggleActive(t.id, t.isActive)}
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer
                          ${t.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                      >
                        {t.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingTest(t); setShowAddForm(false); }} className="p-2 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer border-0 tap-scale" title="Edit">
                          <FiEdit className="text-sm shrink-0" />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer border-0 tap-scale" title="Delete">
                          <FiTrash2 className="text-sm shrink-0" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
