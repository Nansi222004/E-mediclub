import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiFileText, FiInfo, FiAward, FiPlus, FiTrash2, FiExternalLink, FiUploadCloud
} from 'react-icons/fi';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import apiClient from '../../../shared/services/apiClient';

export default function LabVendorProfile({ defaultTab }) {
  const { tab: routeTab } = useParams();
  const navigate = useNavigate();
  const activeTab = routeTab || defaultTab || 'basic';

  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Success state
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/labs/vendor/profile');
      setLab(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/api/labs/vendor/profile', lab);
      setSuccessMsg("Profile particulars saved successfully.");
      fetchProfile();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFacilityToggle = async (key) => {
    const updatedFacilities = {
      ...lab.facilitiesList,
      [key]: !lab.facilitiesList[key]
    };
    try {
      await apiClient.put('/api/labs/vendor/profile', {
        facilitiesList: updatedFacilities
      });
      setLab({ ...lab, facilitiesList: updatedFacilities });
      setSuccessMsg("Facility configurations updated.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGalleryImage = async () => {
    const url = window.prompt("Enter image URL to add to Gallery:");
    if (!url) return;
    if (lab.gallery.length >= 15) {
      alert("Maximum limit of 15 gallery images reached.");
      return;
    }
    const newImg = {
      id: Date.now().toString(),
      url,
      category: 'Testing Area',
      isFeatured: lab.gallery.length === 0
    };
    const updatedGallery = [...lab.gallery, newImg];
    try {
      await apiClient.put('/api/labs/vendor/profile', { gallery: updatedGallery });
      setLab({ ...lab, gallery: updatedGallery });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    const updatedGallery = lab.gallery.filter(g => g.id !== id);
    try {
      await apiClient.put('/api/labs/vendor/profile', { gallery: updatedGallery });
      setLab({ ...lab, gallery: updatedGallery });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetFeaturedImage = async (id) => {
    const updatedGallery = lab.gallery.map(g => ({
      ...g,
      isFeatured: g.id === id
    }));
    try {
      await apiClient.put('/api/labs/vendor/profile', { gallery: updatedGallery });
      setLab({ ...lab, gallery: updatedGallery });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/api/labs/vendor/profile', {
        promotionalBanner: lab.promotionalBanner
      });
      setSuccessMsg("Promotional banner saved.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAccreditation = async (key, val) => {
    const updatedAccred = {
      ...lab.accreditations,
      [key]: val
    };
    try {
      await apiClient.put('/api/labs/vendor/profile', {
        accreditations: updatedAccred
      });
      setLab({ ...lab, accreditations: updatedAccred });
      setSuccessMsg("Accreditation documents updated.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'gallery', label: 'Lab Gallery' },
    { id: 'banner', label: 'Promotional Banner' },
    { id: 'facilities', label: 'Facilities & Amenities' },
    { id: 'accreditation', label: 'Accreditation' },
    { id: 'preview', label: 'User View Preview' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">KYC Laboratory Profile</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review compliance certificates, diagnostic capabilities, and user preview cards.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold animate-fadeIn">
          ✔️ {successMsg}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-slate-150 gap-4 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => navigate(`/vendor/lab/profile/${t.id}`)}
            className={`py-2 px-1 text-xs font-black uppercase tracking-wider bg-transparent border-0 border-b-2 cursor-pointer transition-all whitespace-nowrap
              ${activeTab === t.id ? 'border-teal text-teal' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      
      {/* 1. BASIC INFORMATION */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-premium flex flex-col gap-5 max-w-3xl">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-2">Laboratory Particulars</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Accredited Laboratory Name</label>
              <input 
                type="text" 
                value={lab.name || ''}
                onChange={(e) => setLab({...lab, name: e.target.value})}
                required
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Medical Director / Pathologist</label>
              <input 
                type="text" 
                value={lab.ownerName || ''}
                onChange={(e) => setLab({...lab, ownerName: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Communication Email</label>
              <input 
                type="email" 
                value={lab.emailAddress || ''}
                onChange={(e) => setLab({...lab, emailAddress: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Contact Mobile</label>
              <input 
                type="text" 
                value={lab.mobileNumber || ''}
                onChange={(e) => setLab({...lab, mobileNumber: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">State</label>
              <input 
                type="text" 
                value={lab.state || ''}
                onChange={(e) => setLab({...lab, state: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">City</label>
              <input 
                type="text" 
                value={lab.city || ''}
                onChange={(e) => setLab({...lab, city: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Pincode</label>
              <input 
                type="text" 
                value={lab.pincode || ''}
                onChange={(e) => setLab({...lab, pincode: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Lab Dispatch Coordinates</label>
              <textarea 
                value={lab.address || ''}
                onChange={(e) => setLab({...lab, address: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full h-16 resize-none"
              />
            </div>
          </div>

          <button type="submit" className="self-end px-6 py-2.5 bg-[#1FA7A5] hover:bg-[#135A5A] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border-0 cursor-pointer">
            Save Particulars
          </button>
        </form>
      )}

      {/* 2. LAB GALLERY */}
      {activeTab === 'gallery' && (
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-premium flex flex-col gap-6 max-w-4xl">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Laboratory Gallery</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 font-bold block">{lab.gallery?.length || 0} / 15 Images</span>
            </div>
            <button
              onClick={handleAddGalleryImage}
              className="flex items-center gap-1 px-4 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer shadow-sm"
            >
              <FiPlus /> Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(lab.gallery || []).map((img, idx) => (
              <div 
                key={img.id || idx} 
                draggable 
                onDragStart={() => setDraggedIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async () => {
                  const newGallery = [...lab.gallery];
                  const item = newGallery.splice(draggedIdx, 1)[0];
                  newGallery.splice(idx, 0, item);
                  setLab({ ...lab, gallery: newGallery });
                  await apiClient.put('/api/labs/vendor/profile', { gallery: newGallery });
                  setDraggedIdx(null);
                }}
                className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 group shadow-sm cursor-move bg-slate-100"
              >
                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  {!img.isFeatured && (
                    <button 
                      onClick={() => handleSetFeaturedImage(img.id)}
                      className="p-1.5 bg-white/20 hover:bg-white hover:text-amber-500 text-white rounded-lg border-0 cursor-pointer"
                      title="Set as Featured"
                    >
                      <FiAward size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteGalleryImage(img.id)}
                    className="p-1.5 bg-rose-600 text-white rounded-lg border-0 cursor-pointer"
                    title="Delete Image"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                {img.isFeatured && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <FiAward /> Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROMOTIONAL BANNER */}
      {activeTab === 'banner' && (
        <form onSubmit={handleSaveBanner} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-premium flex flex-col gap-6 max-w-3xl">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-2">Promotional Banner Builder</h3>
          
          {/* Banner Live Preview */}
          <div className="rounded-[24px] overflow-hidden relative h-36 bg-slate-900 shadow-inner group">
            <img 
              src={lab.promotionalBanner?.image || "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"} 
              alt="Banner Preview" 
              className="w-full h-full object-cover opacity-50" 
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
              <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block mb-1">{lab.promotionalBanner?.offerText || 'Offer Subtitle'}</span>
              <h4 className="font-black text-xl leading-tight">{lab.promotionalBanner?.title || 'Enter Promotional Title'}</h4>
              <p className="text-white/80 text-xs mt-1 font-semibold max-w-[80%]">{lab.promotionalBanner?.subtitle || 'Enter description of the offer.'}</p>
              <div className="mt-3 text-[10px] font-black uppercase tracking-wider bg-white text-slate-800 px-3.5 py-1.5 rounded-full self-start inline-block shadow-md">
                {lab.promotionalBanner?.ctaButton || 'CTA Button Text'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Banner Image URL</label>
              <input 
                type="text" 
                value={lab.promotionalBanner?.image || ''}
                onChange={(e) => setLab({
                  ...lab, 
                  promotionalBanner: { ...lab.promotionalBanner, image: e.target.value }
                })}
                placeholder="https://images.unsplash.com/photo-..."
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Banner Main Title</label>
              <input 
                type="text" 
                value={lab.promotionalBanner?.title || ''}
                onChange={(e) => setLab({
                  ...lab, 
                  promotionalBanner: { ...lab.promotionalBanner, title: e.target.value }
                })}
                placeholder="e.g. Free Home Collection"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Offer Text Badge</label>
              <input 
                type="text" 
                value={lab.promotionalBanner?.offerText || ''}
                onChange={(e) => setLab({
                  ...lab, 
                  promotionalBanner: { ...lab.promotionalBanner, offerText: e.target.value }
                })}
                placeholder="e.g. 20% OFF Packages"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Subtitle / Description</label>
              <input 
                type="text" 
                value={lab.promotionalBanner?.subtitle || ''}
                onChange={(e) => setLab({
                  ...lab, 
                  promotionalBanner: { ...lab.promotionalBanner, subtitle: e.target.value }
                })}
                placeholder="e.g. Accurate blood diagnostic results delivered digitally."
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">CTA Button Text</label>
              <input 
                type="text" 
                value={lab.promotionalBanner?.ctaButton || ''}
                onChange={(e) => setLab({
                  ...lab, 
                  promotionalBanner: { ...lab.promotionalBanner, ctaButton: e.target.value }
                })}
                placeholder="e.g. View Packages"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal w-full"
              />
            </div>
          </div>

          <button type="submit" className="self-end px-6 py-2.5 bg-[#1FA7A5] hover:bg-[#135A5A] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border-0 cursor-pointer">
            Save Promotional Banner
          </button>
        </form>
      )}

      {/* 4. FACILITIES & AMENITIES */}
      {activeTab === 'facilities' && (
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-premium flex flex-col gap-5 max-w-2xl">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-2">Toggle Lab Capabilities</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'nablCertified', label: 'NABL Certified ✓' },
              { key: 'homeCollection', label: 'Free Home Collection Available ✓' },
              { key: 'digitalReports', label: 'Digital Reports (WhatsApp/PDF) ✓' },
              { key: 'sameDayReports', label: 'Same Day Quick Reports ✓' },
              { key: 'parkingAvailable', label: 'Free Car Parking Available ✓' },
              { key: 'wheelchairAccess', label: 'Wheelchair Accessible Access ✓' },
              { key: 'emergencyTesting', label: 'Emergency Testing (24x7) ✓' },
              { key: 'onlinePayments', label: 'Online Secure Payments Supported ✓' }
            ].map(fac => (
              <label key={fac.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-[#1FA7A5]/30 cursor-pointer transition-colors bg-white shadow-sm">
                <span className="text-xs font-black text-slate-700">{fac.label}</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-[#1FA7A5] cursor-pointer"
                  checked={!!lab.facilitiesList?.[fac.key]}
                  onChange={() => handleFacilityToggle(fac.key)}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 5. ACCREDITATION */}
      {activeTab === 'accreditation' && (
        <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-premium flex flex-col gap-5 max-w-3xl">
          <h3 className="text-xs font-black text-slate-855 uppercase tracking-widest border-b border-slate-50 pb-2">Accreditation & License Files</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { key: 'nablCertificate', label: 'NABL Certificate Copy' },
              { key: 'isoCertificate', label: 'ISO Verification Certificate' },
              { key: 'gstCertificate', label: 'GSTIN Registration Document' },
              { key: 'registrationCertificate', label: 'Diagnostic Center License' },
              { key: 'labLicense', label: 'Medical Pathologist Authorization' }
            ].map(doc => {
              const fileUrl = lab.accreditations?.[doc.key];
              return (
                <div key={doc.key} className="border border-slate-100 p-4 rounded-3xl flex flex-col gap-3 justify-between bg-slate-50/50">
                  <div>
                    <h4 className="text-xs text-slate-800 font-extrabold leading-snug">{doc.label}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">PDF or Image scan copy (Max 5MB)</span>
                  </div>

                  {fileUrl ? (
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/50">
                      <span className="flex items-center gap-1.5"><FiFileText className="text-teal" /> Document Uploaded</span>
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-teal hover:underline flex items-center gap-1 text-[10px] font-black uppercase decoration-transparent">
                        <FiExternalLink /> View File
                      </a>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        const url = window.prompt(`Enter URL link for ${doc.label}:`);
                        if (url) handleSaveAccreditation(doc.key, url);
                      }}
                      className="border border-dashed border-slate-200 hover:border-teal rounded-2xl p-4 bg-white cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors text-[10px] font-black text-teal uppercase tracking-wider"
                    >
                      <FiUploadCloud className="text-lg text-slate-400" /> Upload Scan File
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. USER VIEW PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-[#F7FAFC] p-6 rounded-[32px] shadow-inner border border-slate-100 max-w-4xl flex flex-col gap-6">
          
          <div className="bg-amber-50/80 border border-amber-100 p-4 rounded-2xl flex items-start gap-2 max-w-xl mx-auto">
            <FiInfo className="text-amber-700 text-lg shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-650 font-semibold leading-relaxed">
              <strong>Patient View Simulation:</strong> This page renders exactly how patients see your diagnostic center when booking checkups inside E Mediclub customer application.
            </p>
          </div>

          {/* Simulated Lab Details Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-premium border border-slate-100 flex flex-col max-w-xl mx-auto w-full relative">
            {/* Banner Image */}
            <div className="h-44 bg-slate-200 relative overflow-hidden">
              <img 
                src={lab.promotionalBanner?.image || "https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=800&q=80"} 
                alt="Banner" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-4 left-6 text-white">
                <span className="bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  {lab.promotionalBanner?.offerText || 'Offer Code'}
                </span>
                <h4 className="font-black text-lg leading-tight">{lab.promotionalBanner?.title}</h4>
                <p className="text-white/80 text-[11px] font-medium">{lab.promotionalBanner?.subtitle}</p>
              </div>
            </div>

            {/* Profile body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-100 shadow-sm flex items-center justify-center text-3xl font-black shrink-0">
                  🔬
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5 leading-tight">
                    {lab.name} <FaCheckCircle className="text-teal text-sm shrink-0" />
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5">
                      <FaStar className="text-[8px]" /> {lab.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">({lab.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2.5">Available Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(lab.facilitiesList || {}).map(([key, val]) => {
                    if (!val) return null;
                    return (
                      <span key={key} className="text-[10px] font-extrabold text-[#135A5A] bg-[#135A5A]/5 border border-[#135A5A]/10 px-3 py-1 rounded-xl">
                        ✓ {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Packages */}
              <div>
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2.5">Diagnostic Wellness Packages</h4>
                <div className="flex flex-col gap-3">
                  {(lab.packagesList || []).map(pkg => (
                    <div key={pkg.id} className="border border-slate-100 p-4 rounded-3xl flex justify-between items-center bg-slate-50">
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-800">{pkg.name}</h5>
                        <span className="text-[9px] text-[#135A5A] font-black uppercase tracking-widest">{pkg.fastingRequired} • {pkg.turnaround} Reports</span>
                      </div>
                      <strong className="text-sm font-black text-teal">₹{pkg.discountPrice || pkg.price}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
