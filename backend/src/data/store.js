const { v4: uuidv4 } = require('uuid');

// In-memory data store
const users = [
  { id: uuidv4(), name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin', avatar: 'SC', createdAt: '2026-01-15T08:30:00Z' },
  { id: uuidv4(), name: 'Marcus Johnson', email: 'marcus.j@example.com', role: 'Developer', avatar: 'MJ', createdAt: '2026-02-20T14:15:00Z' },
  { id: uuidv4(), name: 'Aisha Patel', email: 'aisha.p@example.com', role: 'Designer', avatar: 'AP', createdAt: '2026-03-10T09:45:00Z' },
  { id: uuidv4(), name: 'James Wilson', email: 'james.w@example.com', role: 'DevOps', avatar: 'JW', createdAt: '2026-04-05T11:00:00Z' },
  { id: uuidv4(), name: 'Luna Rodriguez', email: 'luna.r@example.com', role: 'Developer', avatar: 'LR', createdAt: '2026-05-18T16:30:00Z' },
  { id: uuidv4(), name: 'David Kim', email: 'david.k@example.com', role: 'Manager', avatar: 'DK', createdAt: '2026-06-01T10:20:00Z' }
];

module.exports = { users };
