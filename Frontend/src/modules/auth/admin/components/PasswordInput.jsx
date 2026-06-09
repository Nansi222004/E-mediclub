import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({ 
  label, 
  placeholder = "Enter your password", 
  error, 
  register,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
          {label} {required && <span className="text-coral">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
          <FiLock className="text-base" />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...(register ? register : {})}
          className={`w-full pl-10 pr-10 py-3 bg-slate-50 border ${
            error ? 'border-coral focus:border-coral focus:ring-coral-light' : 'border-slate-100 focus:border-teal focus:ring-teal-light'
          } rounded-2xl text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 placeholder:text-slate-400`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
        </button>
      </div>
      {error && (
        <span className="text-coral text-[10px] font-black uppercase tracking-wide leading-none pl-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
