/**
 * Mock notification utility for Email and SMS.
 *
 * In production, replace the implementations with:
 * - Email: Resend (resend.com) or Nodemailer
 * - SMS: Twilio or AWS SNS
 *
 * All functions return a Promise so they are drop-in replaceable.
 */

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

interface SMSPayload {
  to: string; // mobile number e.g. "+919876543210"
  message: string;
}

/**
 * Sends an email notification.
 * Currently mocked — logs to console.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log("📧 [MOCK EMAIL]");
  console.log(`   To:      ${payload.to}`);
  console.log(`   Subject: ${payload.subject}`);
  console.log(`   Body:    ${payload.body}`);
  // TODO: Replace with real provider e.g.:
  // await resend.emails.send({ from: "noreply@yourdomain.com", ...payload });
}

/**
 * Sends an SMS notification.
 * Currently mocked — logs to console.
 */
export async function sendSMS(payload: SMSPayload): Promise<void> {
  console.log("📱 [MOCK SMS]");
  console.log(`   To:      ${payload.to}`);
  console.log(`   Message: ${payload.message}`);
  // TODO: Replace with real provider e.g.:
  // await twilioClient.messages.create({ from: "+1...", ...payload });
}

/**
 * Sends an OTP via email and optionally SMS.
 */
export async function sendOTP(
  email: string,
  otp: string,
  mobile?: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Your Amazon - Verification Code",
    body: `Your one-time verification code is: ${otp}. It expires in 10 minutes.`,
  });

  if (mobile) {
    await sendSMS({
      to: mobile,
      message: `Your Amazon -  OTP is ${otp}. Valid for 10 minutes.`,
    });
  }
}

/**
 * Sends an order confirmation notification.
 */
export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  mobile?: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Order Confirmed — Amazon",
    body: `Thank you for ordering! Your order has been placed successfully.\nOrder ID: ${orderId}`,
  });

  if (mobile) {
    await sendSMS({
      to: mobile,
      message: `Thank you for ordering! Your order #${orderId} has been placed successfully.`,
    });
  }
}
