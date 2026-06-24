const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { products } = require('../data/products');

const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  const { category, status } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST create product
router.post('/', (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ success: false, error: 'Name, category, and price are required' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    category,
    price: parseFloat(price),
    status: 'active',
    description: description || '',
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// DELETE product
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const deleted = products.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

module.exports = router;
