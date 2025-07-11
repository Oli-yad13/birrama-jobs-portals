import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, role, applicationType } = await request.json();

    if (!name || !email || !role || !applicationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here') {
      // API key not configured, return success but log that email wasn't sent
      console.log(`Email confirmation would be sent to ${email} for ${role} application (API key not configured)`);
      return NextResponse.json({ 
        success: true, 
        message: 'Application received (email confirmation not configured)' 
      });
    }

    // Send confirmation email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'jobs@birrama.et',
        to: email,
        subject: `Your ${applicationType} Application Received`,
        html: `<p>Dear ${name},</p><p>Thank you for applying for the ${role} ${applicationType} position. We have received your application and will review it soon.</p><p>Best regards,<br/>Birrama Team</p>`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Application received and confirmation email sent' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}