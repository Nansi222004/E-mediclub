import { useState } from 'react';
import { FiStar, FiFilter, FiSearch, FiMessageSquare } from 'react-icons/fi';

export default function DoctorVendorReviews() {
  const [reviews] = useState([
    { id: 1, user: 'Rahul Sharma', rating: 5, date: '2 days ago', comment: 'Dr. John is very patient and explains the diagnosis clearly.', type: 'Online Call' },
    { id: 2, user: 'Priya K.', rating: 4, date: '1 week ago', comment: 'Good consultation, but the waiting time in the clinic was a bit long.', type: 'In-Clinic' },
    { id: 3, user: 'Amit Verma', rating: 5, date: '2 weeks ago', comment: 'Excellent doctor! The prescribed medicines worked perfectly.', type: 'Online Call' }
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Reviews & Ratings</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor patient feedback and respond to reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-4xl font-black text-slate-800 mb-2">4.8</div>
          <div className="flex items-center text-amber-400 mb-2">
            <FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:col-span-2 shadow-sm flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-12">{star} Stars</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 5 : 0}%` }}></div>
              </div>
              <span className="text-xs font-bold text-slate-400 w-8">{star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '5%' : '0%'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex flex-col">
          {reviews.map(review => (
            <div key={review.id} className="p-5 sm:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex flex-col sm:w-48 shrink-0">
                <span className="text-sm font-black text-slate-800">{review.user}</span>
                <span className="text-xs font-bold text-slate-400 mt-1">{review.date}</span>
                <span className="inline-block mt-3 px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg w-fit">
                  {review.type}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center text-amber-400 text-sm">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark transition-colors border-0 bg-transparent cursor-pointer">
                    <FiMessageSquare /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
