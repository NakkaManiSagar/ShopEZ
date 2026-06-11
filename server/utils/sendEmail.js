const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Order Confirmation Email ──────────────────────────────
const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #2a2a45;">
        <strong style="color:#e8e8f0;">${item.name}</strong>
      </td>
      <td style="padding:10px;border-bottom:1px solid #2a2a45;text-align:center;color:#9494b0;">
        ${item.quantity}
      </td>
      <td style="padding:10px;border-bottom:1px solid #2a2a45;text-align:right;color:#e8e8f0;">
        Rs.${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0d0d14);padding:32px;text-align:center;border-bottom:1px solid #2a2a45;">
          <h1 style="margin:0;font-size:28px;color:#e8e8f0;">ShopEZ</h1>
          <p style="margin:8px 0 0;color:#9494b0;font-size:14px;">Your order is confirmed!</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#e8e8f0;font-size:16px;">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#9494b0;font-size:14px;">Thank you for your order.</p>
          <p style="color:#e94560;font-size:18px;font-weight:700;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead><tr style="background:#1a1a2e;">
              <th style="padding:10px;text-align:left;color:#9494b0;">Item</th>
              <th style="padding:10px;text-align:center;color:#9494b0;">Qty</th>
              <th style="padding:10px;text-align:right;color:#9494b0;">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="color:#e8e8f0;font-size:16px;font-weight:700;">Total: Rs.${order.totalPrice?.toLocaleString()}</p>
          <p style="color:#9494b0;">Shipping to: ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
        </div>
        <div style="padding:20px;border-top:1px solid #2a2a45;text-align:center;">
          <p style="margin:0;font-size:12px;color:#5a5a7a;">ShopEZ</p>
        </div>
      </div>
    </body></html>`;

  await transporter.sendMail({
    from:    `"ShopEZ" <${process.env.EMAIL_USER}>`,
    to:      user.email,
    subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} - ShopEZ`,
    html,
  });
};

// ── Welcome Email ─────────────────────────────────────────
const sendWelcomeEmail = async (user) => {
  const html = `<!DOCTYPE html><html>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="padding:40px;text-align:center;background:#1a1a2e;">
          <h1 style="color:#e8e8f0;">ShopEZ</h1>
          <p style="color:#9494b0;">Welcome to the family!</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <h2 style="color:#e8e8f0;">Hi ${user.name}!</h2>
          <p style="color:#9494b0;">Your ShopEZ account is ready. Start shopping now!</p>
          <p style="color:#5a5a7a;">Use code <strong style="color:#f0c040;">SHOPEZ20</strong> for 20% off your first order!</p>
        </div>
      </div>
    </body></html>`;

  await transporter.sendMail({
    from:    `"ShopEZ" <${process.env.EMAIL_USER}>`,
    to:      user.email,
    subject: `Welcome to ShopEZ, ${user.name}!`,
    html,
  });
};

// ── OTP Email ─────────────────────────────────────────────
const sendOTPEmail = async (user, otp) => {
  const html = `<!DOCTYPE html><html>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:500px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;background:#1a1a2e;border-bottom:1px solid #2a2a45;">
          <h1 style="color:#e8e8f0;">ShopEZ</h1>
          <p style="color:#9494b0;">Password Reset Request</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <p style="color:#e8e8f0;">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#9494b0;">Use this OTP to reset your password. Expires in 10 minutes.</p>
          <div style="background:#1a1a2e;border:2px dashed #e94560;border-radius:12px;padding:24px;margin:20px 0;">
            <p style="margin:0;font-size:42px;font-weight:700;color:#e94560;letter-spacing:12px;font-family:monospace;">${otp}</p>
          </div>
          <p style="color:#5a5a7a;font-size:13px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    </body></html>`;

  await transporter.sendMail({
    from:    `"ShopEZ" <${process.env.EMAIL_USER}>`,
    to:      user.email,
    subject: `Your ShopEZ Password Reset OTP: ${otp}`,
    html,
  });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail, sendOTPEmail };