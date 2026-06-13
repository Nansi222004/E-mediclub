import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { addNewLabTest, deleteLabTest, editLabTest } from '../../user/store/productSlice';
import { 
  FiTrash2, FiEye, FiEdit2, FiPlus, FiSearch, 
  FiFilter, FiDollarSign, FiClock, FiAlertTriangle, 
  FiCheck, FiX, FiCheckCircle, FiShield
} from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function LabTestsManagement({ autoOpenAdd = false }) {
  const dispatch = useDispatch();
  const { labCategories, labs } = useSelector(state => state.products);
  const [labTestsList, setLabTestsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { locationFilter, isFiltered } = useAdminLocation();
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  // Search & Filter local states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");
  const [selectedNabl, setSelectedNabl] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/lab-tests', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setLabTestsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(autoOpenAdd);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Active items states
  const [testToView, setTestToView] = useState(null);
  const [testToEdit, setTestToEdit] = useState(null);
  const [testToDelete, setTestToDelete] = useState(null);

  // Add/Edit Form State
  const initialFormState = {
    name: "",
    category: "Blood Test",
    labId: labs[0]?.id || "",
    price: "",
    discountPrice: "",
    parameters: "",
    timeframe: "Report in 12 Hrs",
    fastingRequired: "No fasting required",
    testsIncluded: ""
  };
  const [formState, setFormState] = useState(initialFormState);

  // Helper: check if a test is NABL accredited based on its lab
  const isNablCertified = (test) => {
    const lab = labs.find(l => l.name === test.labName || l.id === test.labId);
    return lab ? lab.nablCertified : false;
  };

  // Filter Logic
  const filteredTests = useMemo(() => {
    return labTestsList.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLab = selectedLab === "all" ? true : (test.labName === selectedLab || test.labId === selectedLab);
      const matchesNabl = selectedNabl === "all" ? true :
                          selectedNabl === "yes" ? isNablCertified(test) === true :
                          selectedNabl === "no" ? isNablCertified(test) === false : true;
      const matchesCategory = selectedCategory === "all" ? true : test.category === selectedCategory;
      
      const priceVal = test.discountPrice || test.price;
      const matchesPrice = selectedPriceRange === "all" ? true :
                           selectedPriceRange === "under500" ? priceVal < 500 :
                           selectedPriceRange === "500to1000" ? (priceVal >= 500 && priceVal <= 1000) :
                           selectedPriceRange === "1000to2000" ? (priceVal >= 1000 && priceVal <= 2000) :
                           selectedPriceRange === "over2000" ? priceVal > 2000 : true;

      return matchesSearch && matchesLab && matchesNabl && matchesCategory && matchesPrice;
    });
  }, [labTestsList, searchQuery, selectedLab, selectedNabl, selectedCategory, selectedPriceRange]);

  // Extract unique lab list for filter
  const uniqueLabs = Array.from(new Set(labTestsList.map(t => t.labName).filter(Boolean)));

  // Handle Add Form Submission
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.price) return;
    
    const selectedLabObj = labs.find(l => l.id === formState.labId);
    const price = Number(formState.price);
    const discountPrice = formState.discountPrice ? Number(formState.discountPrice) : price;
    const discountPercent = Math.round(((price - discountPrice) / price) * 100);

    const payload = {
      name: formState.name,
      category: formState.category,
      labId: formState.labId,
      labName: selectedLabObj ? selectedLabObj.name : "E Mediclub Laboratories",
      price,
      discountPrice,
      discountPercent: discountPercent > 0 ? discountPercent : 0,
      parameters: formState.parameters ? `${formState.parameters} Parameters Checked` : "12 Parameters Checked",
      timeframe: formState.timeframe,
      fastingRequired: formState.fastingRequired,
      testsIncluded: formState.testsIncluded,
      tag: discountPercent > 40 ? "Super Value" : "Popular"
    };

    dispatch(addNewLabTest(payload));
    setShowAddModal(false);
    setFormState(initialFormState);
  };

  // Open Edit Modal & Populate Form
  const openEditModal = (test) => {
    setTestToEdit(test);
    setFormState({
      name: test.name,
      category: test.category || "Blood Test",
      labId: test.labId || labs.find(l => l.name === test.labName)?.id || labs[0]?.id || "",
      price: test.price,
      discountPrice: test.discountPrice || "",
      parameters: test.parameters ? parseInt(test.parameters) : "",
      timeframe: test.timeframe || "Report in 12 Hrs",
      fastingRequired: test.fastingRequired || "No fasting required",
      testsIncluded: test.testsIncluded || ""
    });
    setShowEditModal(true);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!testToEdit || !formState.name || !formState.price) return;

    const selectedLabObj = labs.find(l => l.id === formState.labId);
    const price = Number(formState.price);
    const discountPrice = formState.discountPrice ? Number(formState.discountPrice) : price;
    const discountPercent = Math.round(((price - discountPrice) / price) * 100);

    const payload = {
      id: testToEdit.id,
      name: formState.name,
      category: formState.category,
      labId: formState.labId,
      labName: selectedLabObj ? selectedLabObj.name : testToEdit.labName,
      price,
      discountPrice,
      discountPercent: discountPercent > 0 ? discountPercent : 0,
      parameters: formState.parameters ? `${formState.parameters} Parameters Checked` : testToEdit.parameters,
      timeframe: formState.timeframe,
      fastingRequired: formState.fastingRequired,
      testsIncluded: formState.testsIncluded
    };

    dispatch(editLabTest(payload));
    setShowEditModal(false);
    setTestToEdit(null);
    setFormState(initialFormState);
  };

  // Delete Action Confirm
  const handleDeleteConfirm = () => {
    if (!testToDelete) return;
    dispatch(deleteLabTest(testToDelete.id));
    setShowDeleteConfirmModal(false);
    setTestToDelete(null);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3.5 overflow-hidden font-sans">
      
      {/* Page Header */}
      <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-100 pb-2 shrink-0">
        <div>
          <div className="text-base font-extrabold text-slate-800 leading-none">Diagnostic Catalog Directory</div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-tight">
            Browse and manage diagnostic checkup panels, parameter counts, pricing structures, and test preps.
          </p>
        </div>
        <button
          onClick={() => { setFormState(initialFormState); setShowAddModal(true); }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal hover:bg-teal-dark text-white text-[10px] font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer tap-scale shrink-0"
        >
          <FiPlus className="text-xs" />
          <span>Add Lab Test</span>
        </button>
      </div>

      {/* Location Filter Bar */}
      <LocationFilter />
      <LocationBanner />

      {/* Filter Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-premium shrink-0">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search test name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>

        {/* Lab Name Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedLab} 
            onChange={(e) => setSelectedLab(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Laboratories</option>
            {uniqueLabs.map((labName, idx) => (
              <option key={idx} value={labName}>{labName}</option>
            ))}
          </select>
        </div>

        {/* NABL Accredited Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedNabl} 
            onChange={(e) => setSelectedNabl(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">NABL Certified</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Classes</option>
            {labCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-xl">
          <FiFilter className="text-slate-400 text-[9px] shrink-0" />
          <select 
            value={selectedPriceRange} 
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="bg-transparent border-none outline-none text-[9px] font-black text-slate-650 uppercase tracking-wide cursor-pointer w-full"
          >
            <option value="all">All Prices</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 - ₹1000</option>
            <option value="1000to2000">₹1000 - ₹2000</option>
            <option value="over2000">Over ₹2000</option>
          </select>
        </div>

      </div>

      {/* Main Listings */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && labTestsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && labTestsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">🔬</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Lab Tests Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no diagnostic test packages registered in the system yet.</p>
          </div>
        ) : filteredTests.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4.5 px-6">Diagnostic Package</th>
                    <th className="py-4.5 px-6">Lab Partner</th>
                    <th className="py-4.5 px-6">NABL Status</th>
                    <th className="py-4.5 px-6">Diagnostic Class</th>
                    <th className="py-4.5 px-6">Covered Parameters</th>
                    <th className="py-4.5 px-6">Listing Price</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {filteredTests.map((test) => {
                    const isNabl = isNablCertified(test);
                    return (
                      <tr key={test.id} className="hover:bg-slate-50/30 transition-colors">
                        {/* Name */}
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
                              🧪
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-800 block text-xs truncate max-w-[200px]">{test.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">{test.timeframe}</span>
                            </div>
                          </div>
                        </td>

                        {/* Lab Name */}
                        <td className="py-4.5 px-6 font-bold text-slate-700">
                          {test.labName}
                        </td>

                        {/* NABL Accredited status */}
                        <td className="py-4.5 px-6">
                          {isNabl ? (
                            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-0.5">
                              <FiShield className="text-[10px]" /> NABL
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-450 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-0.5">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-4.5 px-6">
                          <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-650 uppercase tracking-wide">
                            {test.category}
                          </span>
                        </td>

                        {/* Parameters */}
                        <td className="py-4.5 px-6 font-bold text-slate-600 text-2xs">
                          {test.parameters || "12 Parameters Checked"}
                        </td>

                        {/* Price */}
                        <td className="py-4.5 px-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-850 text-xs">₹{test.discountPrice || test.price}</span>
                            {test.discountPercent > 0 && (
                              <span className="text-[9px] text-teal font-extrabold">{test.discountPercent}% OFF</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* View Detail Button */}
                            <button
                              onClick={() => { setTestToView(test); setShowViewModal(true); }}
                              title="View Details"
                              className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                              <FiEye className="text-xs shrink-0" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditModal(test)}
                              title="Edit Test"
                              className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                              <FiEdit2 className="text-xs shrink-0" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => { setTestToDelete(test); setShowDeleteConfirmModal(true); }}
                              title="Delete Test"
                              className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                            >
                              <FiTrash2 className="text-xs shrink-0" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredTests.map((test) => {
                const isNabl = isNablCertified(test);
                return (
                  <div key={test.id} className="bg-white border border-slate-100 p-4.5 rounded-[24px] shadow-premium flex flex-col gap-3.5 hover-lift">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-800 text-sm leading-tight truncate">{test.name}</div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 truncate">🏢 {test.labName}</p>
                      </div>
                      <div>
                        {isNabl ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">NABL</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-450 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Standard</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-150/40 grid grid-cols-3 gap-1 text-center items-center text-[10px]">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Class</span>
                        <span className="font-extrabold text-slate-800 leading-tight truncate text-[9px]">{test.category}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Price</span>
                        <span className="font-black text-slate-800 leading-tight truncate text-[9px]">₹{test.discountPrice || test.price}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Covered</span>
                        <span className="font-extrabold text-slate-800 leading-tight truncate text-[9px]">{test.parameters || "12 Check"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <button
                        onClick={() => { setTestToView(test); setShowViewModal(true); }}
                        className="flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        <FiEye />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => openEditModal(test)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        <FiEdit2 />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => { setTestToDelete(test); setShowDeleteConfirmModal(true); }}
                        className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 p-12 text-center rounded-3xl shadow-premium">
            <p className="text-slate-400 font-bold text-sm uppercase">No diagnostic test packages match that selection.</p>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 4. ADD LAB TEST MODAL                                */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-lg w-full p-6 sm:p-8 z-20 relative overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4.5 mb-5">
                <div className="text-base font-black text-slate-800 uppercase tracking-wider leading-none">Add New Diagnostic Test</div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Test / Package Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name} 
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Lipase & Amylase Pancreatic Screening"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Diagnostic Class</label>
                    <select 
                      value={formState.category} 
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal cursor-pointer"
                    >
                      {labCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lab Partner</label>
                    <select 
                      value={formState.labId} 
                      onChange={(e) => setFormState({ ...formState, labId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal cursor-pointer"
                    >
                      {labs.map((lab) => (
                        <option key={lab.id} value={lab.id}>{lab.name} {lab.nablCertified ? '(NABL)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Original Price (₹) *</label>
                    <input 
                      type="number" 
                      required 
                      value={formState.price} 
                      onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                      placeholder="e.g. 1200"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Offer Price (₹, Leave empty for no discount)</label>
                    <input 
                      type="number" 
                      value={formState.discountPrice} 
                      onChange={(e) => setFormState({ ...formState, discountPrice: e.target.value })}
                      placeholder="e.g. 799"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Parameters Count</label>
                    <input 
                      type="number" 
                      value={formState.parameters} 
                      onChange={(e) => setFormState({ ...formState, parameters: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reporting Timeframe</label>
                    <input 
                      type="text" 
                      value={formState.timeframe} 
                      onChange={(e) => setFormState({ ...formState, timeframe: e.target.value })}
                      placeholder="e.g. Report in 12 Hrs"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Fasting Instruction</label>
                  <input 
                    type="text" 
                    value={formState.fastingRequired} 
                    onChange={(e) => setFormState({ ...formState, fastingRequired: e.target.value })}
                    placeholder="e.g. 10-12 hours fasting mandatory"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Tests Included (Comma-separated)</label>
                  <textarea 
                    value={formState.testsIncluded} 
                    onChange={(e) => setFormState({ ...formState, testsIncluded: e.target.value })}
                    placeholder="e.g. Serum Amylase, Serum Lipase"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Save Test
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 5. EDIT LAB TEST MODAL                               */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showEditModal && testToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-lg w-full p-6 sm:p-8 z-20 relative overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4.5 mb-5">
                <div className="text-base font-black text-slate-800 uppercase tracking-wider leading-none">Modify Diagnostic Test</div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-xs font-semibold text-slate-700">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Test / Package Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formState.name} 
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Diagnostic Class</label>
                    <select 
                      value={formState.category} 
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal cursor-pointer"
                    >
                      {labCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Lab Partner</label>
                    <select 
                      value={formState.labId} 
                      onChange={(e) => setFormState({ ...formState, labId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal cursor-pointer"
                    >
                      {labs.map((lab) => (
                        <option key={lab.id} value={lab.id}>{lab.name} {lab.nablCertified ? '(NABL)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Original Price (₹) *</label>
                    <input 
                      type="number" 
                      required 
                      value={formState.price} 
                      onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Offer Price (₹)</label>
                    <input 
                      type="number" 
                      value={formState.discountPrice} 
                      onChange={(e) => setFormState({ ...formState, discountPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Parameters Count</label>
                    <input 
                      type="number" 
                      value={formState.parameters} 
                      onChange={(e) => setFormState({ ...formState, parameters: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reporting Timeframe</label>
                    <input 
                      type="text" 
                      value={formState.timeframe} 
                      onChange={(e) => setFormState({ ...formState, timeframe: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Fasting Instruction</label>
                  <input 
                    type="text" 
                    value={formState.fastingRequired} 
                    onChange={(e) => setFormState({ ...formState, fastingRequired: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal"
                  />
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Tests Included (Comma-separated)</label>
                  <textarea 
                    value={formState.testsIncluded} 
                    onChange={(e) => setFormState({ ...formState, testsIncluded: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-teal h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 6. VIEW DETAILS MODAL                                */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showViewModal && testToView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-20 relative overflow-y-auto max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-[8px] font-black bg-teal-light text-teal px-2 py-0.5 rounded-full uppercase tracking-wider">{testToView.category}</span>
                  <div className="text-sm font-black text-slate-800 uppercase tracking-wider mt-1">{testToView.name}</div>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xs font-semibold text-slate-650">
                
                {/* Lab Partner Profile */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Lab Partner</span>
                    <span className="font-extrabold text-slate-850">{testToView.labName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Accreditation</span>
                    <span className="font-extrabold">
                      {isNablCertified(testToView) ? (
                        <span className="text-emerald-600 font-black uppercase">NABL Certified</span>
                      ) : (
                        <span className="text-slate-450 font-bold uppercase">Standard Quality</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Technical Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-100 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-slate-400 font-bold uppercase text-[8px]">Parameters Covered</span>
                    <span className="text-slate-850 font-extrabold">{testToView.parameters || "12 Parameters Checked"}</span>
                  </div>
                  <div className="border border-slate-100 rounded-2xl p-3 flex flex-col gap-0.5">
                    <span className="text-slate-400 font-bold uppercase text-[8px]">Reporting Duration</span>
                    <span className="text-slate-850 font-extrabold">{testToView.timeframe || "Report in 12 Hrs"}</span>
                  </div>
                </div>

                {/* Fasting Requirement */}
                <div className="border border-slate-100 rounded-2xl p-3.5 flex flex-col gap-0.5 text-left">
                  <span className="text-slate-400 font-bold uppercase text-[8px]">Pre-test Fasting Instructions</span>
                  <span className="text-slate-850 font-extrabold">{testToView.fastingRequired || "No fasting required"}</span>
                </div>

                {/* Pricing Structure */}
                <div className="bg-teal-light/5 border border-teal-light/20 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Pricing Details</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-800 font-black text-sm">₹{testToView.discountPrice || testToView.price}</span>
                      {testToView.discountPercent > 0 && (
                        <span className="text-slate-400 line-through text-[10px]">₹{testToView.price}</span>
                      )}
                    </div>
                  </div>
                  {testToView.discountPercent > 0 && (
                    <span className="bg-teal text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      {testToView.discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Tests Included */}
                {testToView.testsIncluded && (
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">Clinical Parameters Included</span>
                    <div className="flex flex-wrap gap-1.5">
                      {testToView.testsIncluded.split(',').map((t, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-700 px-2 py-1 rounded-xl">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 7. GATED DELETE CONFIRMATION MODAL                   */}
      {/* ==================================================== */}
      <AnimatePresence>
        {showDeleteConfirmModal && testToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirmModal(false)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-sm w-full p-6 sm:p-8 z-20 text-center relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-xl" />
              </div>
              <div className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 text-center">
                Delete Test Package?
              </div>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mb-6 leading-relaxed text-center">
                Are you sure you want to permanently delete <strong className="text-slate-600">{testToDelete.name}</strong>?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
