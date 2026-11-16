const Razorpay = require('razorpay');
const crypto = require('crypto');
const { env } = require('../config/env');

function getRazorpayInstance() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    return null;
  }
  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
}

function isGatewayConfigured() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}

/**
 * Creates an authentic order on Razorpay Gateway
 */
async function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  if (!isGatewayConfigured()) {
    return {
      success: false,
      configured: false,
      error: 'Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
    };
  }

  const razorpay = getRazorpayInstance();
  try {
    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise (1 INR = 100 paise)
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      configured: true,
      order,
    };
  } catch (err) {
    console.error('Razorpay Order Creation Error:', err.message);
    return {
      success: false,
      configured: true,
      error: err.error?.description || err.message || 'Razorpay order creation failed.',
    };
  }
}

/**
 * Verifies the cryptographic HMAC-SHA256 signature returned by Razorpay Checkout
 */
function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!env.razorpayKeySecret || !orderId || !paymentId || !signature) {
    return false;
  }

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.razorpayKeySecret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (err) {
    console.error('Payment signature verification error:', err.message);
    return false;
  }
}

module.exports = {
  isGatewayConfigured,
  createRazorpayOrder,
  verifyPaymentSignature,
};
