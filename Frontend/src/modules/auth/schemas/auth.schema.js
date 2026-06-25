import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
});

export const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const otpSchema = z.object({
  otp: z.string().length(4, 'OTP must be exactly 4 digits')
});
