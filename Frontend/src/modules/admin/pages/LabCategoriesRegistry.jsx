import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiPlus, FiX, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { addLabCategory, addNewLabTest } from '../../user/store/productSlice';

export default function LabCategoriesRegistry() {
  const dispatch = useDispatch();
  const { labTests, labCategories } = useSelector(state => state.products);

  // States
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Add Lab Test Form Fields
  const [packageName, setPackageName] = useState("");
  const [testCategory, setTestCategory] = useState(labCategories[0] || "Blood Test");
  const [testPrice, setTestPrice] = useState("");
  const [testDiscPrice, setTestDiscPrice] = useState("");
  const [testParamsCount, setTestParamsCount] = useState("");
  const [testRequirements, setTestRequirements] = useState("");
  const [testDescription, setTestDescription] = useState("");

  // Validation
  const [formErrors, setFormErrors] = useState({});

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (labCategories.includes(newCategoryName.trim())) {
      setSuccessToast("Category already exists!");
      setTimeout(() => setSuccessToast(""), 3000);
      return;
    }
    dispatch(addLabCategory(newCategoryName.trim()));
    setSuccessToast(`Lab Category "${newCategoryName.trim()}" registered!`);
    setNewCategoryName("");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!packageName) errors.packageName = "Package name is required";
    if (!testPrice || isNaN(testPrice) || Number(testPrice) <= 0) errors.price = "Enter a valid MRP price";
    if (testDiscPrice && (isNaN(testDiscPrice) || Number(testDiscPrice) < 0)) errors.discPrice = "Enter a valid discount price";
    if (!testParamsCount || isNaN(testParamsCount)) errors.testsCount = "Enter valid parameters count";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const priceNum = Number(testPrice);
    const discPriceNum = testDiscPrice ? Number(testDiscPrice) : priceNum;
    const discountPercentVal = priceNum > 0 ? Math.round(((priceNum - discPriceNum) / priceNum) * 100) : 0;

    const payload = {
      name: packageName,
      category: testCategory,
      price: priceNum,
      discountPrice: discPriceNum,
      discountPercent: discountPercentVal > 0 ? discountPercentVal : 0,
      testsCount: Number(testParamsCount),
      description: testDescription || "Includes vital pathological markers monitoring.",
      requirements: testRequirements || "No special preparation required.",
    };

    dispatch(addNewLabTest(payload));
    
    // Clear Form
    setPackageName("");
    setTestPrice("");
    setTestDiscPrice("");
    setTestParamsCount("");
    setTestRequirements("");
    setTestDescription("");
    setFormErrors({});
    
    setShowAddModal(false);
    setSuccessToast(`"${packageName}" package registered successfully!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in relative font-sans">
      
      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-teal text-white py-3 px-5 rounded-2xl shadow-premium flex items-center gap-2 font-black text-xs uppercase tracking-wider"
          >
            <FiCheckCircle className="text-sm shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Diagnostic Categories Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Register and manage lab diagnostic groups, pathologies, and create custom checkup packages.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
          >
            <FiPlus className="text-sm" /> Add Lab Package
          </button>
        </div>
      </div>

      {/* Grid Categories */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left card: registered Lab Categories */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <FiGrid className="text-teal" /> Diagnostic Class Registry
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{labCategories.length} categories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {labCategories.map((cat, idx) => {
              const count = labTests.filter(t => t.category === cat).length;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-slate-100 hover:border-teal/30 p-4.5 rounded-2xl transition-all duration-350 flex flex-col gap-1 hover:shadow-premium-hover"
                >
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide truncate">{cat}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{count} Active {count === 1 ? 'package' : 'packages'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right card: Add New Category Tag */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">
            Create Test Class
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Register a new pathology group.
          </p>

          <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g. Thyroid, Vitamin, Lipids..." 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none transition-all"
            />
            <button 
              type="submit"
              className="py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1 tap-scale"
            >
              <FiPlus /> Add Category Tag
            </button>
          </form>
        </div>

      </section>

      {/* Add Lab Package Modal / Drawer */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            {/* Responsive Container */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-slate-100 shadow-premium max-w-2xl w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 shrink-0">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <FiActivity className="text-teal" /> Register Diagnostic Checkup Package
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                    Add custom health checks packages, parameter counts, and preparations.
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-xl transition-colors cursor-pointer"
                >
                  <FiX className="text-lg shrink-0" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-4 flex flex-col gap-4">
                
                {/* Package Name & Specialty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Package / Profile Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Diabetes Screening Core Panel"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.packageName ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.packageName && <span className="text-coral text-[9px] font-black">{formErrors.packageName}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Diagnostic Class *</label>
                    <select
                      value={testCategory}
                      onChange={(e) => setTestCategory(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    >
                      {labCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Parameters count & requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Parameters count (Number) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      value={testParamsCount}
                      onChange={(e) => setTestParamsCount(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.testsCount ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.testsCount && <span className="text-coral text-[9px] font-black">{formErrors.testsCount}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Preparation / Requirements</label>
                    <input
                      type="text"
                      placeholder="e.g. 10-12 Hours fasting required"
                      value={testRequirements}
                      onChange={(e) => setTestRequirements(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* MRP and Offer Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">MRP Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="MRP in ₹"
                      value={testPrice}
                      onChange={(e) => setTestPrice(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.price ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.price && <span className="text-coral text-[9px] font-black">{formErrors.price}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Offer Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Discount price in ₹"
                      value={testDiscPrice}
                      onChange={(e) => setTestDiscPrice(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.discPrice ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.discPrice && <span className="text-coral text-[9px] font-black">{formErrors.discPrice}</span>}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-455 tracking-wider">Diagnostic Profile Description</label>
                  <textarea
                    placeholder="Describe what biomarkers are measured, clinical purpose of the panel..."
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal h-18 resize-none"
                  />
                </div>

              </form>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer text-center"
                >
                  Register Package
                </button>
              </div>

            </motion.div>
            
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
