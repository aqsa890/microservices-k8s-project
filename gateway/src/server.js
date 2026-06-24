require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3333;

// Service registry
const SERVICES = {
  backend: process.env.BACKEND_URL || 'http://localhost:4000'
};

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Root route - HTML Health Status Dashboard visible in browser
app.get('/', async (req, res) => {
  const uptimeSecs = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSecs / 3600);
  const mins = Math.floor((uptimeSecs % 3600) / 60);
  const secs = uptimeSecs % 60;
  const uptimeStr = `${hours}h ${mins}m ${secs}s`;

  // Check backend health status
  let backendStatus = 'Offline';
  let backendColor = '#ef4444';
  let mongoStatus = 'Unknown';
  let mongoColor = '#5a5a72';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const backendRes = await fetch(`${SERVICES.backend}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (backendRes.ok) {
      const data = await backendRes.json();
      backendStatus = 'Online';
      backendColor = '#10b981';
      mongoStatus = data.mongoDb === 'connected' ? 'Connected' : 'Disconnected';
      mongoColor = data.mongoDb === 'connected' ? '#10b981' : '#ef4444';
    }
  } catch (err) {
    // backend is offline
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Gateway — Health Dashboard</title>
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
          padding: 40px;
          max-width: 550px;
          width: 90%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: rgba(99,102,241,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }
        h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
        .subtitle { font-size: 0.85rem; color: #5a5a72; margin-top: 4px; }
        .status-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
          color: #6366f1; padding: 8px 18px; border-radius: 100px;
          font-weight: 600; font-size: 0.85rem; margin-bottom: 24px;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .info-grid { display: flex; flex-direction: column; gap: 1px; background: rgba(255,255,255,0.04); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
        .info-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; background: #16161f;
        }
        .info-label { font-size: 0.82rem; color: #5a5a72; font-weight: 500; }
        .info-value { font-size: 0.88rem; font-weight: 600; font-family: 'SF Mono','Fira Code',monospace; }
        .services-section h3 {
          font-size: 0.85rem; color: #8b8b9e; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .service-status {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; background: rgba(255,255,255,0.02);
          border-radius: 10px; margin-bottom: 10px;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .service-info { display: flex; align-items: center; gap: 12px; }
        .service-indicator { width: 10px; height: 10px; border-radius: 50%; }
        .service-title { font-size: 0.88rem; font-weight: 600; }
        .service-port { font-size: 0.78rem; color: #5a5a72; font-family: 'SF Mono','Fira Code',monospace; }
        .service-state { font-size: 0.82rem; font-weight: 600; }
        .routes-info { margin-top: 24px; font-size: 0.8rem; color: #5a5a72; text-align: center; }
        .routes-info a { color: #6366f1; text-decoration: none; }
        .routes-info a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">🌐</div>
          <div>
            <h1>API Gateway</h1>
            <p class="subtitle">Microservices Traffic Router</p>
          </div>
        </div>
        <div class="status-badge"><div class="dot"></div> Gateway Online</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Gateway Port</span>
            <span class="info-value">3333</span>
          </div>
          <div class="info-row">
            <span class="info-label">Uptime</span>
            <span class="info-value">${uptimeStr}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Timestamp</span>
            <span class="info-value" style="font-size:0.78rem">${new Date().toISOString()}</span>
          </div>
        </div>
        <div class="services-section">
          <h3>Registered Microservices</h3>
          
          <div class="service-status">
            <div class="service-info">
              <div class="service-indicator" style="background:${backendColor}"></div>
              <div>
                <span class="service-title">Backend REST API</span>
                <div class="service-port">http://localhost:4000</div>
              </div>
            </div>
            <span class="service-state" style="color:${backendColor}">${backendStatus}</span>
          </div>

          <div class="service-status">
            <div class="service-info">
              <div class="service-indicator" style="background:${mongoColor}"></div>
              <div>
                <span class="service-title">MongoDB Database</span>
                <div class="service-port">mongodb://localhost:27017/microservices_db</div>
              </div>
            </div>
            <span class="service-state" style="color:${mongoColor}">${mongoStatus}</span>
          </div>
        </div>
        <div class="routes-info">
          Try routes: <a href="/api/users" target="_blank">/api/users</a> | <a href="/api/products" target="_blank">/api/products</a> | <a href="/health" target="_blank">/health</a> | <a href="/gateway/info" target="_blank">/gateway/info</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Gateway health check endpoint (JSON)
app.get('/health', (req, res) => {
  res.json({
    service: 'gateway',
    status: 'healthy',
    port: PORT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    registeredServices: Object.keys(SERVICES)
  });
});

// Gateway info endpoint
app.get('/gateway/info', (req, res) => {
  res.json({
    name: 'API Gateway',
    version: '1.0.0',
    port: PORT,
    routes: [
      { path: '/api/users', target: SERVICES.backend, methods: ['GET', 'POST', 'DELETE'] },
      { path: '/api/products', target: SERVICES.backend, methods: ['GET', 'POST', 'DELETE'] },
      { path: '/health', target: 'self', methods: ['GET'] }
    ],
    services: SERVICES
  });
});

// Proxy /api/* requests to backend service
app.use('/api', createProxyMiddleware({
  target: SERVICES.backend,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Forwarded-By', 'api-gateway');
    proxyReq.setHeader('X-Request-Time', new Date().toISOString());
    console.log(`[GATEWAY] ${req.method} ${req.originalUrl} → ${SERVICES.backend}${req.originalUrl}`);
  },
  onProxyRes: (proxyRes, req) => {
    proxyRes.headers['X-Gateway'] = 'api-gateway';
    console.log(`[GATEWAY] Response ${proxyRes.statusCode} from ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error(`[GATEWAY] Proxy error: ${err.message}`);
    res.status(503).json({
      success: false,
      error: 'Service unavailable',
      message: 'The backend service is not responding. Please try again later.'
    });
  }
}));

// Proxy backend health check
app.use('/backend/health', createProxyMiddleware({
  target: SERVICES.backend,
  changeOrigin: true,
  pathRewrite: { '^/backend/health': '/health' }
}));

// 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Gateway route not found',
    availableRoutes: ['/api/users', '/api/products', '/health', '/gateway/info']
  });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`   🌐 API GATEWAY RUNNING`);
  console.log(`========================================`);
  console.log(`✅ Port:      ${PORT}`);
  console.log(`✅ Local:     http://localhost:${PORT}`);
  console.log(`✅ Health:    http://localhost:${PORT}/health`);
  console.log(`✅ Backend:   ${SERVICES.backend}`);
  console.log(`========================================\n`);
});
