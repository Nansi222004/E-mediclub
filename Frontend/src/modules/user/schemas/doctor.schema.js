import { z } from 'zod';

export const doctorBookingSchema = z.object({
  patientName: z.string().min(2, 'Patient Name is required (min 2 chars)').max(100).regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  patientAge: z.coerce.number().int().min(1, 'Age must be at least 1').max(120, 'Invalid Age'),
  preferredTime: z.string().min(1, 'Time slot is required'),
  consultationType: z.enum(['Online Consultation', 'Offline / In-Person Consultation']),
  additionalNotes: z.string().optional()
});
