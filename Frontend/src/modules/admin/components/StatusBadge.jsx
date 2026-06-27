
const StatusBadge = ({ status, className = '' }) => {
  const getBadgeStyle = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'active':
      case 'completed':
      case 'approved':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pending':
      case 'processing':
      case 'assigned':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'blocked':
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getBadgeStyle(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
