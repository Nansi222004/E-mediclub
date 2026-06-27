import { useRef } from 'react';

export default function OtpInput({ 
  value, 
  onChange,
  error 
}) {
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...value];
    newOtp[index] = val.substring(val.length - 1);
    onChange(newOtp);

    // Auto-focus next field
    if (val && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            ref={(el) => (inputsRef.current[idx] = el)}
            value={value[idx] || ""}
            onChange={(e) => handleInputChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-14 bg-slate-50 border border-slate-100/80 focus:border-teal rounded-xl text-center text-xl font-black text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-teal-light"
          />
        ))}
      </div>
      {error && (
        <span className="text-coral text-[10px] font-black uppercase tracking-wide leading-none">
          {error}
        </span>
      )}
    </div>
  );
}
