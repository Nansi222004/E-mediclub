import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiPlus, FiX, FiCheckCircle, FiInfo, FiUploadCloud } from 'react-icons/fi';
import { addMedicineCategory, addNewMedicine } from '../../user/store/productSlice';

export default function ProductManagement({ autoOpenAdd = false }) {
  const dispatch = useDispatch();
  const { medicines, medicineCategories } = useSelector(state => state.products);

  // States
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddModal, setShowAddModal] = useState(autoOpenAdd);
  const [successToast, setSuccessToast] = useState("");

  // Add Medicine Form Fields
  const [medName, setMedName] = useState("");
  const [medCategory, setMedCategory] = useState(medicineCategories[0] || "Allopathy");
  const [medBrand, setMedBrand] = useState("");
  const [medPrice, setMedPrice] = useState("");
  const [medDiscPrice, setMedDiscPrice] = useState("");
  const [medPackSize, setMedPackSize] = useState("");
  const [medComposition, setMedComposition] = useState("");
  const [medBenefits, setMedBenefits] = useState("");
  const [medWarnings, setMedWarnings] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medImage, setMedImage] = useState("");

  // Validation
  const [formErrors, setFormErrors] = useState({});

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (medicineCategories.includes(newCategoryName.trim())) {
      setSuccessToast("Category already exists!");
      setTimeout(() => setSuccessToast(""), 3000);
      return;
    }
    dispatch(addMedicineCategory(newCategoryName.trim()));
    setSuccessToast(`Category "${newCategoryName.trim()}" added!`);
    setNewCategoryName("");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!medName) errors.name = "Medicine name is required";
    if (!medBrand) errors.brand = "Manufacturer brand is required";
    if (!medPrice || isNaN(medPrice) || Number(medPrice) <= 0) errors.price = "Enter valid MRP price";
    if (medDiscPrice && (isNaN(medDiscPrice) || Number(medDiscPrice) < 0)) errors.discPrice = "Enter valid discount price";
    if (!medPackSize) errors.packSize = "Pack size is required (e.g. Strip of 10 tablets)";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const priceNum = Number(medPrice);
    const discPriceNum = medDiscPrice ? Number(medDiscPrice) : priceNum;
    const discountPercentVal = priceNum > 0 ? Math.round(((priceNum - discPriceNum) / priceNum) * 100) : 0;

    const payload = {
      name: medName,
      category: medCategory,
      brand: medBrand,
      price: priceNum,
      discountPrice: discPriceNum,
      discountPercent: discountPercentVal > 0 ? discountPercentVal : 0,
      packSize: medPackSize,
      composition: medComposition || "Generic Formulation",
      benefits: medBenefits || "Provides rapid clinical symptoms relief.",
      warnings: medWarnings || "Keep in cool dry storage. Keep out of reach of children.",
      dosage: medDosage || "Take as instructed by clinical supervisor.",
      image: medImage || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80"
    };

    dispatch(addNewMedicine(payload));
    
    // Clear Form
    setMedName("");
    setMedBrand("");
    setMedPrice("");
    setMedDiscPrice("");
    setMedPackSize("");
    setMedComposition("");
    setMedBenefits("");
    setMedWarnings("");
    setMedDosage("");
    setMedImage("");
    setFormErrors({});
    
    setShowAddModal(false);
    setSuccessToast(`"${medName}" added successfully to Listings!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in relative">
      
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
          <div className="admin-medicines-page-title">Medicines Registry</div>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Register and manage pharmacological categories, classifications, and add new formulations.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
          >
            <FiPlus className="text-sm" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Main Grid Category View */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Categories List Card */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
            <div className="admin-section-heading-wrapper mb-0">
              <FiGrid />
              <span>Category Registry Directory</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{medicineCategories.length} Categories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {medicineCategories.map((cat, idx) => {
              const count = medicines.filter(m => m.category === cat).length;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-slate-100 hover:border-teal/30 p-4.5 rounded-2xl transition-all duration-350 flex flex-col gap-1 hover:shadow-premium-hover admin-card"
                >
                  <span className="admin-category-card-title truncate">{cat}</span>
                  <span className="admin-category-card-count">{count} active {count === 1 ? 'product' : 'products'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Add New Category Form */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium">
          <div className="admin-panel-title mb-3">
            Create Therapy Class
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Add a new therapeutic category tag.
          </p>

          <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="e.g. Homeopathy, Surgical..." 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none transition-all"
            />
            <button 
              type="submit"
              className="admin-btn-dark py-3 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1 tap-scale"
            >
              <FiPlus /> Add Category Tag
            </button>
          </form>
        </div>

      </section>

      {/* Responsive Centered Modal on Desktop & Slide-up Bottom-Sheet on Mobile */}
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
                  <div className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <FiPlus className="text-teal" /> Register New Medicine Formulation
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                    Add catalog entry with dosage, compositions, and pricing.
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
                
                {/* Product Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Medicine Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol 500mg"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.name ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.name && <span className="text-coral text-[9px] font-black">{formErrors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Manufacturer / Brand *</label>
                    <input
                      type="text"
                      placeholder="e.g. GlaxoSmithKline"
                      value={medBrand}
                      onChange={(e) => setMedBrand(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.brand ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.brand && <span className="text-coral text-[9px] font-black">{formErrors.brand}</span>}
                  </div>
                </div>

                {/* Category & Pack Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Therapeutic Class *</label>
                    <select
                      value={medCategory}
                      onChange={(e) => setMedCategory(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    >
                      {medicineCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Pack Size *</label>
                    <input
                      type="text"
                      placeholder="e.g. Strip of 15 tablets"
                      value={medPackSize}
                      onChange={(e) => setMedPackSize(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.packSize ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.packSize && <span className="text-coral text-[9px] font-black">{formErrors.packSize}</span>}
                  </div>
                </div>

                {/* Price, Discount Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">MRP Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="MRP in ₹"
                      value={medPrice}
                      onChange={(e) => setMedPrice(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.price ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.price && <span className="text-coral text-[9px] font-black">{formErrors.price}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Offer / Discount Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Discount price in ₹"
                      value={medDiscPrice}
                      onChange={(e) => setMedDiscPrice(e.target.value)}
                      className={`px-3 py-2 bg-slate-50 border ${formErrors.discPrice ? 'border-coral' : 'border-slate-200'} rounded-xl text-xs font-semibold outline-none focus:border-teal`}
                    />
                    {formErrors.discPrice && <span className="text-coral text-[9px] font-black">{formErrors.discPrice}</span>}
                  </div>
                </div>

                {/* Composition */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Active Chemical Composition</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 500mg, Phenylephrine 5mg"
                    value={medComposition}
                    onChange={(e) => setMedComposition(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                {/* Benefits */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Therapeutic Benefits</label>
                  <textarea
                    placeholder="Describe how the formulation relieves pain or cures conditions..."
                    value={medBenefits}
                    onChange={(e) => setMedBenefits(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal h-14 resize-none"
                  />
                </div>

                {/* Warnings & Dosage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Dosage Directions</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 capsule daily after meal"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Clinical Warnings</label>
                    <input
                      type="text"
                      placeholder="e.g. Avoid high dosage, keep dry"
                      value={medWarnings}
                      onChange={(e) => setMedWarnings(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* Custom Image URL */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Formulation Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/med-image.jpg"
                    value={medImage}
                    onChange={(e) => setMedImage(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal"
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
                  Complete Registration
                </button>
              </div>

            </motion.div>
            
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
