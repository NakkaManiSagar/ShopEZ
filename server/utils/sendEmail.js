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
        ₹${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0d0d14);padding:32px;text-align:center;border-bottom:1px solid #2a2a45;">
          <h1 style="margin:0;font-size:28px;color:#e8e8f0;">Shop<span style="color:#e94560;">EZ</span></h1>
          <p style="margin:8px 0 0;color:#9494b0;font-size:14px;">Your order is confirmed! 🎉</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#e8e8f0;font-size:16px;margin-bottom:6px;">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#9494b0;font-size:14px;margin-bottom:24px;">
            Thank you for your order. We've received it and will start processing it shortly.
          </p>
          <div style="background:#1a1a2e;border:1px solid #2a2a45;border-radius:10px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:12px;color:#9494b0;text-transform:uppercase;letter-spacing:0.5px;">Order ID</p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#e94560;font-family:monospace;">
              #${order._id.toString().slice(-8).toUpperCase()}
            </p>
            <p style="margin:4px 0 0;font-size:12px;color:#9494b0;">
              Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <h3 style="color:#e8e8f0;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#1a1a2e;">
                <th style="padding:10px;text-align:left;font-size:12px;color:#9494b0;">Item</th>
                <th style="padding:10px;text-align:center;font-size:12px;color:#9494b0;">Qty</th>
                <th style="padding:10px;text-align:right;font-size:12px;color:#9494b0;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="background:#1a1a2e;border:1px solid #2a2a45;border-radius:10px;padding:16px;margin-bottom:24px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#9494b0;font-size:14px;">Subtotal</span>
              <span style="color:#e8e8f0;font-size:14px;">₹${order.itemsPrice?.toLocaleString()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#9494b0;font-size:14px;">Shipping</span>
              <span style="color:${order.shippingPrice === 0 ? "#4caf7d" : "#e8e8f0"};font-size:14px;">
                ${order.shippingPrice === 0 ? "FREE" : "₹" + order.shippingPrice}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid #2a2a45;padding-top:12px;">
              <span style="color:#e8e8f0;font-size:16px;font-weight:700;">Total</span>
              <span style="color:#e94560;font-size:18px;font-weight:700;">₹${order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
          <h3 style="color:#e8e8f0;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Shipping To</h3>
          <div style="background:#1a1a2e;border:1px solid #2a2a45;border-radius:10px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;color:#e8e8f0;font-size:14px;line-height:1.7;">
              ${order.shippingAddress.street},<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;background:#1a1a2e;border:1px solid #2a2a45;border-radius:10px;padding:14px;">
            <span style="font-size:20px;">${order.paymentMethod === "COD" ? "💵" : "💳"}</span>
            <div>
              <p style="margin:0;font-size:12px;color:#9494b0;">Payment</p>
              <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#e8e8f0;">${order.paymentMethod}</p>
            </div>
            <span style="margin-left:auto;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;
              background:${order.paymentStatus === "Paid" ? "rgba(76,175,125,0.15)" : "rgba(240,160,64,0.15)"};
              color:${order.paymentStatus === "Paid" ? "#4caf7d" : "#f0a040"};">
              ${order.paymentStatus}
            </span>
          </div>
        </div>
        <div style="padding:20px 32px;border-top:1px solid #2a2a45;text-align:center;">
          <p style="margin:0;font-size:12px;color:#5a5a7a;">© ${new Date().getFullYear()} ShopEZ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from:    `"ShopEZ" <${process.env.EMAIL_USER}>`,
    to:      user.email,
    subject: `✅ Order Confirmed #${order._id.toString().slice(-8).toUpperCase()} — ShopEZ`,
    html,
  });
};

// ── Welcome Email ─────────────────────────────────────────
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#13131f;border:1px solid #2a2a45;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0d0d14);padding:40px;text-align:center;">
          <h1 style="margin:0;font-size:32px;color:#e8e8f0;">Shop<span style="color:#e94560;">EZ</span></h1>
          <p style="margin:10px 0 0;color:#9494b0;">Welcome to the family! 🎉</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <h2 style="color:#e8e8f0;font-size:22px;margin-bottom:10px;">Hi ${user.name}! 👋</h2>
          <p style="color:#9494b0;font-size:15px;line-height:1.7;margin-bottom:24px;">
            Your ShopEZ account is ready. Explore thousands of products, save your favorites, and enjoy fast delivery.
          </p>
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/products"
            style="display:inline-block;background:#e94560;color:#fff;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;text-decoration:none;">
            Start Shopping →
          </a>
          <p style="color:#5a5a7a;font-size:13px;margin-top:24px;">
            Use code <strong style="color:#f0c040;">SHOPEZ20</strong> for 20% off your first order!
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
    subject: `Welcome to ShopEZ, ${user.name}! 🛒`,
    html,
  });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail };