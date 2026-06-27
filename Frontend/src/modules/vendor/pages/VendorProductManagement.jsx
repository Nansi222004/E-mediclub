import { useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addProduct, editProduct, deleteProduct } from '../store/vendorSlice';
import { 
  FiPackage, FiPlus, FiTrash2, FiEdit2, FiLayout, 
  FiSearch, FiUpload, FiX, FiTag, FiCalendar, FiDollarSign 
} from 'react-icons/fi';

const CATEGORIES = [
  'Allopathy',
  'Ayurveda',
  'Homeopathy',
  'Wellness',
  'OTC',
  'Surgical',
  'Devices',
  'Supplements'
];

export default function VendorProductManagement() {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.vendor);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockStatus, setStockStatus] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);

  // Modal active states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Allopathy");
  const [sku, setSku] = useState("");
  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState(""); // Selling Price
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]); // Array of base64 or object URLs
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Helper: Determine stock badge color & label
  const getStockDetails = (qty) => {
    if (qty <= 0) return { label: 'Out of Stock', bg: 'bg-coral-light/20 text-coral border-coral/10', color: 'text-coral' };
    if (qty < 20) return { label: 'Low Stock', bg: 'bg-gold-light/20 text-gold-dark border-gold/10', color: 'text-gold-dark' };
    return { label: 'In Stock', bg: 'bg-teal-light/20 text-teal border-teal/10', color: 'text-teal' };
  };

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // 1. Search Query filter (matches name, SKU, or manufacturer)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        prod.name.toLowerCase().includes(query) || 
        (prod.sku && prod.sku.toLowerCase().includes(query)) ||
        (prod.manufacturer && prod.manufacturer.toLowerCase().includes(query));

      // 2. Category filter
      const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;

      // 3. Stock Status filter
      const stockDetails = getStockDetails(prod.stock);
      const matchesStock = stockStatus === "All" || stockDetails.label.toLowerCase() === stockStatus.toLowerCase();

      // 4. Price range filter
      const matchesPrice = prod.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesStock && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, stockStatus, maxPrice]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory("Allopathy");
    setSku(`SKU-${Math.floor(10000 + Math.random() * 90000)}`);
    setMrp("");
    setPrice("");
    setStock("");
    setExpiryDate("");
    setManufacturer("");
    setDescription("");
    setUploadedImages([]);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category || "Allopathy");
    setSku(prod.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`);
    setMrp(prod.mrp || prod.price || "");
    setPrice(prod.price || "");
    setStock(prod.stock || "");
    setExpiryDate(prod.expiryDate || "");
    setManufacturer(prod.manufacturer || "");
    setDescription(prod.description || "");
    setUploadedImages(prod.images || (prod.image ? [prod.image] : []));
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    // Calculate dynamic discount % if MRP and Price exist
    const mrpNum = Number(mrp) || Number(price);
    const priceNum = Number(price);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const payload = {
      name,
      category,
      sku,
      mrp: mrpNum,
      price: priceNum,
      stock: Number(stock),
      discPercent: discount,
      expiryDate: expiryDate || '2028-12-31',
      manufacturer: manufacturer || 'Generic Pharmaceutics',
      description: description || 'No therapeutic description provided.',
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'],
      image: uploadedImages[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      packSize: editingProduct?.packSize || 'Strip of 10 tablets'
    };

    if (editingProduct) {
      dispatch(editProduct({ id: editingProduct.id, ...payload }));
    } else {
      dispatch(addProduct(payload));
    }

    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-5 overflow-hidden">
      
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Medicine Catalog</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review custom formulations, medical products pricing, and catalog items.
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-teal text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-premium hover:bg-teal-dark transition-all cursor-pointer tap-scale"
        >
          <FiPlus className="text-sm shrink-0" /> Publish Medicine
        </button>
      </div>

      {/* Filter and Analytics Deck */}
      <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shrink-0 flex flex-col gap-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search by name, SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
            />
          </div>

          {/* Category drop */}
          <div className="relative">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wider outline-none focus:border-teal cursor-pointer appearance-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Stock level drop */}
          <div>
            <select 
              value={stockStatus} 
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wider outline-none focus:border-teal cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Price uploader range */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase mb-1">
              <span>Price Limit:</span>
              <span className="text-teal font-extrabold">₹{maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal h-1.5 bg-slate-150 rounded-lg cursor-pointer"
            />
          </div>
        </div>

      </section>

      {/* Main Table view / Card Grid (Internally Scrollable Viewport) */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Desktop Table View */}
        <div className="flex-1 overflow-x-auto custom-scrollbar hidden md:block">
          
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Medicine / Product Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">SKU / Code</th>
                <th className="py-4 px-6 text-right">Price (MRP)</th>
                <th className="py-4 px-6 text-center">Fulfillment Status</th>
                <th className="py-4 px-6 text-center">Expiry</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-600">
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-450 font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiPackage className="text-3xl text-slate-300" />
                        <span>No medical products match your selected filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((row) => {
                    const stockDetails = getStockDetails(row.stock);
                    return (
                      <motion.tr 
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'} 
                              alt={row.name} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0 select-none bg-slate-50"
                            />
                            <div className="truncate max-w-xs sm:max-w-sm">
                              <span className="font-extrabold text-slate-800 block text-xs truncate leading-snug">{row.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5 tracking-wider truncate">
                                {row.manufacturer || 'Generic Corp'} • {row.packSize || '10 units'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200/50">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-[10px] text-slate-550">{row.sku || 'N/A'}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col justify-end items-end">
                            <span className="font-black text-slate-800 text-xs">₹{row.price}</span>
                            {row.mrp && row.mrp > row.price && (
                              <span className="text-[9px] text-slate-400 line-through font-semibold">₹{row.mrp}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border ${stockDetails.bg}`}>
                              {stockDetails.label}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              {row.stock} units
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-500 text-[10px]">
                          {row.expiryDate || '12/2028'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleOpenEditModal(row)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer tap-scale"
                              title="Edit product parameters"
                            >
                              <FiEdit2 className="text-xs shrink-0" />
                            </button>
                            <button 
                              onClick={() => handleDelete(row.id)}
                              className="p-2 bg-coral-light/20 hover:bg-coral-light/55 text-coral rounded-xl transition-all cursor-pointer tap-scale"
                              title="Delete medicine"
                            >
                              <FiTrash2 className="text-xs shrink-0" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>

        </div>

        {/* Mobile Card Grid View */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 md:hidden custom-scrollbar bg-slate-50/50">
          <AnimatePresence>
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold flex flex-col items-center justify-center gap-2">
                <FiPackage className="text-3xl text-slate-350" />
                <span>No products found.</span>
              </div>
            ) : (
              filteredProducts.map((row) => {
                const stockDetails = getStockDetails(row.stock);
                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="bg-white border border-slate-100 p-4.5 rounded-[24px] shadow-premium flex flex-col gap-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'} 
                        alt={row.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shrink-0 select-none bg-slate-50"
                      />
                      <div className="truncate flex-1">
                        <span className="font-extrabold text-slate-800 block text-xs truncate leading-snug">{row.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5 tracking-wider truncate">
                          {row.manufacturer || 'Generic Corp'} • {row.packSize || '10 units'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150/40 grid grid-cols-3 gap-1 text-center items-center text-[10px]">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Price</span>
                        <span className="font-black text-slate-800 leading-tight truncate text-[9.5px]">₹{row.price}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Stock</span>
                        <span className={`font-black leading-tight truncate text-[9.5px] ${stockDetails.color}`}>{row.stock} u</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Expiry</span>
                        <span className="font-black text-slate-600 leading-tight truncate text-[9.5px]">{row.expiryDate || '12/2028'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 mt-0.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200/50">
                        {row.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer tap-scale"
                          title="Edit product parameters"
                        >
                          <FiEdit2 className="text-2xs" />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="flex items-center gap-1 py-1.5 px-3 bg-coral-light/20 hover:bg-coral-light/30 text-coral rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer tap-scale"
                          title="Delete medicine"
                        >
                          <FiTrash2 className="text-2xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Add / Edit Form Modal (High Fidelity) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-2xl w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <FiLayout className="text-teal text-lg shrink-0" /> 
                {editingProduct ? 'Edit Catalog Product Details' : 'Publish New Medicine'}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3 mb-5 shrink-0">
                Populate verified therapeutic values, inventory counts, and license coordinates.
              </p>

              {/* Form panel scroll container */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar">
                
                {/* 1. Brand name & therapy class */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5">
                      <FiTag /> Medicine Brand Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Crocin Advance 650mg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                      Therapy Classification *
                    </label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wider outline-none focus:border-teal cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* 2. SKU and Manufacturer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                      Stock Keeping Unit (SKU)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. SKU-12345"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal font-mono uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                      Manufacturer / Lab
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cipla Ltd / Sun Pharma"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* 3. Pricing Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5">
                      <FiDollarSign /> Maximum Retail Price (₹)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 150"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5">
                      <FiDollarSign /> Selling Price (₹) *
                    </label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 120"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                      Initial Units Stock *
                    </label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 250"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* 4. Expiry and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-0.5">
                      <FiCalendar /> Expiry Date (YYYY-MM-DD)
                    </label>
                    <input 
                      type="date" 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                      Product Excerpts / Description
                    </label>
                    <input 
                      type="text" 
                      placeholder="Therapeutic benefits, dose guidelines..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* 5. Drag & Drop Multi-Image Uploader */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">
                    Upload Product Images
                  </label>
                  
                  {/* Drop zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 select-none
                      ${dragActive 
                        ? 'border-teal bg-teal-light/20 text-teal' 
                        : 'border-slate-200 hover:border-teal hover:bg-slate-50/50 text-slate-450'
                      }`}
                  >
                    <FiUpload className="text-2xl text-teal shrink-0 animate-pulse" />
                    <span className="text-[11px] font-bold">
                      Drag & Drop files here, or <span className="text-teal underline font-black">browse files</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Supports JPG, PNG, WEBP (Max 3 files)</span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Image previews list */}
                  <AnimatePresence>
                    {uploadedImages.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-3 mt-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl"
                      >
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white text-[10px] hover:bg-black transition-all cursor-pointer shadow-premium"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 6. Form actions */}
                <div className="grid grid-cols-2 gap-4 mt-5 border-t border-slate-50 pt-5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-premium transition-all cursor-pointer tap-scale"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
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
