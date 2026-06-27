import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  addressLine1: z.string().min(5, 'Address is required (min 5 chars)'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^[0-9]{6}$/, 'Valid 6-digit Pincode is required'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit Phone is required'),
  country: z.string().default('India')
});
