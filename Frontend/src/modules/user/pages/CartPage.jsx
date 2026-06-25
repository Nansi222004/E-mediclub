import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiPercent, 
  FiChevronRight, FiCheck, FiX, FiShield, FiTrendingUp,
  FiTruck, FiAlertTriangle
} from 'react-icons/fi';
import { addToCart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } from '../store/cartSlice';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { items, subtotal, savings, deliveryFee, coupon, couponDiscount, total } = useSelector(state => state.cart);
  const { addresses, isAuthenticated } = useSelector(state => state.auth || {});
  const { selectedLocation, medicines } = useSelector(state => state.products);

  // Dynamic Location Suggestions
  const locationSuggestions = {
    'Mumbai, Maharashtra': ['med-4', 'med-1', 'med-10'],
    'Bengaluru, Karnataka': ['med-3', 'med-6', 'med-11'],
    'New Delhi, Delhi': ['med-13', 'med-3', 'med-12'],
    'Hyderabad, Telangana': ['med-2', 'med-9', 'med-5'],
    'Pune, Maharashtra': ['med-8', 'med-1', 'med-4'],
    'Chennai, Tamil Nadu': ['med-6', 'med-9', 'med-12'],
    'Kolkata, West Bengal': ['med-3', 'med-8', 'med-11'],
    'Ahmedabad, Gujarat': ['med-2', 'med-4', 'med-5']
  };

  const getCityKey = (loc) => {
    if (!loc) return 'Mumbai, Maharashtra';
    const normalized = loc.toLowerCase();
    if (normalized.includes('mumbai')) return 'Mumbai, Maharashtra';
    if (normalized.includes('bengaluru') || normalized.includes('bangalore')) return 'Bengaluru, Karnataka';
    if (normalized.includes('delhi')) return 'New Delhi, Delhi';
    if (normalized.includes('hyderabad')) return 'Hyderabad, Telangana';
    if (normalized.includes('pune')) return 'Pune, Maharashtra';
    if (normalized.includes('chennai')) return 'Chennai, Tamil Nadu';
    if (normalized.includes('kolkata')) return 'Kolkata, West Bengal';
    if (normalized.includes('ahmedabad')) return 'Ahmedabad, Gujarat';
    return 'Mumbai, Maharashtra'; // Default fallback
  };

  const cityKey = getCityKey(selectedLocation);
  const suggestedIds = locationSuggestions[cityKey] || locationSuggestions['Mumbai, Maharashtra'];
  const suggestedProducts = (medicines || []).filter(med => suggestedIds.includes(med.id));

  const handleQuickAdd = (p, e) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: p.id,
      name: p.name,
      type: 'medicine',
      price: p.price,
      discountPrice: p.discountPrice,
      image: p.image,
      packSize: p.packSize,
      brand: p.brand
    }));
  };

  // States
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponsDrawer, setShowCouponsDrawer] = useState(false);

  // Coupons Database
  const availableCoupons = [
    { code: 'MEDICLUB20', discountPercent: 20, desc: 'Flat 20% discount on order above ₹499', minOrder: 499 },
    { code: 'WELCOME100', discountFlat: 100, desc: 'Flat ₹100 OFF on your first purchase', minOrder: 299 }
  ];

  const handleQtyChange = (id, type, change) => {
    dispatch(updateQuantity({ id, type, change }));
  };

  const handleRemove = (id, type) => {
    dispatch(removeFromCart({ id, type }));
  };

  const handleApplyCoupon = (promo) => {
    if (subtotal < (promo.minOrder || 0)) {
      setCouponError(`Min order value must be ₹${promo.minOrder} to apply this code`);
      return;
    }
    setCouponError('');
    dispatch(applyCoupon(promo));
    setShowCouponsDrawer(false);
  };

  const handleManualCouponSubmit = (e) => {
    e.preventDefault();
    const found = availableCoupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (found) {
      handleApplyCoupon(found);
    } else {
      setCouponError('Invalid Coupon Code. Try MEDICLUB20');
    }
  };

  // Delivery Free collection progress threshold (₹500 target)
  const freeDeliveryTarget = 500;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryTarget) * 100);
  const remainingForFree = Math.max(0, freeDeliveryTarget - subtotal);

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10 select-none">
      
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <h1 className="text-xl font-extrabold text-slate-800">Your Health Cart</h1>
        <span className="bg-slate-100 text-slate-600 text-xs font-black px-2 py-0.5 rounded-md">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Left panel: items listing */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Free shipping progress alert bar */}
            {remainingForFree > 0 ? (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex flex-col gap-2">
                <p className="text-xs font-bold text-amber-700">
                  Add <strong className="text-slate-800">₹{remainingForFree}</strong> more to qualify for <strong className="text-slate-800">FREE Delivery</strong>!
                </p>
                <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-emerald-700 text-xs font-black flex items-center gap-1.5">
                <FiCheck className="stroke-[3px]" />
                <span>Congratulations! Your order qualifies for FREE Express Delivery.</span>
              </div>
            )}

            {/* List items block */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden divide-y divide-slate-100">
              {items.map((item) => (
                <div key={`${item.id}-${item.type}`} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                  
                  {/* Top segment: Image and Description */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain mix-blend-multiply bg-slate-50 p-1.5 rounded-xl shrink-0 border border-slate-100/50"
                    />

                    {/* Description details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] sm:text-[9.5px] text-teal font-black uppercase tracking-wider block">
                        {item.type === 'labtest' ? 'Clinical Lab Test' : item.type === 'doctor' ? 'Online Consultation' : item.brand}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-[10px] sm:text-[10.5px] text-slate-500 font-semibold block mt-0.5">
                        {item.packSize || item.subtitle}
                      </span>
                      {/* Estimated delivery & Rx */}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {item.type === 'medicine' && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            <FiTruck className="w-3 h-3 text-teal" /> Delivery by {new Date(Date.now() + 86400000 * (item.rxRequired ? 2 : 1)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {item.rxRequired && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            <FiAlertTriangle className="w-3 h-3" /> Rx Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom segment: Actions (Qty, Price, Trash) */}
                  <div className="flex items-center justify-between sm:justify-end gap-4.5 sm:gap-6 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto shrink-0">
                    {/* Quantity Actions */}
                    {item.type === 'medicine' ? (
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden p-0.5 min-h-[44px] sm:min-h-[36px] min-w-[85px] justify-between">
                        <button 
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.type, -1)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-600 rounded-full transition-colors outline-none"
                        >
                          <FiMinus className="w-3 h-3 stroke-[3.5px]" />
                        </button>
                        <span className="px-1 text-xs font-black text-slate-800 select-none min-w-[16px] text-center">{item.qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.type, 1)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-650 rounded-full transition-colors outline-none"
                        >
                          <FiPlus className="w-3 h-3 stroke-[3.5px]" />
                        </button>
                      </div>
                    ) : (
                      <span className="bg-teal-light text-teal text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1.5 rounded-full shrink-0 min-h-[44px] sm:min-h-[36px] flex items-center justify-center">
                        1 BOOKING
                      </span>
                    )}

                    {/* Price segment */}
                    <div className="flex flex-col text-right min-w-[70px]">
                      <span className="text-xs sm:text-sm font-black text-slate-800">
                        ₹{(item.discountPrice || item.price) * item.qty}
                      </span>
                      {item.discountPrice && (
                        <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                          ₹{item.price * item.qty}
                        </span>
                      )}
                    </div>

                    {/* Delete action */}
                    <button 
                      type="button"
                      onClick={() => handleRemove(item.id, item.type)}
                      className="p-2.5 text-slate-300 hover:text-coral hover:bg-coral-light/20 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center outline-none"
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>            {/* Sticky Checkout section pricing sidebar */}
          </div>

          {/* Right panel: pricing & coupon splits */}
          <div className="flex flex-col gap-4 md:sticky md:top-24">
            
            {/* Promo coupon block */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-3">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <FiPercent className="text-teal" /> Coupon Banners
              </h3>

              {coupon ? (
                <div className="bg-teal-light/50 border border-teal/20 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs text-teal-dark font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <div>
                      <p className="font-black text-forest">Code applied: {coupon.code}</p>
                      <p className="text-[10px] text-slate-500">Savings: -₹{couponDiscount}</p>
                    </div>
                  </div>
                  <button onClick={() => dispatch(removeCoupon())} className="text-slate-400 hover:text-slate-600">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowCouponsDrawer(true)}
                    className="w-full py-2.5 bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 min-h-[44px] outline-none cursor-pointer"
                  >
                    <span>View Available Coupons</span>
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>

            {/* Price breaks checkout summary */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-3">
                Order Value Breakdown
              </h3>
              
              <div className="flex flex-col gap-2.5 text-xs text-slate-500 font-semibold">
                <div className="flex items-center justify-between">
                  <span>Medicine Subtotal</span>
                  <span className="text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Applied Coupon Discount</span>
                  <span className="text-emerald-600 font-bold">-₹{couponDiscount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Express Delivery Fee</span>
                  <span className="text-slate-800">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-base text-forest">₹{total}</span>
                </div>
                
                {savings > 0 && (
                  <div className="mt-2 bg-emerald-50 text-emerald-700 p-2.5 rounded-xl text-center text-xs font-bold border border-emerald-100">
                    You save ₹{savings} on this order!
                  </div>
                )}
              </div>

              {/* Secure health checkout badge */}
              <div className="bg-slate-50 p-2.5 rounded-2xl flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                <FiShield className="text-teal w-4.5 h-4.5 shrink-0" />
                <span>Orders processed securely under FDA Clinical lic. protections.</span>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: '/checkout' } });
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white font-black text-xs rounded-2xl shadow-sm hover:shadow text-center transition-all min-h-[44px] outline-none cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-premium text-center flex flex-col items-center gap-3 select-none">
            <span className="text-7xl">🛒</span>
            <h4 className="font-extrabold text-slate-800 text-sm">Your Pharmacy Cart is Empty</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
              Fill your prescription drawer with premium medicine brands, Ayurveda herbs, and diagnostic body checkups.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-3 px-6 py-2.5 bg-forest text-white text-xs font-black rounded-xl min-h-[44px] outline-none cursor-pointer"
            >
              Start Shopping Now
            </button>
          </div>
        </div>
      )}

      {/* Available Coupon drawer list sheet */}
      <AnimatePresence>
        {showCouponsDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCouponsDrawer(false)}
              className="fixed inset-0 z-50 bg-black bg-opacity-40"
            />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ y: '100%', opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto p-6 shadow-premium border-t sm:border border-slate-150 flex flex-col gap-4 pointer-events-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
                    🎟️ Select Coupon Code
                  </h3>
                  <button onClick={() => setShowCouponsDrawer(false)} className="text-slate-400 border-0 bg-transparent cursor-pointer">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {couponError && (
                  <p className="text-coral text-xs font-bold bg-coral-light p-2.5 rounded-xl border border-coral/10 leading-snug">
                    {couponError}
                  </p>
                )}

                {/* Coupon list */}
                <div className="flex flex-col gap-3">
                  {availableCoupons.map((promo) => (
                    <div key={promo.code} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="border-2 border-dashed border-teal/40 bg-white text-teal text-xs font-black px-3 py-1 rounded-lg">
                          {promo.code}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide">
                          {promo.desc}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleApplyCoupon(promo)}
                        className="px-4 py-2 bg-forest hover:bg-forest-dark text-white text-xs font-black rounded-xl shadow-sm border-0 cursor-pointer"
                      >
                        APPLY
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
