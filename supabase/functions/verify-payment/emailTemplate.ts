// File: supabase/functions/verify-payment/emailTemplate.ts

// --- HELPER STYLES ---
const getStyles = () => `
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #333333; line-height: 1.6; }
    .email-wrapper { width: 100%; padding: 40px 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
    .email-header { background-color: #000000; padding: 30px; text-align: center; }
    .email-header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
    .email-body { padding: 40px 30px; }
    .email-body h2 { margin-top: 0; color: #111111; font-size: 22px; }
    .email-body p { margin-bottom: 20px; font-size: 16px; color: #555555; }
    .credentials-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #2563eb; padding: 20px; border-radius: 4px; margin: 30px 0; }
    .credentials-item { margin-bottom: 10px; }
    .credentials-item:last-child { margin-bottom: 0; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: bold; display: block; margin-bottom: 4px; }
    .value { font-size: 18px; color: #111111; font-family: 'Courier New', Courier, monospace; font-weight: bold; }
    .notice-box { background-color: #fff4e5; border: 1px solid #fed7aa; border-left: 4px solid #f97316; padding: 15px; border-radius: 4px; margin-bottom: 30px; color: #9a3412; font-size: 14px; }
    .notice-box.error { background-color: #fef2f2; border-color: #fca5a5; border-left-color: #ef4444; color: #991b1b; }
    .notice-box strong { display: block; margin-bottom: 5px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    .btn-container { text-align: center; margin-top: 35px; font-size: 0; }
    .btn { display: inline-block; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 14px; transition: opacity 0.3s; margin: 0 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-primary { background-color: #2563eb; color: #ffffff !important; }
    .btn-secondary { background-color: #25D366; color: #ffffff !important; }
    .btn-danger { background-color: #ef4444; color: #ffffff !important; }
    .btn:hover { opacity: 0.8; }
    .email-footer { background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; }
    .email-footer p { font-size: 12px; color: #999999; margin: 0; }
    .email-footer a { color: #999999; text-decoration: underline; }
    @media only screen and (max-width: 600px) {
        .email-body { padding: 20px; }
        .btn { display: block; width: 100%; margin: 10px 0; box-sizing: border-box; text-align: center; }
    }
`;

// --- WELCOME EMAIL ---
export const getWelcomeEmailHtml = (name: string, email: string, tempPass: string, plan: string) => {
  const phoneNumber = "9188802136";
  const message = `Hi I'm ${name}, I purchased the ${plan}. My email is ${email}. Let's design the card.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixiic - Welcome Email</title>
    <style>${getStyles()}</style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header"><h1>Pixiic</h1></div>
            <div class="email-body">
                <h2>Welcome, ${name}!</h2>
                <p>Thank you for subscribing to the <strong>${plan}</strong>. We are thrilled to have you onboard.</p>
                <div class="credentials-box">
                    <div class="credentials-item">
                        <span class="label">Login Email</span>
                        <div class="value">${email}</div>
                    </div>
                    <div class="credentials-item" style="margin-top: 15px;">
                        <span class="label">Temporary Password</span>
                        <div class="value">${tempPass}</div>
                    </div>
                </div>
                <div class="notice-box">
                    <strong>Next Steps Required</strong>
                    Please contact Pixiic immediately to finalize your custom card design. Full access to your services will be activated only after the design consultation is complete.
                </div>
                <p>For security reasons, please change your password immediately after logging in.</p>
                <div class="btn-container">
                    <a href="${whatsappUrl}" class="btn btn-secondary">Contact Pixiic (WhatsApp)</a>
                    <a href="https://pixiic.com/user" class="btn btn-primary">Login to Dashboard</a>
                </div>
            </div>
            <div class="email-footer">
                <p>&copy; 2025 Pixiic Inc. All rights reserved.</p>
                <p>India</p>
                <p style="margin-top: 10px;"><a href="#">Privacy Policy</a> | <a href="#">Contact Support</a></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

// --- TECHNICAL ERROR EMAIL ---
export const getTechnicalErrorEmailHtml = (name: string, plan: string) => {
  const phoneNumber = "9188802136";
  const message = `URGENT: Hi I'm ${name}, I purchased ${plan} but I got a technical error during account creation. Payment ID available.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixiic - Action Required</title>
    <style>${getStyles()}</style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header"><h1>Pixiic</h1></div>
            <div class="email-body">
                <h2>Payment Successful, But...</h2>
                <p>Hi ${name},</p>
                <p>We received your payment for the <strong>${plan}</strong>, but we encountered a technical error while setting up your account automatically.</p>
                
                <div class="notice-box error">
                    <strong>Technical Error Occurred</strong>
                    Your payment is safe, but your login credentials could not be generated. Please contact support immediately to resolve this.
                </div>

                <p>Do not worry, our team will manually set up your account.</p>

                <div class="btn-container">
                    <a href="${whatsappUrl}" class="btn btn-secondary">Contact Support (WhatsApp)</a>
                </div>
            </div>
            <div class="email-footer">
                <p>&copy; 2025 Pixiic Inc. All rights reserved.</p>
                <p>India</p>
                <p style="margin-top: 10px;"><a href="#">Privacy Policy</a> | <a href="#">Contact Support</a></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};
