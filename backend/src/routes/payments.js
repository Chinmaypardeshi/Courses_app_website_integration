const { Router } = require('express');
const { pool } = require('../db/pool');
const { createRazorpayOrder, verifyPaymentSignature, isGatewayConfigured } = require('../services/payment');
const { optionalAuthenticate, authenticate } = require('../middleware/authenticate');
const { env } = require('../config/env');

const paymentsRouter = Router();

// Check Gateway Status
paymentsRouter.get('/v1/payment/status', (req, res) => {
  return res.json({
    configured: isGatewayConfigured(),
    keyId: env.razorpayKeyId || null,
  });
});

// 1. Create Authentic Razorpay Order
async function handleCreateOrder(req, res) {
  const { amount, currency = 'INR', courseId, courseName, customerName, customerEmail, customerPhone } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: 'Valid payment amount is required.' });
  }

  if (!isGatewayConfigured()) {
    return res.status(400).json({
      success: false,
      configured: false,
      error: 'Razorpay payment gateway is not configured yet. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your backend environment variables.',
    });
  }

  const userId = req.auth?.userId || null;
  const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  try {
    const orderResult = await createRazorpayOrder({ amount, currency, receipt });
    if (!orderResult.success) {
      return res.status(502).json({
        success: false,
        configured: true,
        error: orderResult.error || 'Could not initialize gateway order with Razorpay.',
      });
    }

    const order = orderResult.order;

    // Record order in PostgreSQL
    await pool.query(`
      INSERT INTO orders (user_id, order_id, amount, currency, course_id, course_name, customer_name, customer_email, customer_phone, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'created')
      ON CONFLICT (order_id) DO NOTHING
    `, [
      userId,
      order.id,
      amount,
      currency,
      courseId || null,
      courseName || 'Course Enrollment',
      customerName || req.auth?.name || 'Learner',
      customerEmail || req.auth?.email || '',
      customerPhone || '',
    ]);

    return res.status(200).json({
      success: true,
      configured: true,
      order,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpayKeyId,
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error creating order.' });
  }
}

// 2. Verify Cryptographic Payment Signature
async function handleVerifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, paymentId, signature, courseId } = req.body;
  const oId = razorpay_order_id || orderId;
  const pId = razorpay_payment_id || paymentId;
  const sig = razorpay_signature || signature;

  if (!oId || !pId || !sig) {
    return res.status(400).json({ success: false, error: 'Missing order_id, payment_id, or signature.' });
  }

  const isValid = verifyPaymentSignature({ orderId: oId, paymentId: pId, signature: sig });

  try {
    await pool.query(`
      UPDATE orders
      SET payment_id = $1, signature = $2, status = $3, updated_at = NOW()
      WHERE order_id = $4
    `, [pId, sig || '', isValid ? 'paid' : 'failed', oId]);

    // If payment verified and user is authenticated, grant subscription
    if (isValid && req.auth?.userId) {
      await pool.query(`
        INSERT INTO user_subscriptions (user_id, plan_id, status, starts_at, ends_at)
        VALUES ($1, 2, 'active', NOW(), NOW() + INTERVAL '365 days')
      `, [req.auth.userId]);
    }

    return res.status(200).json({
      success: isValid,
      paymentId: pId,
      orderId: oId,
      message: isValid ? 'Payment verified successfully! Course unlocked.' : 'Payment signature verification failed.',
    });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify payment.' });
  }
}

// 3. User Orders
async function getUserOrders(req, res) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized.' });

  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.status(200).json({ success: true, orders: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
  }
}

// 4. Subscriptions Plans & Status
async function getSubscriptionPlans(req, res) {
  try {
    const result = await pool.query('SELECT * FROM subscription_plans WHERE is_active = TRUE ORDER BY price_inr ASC');
    const plans = result.rows.map((row) => ({
      id: String(row.id),
      code: row.code,
      name: row.name,
      description: row.description || '',
      priceInr: Number(row.price_inr),
      price_inr: Number(row.price_inr),
      durationDays: Number(row.duration_days),
      duration_days: Number(row.duration_days),
      features: row.features || [],
      isActive: row.is_active !== false,
    }));
    return res.status(200).json({ success: true, plans });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch plans.' });
  }
}

async function getUserSubscriptionStatus(req, res) {
  const userId = req.auth?.userId;
  if (!userId) return res.status(401).json({ error: 'Please sign in to view subscription.' });

  try {
    const result = await pool.query(`
      SELECT s.*, p.name as plan_name, p.code as plan_code, p.features
      FROM user_subscriptions s
      JOIN subscription_plans p ON s.plan_id = p.id
      WHERE s.user_id = $1 AND s.status = 'active' AND s.ends_at > NOW()
      ORDER BY s.ends_at DESC LIMIT 1
    `, [userId]);

    if (result.rowCount === 0) {
      return res.status(200).json({
        isSubscriber: false,
        hasActiveSubscription: false,
        hasPremiumAccess: false,
        status: 'inactive',
        plan: null,
      });
    }

    const sub = result.rows[0];
    return res.status(200).json({
      isSubscriber: true,
      hasActiveSubscription: true,
      hasPremiumAccess: true,
      status: 'active',
      plan: {
        id: String(sub.plan_id),
        code: sub.plan_code,
        name: sub.plan_name,
        features: sub.features,
      },
      startsAt: sub.starts_at,
      endsAt: sub.ends_at,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user subscription.' });
  }
}

// Routes registration
paymentsRouter.post('/create-order', optionalAuthenticate, handleCreateOrder);
paymentsRouter.post('/v1/payment/create-order', optionalAuthenticate, handleCreateOrder);
paymentsRouter.post('/v1/payment/verify', optionalAuthenticate, handleVerifyPayment);
paymentsRouter.get('/v1/orders', authenticate, getUserOrders);

paymentsRouter.get('/subscriptions/plans', getSubscriptionPlans);
paymentsRouter.get('/subscriptions/me', authenticate, getUserSubscriptionStatus);
paymentsRouter.get('/subscriptions/access', authenticate, getUserSubscriptionStatus);

module.exports = { paymentsRouter };
