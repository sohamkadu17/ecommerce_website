const express     = require('express');
const db          = require('../db');
const verifyToken = require('../middleware/auth');
const router      = express.Router();

// ── GET /api/orders/:userId ── Get all orders of a user ─
router.get('/:userId', verifyToken, (req, res) => {
  const sql = `
    SELECT o.order_id, o.total_amount, o.status, o.created_at,
           o.address_id, a.flat_no, a.building_name, a.city, a.state, a.pincode,
           oi.item_id, oi.quantity, oi.unit_price, oi.total_price,
           p.product_name
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p     ON oi.product_id = p.product_id
    LEFT JOIN address a ON o.address_id = a.address_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          order_id:     row.order_id,
          total_amount: row.total_amount,
          status:       row.status,
          created_at:   row.created_at,
          address:      row.address_id ? {
            address_id:    row.address_id,
            flat_no:        row.flat_no,
            building_name:  row.building_name,
            city:           row.city,
            state:          row.state,
            pincode:        row.pincode,
          } : null,
          items:        []
        };
      }
      orders[row.order_id].items.push({
        item_id:      row.item_id,
        product_name: row.product_name,
        quantity:     row.quantity,
        unit_price:   row.unit_price,
        total_price:  row.total_price,
      });
    });

    res.json(Object.values(orders));
  });
});

// ── POST /api/orders ── Place a new order ────────────
router.post('/', verifyToken, (req, res) => {
  const { user_id, items, final_amount, address_id } = req.body;
  // items = [{ product_id, quantity, unit_price }, ...]

  if (!items || items.length === 0)
    return res.status(400).json({ error: 'No items in order' });

  if (!address_id)
    return res.status(400).json({ error: 'address_id is required' });

  const total_amount = final_amount || items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  db.query(
    'INSERT INTO orders (user_id, total_amount, address_id) VALUES (?, ?, ?)',
    [user_id, total_amount, address_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = result.insertId;

      // Store both unit_price and total_price
      const orderItems = items.map(i => [orderId, i.product_id, i.quantity, i.unit_price, i.unit_price * i.quantity]);

      db.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ?',
        [orderItems],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Update stock
          items.forEach(item => {
            db.query('UPDATE products SET stock = stock - ? WHERE product_id = ?',
              [item.quantity, item.product_id]);
          });

          res.status(201).json({ message: 'Order placed!', order_id: orderId, total_amount });
        }
      );
    }
  );
});

// ── PATCH /api/orders/:id/status ── Update order status ─
router.patch('/:id/status', verifyToken, (req, res) => {
  const { status } = req.body;
  db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order status updated!' });
  });
});

module.exports = router;