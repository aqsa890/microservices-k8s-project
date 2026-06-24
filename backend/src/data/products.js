const { v4: uuidv4 } = require('uuid');

// In-memory products store
const products = [
  { id: uuidv4(), name: 'Cloud Server Pro', category: 'Infrastructure', price: 299.99, status: 'active', description: 'High-performance cloud computing instance', createdAt: '2026-01-10T08:00:00Z' },
  { id: uuidv4(), name: 'API Shield', category: 'Security', price: 149.99, status: 'active', description: 'Enterprise-grade API protection suite', createdAt: '2026-02-14T10:30:00Z' },
  { id: uuidv4(), name: 'DataSync Engine', category: 'Data', price: 199.99, status: 'active', description: 'Real-time data synchronization platform', createdAt: '2026-03-22T14:00:00Z' },
  { id: uuidv4(), name: 'EdgeCache CDN', category: 'Infrastructure', price: 89.99, status: 'inactive', description: 'Global content delivery network', createdAt: '2026-04-01T09:15:00Z' },
  { id: uuidv4(), name: 'LogStream Analytics', category: 'Monitoring', price: 129.99, status: 'active', description: 'Real-time log aggregation and analytics', createdAt: '2026-05-05T11:45:00Z' },
  { id: uuidv4(), name: 'AutoScale Manager', category: 'Infrastructure', price: 179.99, status: 'active', description: 'Intelligent auto-scaling orchestrator', createdAt: '2026-06-10T13:00:00Z' }
];

module.exports = { products };
