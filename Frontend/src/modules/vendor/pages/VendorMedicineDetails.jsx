import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiArrowLeft, FiInfo, FiLayers, FiAlertTriangle, FiUploadCloud, FiSave, FiPlus, FiTrash2, FiCamera, FiLock
} from 'react-icons/fi';

// Fallback Mock data for pre-filling the details form
const MOCK_CATALOG = {
  name: 'Augmentin 625 Duo Tablet',
  brand: 'GLAXOSMITHKLINE',
  saltComposition: ['Amoxicillin', 'Clavulanic Acid'],
  category: 'Allopathy',
  medicineType: 'Tablet',
  therapeuticCategory: 'Antibiotic',
  manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
  description: 'Augmentin 625 Duo Tablet is an antibiotic medicine that helps treat bacterial infections of the lungs, airways, middle ear, sinuses, skin, and urinary tract. It contains a combination of Amoxicillin and Clavulanic Acid.',
  uses: 'Bacterial infections of throat, lungs, urinary tract, and skin.',
  sideEffects: 'Nausea, vomiting, diarrhea, indigestion, skin rash.',
  warnings: 'Avoid in patients allergic to penicillin. Seek immediate attention if liver symptoms appear.',
  prescriptionRequired: true,
  scheduleType: 'Schedule H',
  
  variants: [
    { strength: '625 mg', form: 'Tablet', packSize: '10 tablets', mrp: '204', sellingPrice: '164', discount: '20', stock: '45', sku: 'AUG-625-T10', batchNumber: 'BAT-GSK-09A', expiryDate: '2027-04-30' },
    { strength: '1000 mg', form: 'Tablet', packSize: '15 tablets', mrp: '350', sellingPrice: '300', discount: '14', stock: '20', sku: 'AUG-1000-T15', batchNumber: 'BAT-GSK-11B', expiryDate: '2028-02-15' }
  ],
  
  lowStockThreshold: 15,
  batchTracking: true,
  expiryAlert: true,
  autoDisableExpired: true,
  
  images: [
    { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', type: 'main', label: 'Main Product Image', description: 'Mandatory main thumbnail image for product catalog search.' },
    { url: '', type: 'strip', label: 'Strip / Bottle Image', description: 'Detailed view of the tablet strip, syrup bottle, or tube.' },
    { url: '', type: 'box', label: 'Box / Back Label Image', description: 'Packaging label showing drug warnings, manufacturing dates, and ingredients.' }
  ]
};

export default function VendorMedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Tabs: 'basic' | 'variants' | 'inventory' | 'media'
  const initialTab = searchParams.get('tab') || 'basic';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [formData, setFormData] = useState(MOCK_CATALOG);
  const [saltInput, setSaltInput] = useState('');
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // Sync activeTab when url param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle Basic Inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Salt composition chips
  const handleAddSalt = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!saltInput.trim()) return;
      setFormData(prev => ({
        ...prev,
        saltComposition: [...prev.saltComposition, saltInput.trim()]
      }));
      setSaltInput('');
    }
  };

  const handleRemoveSalt = (index) => {
    setFormData(prev => ({
      ...prev,
      saltComposition: prev.saltComposition.filter((_, i) => i !== index)
    }));
  };

  // Variants management
  const handleAddVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { strength: '', form: 'Tablet', packSize: '', mrp: '', sellingPrice: '', discount: '0', stock: '', sku: '', batchNumber: '', expiryDate: '' }]
    }));
  };

  const handleRemoveVariantRow = (index) => {
    if (formData.variants.length === 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updated = prev.variants.map((v, i) => {
        if (i === index) {
          const uVar = { ...v, [field]: value };
          if (field === 'mrp' || field === 'sellingPrice') {
            const mrpVal = Number(uVar.mrp || 0);
            const sellVal = Number(uVar.sellingPrice || 0);
            if (mrpVal > 0) {
              uVar.discount = Math.round(((mrpVal - sellVal) / mrpVal) * 100).toString();
            }
          }
          return uVar;
        }
        return v;
      });
      return { ...prev, variants: updated };
    });
  };

  // Media Management
  const handleMediaUpload = (slotIndex, file) => {
    if (!file) return;
    
    // Validations: JPG, PNG, WEBP, Max 5MB
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert("Format error. Only JPG, PNG, and WEBP files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setFormData(prev => {
      const updated = [...prev.images];
      updated[slotIndex] = { ...updated[slotIndex], url: fileUrl };
      return { ...prev, images: updated };
    });
  };

  const handleRemoveMedia = (slotIndex) => {
    setFormData(prev => {
      const updated = [...prev.images];
      updated[slotIndex] = { ...updated[slotIndex], url: '' };
      return { ...prev, images: updated };
    });
  };

  // Save changes
  const handleSaveChanges = () => {
    // Basic verification
    if (!formData.name.trim() || !formData.brand.trim()) {
      alert("Medicine Name and Brand Name are required.");
      return;
    }
    if (!formData.images[0].url) {
      alert("Main product image is mandatory.");
      setActiveTab('media');
      return;
    }
    alert("Medicine details saved successfully to ERP database!");
    navigate('/vendor/pharmacy/medicines');
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-4 sm:p-6 flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* Back Button and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/vendor/pharmacy/medicines')}
            className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <FiArrowLeft className="w-4 h-4 text-slate-650" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Manage Medicine</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{formData.name}</p>
          </div>
        </div>
        <button 
          onClick={handleSaveChanges}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-premium w-full sm:w-auto"
        >
          <FiSave className="text-base" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs list */}
      <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm flex flex-wrap gap-1">
        {[
          { key: 'basic', label: 'Basic Information', icon: FiInfo },
          { key: 'variants', label: 'Variant Management', icon: FiLayers },
          { key: 'inventory', label: 'Inventory Controls', icon: FiAlertTriangle },
          { key: 'media', label: 'Media Vault', icon: FiUploadCloud }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border-0
                ${activeTab === tab.key 
                  ? 'bg-teal-50 text-[#135A5A]' 
                  : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Card */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-5 sm:p-6 shadow-sm min-h-[400px]">
        
        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-black text-[#135A5A] uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiInfo /> Basic Medicine Attributes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Brand Name *</label>
                <input 
                  type="text" 
                  value={formData.brand} 
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
            </div>

            {/* Salt composition chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Salt Composition</label>
              <div className="flex flex-wrap gap-1.5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl min-h-[44px]">
                {formData.saltComposition.map((salt, index) => (
                  <span key={index} className="bg-teal-50 text-[#135A5A] border border-teal-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <span>{salt}</span>
                    <button type="button" onClick={() => handleRemoveSalt(index)} className="text-xs hover:text-rose-500 border-0 bg-transparent cursor-pointer">✕</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={saltInput} 
                  onChange={(e) => setSaltInput(e.target.value)}
                  onKeyDown={handleAddSalt}
                  placeholder="Type salt and press Enter..." 
                  className="bg-transparent border-none outline-none text-xs font-semibold placeholder:text-slate-400 flex-1 min-w-[200px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>Allopathy</option>
                  <option>Ayurveda</option>
                  <option>Homeopathy</option>
                  <option>OTC Wellness</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dosage Form</label>
                <select 
                  value={formData.medicineType}
                  onChange={(e) => handleInputChange('medicineType', e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Cream</option>
                  <option>Drops</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Drug Schedule</label>
                <select 
                  value={formData.scheduleType}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>OTC</option>
                  <option>Schedule H</option>
                  <option>Schedule H1</option>
                  <option>Schedule X</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Manufacturer</label>
                <input 
                  type="text" 
                  value={formData.manufacturer} 
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 border border-slate-100 rounded-xl self-end h-[46px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-extrabold text-slate-805">Prescription Required</span>
                  <span className="text-[8.5px] text-slate-400 font-bold uppercase">Customer must upload doctor Rx</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.prescriptionRequired} 
                  onChange={(e) => handleInputChange('prescriptionRequired', e.target.checked)}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Description</label>
              <textarea 
                rows="3" 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Uses & Indications</label>
                <textarea 
                  rows="2" 
                  value={formData.uses}
                  onChange={(e) => handleInputChange('uses', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Side Effects</label>
                <textarea 
                  rows="2" 
                  value={formData.sideEffects}
                  onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Warnings</label>
                <textarea 
                  rows="2" 
                  value={formData.warnings}
                  onChange={(e) => handleInputChange('warnings', e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VARIANT MANAGEMENT */}
        {activeTab === 'variants' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2 flex-wrap gap-2">
              <h3 className="text-xs font-black text-[#135A5A] uppercase tracking-widest flex items-center gap-1.5">
                <FiLayers /> Medicine Variant Catalog Table
              </h3>
              <button 
                type="button" 
                onClick={handleAddVariantRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <FiPlus /> + Add Variant
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-450">
                    <th className="p-3">Strength</th>
                    <th className="p-3">Form</th>
                    <th className="p-3">Pack Size</th>
                    <th className="p-3">MRP (₹)</th>
                    <th className="p-3">Selling (₹)</th>
                    <th className="p-3">Disc %</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Batch No</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Stock Qty</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {formData.variants.map((v, index) => (
                    <tr key={index} className="hover:bg-slate-50/20">
                      <td className="p-2">
                        <select value={v.strength} onChange={(e) => handleVariantChange(index, 'strength', e.target.value)} className="w-24 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-800">
                          <option>625 mg</option>
                          <option>1000 mg</option>
                          <option>650mg</option>
                          <option>500mg</option>
                          <option>250mg</option>
                          <option>100mg</option>
                          <option>50mg</option>
                          <option>40mg</option>
                          <option>20mg</option>
                          <option>10mg</option>
                          <option>5mg</option>
                          <option>15ml</option>
                          <option>60ml</option>
                          <option>100ml</option>
                          <option>200ml</option>
                          <option>15g</option>
                          <option>20g</option>
                          <option>30g</option>
                          <option>50g</option>
                          <option>100g</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select value={v.form} onChange={(e) => handleVariantChange(index, 'form', e.target.value)} className="w-20 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-700">
                          <option>Tablet</option>
                          <option>Capsule</option>
                          <option>Syrup</option>
                          <option>Cream</option>
                          <option>Drops</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select value={v.packSize} onChange={(e) => handleVariantChange(index, 'packSize', e.target.value)} className="w-28 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-700">
                          <option>10 tablets</option>
                          <option>15 tablets</option>
                          <option>Strip of 10</option>
                          <option>Strip of 15</option>
                          <option>Strip of 30</option>
                          <option>Bottle of 30</option>
                          <option>Bottle of 60</option>
                          <option>Bottle of 100</option>
                          <option>Bottle of 60ml</option>
                          <option>Bottle of 100ml</option>
                          <option>Bottle of 200ml</option>
                          <option>Tube of 10g</option>
                          <option>Tube of 15g</option>
                          <option>Tube of 20g</option>
                          <option>Tube of 30g</option>
                          <option>Tube of 50g</option>
                          <option>Box of 1</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="204" value={v.mrp} onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)} className="w-14 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-800" />
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="164" value={v.sellingPrice} onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)} className="w-14 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-[#135A5A]" />
                      </td>
                      <td className="p-2">
                        <span className="w-12 px-1.5 py-1 bg-slate-100 rounded-md font-black text-center text-[10px] block">{v.discount}%</span>
                      </td>
                      <td className="p-2">
                        <input type="text" placeholder="SKU-CODE" value={v.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-24 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-mono font-semibold" />
                      </td>
                      <td className="p-2">
                        <input type="text" placeholder="BAT-NO" value={v.batchNumber} onChange={(e) => handleVariantChange(index, 'batchNumber', e.target.value)} className="w-24 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-mono font-semibold" />
                      </td>
                      <td className="p-2">
                        <input type="date" value={v.expiryDate} onChange={(e) => handleVariantChange(index, 'expiryDate', e.target.value)} className="w-28 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[11px]" />
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="45" value={v.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} className="w-14 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md font-bold text-slate-800" />
                      </td>
                      <td className="p-2 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveVariantRow(index)}
                          className="text-slate-400 hover:text-rose-500 border-0 bg-transparent cursor-pointer p-1"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY CONTROLS */}
        {activeTab === 'inventory' && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-black text-[#135A5A] uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiAlertTriangle /> Advanced Inventory Management Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Global Stock Quantity (Derived Sum)</label>
                <div className="px-3.5 py-2.5 bg-slate-150 border border-slate-200 rounded-xl text-xs font-black text-slate-805 flex items-center gap-2">
                  <FiLock className="text-slate-400" />
                  <span>{formData.variants.reduce((acc, curr) => acc + Number(curr.stock || 0), 0)} units</span>
                </div>
                <span className="text-[8.5px] text-slate-400 font-bold uppercase mt-0.5">Sum of all active variant pack inventory levels.</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Low Stock Alert Threshold *</label>
                <input 
                  type="number" 
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', Number(e.target.value))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
                <span className="text-[8.5px] text-slate-400 font-bold uppercase mt-0.5">Triggers warning status badge when stock falls below limit.</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {/* Batch tracking */}
              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-805 block">Batch Audits & Tracking Logs</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Enables tracking of manufacturing batch codes and custom warehouse slots.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.batchTracking} 
                  onChange={(e) => handleInputChange('batchTracking', e.target.checked)}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>

              {/* Expiry alerts */}
              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-805 block">Expiry Alert Warnings</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Notify pharmacist dashboard 90 days before batch expiry dates.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.expiryAlert} 
                  onChange={(e) => handleInputChange('expiryAlert', e.target.checked)}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>

              {/* Auto Disable expired */}
              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-805 block">Auto Disable Expired Medicine</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Immediately deactivate and hide from customer listing if current date hits expiry.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.autoDisableExpired} 
                  onChange={(e) => handleInputChange('autoDisableExpired', e.target.checked)}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEDIA MANAGER */}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-[#135A5A] uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiUploadCloud /> Medicine Images Vault
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.images.map((slot, index) => {
                const hasImage = !!slot.url;
                const isDragOver = dragOverSlot === index;

                return (
                  <div 
                    key={slot.type}
                    className={`bg-white border-2 rounded-[24px] p-4 flex flex-col justify-between transition-all duration-300 relative min-h-[260px]
                      ${isDragOver 
                        ? 'border-[#135A5A] bg-[#135A5A]/5 scale-[1.02]' 
                        : hasImage 
                          ? 'border-slate-100 shadow-sm' 
                          : 'border-dashed border-slate-200 hover:border-[#135A5A]/40'}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSlot(index);
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      const file = e.dataTransfer.files[0];
                      if (file) handleMediaUpload(index, file);
                    }}
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        {slot.type === 'main' ? 'Image 1 (Main Product)' : slot.type === 'strip' ? 'Image 2 (Strip/Bottle)' : 'Image 3 (Box/Label)'}
                      </span>
                      <h4 className="text-[11px] font-extrabold text-slate-850 mt-1">{slot.label}</h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold leading-tight mt-0.5 mb-4">{slot.description}</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      {hasImage ? (
                        <div className="flex flex-col gap-3">
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative group">
                            <img src={slot.url} alt={slot.label} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="p-2 bg-white/95 text-[#135A5A] rounded-xl hover:bg-white transition-all cursor-pointer shadow-md text-xs font-bold flex items-center gap-1">
                                <input 
                                  type="file" 
                                  accept=".png,.jpg,.jpeg,.webp"
                                  className="hidden" 
                                  onChange={(e) => handleMediaUpload(index, e.target.files[0])}
                                />
                                <FiCamera className="w-3.5 h-3.5" /> Replace
                              </label>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveMedia(index)}
                                className="p-2 bg-white/95 text-rose-600 rounded-xl hover:bg-white transition-all cursor-pointer shadow-md text-xs font-bold border-0 flex items-center gap-1"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-205 hover:border-[#135A5A]/50 transition-colors rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50/80">
                          <input 
                            type="file" 
                            accept=".png,.jpg,.jpeg,.webp"
                            className="hidden" 
                            onChange={(e) => handleMediaUpload(index, e.target.files[0])}
                          />
                          <FiCamera className="text-3xl text-slate-350" />
                          <span className="text-[10px] font-black text-slate-805 uppercase tracking-wider">+ Drag or Upload</span>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Save Action Bar at bottom */}
      <div className="bg-white border border-slate-100 p-4.5 rounded-3xl shadow-sm flex justify-between items-center">
        <button 
          onClick={() => navigate('/vendor/pharmacy/medicines')}
          className="px-5 py-3 rounded-xl border border-slate-200 text-slate-650 hover:bg-slate-50 transition-colors text-xs font-black uppercase tracking-wider cursor-pointer"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveChanges}
          className="px-8 py-3.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-premium cursor-pointer"
        >
          Save Medicine Details
        </button>
      </div>

    </div>
  );
}
