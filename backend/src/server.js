require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/microservices_db';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Root route — HTML health check page visible in browser
app.get('/', (req, res) => {
  const uptimeSecs = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSecs / 3600);
  const mins = Math.floor((uptimeSecs % 3600) / 60);
  const secs = uptimeSecs % 60;
  const uptimeStr = `${hours}h ${mins}m ${secs}s`;
  const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const mongoStatusColor = mongoose.connection.readyState === 1 ? '#10b981' : '#ef4444';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Backend Service — Health</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0f;
          color: #f0f0f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: #16161f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 48px;
          max-width: 520px;
          width: 90%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: rgba(16,185,129,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }
        h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
        .subtitle { font-size: 0.85rem; color: #5a5a72; margin-top: 4px; }
        .status-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
          color: #10b981; padding: 8px 18px; border-radius: 100px;
          font-weight: 600; font-size: 0.85rem; margin-bottom: 28px;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .info-grid { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.04); border-radius: 12px; overflow: hidden; }
        .info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; background: #16161f;
        }
        .info-label { font-size: 0.82rem; color: #5a5a72; font-weight: 500; }
        .info-value { font-size: 0.88rem; font-weight: 600; font-family: 'SF Mono','Fira Code',monospace; }
        .mongo-status { color: ${mongoStatusColor}; }
        .endpoints { margin-top: 28px; }
        .endpoints h3 { font-size: 0.85rem; color: #8b8b9e; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .endpoint {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.85rem;
        }
        .endpoint:last-child { border-bottom: none; }
        .method {
          padding: 3px 10px; border-radius: 6px; font-size: 0.72rem;
          font-weight: 700; letter-spacing: 0.04em; min-width: 52px; text-align: center;
        }
        .get { background: rgba(99,102,241,0.15); color: #6366f1; }
        .post { background: rgba(16,185,129,0.15); color: #10b981; }
        .delete { background: rgba(239,68,68,0.15); color: #ef4444; }
        .path { color: #8b8b9e; font-family: 'SF Mono','Fira Code',monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">⚡</div>
          <div>
            <h1>Backend Service</h1>
            <p class="subtitle">REST API Microservice</p>
          </div>
        </div>
        <div class="status-badge"><div class="dot"></div> Server Running</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value" style="color:#10b981">● Healthy</span>
          </div>
          <div class="info-row">
            <span class="info-label">Port</span>
            <span class="info-value">${PORT}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Uptime</span>
            <span class="info-value">${uptimeStr}</span>
          </div>
          <div class="info-row">
            <span class="info-label">MongoDB</span>
            <span class="info-value mongo-status">● ${mongoStatus}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Database</span>
            <span class="info-value" style="font-size:0.78rem">microservices_db</span>
          </div>
          <div class="info-row">
            <span class="info-label">Timestamp</span>
            <span class="info-value" style="font-size:0.78rem">${new Date().toISOString()}</span>
          </div>
        </div>
        <div class="endpoints">
          <h3>API Endpoints</h3>
          <div class="endpoint"><span class="method get">GET</span><span class="path">/api/users</span></div>
          <div class="endpoint"><span class="method post">POST</span><span class="path">/api/users</span></div>
          <div class="endpoint"><span class="method delete">DEL</span><span class="path">/api/users/:id</span></div>
          <div class="endpoint"><span class="method get">GET</span><span class="path">/api/products</span></div>
          <div class="endpoint"><span class="method post">POST</span><span class="path">/api/products</span></div>
          <div class="endpoint"><span class="method delete">DEL</span><span class="path">/api/products/:id</span></div>
          <div class="endpoint"><span class="method get">GET</span><span class="path">/health</span></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check JSON endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'backend',
    status: 'healthy',
    mongoDb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB then start server
async function startServer() {
  try {
    console.log('\n========================================');
    console.log('   🚀 BACKEND SERVICE');
    console.log('========================================\n');
    console.log('⏳ Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI}\n`);

    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}\n`);

    app.listen(PORT, () => {
      console.log('----------------------------------------');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`   Local:  http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log('----------------------------------------\n');
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.log('⚠️  Starting server without MongoDB...\n');

    app.listen(PORT, () => {
      console.log('----------------------------------------');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`   Local:  http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
      console.log(`   ⚠️  MongoDB: Disconnected`);
      console.log('----------------------------------------\n');
    });
  }
}

// Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose: Connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('📡 Mongoose: Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose: Disconnected from MongoDB');
});

startServer();
