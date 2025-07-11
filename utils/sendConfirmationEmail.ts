export async function sendConfirmationEmail(
  name: string,
  email: string,
  role: string,
  applicationType: 'Fellowship' | 'Full-time'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        role,
        applicationType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Email API error:', data.error);
      return { success: false, error: data.error || 'Failed to send confirmation email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
} 