import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiStar } from 'react-icons/fi';
import { addToCart, updateQuantity } from '../../modules/user/store/cartSlice';
import { useNavigate } from 'react-router-dom';
import MedicineVariant, { getVariantsForProduct } from './MedicineVariant';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const { isAuthenticated } = useSelector(state => state.auth || {});

  const variants = React.useMemo(() => getVariantsForProduct(product), [product]);
  const defaultVariant = React.useMemo(() => {
    return variants.find(v => v.factor === 1.0) || variants[0];
  }, [variants]);

  const [selectedVariant, setSelectedVariant] = React.useState(defaultVariant);

  // Sync selectedVariant if product changes
  React.useEffect(() => {
    setSelectedVariant(defaultVariant);
  }, [product, defaultVariant]);

  // Find if this product variant is already in the cart
  const itemId = selectedVariant ? `${product.id}-${selectedVariant.label}` : product.id;
  const cartItem = cartItems.find(item => item.id === itemId && item.type === 'medicine');
  const quantityInCart = cartItem ? cartItem.qty : 0;

  const handleAdd = (e) => {
    e.stopPropagation(); // Avoid triggering card click navigation
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    const itemPrice = selectedVariant ? selectedVariant.price : product.price;
    const itemDiscountPrice = selectedVariant ? selectedVariant.discountPrice : product.discountPrice;

    dispatch(addToCart({
      id: itemId,
      name: selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name,
      type: 'medicine',
      price: itemPrice,
      discountPrice: itemDiscountPrice,
      image: product.image,
      packSize: selectedVariant ? selectedVariant.label : product.packSize,
      brand: product.brand
    }));
  };

  const handleQtyChange = (change, e) => {
    e.stopPropagation();
    dispatch(updateQuantity({
      id: itemId,
      type: 'medicine',
      change
    }));
  };

  const navigateToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentDiscountPrice = selectedVariant ? selectedVariant.discountPrice : product.discountPrice;
  const currentDiscountPercent = (currentDiscountPrice && currentPrice)
    ? Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100)
    : product.discountPercent;

  return (
    <div
      onClick={navigateToDetails}
      className="bg-white rounded-[20px] p-3 border border-slate-100 hover:border-forest/30 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col justify-between cursor-pointer relative overflow-hidden select-none transition-all duration-300 group"
    >
      {/* Discount Badge */}
      {currentDiscountPercent > 0 && (
      <span className="absolute top-3.5 left-3.5 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-10 shadow-sm animate-pulse-subtle">
        {currentDiscountPercent}% OFF
      </span>
      )}

      {/* Product Image */}
        <div className="w-full h-[85px] sm:h-[100px] flex items-center justify-center mb-2.5 bg-slate-50/60 rounded-xl overflow-hidden p-1.5">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80'}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-[1.06] transition-transform duration-500 ease-out rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80';
            }}
          />
        </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand/Mfg */}
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5 truncate">
            {product.brand}
          </span>
          {/* Title */}
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug hover:text-forest transition-colors">
            {product.name}
          </h4>
          {/* Pack Size */}
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            {product.packSize}
          </span>

          {/* Variants Selector */}
          <div onClick={(e) => e.stopPropagation()} className="mt-1 mb-1">
            <MedicineVariant
              product={product}
              selectedVariant={selectedVariant}
              onChange={setSelectedVariant}
            />
          </div>
        </div>

        {/* Rating and Pricing Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5 bg-yellow-50 text-gold-dark text-[9px] font-black px-1.5 py-0.5 rounded">
              <FiStar className="fill-gold stroke-gold w-2.5 h-2.5" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">({product.reviewsCount})</span>
          </div>

          <div className="flex items-end justify-between gap-3 sm:gap-4">
            {/* Pricing */}
            <div className="flex flex-col min-h-[32px] justify-end">
              {currentDiscountPrice ? (
                <>
                  <span className="text-[11px] text-slate-400 line-through font-medium leading-none">
                    ₹{currentPrice}
                  </span>
                  <span className="text-base font-black text-slate-900 leading-tight mt-0.5">
                    ₹{currentDiscountPrice}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] text-transparent select-none leading-none">
                    &nbsp;
                  </span>
                  <span className="text-base font-black text-slate-900 leading-tight mt-0.5">
                    ₹{currentPrice}
                  </span>
                </>
              )}
            </div>

            <div className="relative z-10 flex items-center">
              {quantityInCart > 0 ? (
                <div className="flex items-center bg-forest text-white rounded-full overflow-hidden p-0.5 shadow-sm min-h-[32px] min-w-[76px] justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(-1, e)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-forest-dark text-white rounded-full transition-colors"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px] font-black select-none">{quantityInCart}</span>
                  <button
                    type="button"
                    onClick={(e) => handleQtyChange(1, e)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-forest-dark text-white rounded-full transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleAdd}
                  className="bg-forest hover:bg-forest-dark text-white font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 min-h-[32px] sm:min-h-[36px] min-w-[76px] sm:min-w-[84px]"
                >
                  <FiPlus className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>ADD</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
