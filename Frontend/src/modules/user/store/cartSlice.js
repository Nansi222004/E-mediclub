import { createSlice, current } from '@reduxjs/toolkit';

const storedCart = localStorage.getItem('em_cart') ? JSON.parse(localStorage.getItem('em_cart')) : {
  items: [], // { id, name, type: 'medicine'|'labtest'|'doctor', price, discountPrice, qty, image, subtitle, details }
  coupon: null, // { code, discountPercent, discountFlat, minOrder }
  deliveryFee: 49,
  addressId: 1
};

const initialState = storedCart;

// Calculate helper for totals
const recomputeTotals = (state) => {
  let subtotal = 0;
  let savings = 0;
  
  state.items.forEach(item => {
    const basePrice = item.price || 0;
    const finalPrice = item.discountPrice || basePrice;
    subtotal += finalPrice * item.qty;
    savings += (basePrice - finalPrice) * item.qty;
  });

  state.subtotal = subtotal;
  state.savings = savings;

  // Free delivery for orders above 500
  if (subtotal >= 500 || subtotal === 0) {
    state.deliveryFee = 0;
  } else {
    state.deliveryFee = 49;
  }

  // Calculate Coupon discount
  let discountValue = 0;
  if (state.coupon) {
    const { discountPercent, discountFlat, minOrder } = state.coupon;
    if (subtotal >= (minOrder || 0)) {
      if (discountPercent) {
        discountValue = Math.round((subtotal * discountPercent) / 100);
      } else if (discountFlat) {
        discountValue = discountFlat;
      }
    } else {
      // Remove coupon if condition is no longer met
      state.coupon = null;
    }
  }

  state.couponDiscount = discountValue;
  state.total = Math.max(0, subtotal + state.deliveryFee - discountValue);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload; // { id, name, type, price, discountPrice, image, ... }
      const existing = state.items.find(item => item.id === newItem.id && item.type === newItem.type);
      
      if (existing) {
        existing.qty += (newItem.qty || 1);
      } else {
        state.items.push({ ...newItem, qty: newItem.qty || 1 });
      }
      
      recomputeTotals(state);
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    removeFromCart: (state, action) => {
      const { id, type } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.type === type));
      recomputeTotals(state);
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    updateQuantity: (state, action) => {
      const { id, type, change } = action.payload;
      const existing = state.items.find(item => item.id === id && item.type === type);
      if (existing) {
        existing.qty += change;
        if (existing.qty <= 0) {
          state.items = state.items.filter(item => !(item.id === id && item.type === type));
        }
      }
      recomputeTotals(state);
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload; // { code, discountPercent, discountFlat, minOrder }
      recomputeTotals(state);
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    removeCoupon: (state) => {
      state.coupon = null;
      recomputeTotals(state);
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    setCartAddress: (state, action) => {
      state.addressId = action.payload;
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.deliveryFee = 49;
      state.subtotal = 0;
      state.savings = 0;
      state.couponDiscount = 0;
      state.total = 0;
      localStorage.setItem('em_cart', JSON.stringify(current(state)));
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  setCartAddress,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
export { recomputeTotals };
