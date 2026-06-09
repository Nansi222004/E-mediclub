import React from 'react';

export default function AuthInput({ 
  label, 
  type = "text", 
  placeholder, 
  error, 
  icon: Icon,
  register,
  required = false
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
          {label} {required && <span className="text-coral">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Icon className="text-base" />
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...(register ? register : {})}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 bg-slate-50 border ${
            error ? 'border-coral focus:border-coral focus:ring-coral-light' : 'border-slate-100 focus:border-teal focus:ring-teal-light'
          } rounded-2xl text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 placeholder:text-slate-400`}
        />
      </div>
      {error && (
        <span className="text-coral text-[10px] font-black uppercase tracking-wide leading-none pl-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
