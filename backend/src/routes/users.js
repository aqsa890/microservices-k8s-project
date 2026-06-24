const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { users } = require('../data/store');

const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// GET single user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// POST create user
router.post('/', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, error: 'Name, email, and role are required' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    role,
    avatar: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// DELETE user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const deleted = users.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

module.exports = router;
