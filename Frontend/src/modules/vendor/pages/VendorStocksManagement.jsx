import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adjustProductStock, addProduct } from '../store/vendorSlice';
import {
  FiLayers, FiPlus, FiAlertTriangle, FiTrash2, FiSearch, FiActivity, FiDollarSign
} from 'react-icons/fi';
import { mockInventory, getOutOfStockItems, getLowStockItems } from './pharmacyVendorMockData';

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

export default function VendorStocksManagement() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  // Use mockInventory as the source of products for Pharmacy Vendor
  const [localProducts, setLocalProducts] = useState(mockInventory);

  // States
  const [activeTab, setActiveTab] = useState(filterParam === 'low-stock' ? 'Low Stock Alerts' : 'Stock Management'); // 'Stock Management' | 'Low Stock Alerts' | 'Expiry Tracking' | 'Purchase Orders'
  const [searchQuery, setSearchQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all"); // 'all' | 'instock' | 'outofstock'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add product quick modal (linked to "+ ADD NEW PRODUCT" button)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Allopathy");

  // Adjust stock modal states (Screenshot 2 reference)
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('restock'); // 'restock' | 'remove'
  const [qtyChange, setQtyChange] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Helpers: Determine stock health label & styles
  const getStockHealth = (qty, reorderLevel = 10) => {
    if (qty <= 0) return { label: 'OUT OF STOCK', color: 'text-coral' };
    if (qty <= reorderLevel) return { label: 'LOW STOCK', color: 'text-gold-dark' };
    return { label: 'IN STOCK', color: 'text-teal font-extrabold' };
  };

  // KPI Calculations (Screenshot 1 reference)
  const kpis = useMemo(() => {
    let totalInventory = 0;
    let totalValuation = 0;

    localProducts.forEach(p => {
      totalInventory += p.stock;
      totalValuation += (p.stock * p.price);
    });

    const outOfStockCount = getOutOfStockItems(localProducts).length;
    const lowStockCount = getLowStockItems(localProducts).length;

    return {
      totalInventory,
      lowStockCount,
      outOfStockCount,
      totalValuation
    };
  }, [localProducts]);

  // Filter products based on search & health toggles
  const filteredProducts = useMemo(() => {
    return localProducts.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q));

      let matchesHealth = true;
      if (activeTab === 'Low Stock Alerts' || filterParam === 'low-stock') {
        matchesHealth = p.stock > 0 && p.stock <= p.reorderLevel;
      } else if (filterParam === 'out-of-stock') {
        matchesHealth = p.stock === 0;
      } else {
        matchesHealth =
          healthFilter === 'all' ||
          (healthFilter === 'instock' && p.stock > 0) ||
          (healthFilter === 'outofstock' && p.stock === 0);
      }

      return matchesSearch && matchesHealth;
    });
  }, [localProducts, searchQuery, healthFilter, filterParam, activeTab]);

  // Pagination Slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  // Handlers
  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setAdjustType('restock');
    setQtyChange("0");
    setInternalNote("");
    setShowAdjustModal(true);
  };

  const handleSaveAdjust = (e) => {
    e.preventDefault();
    const qty = Number(qtyChange);
    if (!selectedProduct || qty < 0) return;

    setLocalProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const change = qty;
        const newQty = adjustType === 'restock' ? p.stock + change : Math.max(0, p.stock - change);
        return { ...p, stock: newQty, status: newQty <= 0 ? 'Out of Stock' : (newQty < 20 ? 'Low Stock' : 'In Stock') };
      }
      return p;
    }));

    dispatch(adjustProductStock({
      id: selectedProduct.id,
      amount: qty,
      type: adjustType
    }));

    setShowAdjustModal(false);
  };

  const handleQuickAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;

    const newProductObj = {
      id: `MED-400${Date.now()}`,
      name: newProdName,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      status: Number(newProdStock) <= 0 ? 'Out of Stock' : (Number(newProdStock) < 20 ? 'Low Stock' : 'In Stock'),
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
    };

    setLocalProducts(prev => [newProductObj, ...prev]);

    dispatch(addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      packSize: 'Strip of 10 tablets',
      discPercent: 0,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
    }));

    // Reset states
    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    setNewProdCategory("Allopathy");
    setShowAddProductModal(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3.5 sm:gap-5 overflow-hidden font-sans">

      {/* KPI Stats Row (Screenshot 1 Reference) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">

        {/* KPI 1: Total Inventory */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4.5 shadow-premium flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3.5 rounded-2xl bg-teal-light/20 text-teal shrink-0">
            <FiLayers className="text-lg sm:text-xl shrink-0" />
          </div>
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider block">TOTAL INVENTORY</span>
            <span className="text-base sm:text-lg font-black text-slate-850 mt-0.5 sm:mt-1 block leading-none truncate">{kpis.totalInventory.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Low Stock Items */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4.5 shadow-premium flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3.5 rounded-2xl bg-gold-light/20 text-gold-dark shrink-0">
            <FiAlertTriangle className="text-lg sm:text-xl shrink-0 animate-pulse" />
          </div>
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider block">LOW STOCK ITEMS</span>
            <span className="text-base sm:text-lg font-black text-slate-850 mt-0.5 sm:mt-1 block leading-none truncate">{kpis.lowStockCount}</span>
          </div>
        </div>

        {/* KPI 3: Out of Stock */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4.5 shadow-premium flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3.5 rounded-2xl bg-coral-light/20 text-coral shrink-0">
            <FiTrash2 className="text-lg sm:text-xl shrink-0" />
          </div>
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider block">OUT OF STOCK</span>
            <span className="text-base sm:text-lg font-black text-slate-850 mt-0.5 sm:mt-1 block leading-none truncate">{kpis.outOfStockCount}</span>
          </div>
        </div>

        {/* KPI 4: Stock Valuation */}
        <div className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4.5 shadow-premium flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3.5 rounded-2xl bg-teal-light/20 text-teal shrink-0">
            <FiDollarSign className="text-lg sm:text-xl shrink-0" />
          </div>
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider block">STOCK VALUATION</span>
            <span className="text-base sm:text-lg font-black text-slate-850 mt-0.5 sm:mt-1 block leading-none truncate">₹{kpis.totalValuation.toLocaleString()}</span>
          </div>
        </div>

      </section>

      {/* Tabs Row */}
      <div className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-sm flex flex-wrap gap-1.5 overflow-x-auto shrink-0">
        {[
          { key: 'Stock Management', label: 'Stock Management' },
          { key: 'Low Stock Alerts', label: 'Low Stock Alerts' },
          { key: 'Expiry Tracking', label: 'Expiry Tracking' },
          { key: 'Purchase Orders', label: 'Purchase Orders' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border
              ${activeTab === tab.key 
                ? 'bg-teal border-teal text-white shadow-premium' 
                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters & Actions Bar (Screenshot 1 Reference) */}
      <section className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4.5 shadow-sm shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">

        <div className="flex flex-col sm:flex-row flex-1 gap-3">
          {/* Search field */}
          <div className="relative flex-1 max-w-md w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold outline-none focus:border-teal"
            />
          </div>

          {/* Health toggles pills */}
          <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-2xl self-start sm:self-center">
            {[
              { id: 'all', label: 'All' },
              { id: 'instock', label: 'In Stock' },
              { id: 'outofstock', label: 'Out of Stock' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => {
                  setHealthFilter(pill.id);
                  setCurrentPage(1);
                  setSearchParams({});
                }}
                className={`px-3 sm:px-4.5 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap
                  ${healthFilter === pill.id && !filterParam
                    ? 'bg-teal text-white shadow-premium'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add new product trigger */}
        <button
          onClick={() => setShowAddProductModal(true)}
          className="flex items-center justify-center gap-1 px-4 py-2 sm:py-3 bg-teal text-white text-[9px] sm:text-[10px] font-black tracking-widest uppercase rounded-2xl shadow-premium hover:bg-teal-dark transition-all cursor-pointer tap-scale shrink-0 w-full md:w-auto"
        >
          <FiPlus className="text-sm shrink-0" /> ADD NEW PRODUCT
        </button>

      </section>

      {/* Main Table view / Card Grid (Internally Scrollable Viewport) */}
      <div className="flex-1 min-h-0 bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden flex flex-col justify-between">

        {activeTab === 'Purchase Orders' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <FiLayers className="text-4xl mb-4 text-slate-200" />
            <h3 className="text-lg font-black text-slate-800 mb-2">Purchase Orders</h3>
            <p className="text-sm font-semibold max-w-md">Manage your purchase orders to suppliers here. This feature will be integrated soon.</p>
          </div>
        ) : activeTab === 'Expiry Tracking' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <FiLayers className="text-4xl mb-4 text-slate-200" />
            <h3 className="text-lg font-black text-slate-800 mb-2">Expiry Tracking</h3>
            <p className="text-sm font-semibold max-w-md">Track batches that are near expiry to avoid inventory loss.</p>
          </div>
        ) : (
          <>
        {/* Desktop Table View Layout */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar flex-1">

          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider sticky top-0 bg-white z-10">
                <th className="py-4.5 px-6 w-1/3">PRODUCT INFORMATION</th>
                <th className="py-4.5 px-4 text-center">INVENTORY CAPACITY</th>
                <th className="py-4.5 px-4 text-center">STOCK HEALTH</th>
                <th className="py-4.5 px-4 text-right">PRICE</th>
                <th className="py-4.5 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-650">
              <AnimatePresence>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-semibold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiLayers className="text-3xl text-slate-300" />
                        <span>No products found matching stock metrics.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((row) => {
                    const health = getStockHealth(row.stock, row.reorderLevel);
                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/20 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'}
                              alt={row.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50 select-none"
                            />
                            <div className="truncate max-w-xs">
                              <span className="font-extrabold text-slate-800 block text-xs truncate leading-snug">{row.name}</span>
                              <span className="text-[9px] text-slate-400 font-black block uppercase mt-0.5 tracking-wider font-mono truncate">
                                PRODUCT CODE: {row.sku || `SKU-${row.id}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-extrabold text-slate-800">
                          {row.stock} units
                        </td>
                        <td className="py-4 px-4 text-center text-[10px] font-black tracking-widest uppercase">
                          <span className={health.color}>{health.label}</span>
                        </td>
                        <td className="py-4 px-4 text-right font-black text-slate-800 text-xs">
                          ₹{row.price}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleOpenAdjust(row)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 hover:border-slate-350 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>

        </div>

        {/* Mobile Card Grid View Layout */}
        <div className="md:hidden overflow-y-auto custom-scrollbar flex-1 p-3.5 flex flex-col gap-3">
          <AnimatePresence>
            {paginatedProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold w-full">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FiLayers className="text-3xl text-slate-300" />
                  <span>No products found matching stock metrics.</span>
                </div>
              </div>
            ) : (
              paginatedProducts.map((row) => {
                const health = getStockHealth(row.stock, row.reorderLevel);
                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-slate-100 p-4 rounded-[24px] shadow-premium flex flex-col justify-between gap-3 hover-lift"
                  >
                    {/* Product Info Block */}
                    <div className="flex items-start gap-3">
                      <img
                        src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'}
                        alt={row.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 bg-slate-50 select-none"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-slate-800 block text-xs truncate leading-snug">{row.name}</span>
                        <span className="text-[9px] text-slate-400 font-black block uppercase mt-1 tracking-wider font-mono truncate">
                          CODE: {row.sku || `SKU-${row.id}`}
                        </span>
                      </div>
                    </div>

                    {/* Inventory Stats & Health */}
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-150/40 grid grid-cols-3 gap-1 text-center items-center text-[10px]">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">INVENTORY</span>
                        <span className="font-extrabold text-slate-800 leading-tight truncate text-[9px]">{row.stock} units</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-250/50 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">HEALTH</span>
                        <span className={`font-black uppercase tracking-wider text-[8.5px] truncate ${health.color}`}>{health.label}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l border-slate-250/50 pl-1 min-w-0">
                        <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">PRICE</span>
                        <span className="font-black text-slate-800 leading-tight truncate text-[9px]">₹{row.price}</span>
                      </div>
                    </div>

                    {/* Adjust Stock Button */}
                    <button
                      onClick={() => handleOpenAdjust(row)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-250 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
                    >
                      <FiActivity className="text-xs shrink-0" />
                      <span>Adjust Stock</span>
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Custom Pagination Footer */}
        <footer className="border-t border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Page {currentPage} of {totalPages} ({filteredProducts.length} items)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`px-2.5 py-1.5 border border-slate-250/50 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer
                ${currentPage === 1
                  ? 'bg-slate-50 text-slate-300 border-slate-100 pointer-events-none'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`px-2.5 py-1.5 border border-slate-250/50 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer
                ${currentPage === totalPages
                  ? 'bg-slate-50 text-slate-300 border-slate-100 pointer-events-none'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
            >
              Next
            </button>
          </div>
        </footer>
          </>
        )}
      </div>

      {/* Adjust Stock Inventory Modal (Screenshot 2 Reference) */}
      <AnimatePresence>
        {showAdjustModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdjustModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-sm w-full p-6 sm:p-7 z-10 relative overflow-hidden text-left flex flex-col gap-4.5"
            >

              {/* Header Titles */}
              <div>
                <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest leading-none flex items-center gap-1.5">
                  Adjust Inventory
                </h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 block">
                  UPDATE PRODUCT STOCK
                </span>
              </div>

              {/* Product Info Card Box */}
              <div className="bg-slate-50 border border-slate-150/50 rounded-2xl p-3.5 flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-snug">{selectedProduct.name}</h4>
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    CURRENT STOCK: {selectedProduct.stock} UNITS
                  </span>
                </div>
              </div>

              {/* Toggle Segmented Tabs Control */}
              <div className="grid grid-cols-2 p-1 bg-slate-150/40 rounded-2xl border border-slate-150/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setAdjustType('restock')}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center
                    ${adjustType === 'restock'
                      ? 'bg-white text-teal shadow-premium border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  RESTOCK
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('remove')}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center
                    ${adjustType === 'remove'
                      ? 'bg-white text-coral shadow-premium border border-slate-100'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  REMOVE
                </button>
              </div>

              {/* Quantity Changer input */}
              <form onSubmit={handleSaveAdjust} className="flex flex-col gap-4.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">QUANTITY CHANGE</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 font-black text-xs">#</span>
                    <input
                      type="number"
                      required
                      min="0"
                      max={adjustType === 'remove' ? selectedProduct.stock : 9999}
                      placeholder="0"
                      value={qtyChange}
                      onChange={(e) => setQtyChange(e.target.value)}
                      className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">INTERNAL NOTE (OPTIONAL)</label>
                  <textarea
                    rows="2"
                    placeholder="Reason for adjustment..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal resize-none"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="grid grid-cols-2 gap-3.5 mt-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="py-3 border border-slate-250/50 hover:bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-premium transition-colors cursor-pointer text-center"
                  >
                    SAVE CHANGES
                  </button>
                </div>

              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* 2. Quick Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProductModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col text-left"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                Quick Add Catalog Product
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3 mb-5 shrink-0">
                Instantly initialize a product catalog parameter inside MedPlus Wellness store.
              </p>

              <form onSubmit={handleQuickAddProduct} className="flex flex-col gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol 650mg Tablets"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 60"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Initial Stock</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase outline-none focus:border-teal cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 shrink-0 border-t border-slate-50 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-premium transition-colors cursor-pointer text-center"
                  >
                    ADD PRODUCT
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
