import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { appointmentSchema } from '@/lib/validations';
import { BRAND } from '@/lib/config';
import { rateLimiter } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Get the base URL for the site (works in both dev and production)
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export async function POST(request: Request) {
  try {
    // ============================================
    // 1. RATE LIMITING (Stops spam bots)
    // ============================================
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await rateLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // ============================================
    // 2. ORIGIN CHECK (Security)
    // ============================================
    const origin = request.headers.get('origin');
    const baseUrl = getBaseUrl();
    const allowedOrigins = [
      baseUrl,
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean) as string[];

    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // ============================================
    // 3. VALIDATE INPUT
    // ============================================
    const body = await request.json();
    const validated = appointmentSchema.parse(body);

    // ============================================
    // 4. SAVE TO DATABASE
    // ============================================
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([{ 
        name: validated.name, 
        email: validated.email, 
        phone: validated.phone, 
        date_time: validated.dateTime,
        message: validated.message || null
      }]);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json(
        { error: 'Database error. Please call us directly.' },
        { status: 500 }
      );
    }

    // ============================================
    // 5. SEND EMAILS IN THE BACKGROUND
    // ============================================
    const formattedPhone = BRAND.emergencyPhone;
    const formattedDateTime = new Date(validated.dateTime).toLocaleString();

    // Email 1: To the plumber (internal notification)
    resend.emails.send({
      from: `${BRAND.name} <onboarding@resend.dev>`,
      to: [BRAND.email],
      subject: `📅 New Appointment Booking from ${validated.name}`,
      html: `
        <h2>New Appointment Request</h2>
        <p><strong>Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <p><strong>Phone:</strong> ${validated.phone}</p>
        <p><strong>Requested Time:</strong> ${formattedDateTime}</p>
        <p><strong>Notes:</strong> ${validated.message || 'None'}</p>
        <hr />
        <p>Please confirm this slot with the client.</p>
        <p><strong>Client email:</strong> ${validated.email}</p>
      `,
    }).catch(err => console.error('Plumber email failed:', err));

    // Email 2: Auto-reply to the customer (confirmation)
    resend.emails.send({
      from: `${BRAND.name} <onboarding@resend.dev>`,
      to: [validated.email],
      subject: `📅 Appointment Confirmation – ${validated.name}`,
      html: `
        <h2>We've received your appointment request</h2>
        <p>Hi ${validated.name},</p>
        <p>We will review your preferred time and send you a confirmation shortly.</p>
        <p><strong>Requested time:</strong> ${formattedDateTime}</p>
        <p>If you need immediate assistance, call our emergency line: <a href="tel:${formattedPhone}">${formattedPhone}</a></p>
        <p style="color: #666; font-size: 0.9rem;">- The ${BRAND.name} Team</p>
      `,
    }).catch(err => console.error('Customer auto-reply failed:', err));

    // ============================================
    // 6. RESPOND TO USER
    // ============================================
    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully. We will confirm your slot shortly.' 
    });
    
  } catch (error) {
    console.error('Appointment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment. Please call us directly.' },
      { status: 500 }
    );
  }
}