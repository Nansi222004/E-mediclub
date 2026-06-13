import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { addCoupon, deleteCoupon, addHeroBanner, toggleBannerStatus } from '../store/adminSlice';
import { FiLayers, FiPlus, FiTrash2, FiFileText, FiTag, FiLayout } from 'react-icons/fi';

export default function CMSManagement() {
  const dispatch = useDispatch();
  const { cms } = useSelector(state => state.admin);

  // Local form states
  const [newCode, setNewCode] = useState("");
  const [newDisc, setNewDisc] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerImg, setNewBannerImg] = useState("");

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode || !newDisc) return;
    dispatch(addCoupon({
      code: newCode.toUpperCase(),
      discount: newDisc,
      description: newDesc,
      expiry: newExpiry || '2026-12-31'
    }));
    // resets
    setNewCode("");
    setNewDisc("");
    setNewDesc("");
    setNewExpiry("");
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImg) return;
    dispatch(addHeroBanner({
      title: newBannerTitle,
      image: newBannerImg
    }));
    // resets
    setNewBannerTitle("");
    setNewBannerImg("");
  };

  const handleDeleteCoupon = (id) => {
    dispatch(deleteCoupon(id));
  };

  const handleToggleBanner = (id) => {
    dispatch(toggleBannerStatus(id));
  };

  // Define Columns
  const couponColumns = [
    { 
      key: 'code', 
      header: 'Promo Code',
      render: (row) => (
        <span className="bg-teal-light text-teal border border-teal/10 px-3 py-1 rounded-xl font-black text-xs select-all">
          {row.code}
        </span>
      )
    },
    { key: 'discount', header: 'Savings Value' },
    { 
      key: 'description', 
      header: 'Applicability Rule',
      render: (row) => <span className="font-semibold text-slate-500">{row.description}</span>
    },
    { 
      key: 'expiry', 
      header: 'Expiry Date',
      render: (row) => <span className="font-bold text-slate-500">{row.expiry}</span>
    }
  ];

  const couponActions = (row) => (
    <button 
      onClick={() => handleDeleteCoupon(row.id)}
      className="p-2 bg-coral-light/40 hover:bg-coral-light text-coral rounded-xl cursor-pointer tap-scale"
    >
      <FiTrash2 className="text-sm shrink-0" />
    </button>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="text-xl font-extrabold text-slate-800 leading-none">CMS Content Management</div>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage promotional banners, applied coupon codes, and clinical health blog articles.
          </p>
        </div>
      </div>

      {/* Grid section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Banners & Promo Codes */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Coupon codes Table */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiTag className="text-teal" /> Platform Promo Coupons
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Add discounts sheets to incentivize checkout conversions.
            </p>
            <ReusableTable 
              columns={couponColumns}
              data={cms.coupons}
              searchPlaceholder="Search coupon code..."
              searchKey="code"
              actions={couponActions}
              fileName="emediclub-coupons"
            />
          </div>

          {/* Banner Lists */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiLayout className="text-teal" /> Hero Sliding Banners
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Upload carousel layouts floating on user landing dashboards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cms.heroBanners.map((banner) => (
                <div 
                  key={banner.id} 
                  className="border border-slate-100 rounded-2xl overflow-hidden relative group shadow-sm bg-slate-50"
                >
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 flex flex-col gap-2 bg-white">
                    <span className="text-xs font-extrabold text-slate-800 truncate block">{banner.title}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${banner.status === 'active' ? 'bg-teal-light text-teal' : 'bg-slate-100 text-slate-400'}`}>
                        {banner.status}
                      </span>
                      <button 
                        onClick={() => handleToggleBanner(banner.id)}
                        className="text-[9px] font-black text-teal hover:underline uppercase cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Addition Forms */}
        <div className="flex flex-col gap-6">
          
          {/* Coupon Addition */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiPlus className="text-teal" /> Add Discount Coupon
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Publish a new promo badge.
            </p>

            <form onSubmit={handleCreateCoupon} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MONSOON30" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal uppercase"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Discount Value</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 30% OFF" 
                  value={newDisc}
                  onChange={(e) => setNewDisc(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Description Rule</label>
                <input 
                  type="text" 
                  placeholder="e.g. Save flat 30% on diagnostic checkups" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                />
              </div>
              <button 
                type="submit"
                className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer tap-scale"
              >
                Create Promo
              </button>
            </form>
          </div>

          {/* Banner Addition */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiPlus className="text-teal" /> Add Hero Banner
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Add new promotional slider graphics.
            </p>

            <form onSubmit={handleCreateBanner} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Banner Headline</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Save on Diabetes Check" 
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Graphic URL link</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://images.unsplash.com/..." 
                  value={newBannerImg}
                  onChange={(e) => setNewBannerImg(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                />
              </div>
              <button 
                type="submit"
                className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer tap-scale"
              >
                Publish Slide
              </button>
            </form>
          </div>

        </div>

      </section>

    </div>
  );
}
