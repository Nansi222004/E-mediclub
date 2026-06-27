import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiStar, FiCamera, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '../../auth/user/schemas/auth.schema';

export default function ProductRatingsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Review states
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      emojiFeedback: '',
      reviewTitle: '',
      reviewText: ''
    }
  });

  const rating = watch('rating');
  const emojiFeedback = watch('emojiFeedback');

  const emojis = [
    { key: 'bad', symbol: '😞', label: 'Disappointed' },
    { key: 'okay', symbol: '😐', label: 'Neutral' },
    { key: 'great', symbol: '😃', label: 'Delighted' }
  ];

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/orders');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-10 font-sans select-none relative">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/orders')}
        className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-forest transition-colors mb-6 uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Main Review Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium"
      >
        <div className="border-b border-slate-100 pb-4 mb-6">
          <span className="text-[10px] text-teal font-black uppercase tracking-wider">SHARE YOUR EXPERIENCE</span>
          <h1 className="text-lg md:text-xl font-black text-slate-800 leading-tight mt-1">Rate Your Order</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Reference: <strong className="text-slate-600 font-extrabold">{orderId || 'ORD-General'}</strong></p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          {/* 1. Emoji Feedback */}
          <div className="flex flex-col items-center text-center gap-2">
            <label className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider">How do you feel about this order?</label>
            <div className="flex justify-center gap-6 mt-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji.key}
                  type="button"
                  onClick={() => setValue('emojiFeedback', emoji.key, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
                    emojiFeedback === emoji.key 
                      ? 'bg-forest-light/30 scale-110' 
                      : 'hover:bg-slate-50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-4xl">{emoji.symbol}</span>
                  <span className={`text-[10px] font-black ${emojiFeedback === emoji.key ? 'text-forest' : 'text-slate-500'}`}>{emoji.label}</span>
                </button>
              ))}
            </div>
            {errors.emojiFeedback && <p className="text-coral text-[9px] font-bold px-1 mt-1">{errors.emojiFeedback.message}</p>}
          </div>

          {/* 2. Star Ratings */}
          <div className="flex flex-col items-center text-center gap-2 border-t border-b border-slate-50 py-6">
            <label className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider">Tap to rate stars *</label>
            <div className="flex gap-2.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className="p-1 hover:scale-125 transition-transform duration-200"
                >
                  <FiStar 
                    className={`w-8 h-8 transition-all ${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-xs font-black text-forest mt-1.5 bg-forest-light/35 px-3 py-1 rounded-full uppercase tracking-wider">
                {['Disappointed', 'Needs Improvement', 'Good Quality', 'Very Pleased', 'Excellent & Sterile'][rating - 1]}
              </span>
            )}
            {errors.rating && <p className="text-coral text-[9px] font-bold px-1 mt-1">{errors.rating.message}</p>}
          </div>

          {/* 3. Review Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Review Title</label>
            <input 
              type="text"
              placeholder="Summarize your experience (e.g., Express packaging, helpful consultation)"
              {...register('reviewTitle')}
              className={`px-4 py-3 rounded-xl border ${errors.reviewTitle ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400`}
            />
            {errors.reviewTitle && <p className="text-coral text-[9px] font-bold px-1">{errors.reviewTitle.message}</p>}
          </div>

          {/* 4. Review Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Detailed Feedback</label>
            <div className="relative w-full">
              <span className="absolute top-3.5 left-3.5 text-slate-400">
                <FiMessageSquare className="w-4 h-4" />
              </span>
              <textarea 
                rows="4"
                placeholder="Share details about the packaging condition, dosage guides, delivery speed, or general clinical experience..."
                {...register('reviewText')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.reviewText ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400 resize-none`}
              />
            </div>
            {errors.reviewText && <p className="text-coral text-[9px] font-bold px-1">{errors.reviewText.message}</p>}
          </div>

          {/* 5. Upload Images (Dummy) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Add Photos / Invoices</label>
            <div className="flex flex-wrap gap-3 items-center mt-1">
              <label className="w-14 h-14 rounded-2xl border border-dashed border-slate-200 hover:border-teal bg-slate-50/50 hover:bg-slate-50 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all shrink-0">
                <FiCamera className="text-slate-400 text-lg" />
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" 
                />
              </label>

              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0 group">
                  <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-forest hover:bg-forest-dark disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer mt-2"
          >
            {isSubmitting ? 'SUBMITTING FEEDBACK...' : 'SUBMIT CLINICAL REVIEW'}
          </button>

        </form>
      </motion.div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-8 border border-slate-100 shadow-premium z-10 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                <FiCheckCircle className="stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[9px] bg-teal-light text-teal font-black px-3 py-1 rounded-full uppercase tracking-wider">FEEDBACK COMMITTED</span>
                <h3 className="text-base font-black text-slate-800 mt-4 leading-none">Thank You For Your Review!</h3>
                <p className="text-xs text-slate-400 font-semibold mt-2.5 leading-relaxed">
                  Your valuable medical rating and experience help us maintain the highest levels of quality and safety across our e-pharmacy and diagnostic centers.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
