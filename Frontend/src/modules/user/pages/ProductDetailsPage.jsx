import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiStar, FiShoppingBag, FiTruck, FiShield, FiAlertTriangle, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { addToCart, updateQuantity } from '../store/cartSlice';
import ProductCard from '../../../shared/components/ProductCard';

const getSpecsFallback = (product) => {
  if (!product) return {};
  const name = (product.name || '').toLowerCase();
  
  // 1. Paracetamol / Dolo / Crocin
  if (name.includes('dolo') || name.includes('paracetamol') || name.includes('crocin') || name.includes('calpol')) {
    return {
      composition: 'Paracetamol IP 650 mg',
      benefits: 'Effective for symptomatic relief from mild-to-moderate pain and high fever. Commonly used for headaches, muscle aches, backaches, arthritis, toothaches, colds, and minor fevers.',
      dosage: 'Take 1 tablet every 4-6 hours as needed. Do not exceed 4 tablets (4000 mg) in any 24-hour period. Best consumed after meals with water.',
      warnings: 'Liver warning: Consuming more than maximum daily dose may cause serious liver damage or allergic reactions (swelling of face, mouth, throat, breathing difficulty, itching or rash).'
    };
  }
  
  // 2. Metformin / Glycomet (Diabetes)
  if (name.includes('metformin') || name.includes('glycomet') || name.includes('glucophage') || name.includes('glipizide')) {
    return {
      composition: 'Metformin Hydrochloride IP 500 mg / 1000 mg',
      benefits: 'Indicated for type 2 diabetes mellitus to improve glycemic control in adults. Helps increase insulin sensitivity and lower glucose production by the liver.',
      dosage: 'Typically initiated at 500 mg twice daily or 850 mg once daily, taken with meals to reduce gastrointestinal side effects. Adjust dosage under doctor instruction.',
      warnings: 'Lactic Acidosis: A rare but serious metabolic complication. Avoid heavy alcohol intake while on this medication. Discontinue temporarily before contrast imaging studies.'
    };
  }
  
  // 3. Lipitor / Atorvastatin / Atorva (Cholesterol)
  if (name.includes('atorvastatin') || name.includes('lipitor') || name.includes('atorva') || name.includes('rosuvastatin')) {
    return {
      composition: 'Atorvastatin Calcium IP 10 mg / 20 mg',
      benefits: 'Helps lower LDL (bad cholesterol) and triglycerides while raising HDL (good cholesterol). Reduces risk of stroke, heart attack, and other cardiovascular complications.',
      dosage: 'Usually taken once daily at any time of day, with or without food. Swallow the tablet whole with a glass of water. Try to take it at the same time each day.',
      warnings: 'Contraindicated in pregnancy or active liver disease. Report any unexplained muscle pain, tenderness, or weakness immediately to your healthcare provider.'
    };
  }

  // 4. Revital / Multivitamins / Supradyn / Zincovit
  if (name.includes('revital') || name.includes('vitamin') || name.includes('multivitamin') || name.includes('zincovit') || name.includes('supradyn') || name.includes('calcium')) {
    return {
      composition: 'Ginseng Extract, Vitamins A, B-Complex, C, D3, E, Zinc, Iron, Magnesium, and essential minerals.',
      benefits: 'Boosts daily energy levels, fights fatigue, and improves physical stamina. Strengthens the immune system, promotes healthy cognitive functions, and supports bone health.',
      dosage: 'Take 1 capsule/tablet daily with a glass of water, preferably after breakfast or lunch. Do not consume on an empty stomach.',
      warnings: 'Keep out of reach of children. Consult your doctor if you are pregnant, nursing, or have a chronic medical condition (e.g. chronic kidney disease).'
    };
  }

  // 5. Chyawanprash / Ayurveda / Ashwagandha / Neem
  if (name.includes('chyawanprash') || name.includes('dabur') || name.includes('ashwagandha') || name.includes('neem') || name.includes('giloy') || name.includes('triphala') || name.includes('patanjali') || name.includes('himalaya')) {
    return {
      composition: 'Amala (Indian Gooseberry), Ashwagandha, Giloy, Pippali, Shatavari, Cardamom, Honey, and over 40 potent Ayurvedic herbs.',
      benefits: 'Traditional Ayurvedic Rasayana that builds natural immunity, improves respiratory health, aids digestion, and rejuvenates overall energy levels.',
      dosage: 'Adults: 1-2 teaspoons twice daily. Children (above 3 years): 1/2 teaspoon daily. Best taken with warm milk or water in the morning.',
      warnings: 'Contains sugar; diabetic patients should opt for sugar-free variants. Consult an Ayurvedic physician if you have chronic acidity or high blood sugar.'
    };
  }

  // 6. Cold & Flu / Cough syrup / Alexa / Benadryl
  if (name.includes('cough') || name.includes('alex') || name.includes('benadryl') || name.includes('sinus') || name.includes('cetirizine') || name.includes('allegra') || name.includes('flu') || name.includes('spray')) {
    return {
      composition: 'Dextromethorphan HBr, Phenylephrine HCl, Chlorpheniramine Maleate',
      benefits: 'Provides prompt relief from dry cough, nasal congestion, runny nose, watery eyes, and sneezing associated with common cold or respiratory allergies.',
      dosage: 'Take 5 ml to 10 ml 3-4 times a day or as directed by your physician. Use the measuring cup provided in the packaging.',
      warnings: 'May cause drowsiness or dizziness. Avoid driving or operating heavy machinery after consumption. Keep away from alcohol intake.'
    };
  }

  // Default Fallback
  return {
    composition: product.composition || 'Active Pharmaceutical Ingredients (API) mapped dynamically.',
    benefits: product.benefits || 'Indicated for symptomatic treatment and clinical therapy. Promotes therapeutic relief and recovery from relevant physiological disorders.',
    dosage: product.dosage || 'Take as advised by your healthcare practitioner. Swallow whole; do not crush, chew, or break. Ensure proper adherence to scheduled timings.',
    warnings: product.warnings || 'For clinical pharmacy use. Consult your physician prior to usage if pregnant, nursing, or having active hepatic/renal history.'
  };
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const { medicines } = useSelector(state => state.products);
  const cartItems = useSelector(state => state.cart.items);

  // States
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null); // 'success' | 'fail' | null

  // Find product by id
  const product = medicines.find(med => med.id === id) || medicines[0];
  const specs = getSpecsFallback(product);

  // Cart matching details
  const cartItem = cartItems.find(item => item.id === product.id && item.type === 'medicine');
  const qty = cartItem ? cartItem.qty : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      type: 'medicine',
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      packSize: product.packSize,
      brand: product.brand
    }));
  };

  const handleQtyChange = (change) => {
    dispatch(updateQuantity({
      id: product.id,
      type: 'medicine',
      change
    }));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setDeliveryStatus('fail');
      return;
    }
    // Mock check: pincodes starting with 4, 1, 5, or 6 are express, others are standard
    const firstDigit = pincode[0];
    if (['1', '3', '4', '5', '6', '7'].includes(firstDigit)) {
      setDeliveryStatus('success');
    } else {
      setDeliveryStatus('fail');
    }
  };

  // Select similar items
  const similarItems = medicines.filter(med => med.category === product.category && med.id !== product.id).slice(0, 3);

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      
      {/* Top back navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider w-fit border-0 bg-transparent cursor-pointer outline-none"
      >
        <FiArrowLeft className="w-4 h-4 stroke-[3px]" /> Back
      </button>

      {/* Main product showcase split grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-premium">
        
        {/* Left: Product Image */}
        <div className="w-full flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[300px] overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-80 max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Info details & add mechanics */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            {/* Category tag & manufacturer */}
            <span className="text-[10px] text-teal font-black uppercase tracking-widest block">
              {product.category}
            </span>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              BY: {product.brand}
            </p>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-2.5 mt-3">
              <div className="flex items-center gap-0.5 bg-yellow-50 text-gold-dark text-xs font-black px-2 py-0.5 rounded-lg">
                <FiStar className="fill-gold stroke-gold" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500 font-semibold">({product.reviewsCount} verified user reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-center gap-4 mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 w-fit">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 line-through font-semibold">MRP: ₹{product.price}</span>
                <span className="text-2xl font-black text-slate-900 leading-none mt-1">₹{product.discountPrice}</span>
              </div>
              {product.discountPercent > 0 && (
                <span className="bg-coral text-white text-[11px] font-black px-3 py-1 rounded-lg">
                  SAVE {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Pack details */}
            <span className="text-xs text-slate-500 font-bold block mt-3">
              Pack Size: <strong className="text-slate-800">{product.packSize}</strong>
            </span>
          </div>

          {/* Checkout controls + Express delivery check */}
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            
            {/* Dynamic Add triggers */}
            <div className="flex items-center gap-4">
              {qty > 0 ? (
                <div className="flex items-center bg-forest text-white rounded-2xl p-1 shadow-sm border border-forest min-h-[44px]">
                  <button 
                    type="button"
                    onClick={() => handleQtyChange(-1)} 
                    className="p-2.5 hover:bg-forest-dark rounded-xl transition-all outline-none border-0 bg-transparent cursor-pointer flex items-center justify-center"
                  >
                    <FiMinus className="w-4 h-4 stroke-[3px]" />
                  </button>
                  <span className="px-5 font-black text-base select-none">{qty}</span>
                  <button 
                    type="button"
                    onClick={() => handleQtyChange(1)} 
                    className="p-2.5 hover:bg-forest-dark rounded-xl transition-all outline-none border-0 bg-transparent cursor-pointer flex items-center justify-center"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3px]" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-forest hover:bg-forest-dark text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 min-h-[44px] outline-none border-0 cursor-pointer"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              )}
            </div>

            {/* Pincode Availability Checker */}
            <form onSubmit={handlePincodeCheck} className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Check Delivery Pincode</label>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-semibold outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-slate-900 text-white text-xs font-black px-4 rounded-xl hover:bg-slate-800 border-0 cursor-pointer"
                >
                  CHECK
                </button>
              </div>

              {/* Delivery checker statuses */}
              {deliveryStatus === 'success' && (
                <p className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <FiTruck /> Express shipping is active. Delivery by Today evening!
                </p>
              )}
              {deliveryStatus === 'fail' && (
                <p className="text-coral text-xs font-bold flex items-center gap-1">
                  <FiAlertTriangle /> Standard shipping only (Takes 2-3 clinical days).
                </p>
              )}
            </form>

          </div>
        </div>
      </section>

      {/* Product compositional specs */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-4 select-none">
        <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">Medicine Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600 font-semibold text-left">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salt Composition</span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{specs.composition}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Benefits & Uses</span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{specs.benefits}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recommended Dosage</span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{specs.dosage}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Safety warnings</span>
            <p className="text-coral bg-coral-light/60 p-2.5 rounded-xl border border-coral/10 flex items-start gap-1.5 font-bold">
              <FiAlertTriangle className="w-4 h-4 text-coral shrink-0 mt-0.5" />
              <span>{specs.warnings}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Similar items recommendation slider */}
      {similarItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h3 className="font-extrabold text-slate-800 text-base">Similar Products You Might Need</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {similarItems.map((med) => (
              <ProductCard key={med.id} product={med} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
