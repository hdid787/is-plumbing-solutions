import { z } from 'zod';

export const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  description: z.string().min(10, 'Please describe the issue in more detail'),
  imageUrl: z.string().optional(),
});

export const appointmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone number is required'),
  dateTime: z.string().min(1, 'Please select a date and time'),
  message: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;