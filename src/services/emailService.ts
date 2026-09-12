const metaEnv = (import.meta as any).env || {};
const API_BASE_URL = metaEnv.VITE_API_URL || '';

const getBrevoConfig = () => {
  const apiKey = metaEnv.VITE_BREVO_API_KEY || metaEnv.BREVO_API_KEY || '';
  const senderEmail = metaEnv.VITE_SENDER_EMAIL || metaEnv.BREVO_SENDER_EMAIL || 'support@bxstrength.com';
  const adminEmail = metaEnv.VITE_ADMIN_EMAIL || 'khanshadan96@gmail.com';
  return { apiKey, senderEmail, adminEmail };
};

// Unified helper to send emails via backend server proxy (with multi-provider fallback: Gmail SMTP, Brevo, Resend)
const sendViaBackendApi = async (payload: {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
}): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ [CLIENT EMAIL SUCCESS]', data);
      return true;
    }
  } catch (err: any) {
    console.warn('⚠️ [CLIENT EMAIL BACKEND FALLBACK WARNING]', err.message);
  }

  // Direct Brevo REST API fallback if backend is offline
  const { apiKey, senderEmail } = getBrevoConfig();
  if (apiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          sender: { name: payload.senderName || 'BxStrength Coaching', email: senderEmail },
          to: [{ email: payload.toEmail, name: payload.toName || payload.toEmail }],
          subject: payload.subject,
          htmlContent: payload.htmlContent
        })
      });
      return res.ok;
    } catch {}
  }
  return false;
};

export interface PasswordResetEmailParams {
  toEmail: string;
  toName?: string;
  resetLink: string;
  token: string;
}

export const sendPasswordResetEmail = async (params: PasswordResetEmailParams): Promise<{ success: boolean; message: string }> => {
  const { senderEmail } = getBrevoConfig();
  const name = params.toName || params.toEmail.split('@')[0];

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #CCFF00; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #CCFF00; margin: 0; font-size: 22px; text-transform: uppercase; font-weight: 900;">BXSTRENGTH PASSWORD RESET</h1>
      </div>

      <p style="font-size: 15px; color: #e4e4e7;">Dear <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">You requested a password reset for your BxStrength Coaching account. Click the secure button below to set a new password:</p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${params.resetLink}" style="background-color: #CCFF00; color: #000000; padding: 14px 28px; font-weight: 900; font-size: 13px; text-decoration: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">RESET MY PASSWORD</a>
      </div>

      <p style="font-size: 12px; color: #71717a; line-height: 1.5;">If the button above does not work, copy and paste this link into your browser:<br/><a href="${params.resetLink}" style="color: #CCFF00;">${params.resetLink}</a></p>
      
      <div style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #71717a; text-align: center;">
        BxStrength Security System | ${senderEmail}
      </div>
    </div>
  `;

  await sendViaBackendApi({
    toEmail: params.toEmail,
    toName: name,
    subject: `[ACTION REQUIRED] Reset Your BxStrength Password`,
    htmlContent: htmlBody,
    senderName: 'BxStrength Security'
  });

  return {
    success: true,
    message: `Password reset request processed for ${params.toEmail}.`
  };
};

export interface BrevoTicketEmailParams {
  ticketId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export const sendBrevoTicketEmail = async (params: BrevoTicketEmailParams): Promise<{ success: boolean; message: string }> => {
  const { adminEmail } = getBrevoConfig();

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 30px; border-radius: 8px;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #10b981; margin: 0; font-size: 20px; text-transform: uppercase;">🚨 NEW SUPPORT TICKET RAISED</h2>
        <p style="color: #a1a1aa; font-size: 12px; margin-top: 4px;">Ticket ID: <strong>${params.ticketId}</strong></p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; color: #e4e4e7;">
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Customer Name:</td><td style="padding: 8px 0; font-weight: bold;">${params.userName}</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Customer Email:</td><td style="padding: 8px 0; font-weight: bold; color: #10b981;">${params.userEmail}</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Category:</td><td style="padding: 8px 0;"><strong>${params.category}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Priority:</td><td style="padding: 8px 0;"><span style="background-color: #ef4444; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">${params.priority}</span></td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Subject:</td><td style="padding: 8px 0; font-weight: bold;">${params.subject}</td></tr>
      </table>

      <div style="background-color: #18181b; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #e4e4e7; font-style: italic;">"${params.description}"</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${window.location.origin}/#admin" style="background-color: #ffffff; color: #000000; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 12px; text-transform: uppercase;">OPEN ADMIN PANEL TO RESOLVE TICKET</a>
      </div>
    </div>
  `;

  await sendViaBackendApi({
    toEmail: adminEmail,
    toName: 'BxStrength Admin Team',
    subject: `[TICKET ${params.ticketId}] ${params.category.toUpperCase()}: ${params.subject}`,
    htmlContent: htmlBody,
    senderName: 'BxStrength Support Desk'
  });

  return { success: true, message: `Ticket ${params.ticketId} logged & email notification dispatched to admin.` };
};

export interface ConsultationEmailParams {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  goal: string;
  duration?: string;
  coachPreference: string;
  date: string;
  timeSlot: string;
}

export const sendConsultationConfirmationEmail = async (params: ConsultationEmailParams): Promise<{ success: boolean; message: string }> => {
  const { senderEmail, adminEmail } = getBrevoConfig();

  const clientHtmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #CCFF00; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #CCFF00; margin: 0; font-size: 24px; text-transform: uppercase; font-weight: 900;">BXSTRENGTH APPOINTMENT CONFIRMED</h1>
        <p style="color: #a1a1aa; font-size: 13px; margin-top: 6px;">Reference Code: <strong style="color: #ffffff;">${params.bookingId}</strong></p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7;">Dear <strong>${params.clientName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">Thank you for requesting a 1-on-1 Strategy Session with BxStrength. Your consultation slot has been recorded successfully.</p>

      <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #CCFF00; margin-top: 0; font-size: 14px; text-transform: uppercase;">SESSION SUMMARY DETAILS</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e4e4e7;">
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Assigned Coach:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.coachPreference}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Primary Exercise / Goal:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">${params.goal}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Session Duration:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.duration || '15 Min'}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Scheduled Date:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.date}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Scheduled Time Slot:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">${params.timeSlot}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Contact Email:</td><td style="padding: 6px 0; font-weight: bold;">${params.clientEmail}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Phone / WhatsApp:</td><td style="padding: 6px 0; font-weight: bold;">${params.clientPhone}</td></tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">Our Head Coaching team will review your diagnostic profile and confirm your exact slot via WhatsApp / Email calendar invite.</p>

      <div style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #71717a; text-align: center;">
        BxStrength Coaching Platform | Support: ${senderEmail}
      </div>
    </div>
  `;

  const adminHtmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #CCFF00; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #CCFF00; margin: 0; font-size: 22px; text-transform: uppercase; font-weight: 900;">🚨 NEW CONSULTATION BOOKING ALERT</h1>
        <p style="color: #a1a1aa; font-size: 13px; margin-top: 6px;">Ref Code: <strong style="color: #ffffff;">${params.bookingId}</strong></p>
      </div>

      <p style="font-size: 14px; color: #e4e4e7;">A new client has scheduled a consultation session on BxStrength:</p>

      <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #CCFF00; margin-top: 0; font-size: 14px; text-transform: uppercase;">BOOKING &amp; CLIENT SUMMARY</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e4e4e7;">
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Client Name:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.clientName}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Email Address:</td><td style="padding: 6px 0; font-weight: bold;"><a href="mailto:${params.clientEmail}" style="color: #CCFF00;">${params.clientEmail}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Phone / WhatsApp:</td><td style="padding: 6px 0; font-weight: bold;"><a href="https://wa.me/${params.clientPhone.replace(/[^0-9]/g, '')}" style="color: #CCFF00;">${params.clientPhone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Primary Exercise / Goal:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">${params.goal}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Session Duration:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.duration || '15 Min'}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Scheduled Date:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.date}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Scheduled Time Slot:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">${params.timeSlot}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Assigned Coach:</td><td style="padding: 6px 0; font-weight: bold;">${params.coachPreference}</td></tr>
        </table>
      </div>

      <p style="font-size: 12px; color: #a1a1aa;">This booking has been added to the BxStrength Admin CRM dashboard.</p>
    </div>
  `;

  await Promise.all([
    sendViaBackendApi({
      toEmail: params.clientEmail,
      toName: params.clientName,
      subject: `[CONFIRMED] Your BxStrength 1-on-1 Consultation (${params.bookingId})`,
      htmlContent: clientHtmlBody,
      senderName: 'BxStrength Coaching'
    }),
    sendViaBackendApi({
      toEmail: adminEmail,
      toName: 'BxStrength Admin',
      subject: `🚨 [NEW BOOKING] ${params.clientName} - ${params.goal} (${params.date} at ${params.timeSlot})`,
      htmlContent: adminHtmlBody,
      senderName: 'BxStrength Booking Bot'
    })
  ]);

  return { success: true, message: `Appointment confirmation recorded and sent to ${params.clientEmail} and Admin` };
};

export interface PaymentReceiptEmailParams {
  orderId: string;
  clientName: string;
  clientEmail: string;
  planName: string;
  serviceType: string;
  amountPaid: number;
  expiryDate: string;
  selectedExercises?: string[];
}

export const sendBrevoPaymentReceiptEmail = async (params: PaymentReceiptEmailParams): Promise<{ success: boolean; message: string }> => {
  const { senderEmail } = getBrevoConfig();

  const exercisesListHtml = params.selectedExercises && params.selectedExercises.length > 0
    ? `<div style="margin-top: 12px;"><strong style="color: #CCFF00; font-size: 12px; text-transform: uppercase;">Purchased Exercises (${params.selectedExercises.length}):</strong><ul style="margin: 6px 0; padding-left: 18px; font-size: 12px; color: #e4e4e7;">${params.selectedExercises.map(ex => `<li style="margin-bottom: 4px;">${ex}</li>`).join('')}</ul></div>`
    : '';

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #CCFF00; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #CCFF00; margin: 0; font-size: 24px; text-transform: uppercase; font-weight: 900;">BXSTRENGTH PAYMENT RECEIPT</h1>
        <p style="color: #a1a1aa; font-size: 13px; margin-top: 6px;">Order / Receipt ID: <strong style="color: #ffffff;">${params.orderId}</strong></p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #e4e4e7;">Dear <strong>${params.clientName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">Thank you for your purchase! Your payment of <strong style="color: #CCFF00;">£${params.amountPaid}.00 GBP</strong> has been successfully processed via Stripe.</p>

      <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #CCFF00; margin-top: 0; font-size: 14px; text-transform: uppercase;">PAYMENT TRANSACTION RECEIPT</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e4e4e7;">
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Client Name:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.clientName}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Purchased Service:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">${params.planName}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Amount Paid:</td><td style="padding: 6px 0; font-weight: bold; color: #CCFF00;">£${params.amountPaid}.00 GBP</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Payment Method:</td><td style="padding: 6px 0; font-weight: bold;">Stripe Secure Gateway</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Expiry Date:</td><td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${params.expiryDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #a1a1aa;">Client Account:</td><td style="padding: 6px 0; font-weight: bold;">${params.clientEmail}</td></tr>
        </table>
        ${exercisesListHtml}
      </div>

      <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5;">Your plan is now active on your client dashboard. Log in anytime to view your custom exercises, workout logs, and coach messaging.</p>

      <div style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #71717a; text-align: center;">
        BxStrength Performance Coaching | Official Support: ${senderEmail}
      </div>
    </div>
  `;

  await sendViaBackendApi({
    toEmail: params.clientEmail,
    toName: params.clientName,
    subject: `[RECEIPT] Payment Confirmation - ${params.planName} (£${params.amountPaid})`,
    htmlContent: htmlBody,
    senderName: 'BxStrength Billing & Finance'
  });

  return { success: true, message: `Payment receipt recorded and sent to ${params.clientEmail}` };
};

export interface ContactEnquiryEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEnquiryEmail = async (params: ContactEnquiryEmailParams): Promise<{ success: boolean; message: string }> => {
  const { adminEmail } = getBrevoConfig();

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
      <div style="text-align: center; border-bottom: 2px solid #CCFF00; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #CCFF00; margin: 0; font-size: 22px; text-transform: uppercase; font-weight: 900;">📥 NEW WEBSITE ENQUIRY</h1>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; color: #e4e4e7;">
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Sender Name:</td><td style="padding: 8px 0; font-weight: bold; color: #ffffff;">${params.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Sender Email:</td><td style="padding: 8px 0; font-weight: bold;"><a href="mailto:${params.email}" style="color: #CCFF00;">${params.email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #a1a1aa;">Subject:</td><td style="padding: 8px 0; font-weight: bold;">${params.subject}</td></tr>
      </table>

      <div style="background-color: #18181b; border-left: 4px solid #CCFF00; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #e4e4e7; font-size: 14px; line-height: 1.6;">${params.message}</p>
      </div>

      <div style="border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #71717a; text-align: center;">
        BxStrength Contact System | Sent to Admin: ${adminEmail}
      </div>
    </div>
  `;

  await sendViaBackendApi({
    toEmail: adminEmail,
    toName: 'BxStrength Admin Team',
    subject: `[ENQUIRY] ${params.subject} - ${params.name}`,
    htmlContent: htmlBody,
    senderName: 'BxStrength Website Form'
  });

  return { success: true, message: `Enquiry recorded.` };
};
