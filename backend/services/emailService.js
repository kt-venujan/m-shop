const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an order confirmation email to the customer.
 */
const sendOrderConfirmation = async ({ toEmail, toName, order }) => {
  if (!toEmail) return;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;">x${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:bold;">Rs. ${(item.price * item.quantity).toFixed(0)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
      <div style="background:#f57224;padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px;">Order Confirmed! 🎉</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Thank you for shopping with MERN Store</p>
      </div>

      <div style="padding:28px 32px;">
        <p style="font-size:15px;color:#333;">Hi <strong>${toName || 'Valued Customer'}</strong>,</p>
        <p style="font-size:14px;color:#555;line-height:1.6;">Your order has been placed successfully and is being processed. You'll receive another email when it ships.</p>

        <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:20px 0;">
          <p style="font-size:11px;font-weight:bold;color:#888;text-transform:uppercase;margin:0 0 4px;">Order ID</p>
          <p style="font-size:14px;font-family:monospace;color:#333;margin:0;font-weight:bold;">#${order._id.toString().slice(-10).toUpperCase()}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="background:#f8f9fa;">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#888;">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#888;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#888;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:bold;font-size:15px;color:#333;">Total</td>
              <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#f57224;">Rs. ${order.totalAmount.toFixed(0)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="border-top:1px solid #eee;padding-top:16px;margin-top:8px;">
          <p style="font-size:11px;color:#888;text-transform:uppercase;font-weight:bold;margin-bottom:4px;">Shipping To</p>
          <p style="font-size:13px;color:#555;line-height:1.5;">${order.shippingAddress}</p>
        </div>
      </div>

      <div style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="font-size:12px;color:#aaa;margin:0;">MERN Store &bull; Questions? Reply to this email</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"MERN Store" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Order Confirmed #${order._id.toString().slice(-10).toUpperCase()} 🎉`,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send order confirmation:', err.message);
    // Non-fatal — don't throw
  }
};

/**
 * Send an order status update email to the customer.
 */
const sendStatusUpdate = async ({ toEmail, toName, orderId, status }) => {
  if (!toEmail) return;

  const statusMessages = {
    Shipped: { emoji: '📦', headline: 'Your order has shipped!', body: 'Your package is on its way and will arrive within 3–5 business days.' },
    Delivered: { emoji: '✅', headline: 'Your order has been delivered!', body: 'We hope you love your purchase. Please leave a review on our website!' },
    Cancelled: { emoji: '❌', headline: 'Your order has been cancelled', body: 'Your order has been cancelled. If you did not request this, please contact us immediately.' },
  };

  const msg = statusMessages[status] || { emoji: 'ℹ️', headline: `Order status: ${status}`, body: 'Your order status has been updated.' };

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;">
      <div style="background:#f57224;padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">${msg.emoji} ${msg.headline}</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="font-size:15px;color:#333;">Hi <strong>${toName || 'Valued Customer'}</strong>,</p>
        <p style="font-size:14px;color:#555;line-height:1.6;">${msg.body}</p>
        <div style="background:#f8f9fa;border-radius:6px;padding:16px;margin:20px 0;">
          <p style="font-size:11px;color:#888;text-transform:uppercase;font-weight:bold;margin:0 0 4px;">Order ID</p>
          <p style="font-size:14px;font-family:monospace;color:#333;margin:0;font-weight:bold;">#${orderId.toString().slice(-10).toUpperCase()}</p>
        </div>
      </div>
      <div style="background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="font-size:12px;color:#aaa;margin:0;">MERN Store — Thank you for shopping with us</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"MERN Store" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `${msg.emoji} Order ${status} - #${orderId.toString().slice(-10).toUpperCase()}`,
      html,
    });
  } catch (err) {
    console.error('[Email] Failed to send status update:', err.message);
  }
};

module.exports = { sendOrderConfirmation, sendStatusUpdate };
