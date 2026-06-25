import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSmartphone } from 'react-icons/fi';

export default function SignupForm({ onSendOtp, loading }) {
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    const val = e.target.value;
    setUserName(val);
    
    // Live validation
    if (/[0-9]/.test(val)) {
      setErrors(prev => ({ ...prev, name: 'Name cannot contain numbers' }));
    } else if (/[^a-zA-Z\s]/.test(val)) {
      setErrors(prev => ({ ...prev, name: 'Name cannot contain special characters' }));
    } else if (val && val.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmailAddress(val);
    
    // Live validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhoneNumber(val);
    
    if (val && val.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number must be 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    
    if (val && val.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!userName || userName.trim().length < 2) {
      newErrors.name = 'Please enter a valid full name';
    } else if (/[^a-zA-Z\s]/.test(userName)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailAddress && !emailRegex.test(emailAddress)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSendOtp({ phone: phoneNumber, name: userName, email: emailAddress, password });
  };

  return (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      onSubmit={handleSubmit}
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
            value={userName}
            onChange={handleNameChange}
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.name ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium`}
          />
        </div>
        {errors.name && <p className="text-coral text-xs font-bold px-1">{errors.name}</p>}
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
            value={emailAddress}
            onChange={handleEmailChange}
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium`}
          />
        </div>
        {errors.email && <p className="text-coral text-xs font-bold px-1">{errors.email}</p>}
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
            value={password}
            onChange={handlePasswordChange}
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
        {errors.password && <p className="text-coral text-xs font-bold px-1">{errors.password}</p>}
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
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`w-full pl-22 pr-4 py-3 bg-slate-50 border ${errors.phone ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium font-mono`}
          />
        </div>
        {errors.phone && <p className="text-coral text-xs font-bold px-1">{errors.phone}</p>}
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
