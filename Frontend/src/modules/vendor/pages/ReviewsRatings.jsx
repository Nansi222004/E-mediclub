import React, { useState, useEffect } from 'react';
import { 
  FiStar, FiMessageSquare, FiCornerDownRight, FiSend, FiCheckCircle 
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import apiClient from '../../../shared/services/apiClient';

export default function ReviewsRatings() {
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState(null);
  
  // Reply states
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/labs/vendor/profile');
      setLab(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePostReply = async (e, reviewId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await apiClient.post(`/api/labs/vendor/reviews/${reviewId}/reply`, { replyText });
      setSuccessMsg("Reply posted successfully.");
      setActiveReviewId(null);
      setReplyText("");
      fetchProfile();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const reviews = lab?.reviews || [];
  const averageRating = lab?.rating || 5.0;
  const reviewsCount = lab?.reviewsCount || reviews.length;

  // Calculate distribution
  const distribution = [0, 0, 0, 0, 0]; // 1 to 5 star count
  reviews.forEach(r => {
    const starIdx = Math.min(4, Math.max(0, Math.floor(r.rating) - 1));
    distribution[starIdx]++;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Reviews & Ratings</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review patient satisfaction levels, rating stars, and reply to comments.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold animate-fadeIn">
          ✔️ {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main review log */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-2.5">Recent Customer Comments</h3>
            
            {reviews.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-xs text-slate-400 font-bold uppercase">No patient comments registered yet.</div>
            ) : (
              reviews.map(r => (
                <div key={r._id} className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-premium flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs text-slate-800 font-black">{r.patientName}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FaStar key={i} size={10} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/40">{r.reviewText}</p>

                  {r.replyText ? (
                    <div className="ml-6 p-3 bg-teal-light/10 border border-teal/10 rounded-2xl flex gap-2.5 items-start text-xs font-semibold text-slate-600 animate-fadeIn">
                      <FiCornerDownRight className="text-teal text-sm shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-[10px] text-teal uppercase tracking-wider block mb-0.5">Laboratory Reply:</span>
                        <p className="leading-relaxed">{r.replyText}</p>
                      </div>
                    </div>
                  ) : activeReviewId === r._id ? (
                    <form onSubmit={(e) => handlePostReply(e, r._id)} className="ml-6 flex flex-col gap-2.5 animate-slideUp">
                      <textarea 
                        rows="2"
                        placeholder="Write your professional response reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => setActiveReviewId(null)}
                          className="px-3.5 py-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-1.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm flex items-center gap-1"
                        >
                          <FiSend /> Submit Reply
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button 
                      onClick={() => { setActiveReviewId(r._id); setReplyText(""); }}
                      className="ml-6 self-start text-teal hover:underline text-[10px] font-black uppercase tracking-widest bg-transparent border-0 cursor-pointer flex items-center gap-1 mt-1"
                    >
                      <FiMessageSquare /> Reply to review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Rating distribution sidebar */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium flex flex-col gap-5 self-start">
            <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b border-slate-50 pb-2">Feedback Summary</h3>
            
            <div className="flex items-center gap-4 py-2 justify-center">
              <div className="text-center">
                <strong className="text-3xl font-black text-[#135A5A] block leading-none">{averageRating.toFixed(1)}</strong>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">Out of 5 Stars</span>
              </div>
              <div className="w-px h-12 bg-slate-100" />
              <div className="text-center">
                <strong className="text-xl font-black text-slate-800 block leading-none">{reviewsCount}</strong>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 block">Total reviews</span>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="flex flex-col gap-2">
              {distribution.map((count, idx) => {
                const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="w-12 text-right shrink-0">{idx + 1} Star</span>
                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-200/50">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-slate-700 font-black">{percentage}%</span>
                  </div>
                );
              }).reverse()}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
