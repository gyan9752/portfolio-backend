import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
  if (!env.smtp.user || !env.smtp.pass) {
    // Return null when SMTP is not configured
    return null;
  }
  if (!transporter) {
    const isGmail =
      !env.smtp.host ||
      env.smtp.host === 'smtp.gmail.com' ||
      env.smtp.user.endsWith('@gmail.com');

    transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user: env.smtp.user,
              pass: env.smtp.pass.replace(/\s+/g, ''), // Strip spaces from Gmail App Password
            },
            connectionTimeout: 4000,
            greetingTimeout: 4000,
            socketTimeout: 5000,
          }
        : {
            host: env.smtp.host,
            port: env.smtp.port,
            secure: env.smtp.port === 465,
            auth: {
              user: env.smtp.user,
              pass: env.smtp.pass,
            },
            connectionTimeout: 4000,
            greetingTimeout: 4000,
            socketTimeout: 5000,
          }
    );
  }
  return transporter;
}

/** 1. Automated Welcome / Thank You Email for Intro Handshake */
export async function sendWelcomeMail({ name, email }) {
  const mailer = getTransporter();
  console.log(`[Email] Preparing Welcome Email for: ${name} <${email}>`);

  if (!mailer) {
    console.log(`[Email Notice] SMTP not configured. Simulated Welcome Email sent to ${email}`);
    return true;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You for Connecting</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090e; padding: 32px 16px;">
        <tr>
          <td align="center">
            <!-- Main Card Container -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f1422; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);">
              
              <!-- Top Gradient Accent Bar -->
              <tr>
                <td height="4" style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
              </tr>

              <!-- Header Section -->
              <tr>
                <td style="padding: 40px 36px 24px 36px; text-align: left; background: radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15) 0%, transparent 70%);">
                  <div style="display: inline-block; padding: 6px 14px; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">
                    ✨ GYANVENDRA MISHRA • PORTFOLIO
                  </div>
                  <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; line-height: 1.25;">
                    Great connecting with you, ${name}! 👋
                  </h1>
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Thank you for dropping by and completing the interactive handshake gate!
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 36px;"><div style="height: 1px; background: rgba(255, 255, 255, 0.06); width: 100%;"></div></td>
              </tr>

              <!-- Main Body -->
              <tr>
                <td style="padding: 32px 36px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                  <p style="margin: 0 0 16px 0;">
                    Hi <strong style="color: #ffffff;">${name}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 16px 0;">
                    It was a real pleasure connecting with you through my portfolio intro! I truly appreciate you taking the time to explore my digital space and projects.
                  </p>

                  <p style="margin: 0 0 28px 0;">
                    Whether you'd like to collaborate on a new project, explore tech opportunities, or simply have a quick conversation, I'd love to connect!
                  </p>

                  <!-- Call to Action Buttons -->
                  <div style="margin: 32px 0 20px 0; text-align: center;">
                    <a href="https://wa.me/919026926216" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 30px; border-radius: 999px; box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35); margin: 0 6px 10px 6px;">
                      💬 Chat on WhatsApp
                    </a>
                    <a href="mailto:gyanvendram@gmail.com" target="_blank" style="display: inline-block; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15); color: #f8fafc; font-weight: 600; font-size: 14px; text-decoration: none; padding: 13px 26px; border-radius: 999px; margin: 0 6px 10px 6px;">
                      ✉️ Reply to Email
                    </a>
                  </div>

                  <!-- Quick Profile Links Card -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; margin-top: 24px;">
                    <tr>
                      <td style="padding: 16px 20px; text-align: center;">
                        <span style="font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-right: 14px;">Connect with me:</span>
                        <a href="https://github.com/gyan9752" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">GitHub</a>
                        <span style="color: #475569;">•</span>
                        <a href="https://linkedin.com" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">LinkedIn</a>
                        <span style="color: #475569;">•</span>
                        <a href="https://wa.me/919026926216" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">+91 9026926216</a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td style="padding: 24px 36px 32px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; background-color: rgba(11, 15, 25, 0.8);">
                  <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #e2e8f0;">
                    Gyanvendra Mishra
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b;">
                    Full Stack Developer • New Delhi, India
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #475569;">
                    You received this email because you connected via the intro handshake at Gyanvendra's Portfolio.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await mailer.sendMail({
      from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
      to: email,
      subject: `Thanks for connecting, ${name}! — Gyanvendra Mishra`,
      html,
    });
    console.log(`[Email Success] Welcome email delivered to ${email}`);
    return true;
  } catch (err) {
    console.error('[Email Error] Failed to send welcome mail:', err.message);
    return false;
  }
}

/** 2. Contact Form Notification (Sends confirmation to Visitor AND alert to Gyanvendra) */
export async function sendContactMail({ name, email, message }) {
  const mailer = getTransporter();
  console.log(`[Email] Processing Contact Submission from: ${name} <${email}>`);

  if (!mailer) {
    console.log(`[Email Simulated] Contact confirmation to ${email} and alert to ${env.smtp.to}`);
    return true;
  }

  // A. Confirmation Email to the VISITOR
  const visitorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Inquiry Received</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090e; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f1422; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);">
              
              <tr>
                <td height="4" style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
              </tr>

              <tr>
                <td style="padding: 36px 36px 20px 36px; text-align: left; background: radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.15) 0%, transparent 70%);">
                  <div style="display: inline-block; padding: 6px 14px; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px;">
                    ✨ GYANVENDRA MISHRA • INQUIRY RECEIVED
                  </div>
                  <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                    Thank you for reaching out, ${name}! 📨
                  </h1>
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Your message has been safely received. I will review it and get back to you shortly.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 36px;"><div style="height: 1px; background: rgba(255, 255, 255, 0.06); width: 100%;"></div></td>
              </tr>

              <tr>
                <td style="padding: 28px 36px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                  <p style="margin: 0 0 16px 0;">Hi <strong style="color: #ffffff;">${name}</strong>,</p>
                  
                  <p style="margin: 0 0 18px 0;">
                    Thank you for contacting me. Here is a copy of what you shared:
                  </p>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #3b82f6; border-radius: 0 12px 12px 0; margin: 18px 0 24px 0;">
                    <tr>
                      <td style="padding: 16px 20px; font-size: 14px; color: #e2e8f0; line-height: 1.6; font-style: italic;">
                        "${message}"
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8;">
                    If this inquiry is time-sensitive or you'd prefer an instant chat, feel free to message me directly on WhatsApp anytime!
                  </p>

                  <div style="margin: 24px 0; text-align: center;">
                    <a href="https://wa.me/919026926216" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 28px; border-radius: 999px; box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);">
                      💬 Chat on WhatsApp (+91 9026926216)
                    </a>
                  </div>

                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; margin-top: 20px;">
                    <tr>
                      <td style="padding: 14px 18px; text-align: center;">
                        <a href="https://github.com/gyan9752" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">GitHub</a>
                        <span style="color: #475569;">•</span>
                        <a href="https://linkedin.com" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">LinkedIn</a>
                        <span style="color: #475569;">•</span>
                        <a href="mailto:gyanvendram@gmail.com" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">gyanvendram@gmail.com</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; background-color: rgba(11, 15, 25, 0.8);">
                  <p style="margin: 0; font-size: 12px; color: #64748b;">
                    Gyanvendra Mishra • Full Stack Developer • New Delhi, India
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // 1. Send confirmation to Visitor
  try {
    await mailer.sendMail({
      from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
      to: email,
      subject: `Inquiry Received — Thanks for reaching out, ${name}!`,
      html: visitorHtml,
    });
    console.log(`[Email Success] Contact confirmation sent to visitor: ${email}`);
  } catch (err) {
    console.error('[Email Error] Failed to send contact confirmation to visitor:', err.message);
  }

  // 2. Send Alert Notification to Admin (Gyanvendra)
  try {
    await mailer.sendMail({
      from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
      to: env.smtp.to,
      replyTo: email,
      subject: `⚡ New Portfolio Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from Portfolio Contact Form at ${new Date().toLocaleString()}`,
    });
  } catch (err) {
    console.error('[Email Error] Failed to send admin alert:', err.message);
  }

  return true;
}

/** 3. Meeting Booking Confirmation (Sends rich confirmation to Visitor AND alert to Gyanvendra) */
export async function sendBookingConfirmationMail({ name, email, date, time, notes }) {
  const mailer = getTransporter();
  console.log(`[Email] Processing Booking Confirmation for: ${name} <${email}>`);

  if (!mailer) {
    console.log(`[Email Simulated] Booking confirmation to ${email} for ${date} @ ${time}`);
    return true;
  }

  // A. Rich HTML Confirmation to VISITOR
  const visitorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Discovery Call Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090e; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f1422; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);">
              
              <tr>
                <td height="4" style="background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
              </tr>

              <tr>
                <td style="padding: 36px 36px 20px 36px; text-align: left; background: radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.15) 0%, transparent 70%);">
                  <div style="display: inline-block; padding: 6px 14px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px;">
                    📅 1:1 DISCOVERY CALL CONFIRMED
                  </div>
                  <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                    Meeting Scheduled, ${name}! 🎉
                  </h1>
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                    Your 30-minute 1-on-1 discovery call with Gyanvendra Mishra is locked in.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 36px;"><div style="height: 1px; background: rgba(255, 255, 255, 0.06); width: 100%;"></div></td>
              </tr>

              <tr>
                <td style="padding: 28px 36px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                  <p style="margin: 0 0 18px 0;">Hi <strong style="color: #ffffff;">${name}</strong>,</p>

                  <!-- Meeting Card -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; margin: 18px 0 24px 0;">
                    <tr>
                      <td style="padding: 22px;">
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 10px; font-size: 13px; color: #94a3b8;">📅 <strong>Date:</strong></td>
                            <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff; font-weight: 600;">${date}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 10px; font-size: 13px; color: #94a3b8;">⏰ <strong>Time:</strong></td>
                            <td style="padding-bottom: 10px; font-size: 14px; color: #60a5fa; font-weight: 600;">${time} (IST)</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 10px; font-size: 13px; color: #94a3b8;">⏱️ <strong>Duration:</strong></td>
                            <td style="padding-bottom: 10px; font-size: 14px; color: #ffffff;">30 Minutes</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 10px; font-size: 13px; color: #94a3b8;">💻 <strong>Conferencing:</strong></td>
                            <td style="padding-bottom: 10px; font-size: 13px; color: #34d399;">Video call link will be shared ahead of time</td>
                          </tr>
                          ${
                            notes
                              ? `<tr>
                                  <td style="vertical-align: top; font-size: 13px; color: #94a3b8;">📝 <strong>Topic/Notes:</strong></td>
                                  <td style="font-size: 13px; color: #cbd5e1;">${notes}</td>
                                </tr>`
                              : ''
                          }
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8;">
                    Looking forward to speaking with you! If you need to reschedule or have questions before the call, feel free to connect on WhatsApp:
                  </p>

                  <div style="margin: 24px 0; text-align: center;">
                    <a href="https://wa.me/919026926216" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 13px 28px; border-radius: 999px; box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);">
                      💬 Connect on WhatsApp (+91 9026926216)
                    </a>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; background-color: rgba(11, 15, 25, 0.8);">
                  <p style="margin: 0; font-size: 12px; color: #64748b;">
                    Gyanvendra Mishra • Full Stack Developer • New Delhi, India
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // 1. Send confirmation to Visitor
  try {
    await mailer.sendMail({
      from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
      to: email,
      subject: `1:1 Discovery Call Confirmed with Gyanvendra Mishra (${date} @ ${time})`,
      html: visitorHtml,
    });
    console.log(`[Email Success] Booking confirmation sent to visitor: ${email}`);
  } catch (err) {
    console.error('[Email Error] Failed to send booking confirmation to visitor:', err.message);
  }

  // 2. Send Alert Notification to Admin (Gyanvendra)
  try {
    await mailer.sendMail({
      from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
      to: env.smtp.to,
      replyTo: email,
      subject: `⚡ New 1:1 Call Booked by ${name} (${date} @ ${time})`,
      text: `Client Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nNotes: ${notes || 'None'}\n\nBooked from Portfolio Slot Calendar at ${new Date().toLocaleString()}`,
    });
  } catch (err) {
    console.error('[Email Error] Failed to send admin booking alert:', err.message);
  }

  return true;
}

/** 4. Admin Direct Reply to Visitor from Dashboard */
export async function sendAdminReplyMail({ toEmail, toName, subject, replyMessage }) {
  const mailer = getTransporter();
  console.log(`[Email] Sending Admin Reply to: ${toName} <${toEmail}>`);

  if (!mailer) {
    console.log(`[Email Simulated] Reply sent to ${toEmail}: "${subject}"`);
    return true;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <h2 style="color: #0f172a; margin-top: 0;">Reply from Gyanvendra Mishra</h2>
      <p>Hi ${toName || 'there'},</p>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; font-size: 15px; line-height: 1.6;">
        ${replyMessage.replace(/\n/g, '<br/>')}
      </div>
      <p style="font-size: 13px; color: #64748b;">
        Best regards,<br/>
        <strong>Gyanvendra Mishra</strong><br/>
        Full Stack Developer<br/>
        Phone: +91 9026926216 | Email: gyanvendram@gmail.com
      </p>
    </div>
  `;

  await mailer.sendMail({
    from: `"${env.smtp.fromName}" <${env.smtp.user || env.smtp.to}>`,
    to: toEmail,
    replyTo: env.smtp.to,
    subject: subject || `Regarding your message to Gyanvendra Mishra`,
    html,
  });
  return true;
}
