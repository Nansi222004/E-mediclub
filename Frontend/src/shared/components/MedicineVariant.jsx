import React, { useEffect } from 'react';

export const getVariantsForProduct = (product) => {
  const name = (product.name || '').toLowerCase();
  const packSize = (product.packSize || '').toLowerCase();
  const basePrice = product.price || 0;
  const baseDiscountPrice = product.discountPrice || null;

  let variants = [];

  const createVariant = (label, factor) => {
    const price = Math.round(basePrice * factor);
    const discountPrice = baseDiscountPrice ? Math.round(baseDiscountPrice * factor) : null;
    return { label, price, discountPrice, factor };
  };

  if (
    name.includes('syrup') ||
    name.includes('tonic') ||
    name.includes('liquid') ||
    name.includes('wash') ||
    name.includes('shampoo') ||
    name.includes('spray') ||
    packSize.includes('ml') ||
    packSize.includes('bottle')
  ) {
    variants = [
      createVariant('50 ml', 0.6),
      createVariant('100 ml', 1.0),
      createVariant('200 ml', 1.8),
      createVariant('500 ml', 4.0)
    ];
  } else if (
    name.includes('tablet') ||
    name.includes('capsule') ||
    name.includes('strip') ||
    name.includes('pill') ||
    packSize.includes('tablet') ||
    packSize.includes('capsule') ||
    packSize.includes('strip')
  ) {
    variants = [
      createVariant('1 Strip (10 tabs)', 1.0),
      createVariant('Pack of 3 (30 tabs)', 2.7),
      createVariant('Family Box (60 tabs)', 5.0)
    ];
  } else if (
    name.includes('powder') ||
    name.includes('cream') ||
    name.includes('gel') ||
    name.includes('ointment') ||
    packSize.includes(' g') ||
    packSize.includes('gram') ||
    packSize.includes('kg')
  ) {
    variants = [
      createVariant('15 g', 0.5),
      createVariant('50 g', 1.0),
      createVariant('100 g', 1.8),
      createVariant('250 g', 4.0)
    ];
  } else {
    variants = [
      createVariant('Single Pack', 1.0),
      createVariant('Pack of 2', 1.95),
      createVariant('Economy Pack (Pack of 5)', 4.5)
    ];
  }

  return variants;
};

export default function MedicineVariant({ product, selectedVariant, onChange }) {
  const variants = React.useMemo(() => getVariantsForProduct(product), [product]);

  useEffect(() => {
    if (!selectedVariant && variants.length > 0) {
      const defaultVar = variants.find(v => v.factor === 1.0) || variants[0];
      onChange(defaultVar);
    }
  }, [variants, selectedVariant, onChange]);

  if (variants.length <= 1) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Select Size / Pack</span>
      <select
        value={selectedVariant ? selectedVariant.label : ''}
        onChange={(e) => {
          const selected = variants.find(v => v.label === e.target.value);
          if (selected) onChange(selected);
        }}
        className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl px-3 py-2 text-[11px] font-extrabold text-slate-700 outline-none focus:border-forest/20 transition-all cursor-pointer min-h-[40px]"
      >
        {variants.map((v) => (
          <option key={v.label} value={v.label}>
            {v.label} (₹{v.discountPrice || v.price})
          </option>
        ))}
      </select>
    </div>
  );
}
