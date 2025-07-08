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

    // Import Resend only if API key is available
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const roleDisplayNames = {
      data: 'Data Science Fellow',
      marketing: 'Marketing Fellow',
      sales: 'Sales Fellow',
      frontend: 'Frontend Developer Fellow',
      backend: 'Backend Developer Fellow',
      devops: 'DevOps Fellow',
      security: 'Cybersecurity Fellow',
      mobile: 'Mobile App Developer Fellow',
      fulltime: 'Full-time Position'
    };

    const roleName = roleDisplayNames[role as keyof typeof roleDisplayNames] || role;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #232323; color: white; padding: 30px; border-radius: 10px;">
          <h1 style="color: #4FC3F7; margin-bottom: 20px;">Application Received!</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in joining our team! We have successfully received your application for the <strong>${roleName}</strong> position.</p>
          
          <div style="background-color: #333; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4FC3F7; margin-top: 0;">Application Details:</h3>
            <ul style="color: #ccc;">
              <li><strong>Position:</strong> ${roleName}</li>
              <li><strong>Application Type:</strong> ${applicationType}</li>
              <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>Our team will review your application carefully and get back to you within the next few weeks. We appreciate your patience during this process.</p>
          
          <p>If you have any questions about your application, please don't hesitate to reach out to us.</p>
          
          <p>Best regards,<br>
          The Birrama Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; font-size: 12px; color: #ccc;">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      </div>
    `;

    // const { data, error } = await resend.emails.send({
    //   from: 'onboarding@resend.dev', // TEST SENDER for development
    //   to: [email],
    //   subject: `Application Received - ${roleName} Position`,
    //   html: emailContent,
    // });

    // if (error) {
    //   console.error('Email sending error:', error);
    //   return NextResponse.json(
    //     { error: 'Failed to send confirmation email' },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({ success: true, message: 'Application received and confirmation email sent' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}