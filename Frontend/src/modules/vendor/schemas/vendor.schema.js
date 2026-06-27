import { z } from 'zod';

export const labSignupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  labName: z.string().min(2, 'Lab Name must be at least 2 characters'),
  nablNumber: z.string().optional(),
  regNumber: z.string().regex(/^[A-Z0-9]+$/, 'Registration No. can only contain uppercase letters and numbers'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().regex(/^[a-zA-Z\s]+$/, 'City can only contain letters and spaces'),
  state: z.string().regex(/^[a-zA-Z\s]+$/, 'State can only contain letters and spaces'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
  serviceablePincodes: z.string().regex(/^(\d{6})(,\s*\d{6})*$/, 'Enter valid 6-digit pincodes separated by commas'),
  homeCollectionRadius: z.coerce.number().min(1, 'Radius must be greater than 0').optional(),
  homeCollection: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const doctorSignupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s.]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  regNumber: z.string().min(1, 'Registration Number is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  experience: z.coerce.number().min(0, 'Experience must be a valid number'),
  consultationType: z.enum(['Online Only', 'In-Clinic Only', 'Both']),
  fee: z.coerce.number().min(0, 'Fee must be a valid number'),
  clinicName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const pharmacySignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  storeName: z.string().min(2, 'Store Name must be at least 2 characters'),
  drugLicenseNumber: z.string().min(1, 'Drug License Number is required'),
  gstNumber: z.string().length(15, '15-character GST number is required').regex(/^[A-Z0-9]+$/, 'GST can only contain uppercase letters and numbers'),
  pharmacistRegistrationNumber: z.string().min(1, 'Pharmacist Registration Number is required'),
  landmark: z.string().optional(),
  googleMapsLocation: z.string().optional(),
  openingHour: z.string(),
  openingMinute: z.string(),
  openingAmpm: z.string(),
  closingHour: z.string(),
  closingMinute: z.string(),
  closingAmpm: z.string(),
  deliveryRadius: z.coerce.number().min(1, 'Radius must be at least 1 KM'),
  homeDelivery: z.boolean().optional(),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().regex(/^[a-zA-Z\s]+$/, 'City can only contain letters and spaces'),
  state: z.string().regex(/^[a-zA-Z\s]+$/, 'State can only contain letters and spaces'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const vendorLoginSchema = z.object({
  email: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
