const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use Gmail or other service
  // In production, use dedicated email service like SendGrid, Mailgun, etc.
  return nodemailer.createTransport({
    service: 'gmail', // or use SMTP settings
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (userEmail, userName, orderDetails) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@shophub.com',
      to: userEmail,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your order! Here are the details:</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${orderDetails.paymentStatus}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>${orderDetails.shippingAddress.address}</p>
            <p>${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.pincode}</p>
            <p>${orderDetails.shippingAddress.country}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Items Ordered</h3>
            ${orderDetails.items.map(item => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.qty} | Price: ₹${item.price}</p>
                <p>Subtotal: ₹${item.qty * item.price}</p>
              </div>
            `).join('')}
          </div>

          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you for shopping with ShopHub!</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error to avoid breaking payment flow
  }
};

// Send payment success email
const sendPaymentSuccess = async (userEmail, userName, paymentDetails) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@shophub.com',
      to: userEmail,
      subject: 'Payment Successful - ShopHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Successful!</h2>
          <p>Dear ${userName},</p>
          <p>Your payment has been processed successfully.</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Payment Details</h3>
            <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
            <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
            <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>You will receive a separate email with your order details shortly.</p>
          <p>Thank you for choosing ShopHub!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment success email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending payment success email:', error);
    // Don't throw error to avoid breaking payment flow
  }
};

module.exports = {
  sendOrderConfirmation,
  sendPaymentSuccess
};