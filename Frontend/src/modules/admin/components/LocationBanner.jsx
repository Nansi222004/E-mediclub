import { useAdminLocation } from '../context/AdminLocationContext';

export default function LocationBanner() {
  const { locationFilter, clearFilter, isFiltered } = useAdminLocation();
  if (!isFiltered) return null;

  const parts = [
    locationFilter.search,
    locationFilter.state,
    locationFilter.city,
    locationFilter.pincode,
  ].filter(Boolean);

  return (
    <div className="admin-location-banner flex items-center justify-between p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-[11px] font-bold text-emerald-800">
      <div className="flex items-center gap-2">
        <span>📍</span>
        <span>Showing data for: <strong>{parts.join(' → ')}</strong></span>
      </div>
      <button 
        type="button" 
        onClick={clearFilter}
        className="ml-auto text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer"
      >
        ✕ Clear
      </button>
    </div>
  );
}
