import { useAdminLocation } from '../context/AdminLocationContext';

export default function LocationEmptyState({ locationName, hasVendors, hasOrders }) {
  const { clearFilter } = useAdminLocation();

  const getMessage = () => {
    if (!hasVendors && !hasOrders) return {
      title: `No data found for "${locationName}"`,
      subtitle: 'No vendors, orders or patients found in this location yet.',
    };
    if (hasVendors && !hasOrders) return {
      title: `Vendors exist in "${locationName}"`,
      subtitle: 'Vendors are registered here but no orders have been placed yet.',
    };
    return {
      title: `Loading data for "${locationName}"...`,
      subtitle: 'Data exists but is still loading. Please wait.',
    };
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center bg-white border border-[#E8F5EE] rounded-[32px] p-12 text-center shadow-premium min-h-[400px] w-full mt-4">
      <span className="text-4xl mb-4">📍</span>
      <div className="text-base font-black text-slate-800 uppercase tracking-wider mb-2">
        {title}
      </div>
      <p className="text-2xs text-[#6B7280] font-bold uppercase tracking-wider mb-6 leading-relaxed max-w-md">
        {subtitle}
      </p>
      <button
        type="button"
        onClick={clearFilter}
        className="px-6 py-3 bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-sm border-0"
      >
        Clear Filter & Show All Data
      </button>
    </div>
  );
}
