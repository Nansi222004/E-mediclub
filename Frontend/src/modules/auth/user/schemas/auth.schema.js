import { z } from 'zod';

export const userSignupSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  phone: z.string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Mobile number can only contain digits"),
});

export const userLoginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or phone number"),
});

export const resetPasswordSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const modalLoginSchema = z.object({
  phone: z.string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Mobile number can only contain digits"),
});

export const modalOtpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits").regex(/^[0-9]+$/, "OTP must be digits"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").or(z.literal('')),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.coerce.number().min(1, "Age must be valid").max(120, "Age must be valid").or(z.literal('')),
});

export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().length(10, "Phone number must be 10 digits"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  flat: z.string().min(1, "Required"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a star rating"),
  emojiFeedback: z.string().min(1, "Please select an emoji feedback"),
  reviewTitle: z.string().min(1, "Title is required"),
  reviewText: z.string().min(1, "Review text is required"),
});
