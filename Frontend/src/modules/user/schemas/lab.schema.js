import { z } from 'zod';

export const labBookingPatientSchema = z.object({
  patientName: z.string().min(2, 'Patient Name is required (min 2 chars)').max(100).regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  patientAge: z.coerce.number().int().min(1, 'Age must be at least 1').max(120, 'Invalid Age'),
  patientGender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  patientPhone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit Phone number is required'),
  doctorName: z.string().optional(),
  doctorRegNo: z.string().optional(),
});
