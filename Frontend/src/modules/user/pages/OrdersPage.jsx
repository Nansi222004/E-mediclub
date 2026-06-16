import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiBox, 
  FiCheckCircle, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi';
import { updateOrderStatus, archiveOrder } from '../store/productSlice';

export default function OrdersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders = [], location: locationState } = useSelector(state => state.products);
  const [activeTab, setActiveTab] = React.useState('Active');

  const filteredOrders = React.useMemo(() => {
    return orders.filter(ord => {
      if (ord.archived) return false;

      // Filter by location
      const selectedCity = locationState?.city?.toLowerCase() || '';
      const selectedPin = locationState?.pincode || '';
      
      if (selectedCity) {
        const orderCity = ord.city ? ord.city.toLowerCase() : '';
        const orderPin = ord.pincode || '';
        const addressLower = ord.deliveryAddress ? ord.deliveryAddress.toLowerCase() : '';
        
        const matchesCity = orderCity === selectedCity || addressLower.includes(selectedCity);
        const matchesPin = selectedPin ? (orderPin === selectedPin || addressLower.includes(selectedPin)) : true;
        
        if (!matchesCity || !matchesPin) return false;
      }

      if (activeTab === 'Active') {
        return ord.status !== 'Delivered';
      }
      if (activeTab === 'Past') {
        return ord.status === 'Delivered';
      }
      return true;
    });
  }, [orders, activeTab, locationState]);

  const handleArchiveOrder = (orderId, e) => {
    e.stopPropagation();
    dispatch(archiveOrder(orderId));
  };

  const steps = [
    { label: 'Order Placed', desc: 'Received & verified' },
    { label: 'Confirmed', desc: 'Approved by pharmacist' },
    { label: 'Packed', desc: 'Sterile sealed package' },
    { label: 'Out for Delivery', desc: 'Dispatched with courier' },
    { label: 'Delivered', desc: 'Doorstep handover' }
  ];

  const getStepIndex = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'delivered') return 4;
    if (s === 'out for delivery' || s === 'dispatched' || s === 'shipped') return 3;
    if (s === 'packed') return 2;
    if (s === 'confirmed') return 1;
    return 1; // Default for 'Ordered' or 'pending'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'Shipped':
      case 'Dispatched':
      case 'Out for Delivery':
        return <FiTruck className="w-4 h-4 text-teal shrink-0" />;
      case 'Packed':
        return <FiBox className="w-4 h-4 text-forest shrink-0" />;
      case 'Ordered':
      default:
        return <FiBox className="w-4 h-4 text-forest shrink-0" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Shipped':
      case 'Dispatched':
      case 'Out for Delivery':
        return 'bg-teal-light/50 text-teal border border-teal/10';
      case 'Packed':
        return 'bg-amber-50 text-amber-605 border border-amber-100';
      case 'Ordered':
      default:
        return 'bg-forest-light/40 text-forest border border-forest/10';
    }
  };

  const handleSimulateProgress = (orderId, currentStatus) => {
    let nextStatus = 'Ordered';
    if (currentStatus === 'Ordered' || currentStatus === 'pending') {
      nextStatus = 'Packed';
    } else if (currentStatus === 'Packed') {
      nextStatus = 'Dispatched';
    } else if (currentStatus === 'Dispatched' || currentStatus === 'Shipped') {
      nextStatus = 'Delivered';
    }
    dispatch(updateOrderStatus({ orderId, status: nextStatus }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4 select-none">
      
      <div className="border-b border-slate-100 pb-4 mb-6 mt-4">
        <h1 className="text-xl md:text-2xl font-black text-slate-805 tracking-tight">Your Clinical Orders</h1>
        <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">
          Track sterile shipments, logistics pipelines, and ratings histories
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 mb-6 gap-2 select-none">
        {['Active', 'Past', 'All'].map((tab) => {
          const count = orders.filter(ord => {
            if (ord.archived) return false;
            
            // Filter by location
            const selectedCity = locationState?.city?.toLowerCase() || '';
            const selectedPin = locationState?.pincode || '';
            
            if (selectedCity) {
              const orderCity = ord.city ? ord.city.toLowerCase() : '';
              const orderPin = ord.pincode || '';
              const addressLower = ord.deliveryAddress ? ord.deliveryAddress.toLowerCase() : '';
              
              const matchesCity = orderCity === selectedCity || addressLower.includes(selectedCity);
              const matchesPin = selectedPin ? (orderPin === selectedPin || addressLower.includes(selectedPin)) : true;
              
              if (!matchesCity || !matchesPin) return false;
            }

            if (tab === 'Active') return ord.status !== 'Delivered';
            if (tab === 'Past') return ord.status === 'Delivered';
            return true;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-wider relative transition-colors border-0 bg-transparent cursor-pointer outline-none ${
                activeTab === tab
                  ? 'text-teal border-b-2 border-teal'
                  : 'text-slate-400 hover:text-slate-655'
              }`}
            >
              {tab} Orders ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((ord) => {
            const currentStepIndex = getStepIndex(ord.status);
            return (
              <motion.div 
                key={ord.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-5 md:p-6 border border-slate-100 shadow-premium flex flex-col gap-5 relative overflow-hidden"
              >
                
                {/* Top order summary details */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <FiShoppingBag className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Reference ID</span>
                      <h4 className="text-sm font-black text-slate-800 mt-0.5">{ord.id}</h4>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block md:text-right">Order Date</span>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{ord.date}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto ${getStatusColor(ord.status)}`}>
                    {getStatusIcon(ord.status)}
                    <span>{ord.status}</span>
                  </div>
                </div>

                {/* Items listing inside this order */}
                <div className="flex flex-col gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Prescribed Items ({ord.items.length})</span>
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                        <span>
                          {item.name} <strong className="text-slate-400 text-[10px] ml-1">x{item.qty}</strong>
                        </span>
                      </div>
                      <span className="text-slate-900 font-black">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* 5-Stage Express Progress Stepper */}
                <div className="border-t border-slate-50 pt-5 relative">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
                    <FiTruck className="text-teal text-xs" /> Express Shipment Pipeline
                  </h5>
                  
                  {/* Stepper block */}
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-3 px-2">
                    
                    {/* Background Line Connector for Desktop */}
                    <div className="absolute top-[18px] left-6 right-6 h-1 bg-slate-100 hidden md:block z-0 rounded-full" />
                    
                    {/* Active Progress Line for Desktop */}
                    <div 
                      className="absolute top-[18px] left-6 h-1 bg-forest transition-all duration-700 hidden md:block z-0 rounded-full" 
                      style={{ width: `calc(${(currentStepIndex / 4) * 100}% - 48px)` }}
                    />

                    {/* Vertical Line on Mobile */}
                    <div className="absolute left-[16px] top-4 bottom-4 w-1 bg-slate-100 md:hidden z-0 rounded-full" />
                    <div 
                      className="absolute left-[16px] top-4 w-1 bg-forest transition-all duration-700 md:hidden z-0 rounded-full" 
                      style={{ height: `calc(${(currentStepIndex / 4) * 100}% - 12px)` }}
                    />

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      
                      return (
                        <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-1/5 relative">
                          
                          {/* Step Bubble */}
                          <div 
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shrink-0 ${
                              isCompleted 
                                ? 'bg-forest text-white shadow-md shadow-forest/25 ring-4 ring-forest-light/40' 
                                : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <FiCheckCircle className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          
                          {/* Label & Details */}
                          <div className="text-left md:text-center">
                            <h6 className={`text-[11px] font-black leading-tight ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.label}
                            </h6>
                            <p className="text-[9px] text-slate-400 font-semibold leading-snug mt-0.5 hidden md:block max-w-[120px] mx-auto">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Estimated Arrival & Courier details */}
                {ord.status !== 'Delivered' && (
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                        <FiTruck className="text-teal w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[8px] bg-teal-light text-teal font-black px-2 py-0.5 rounded-full uppercase tracking-wider">ON SCHEDULE</span>
                        <h5 className="font-black text-slate-800 text-xs mt-1">Estimated Delivery: Today Evening</h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Clinical dispatch processed at Andheri East Hub.</p>
                      </div>
                    </div>
                    
                    {/* Courier Bio */}
                    <div className="flex items-center gap-2.5 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center text-xs font-black shrink-0">
                        AS
                      </div>
                      <div>
                        <h6 className="text-[11px] font-black text-slate-850">Amit Sharma</h6>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Express Courier Partner</p>
                        <a 
                          href="tel:+919876543210" 
                          className="text-[10px] text-forest hover:text-forest-dark font-black flex items-center gap-1 mt-0.5 no-underline outline-none"
                        >
                          <FiPhone className="w-3 h-3 text-teal" /> +91 98765 43210
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivered state with CTA for rating */}
                {ord.status === 'Delivered' && (
                  <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1">
                    <div>
                      <h5 className="font-black text-emerald-800 text-xs flex items-center gap-1.5">
                        <FiCheckCircle className="text-emerald-600 stroke-[2.5]" /> Handed Over & Secure
                      </h5>
                      <p className="text-[10px] text-emerald-600/90 font-bold mt-0.5">
                        Delivered safely. Please share your rating and review the products to help other patients.
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/rate/${ord.id}`)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all shrink-0 border-0 cursor-pointer outline-none"
                      >
                        Rate & Review Products
                      </button>
                      <button
                        onClick={(e) => handleArchiveOrder(ord.id, e)}
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-0 cursor-pointer outline-none shrink-0"
                        title="Archive order (hide from view)"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom billing & address summary info */}
                <div className="flex flex-wrap justify-between items-end gap-3 pt-4 border-t border-slate-50 mt-1">
                  <div>
                    <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Deliver To</span>
                    <p className="text-xs font-extrabold text-slate-650 mt-0.5 flex items-center gap-1">
                      <FiMapPin className="text-slate-400 shrink-0" /> {ord.deliveryAddress}
                    </p>
                  </div>
                  
                  {/* Action row with simulator and total */}
                  <div className="flex items-center gap-4 ml-auto">
                    {ord.status !== 'Delivered' && (
                      <button
                        onClick={() => handleSimulateProgress(ord.id, ord.status)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-650 hover:text-slate-800 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all border-0 cursor-pointer outline-none shrink-0"
                      >
                        Simulate Next Step ➔
                      </button>
                    )}
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Total Charged</span>
                      <p className="text-base font-black text-forest mt-0.5">₹{ord.total}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-16 border border-slate-100 shadow-premium text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
            <FiShoppingBag className="w-8 h-8 text-slate-350" />
          </div>
          <h4 className="font-black text-slate-850 text-base">No orders found.</h4>
          <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
            Fill your clinical cabinet with certified prescription drugs and schedule vital lab diagnostics instantly with express delivery!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-forest hover:bg-forest-dark text-white text-xs font-black rounded-2xl shadow-md shadow-forest/20 hover:shadow transition-all uppercase tracking-wider border-0 cursor-pointer outline-none"
          >
            Browse Pharmacy Shop
          </button>
        </div>
      )}

    </div>
  );
}
