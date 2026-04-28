const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ── GET /api/products ── Get all products with order count ────
// Usage: GET /api/products         → all products
// Usage: GET /api/products?q=phone → search using JOIN
router.get('/', (req, res) => {
  const { q } = req.query;

  if (q && q.trim() !== '') {
    // JOIN products with order_items to get search results + times_ordered
    const sql = `
      SELECT DISTINCT p.*
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      WHERE p.product_name LIKE ?
    `;
    db.query(sql, [`%${q}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    const sql = `
      SELECT DISTINCT p.*
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }
});

// ── GET /api/products/:id ── Get single product ──────
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE product_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

// ── POST /api/products ── Add product (admin) ───────
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  // Debug: log incoming form body and file info to help diagnose upload issues
  console.log('[DEBUG] POST /api/products - body keys:', Object.keys(req.body), 'body:', req.body);
  console.log('[DEBUG] POST /api/products - file:', req.file ? { originalname: req.file.originalname, filename: req.file.filename, size: req.file.size } : null);
  console.log('[DEBUG] POST /api/products - auth header:', req.headers.authorization);
  console.log('[DEBUG] POST /api/products - req.user:', req.user);

  const { product_name, product_price, stock, image_url } = req.body;
  if (!product_name || product_price == null || stock == null) {
    return res.status(400).json({ error: 'product_name, product_price and stock are required', received: { body: req.body, file: !!req.file } });
  }

  const price = Number(product_price);
  const stockInt = Number(stock);

  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stockInt) || stockInt < 0) {
    return res.status(400).json({ error: 'Invalid product_price or stock value' });
  }

  const finalImageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : (image_url || null);

  // If no image provided, omit image_url column so DB/defaults remain unchanged
  if (finalImageUrl) {
    db.query(
      'INSERT INTO products (product_name, product_price, stock, image_url) VALUES (?, ?, ?, ?)',
      [product_name, price, stockInt, finalImageUrl],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Product created successfully', product_id: result.insertId });
      }
    );
  } else {
    db.query(
      'INSERT INTO products (product_name, product_price, stock) VALUES (?, ?, ?)',
      [product_name, price, stockInt],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Product created successfully', product_id: result.insertId });
      }
    );
  }
});

// ── PATCH /api/products/:id ── Update product (admin) ─
router.patch('/:id', verifyToken, upload.single('image'), (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const { product_name, product_price, stock, image_url } = req.body;
  const updates = [];
  const values = [];

  if (product_name != null) {
    updates.push('product_name = ?');
    values.push(product_name);
  }
  if (product_price != null) {
    const price = Number(product_price);
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ error: 'Invalid product_price value' });
    }
    updates.push('product_price = ?');
    values.push(price);
  }
  if (stock != null) {
    const stockInt = Number(stock);
    if (!Number.isInteger(stockInt) || stockInt < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }
    updates.push('stock = ?');
    values.push(stockInt);
  }

  if (req.file) {
    updates.push('image_url = ?');
    values.push(`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`);
  } else if (image_url != null) {
    updates.push('image_url = ?');
    values.push(image_url);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'At least one field is required to update' });
  }

  values.push(req.params.id);
  db.query(`UPDATE products SET ${updates.join(', ')} WHERE product_id = ?`, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated successfully' });
  });
});

// ── DELETE /api/products/:id ── Delete product (admin) ─
router.delete('/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  db.query('DELETE FROM products WHERE product_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;