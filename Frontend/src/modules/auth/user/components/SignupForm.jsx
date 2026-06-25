import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSmartphone } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../schemas/auth.schema';

export default function SignupForm({ onSendOtp, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const onValidSubmit = (data) => {
    onSendOtp({ phone: data.phone, name: data.name, email: data.email, password: data.password });
  };

  return (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      onSubmit={handleSubmit(onValidSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Full Name</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FiUser className="text-sm" />
          </span>
          <input
            id="customer-signup-fullname"
            type="text"
            required
            placeholder="Enter your name"
            {...register('name')}
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.name ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium`}
          />
        </div>
        {errors.name && <p className="text-coral text-xs font-bold px-1">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Email Address</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FiMail className="text-sm" />
          </span>
          <input
            id="customer-signup-email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium`}
          />
        </div>
        {errors.email && <p className="text-coral text-xs font-bold px-1">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Password</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FiLock className="text-sm" />
          </span>
          <input
            id="customer-signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Min. 6 characters"
            {...register('password')}
            className={`w-full pl-10 pr-10 py-3 bg-slate-50 border ${errors.password ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
          </button>
        </div>
        {errors.password && <p className="text-coral text-xs font-bold px-1">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Mobile Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-slate-500 font-bold text-sm border-r border-slate-200 pr-2.5 mr-1 flex items-center gap-1.5">
              <FiSmartphone className="text-slate-400 shrink-0 text-sm" />
              <span>+91</span>
            </span>
          </div>
          <input
            id="customer-signup-phone"
            type="tel"
            required
            maxLength={10}
            placeholder="Enter 10-digit number"
            {...register('phone', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
              }
            })}
            className={`w-full pl-22 pr-4 py-3 bg-slate-50 border ${errors.phone ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium font-mono`}
          />
        </div>
        {errors.phone && <p className="text-coral text-xs font-bold px-1">{errors.phone.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-sm text-sm font-black transition-all border-0 cursor-pointer flex items-center justify-center min-h-[48px]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>REGISTER</span>
        )}
      </button>
    </motion.form>
  );
}
