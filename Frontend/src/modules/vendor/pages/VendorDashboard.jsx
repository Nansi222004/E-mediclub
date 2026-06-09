import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatsCard from '../../admin/components/StatsCard';
import { updateOrderStatus } from '../store/vendorSlice';
import { 
  FiDollarSign, FiShoppingBag, FiPackage, FiActivity, 
  FiCheckCircle, FiClock, FiAlertTriangle 
} from 'react-icons/fi';

export default function VendorDashboard() {
  const dispatch = useDispatch();
  const { products, orders, withdrawals, analytics } = useSelector(state => state.vendor);
  const [weeklyHoverIndex, setWeeklyHoverIndex] = useState(null);

  // Filter low stock medicines (< 30 units)
  const lowStockProducts = products.filter(p => p.stock < 30);

  const handleShipOrder = (orderId) => {
    dispatch(updateOrderStatus({ orderId, status: 'shipped' }));
  };

  // Render a responsive, premium SVG Bar Chart for weekly sales
  const renderWeeklyChart = () => {
    const data = analytics.weeklySales;
    const width = 500;
    const height = 180;
    const padding = 20;

    const maxVal = Math.max(...data.map(d => d.sales)) || 15000;
    const barWidth = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    return (
      <div className="w-full bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="flex items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Weekly Store Billings</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Dispatched sales receipts overview</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Realtime tooltip */}
            <div className={`transition-opacity duration-200 ${weeklyHoverIndex !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-[9px] bg-slate-800 text-white font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-sm">
                {weeklyHoverIndex !== null ? `${data[weeklyHoverIndex].day}: ₹${data[weeklyHoverIndex].sales.toLocaleString()}` : ''}
              </span>
            </div>
            <span className="text-[10px] bg-teal-light text-teal font-black uppercase px-2 py-0.5 rounded-full">Weekly Target: 84%</span>
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding + ratio * chartHeight;
              return (
                <line 
                  key={idx} 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="#F8FAFC" 
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Drawing Bars */}
            {data.map((d, i) => {
              const x = padding + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth) / 2;
              const barHeight = (d.sales / maxVal) * chartHeight;
              const y = height - padding - barHeight;
              const isHovered = weeklyHoverIndex === i;

              return (
                <g 
                  key={i} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setWeeklyHoverIndex(i)}
                  onMouseLeave={() => setWeeklyHoverIndex(null)}
                >
                  {/* Glowing hover card container */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isHovered ? "var(--color-teal-dark)" : "var(--color-teal)"}
                    rx="8"
                    className="transition-colors duration-200"
                  />
                  {/* Tooltip value */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fill="var(--color-teal)"
                    className={`text-[8px] font-black uppercase tracking-wider transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  >
                    ₹{d.sales}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between px-6 mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {data.map((d, i) => <span key={i}>{d.day}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Seller Performance Dashboard</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Overview of store earnings, dispatch receipts queue, and consultant bookings schedules.
          </p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl shadow-sm select-none">
          <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
          <span>Live Store Feed</span>
        </div>
      </div>

      {/* KPI Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Weekly Net Billings" 
          value={`₹${analytics.totalRevenue.toLocaleString()}`} 
          change="+14.8%" 
          isPositive={true} 
          icon={FiDollarSign} 
          color="teal" 
          sparklineData={[15, 20, 25, 22, 35, 42, 38]}
        />
        <StatsCard 
          title="Pending Dispatches" 
          value={`${orders.filter(o => o.status === 'pending').length}`} 
          change="-5%" 
          isPositive={true} 
          icon={FiShoppingBag} 
          color="coral" 
          sparklineData={[8, 6, 5, 4, 3, 2, 1]}
        />
        <StatsCard 
          title="Pharmacy Stock Catalog" 
          value={`${products.length}`} 
          change="+2 items" 
          isPositive={true} 
          icon={FiPackage} 
          color="forest" 
          sparklineData={[10, 10, 11, 11, 12, 12, 12]}
        />
        <StatsCard 
          title="Low Stock Indicators" 
          value={`${lowStockProducts.length}`} 
          change="Critical" 
          isPositive={false} 
          icon={FiAlertTriangle} 
          color="gold" 
          sparklineData={[4, 3, 3, 2, 1, 1, 2]}
        />
      </section>

      {/* Charts & timelines deck */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Weekly Sales & Low Stock warnings */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {renderWeeklyChart()}

          {/* Low stock alerts dashboard */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <FiAlertTriangle className="text-coral" /> Critical Stock Shortage Alerts
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
                Replenish following wellness items immediately to prevent checkout disruptions.
              </p>

              <div className="flex flex-col gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 border border-coral/10 bg-coral-light/20 rounded-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">📦</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-none">{p.name}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase mt-1 block">{p.packSize}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-coral">{p.stock} units left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Recent Payout Disbursals Ledger */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-5">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Recent Payouts</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Verified banking remittance feeds</p>
              </div>
              <FiDollarSign className="text-teal" />
            </div>

            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
              {withdrawals.map((w) => (
                <div key={w.id} className="p-3.5 border border-slate-100/60 rounded-2xl bg-slate-50/50 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">Req ID: {w.id}</span>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border
                      ${w.status === 'approved' 
                        ? 'bg-teal-light/20 text-teal border-teal/10' 
                        : 'bg-gold-light/25 text-gold-dark border-gold/15'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2">
                    <span>{w.bankAccount.split(' - ')[0]}</span>
                    <span className="text-slate-800 font-black">₹{w.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 mt-5 flex justify-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
              Verified Banking Remittances
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}
