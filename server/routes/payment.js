const express     = require('express');
const db          = require('../db');
const verifyToken = require('../middleware/auth');
const router      = express.Router();

// ── POST /api/payment ── Make a payment ──────────────
router.post('/', verifyToken, (req, res) => {
  const { order_id, payment_method } = req.body;

  if (!order_id || !payment_method)
    return res.status(400).json({ error: 'order_id and payment_method are required' });

  // Get order to extract user_id
  db.query('SELECT * FROM orders WHERE order_id = ?', [order_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Order not found' });

    const user_id = results[0].user_id;

    // Insert payment (address_id is now in orders table)
    db.query(
      'INSERT INTO payment (order_id, user_id, payment_method, status) VALUES (?, ?, ?, ?)',
      [order_id, user_id, payment_method, 'completed'],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Update order status to confirmed
        db.query("UPDATE orders SET status = 'confirmed' WHERE order_id = ?", [order_id]);

        res.status(201).json({
          message: 'Payment successful! ✅',
          payment_id: result.insertId
        });
      }
    );
  });
});

// ── GET /api/payment/:orderId ── Get payment for an order ─
router.get('/:orderId', verifyToken, (req, res) => {
  const sql = `
    SELECT pay.*, 
           u.username, u.email
    FROM payment pay
    JOIN users u   ON pay.user_id    = u.user_id
    WHERE pay.order_id = ?
  `;
  db.query(sql, [req.params.orderId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(results[0]);
  });
});

module.exports = router;