
// ── OTP Email ─────────────────────────────────────────────
const sendOTPEmail = async (user, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:500px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0d0d14);padding:32px;text-align:center;border-bottom:1px solid #2a2a45;">
          <h1 style="margin:0;font-size:28px;color:#e8e8f0;">Shop<span style="color:#e94560;">EZ</span></h1>
          <p style="margin:8px 0 0;color:#9494b0;font-size:14px;">Password Reset Request</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <p style="color:#e8e8f0;font-size:16px;margin-bottom:6px;">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#9494b0;font-size:14px;margin-bottom:28px;">
            Use this OTP to reset your password. It expires in <strong style="color:#f0a040;">10 minutes</strong>.
          </p>
          <div style="background:#1a1a2e;border:2px dashed #e94560;border-radius:12px;padding:24px;margin-bottom:24px;display:inline-block;">
            <p style="margin:0;font-size:42px;font-weight:700;color:#e94560;letter-spacing:12px;font-family:monospace;">
              ${otp}
            </p>
          </div>
          <p style="color:#5a5a7a;font-size:13px;">
            If you didn't request this, please ignore this email. Your password won't change.
          </p>
        </div>
        <div style="padding:20px;border-top:1px solid #2a2a45;text-align:center;">
          <p style="margin:0;font-size:12px;color:#5a5a7a;">© ${new Date().getFullYear()} ShopEZ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from:    `"ShopEZ" <${process.env.EMAIL_USER}>`,
    to:      user.email,
    subject: `🔐 Your ShopEZ Password Reset OTP: ${otp}`,
    html,
  });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail, sendOTPEmail };