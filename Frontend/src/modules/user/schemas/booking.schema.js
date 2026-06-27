import { z } from 'zod';

export const patientBookingSchema = z.object({
  patientName: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain alphabets and spaces"),
  patientAge: z.coerce.number({ invalid_type_error: "Age must be a number" })
    .int("Age must be an integer")
    .min(1, "Please enter a valid age between 1 and 120")
    .max(120, "Please enter a valid age between 1 and 120"),
  patientGender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  patientPhone: z.string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number can only contain digits"),
});
