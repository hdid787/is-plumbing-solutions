import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { quoteSchema } from '@/lib/validations';
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
    const validated = quoteSchema.parse(body);

    // ============================================
    // 4. SAVE TO DATABASE
    // ============================================
    const { error: dbError } = await supabase
      .from('quotes')
      .insert([{ 
        name: validated.name, 
        email: validated.email, 
        phone: validated.phone || null, 
        description: validated.description,
        image_url: validated.imageUrl || null 
      }]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json(
        { error: 'Database error. Please call us directly.' },
        { status: 500 }
      );
    }

    // ============================================
    // 5. SEND EMAILS IN THE BACKGROUND (Don't block the user)
    // ============================================
    const galleryUrl = `${baseUrl}/gallery`;
    const formattedPhone = BRAND.emergencyPhone;

    // Email 1: To the plumber (internal notification)
    resend.emails.send({
      from: `${BRAND.name} <onboarding@resend.dev>`,
      to: [BRAND.email],
      subject: `🚨 New Quote Request from ${validated.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <p><strong>Phone:</strong> ${validated.phone || 'Not provided'}</p>
        <p><strong>Issue:</strong> ${validated.description}</p>
        ${validated.imageUrl ? `<p><strong>Photo:</strong> <a href="${validated.imageUrl}">View Uploaded Photo</a></p>` : ''}
        <hr />
        <p>Reply to this client directly via email or phone.</p>
        <p><strong>Client email:</strong> ${validated.email}</p>
      `,
    }).catch(err => console.error('Plumber email failed:', err));

    // Email 2: Auto-reply to the customer (Builds trust!)
    resend.emails.send({
      from: `${BRAND.name} <onboarding@resend.dev>`,
      to: [validated.email],
      subject: `✅ We received your quote request, ${validated.name}!`,
      html: `
        <h2>Thank you for choosing ${BRAND.name}</h2>
        <p>Hi ${validated.name},</p>
        <p>We have received your emergency quote request. <strong>A specialist will call you back within 15 minutes.</strong></p>
        <p>In the meantime, check out our <a href="${galleryUrl}">Before & After Gallery</a> to see how we transform homes.</p>
        <hr />
        <p><strong>Urgent?</strong> Call us directly: <a href="tel:${formattedPhone}">${formattedPhone}</a></p>
        <p style="color: #666; font-size: 0.9rem;">- The ${BRAND.name} Team</p>
      `,
    }).catch(err => console.error('Customer auto-reply failed:', err));

    // ============================================
    // 6. RESPOND TO USER
    // ============================================
    return NextResponse.json({ 
      success: true, 
      message: 'Quote sent successfully. We will call you within 15 minutes.' 
    });
    
  } catch (error) {
    console.error('Quote API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please call us directly.' },
      { status: 500 }
    );
  }
}