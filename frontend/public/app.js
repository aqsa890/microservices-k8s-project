// ===== Configuration =====
const GATEWAY_URL = window.ENV?.GATEWAY_URL || 'http://localhost:3333';

// ===== State =====
const state = {
  currentPage: 'dashboard',
  users: [],
  products: [],
  gatewayOnline: false
};

// ===== DOM References =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== API Layer =====
class API {
  static async fetch(endpoint, options = {}) {
    try {
      const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      return await res.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      return null;
    }
  }

  static async getUsers() {
    const res = await this.fetch('/api/users');
    return res?.data || [];
  }

  static async getProducts() {
    const res = await this.fetch('/api/products');
    return res?.data || [];
  }

  static async createUser(data) {
    return this.fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async deleteUser(id) {
    return this.fetch(`/api/users/${id}`, { method: 'DELETE' });
  }

  static async createProduct(data) {
    return this.fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async deleteProduct(id) {
    return this.fetch(`/api/products/${id}`, { method: 'DELETE' });
  }

  static async checkHealth() {
    try {
      const res = await fetch(`${GATEWAY_URL}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  static async getGatewayInfo() {
    return this.fetch('/gateway/info');
  }
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== Utility Functions =====
const avatarColors = ['indigo', 'purple', 'pink', 'cyan', 'emerald', 'amber'];
function getAvatarColor(index) {
  return avatarColors[index % avatarColors.length];
}

function getRoleBadgeClass(role) {
  return role.toLowerCase();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ===== Page Renderers =====
function renderDashboard() {
  const content = $('#content-area');
  content.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card animate-in">
        <div class="stat-card-header">
          <span class="stat-label">Total Users</span>
          <div class="stat-icon indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          </div>
        </div>
        <div class="stat-value">${state.users.length}</div>
        <div class="stat-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          Active team members
        </div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-card-header">
          <span class="stat-label">Products</span>
          <div class="stat-icon emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
        </div>
        <div class="stat-value">${state.products.length}</div>
        <div class="stat-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          ${state.products.filter(p => p.status === 'active').length} active
        </div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-card-header">
          <span class="stat-label">Services</span>
          <div class="stat-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
        </div>
        <div class="stat-value">3</div>
        <div class="stat-change positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          All operational
        </div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-card-header">
          <span class="stat-label">Gateway</span>
          <div class="stat-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="stat-value">:3333</div>
        <div class="stat-change ${state.gatewayOnline ? 'positive' : 'negative'}">
          <div style="width:6px;height:6px;border-radius:50%;background:currentColor"></div>
          ${state.gatewayOnline ? 'Online & Healthy' : 'Offline'}
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-panel animate-in">
        <div class="panel-header">
          <h3 class="panel-title">Recent Users</h3>
          <button class="btn-secondary" style="padding:6px 14px;font-size:0.78rem;" onclick="navigateTo('users')">View All</button>
        </div>
        <div class="panel-body">
          ${state.users.slice(0, 5).map((user, i) => `
            <div class="panel-item">
              <div class="panel-item-avatar table-avatar ${getAvatarColor(i)}">${user.avatar}</div>
              <div class="panel-item-info">
                <div class="panel-item-name">${user.name}</div>
                <div class="panel-item-meta">${user.email}</div>
              </div>
              <span class="badge ${getRoleBadgeClass(user.role)}">${user.role}</span>
            </div>
          `).join('')}
          ${state.users.length === 0 ? '<div class="empty-state"><p>No users found</p></div>' : ''}
        </div>
      </div>

      <div class="dashboard-panel animate-in">
        <div class="panel-header">
          <h3 class="panel-title">Recent Products</h3>
          <button class="btn-secondary" style="padding:6px 14px;font-size:0.78rem;" onclick="navigateTo('products')">View All</button>
        </div>
        <div class="panel-body">
          ${state.products.slice(0, 5).map((product, i) => `
            <div class="panel-item">
              <div class="panel-item-avatar table-avatar ${getAvatarColor(i + 2)}">${product.name.charAt(0)}</div>
              <div class="panel-item-info">
                <div class="panel-item-name">${product.name}</div>
                <div class="panel-item-meta">${product.category}</div>
              </div>
              <span style="font-weight:600;font-size:0.85rem;color:var(--accent-indigo)">$${product.price}</span>
            </div>
          `).join('')}
          ${state.products.length === 0 ? '<div class="empty-state"><p>No products found</p></div>' : ''}
        </div>
      </div>
    </div>
  `;
}

function renderUsers() {
  const content = $('#content-area');
  content.innerHTML = `
    <div class="section-header animate-in">
      <h2 class="section-title">Team Members</h2>
      <button class="btn-primary" id="add-user-btn" onclick="openUserModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add User
      </button>
    </div>
    <div class="table-container animate-in">
      <table class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.users.map((user, i) => `
            <tr>
              <td>
                <span class="table-avatar ${getAvatarColor(i)}">${user.avatar}</span>
                ${user.name}
              </td>
              <td style="color:var(--text-secondary)">${user.email}</td>
              <td><span class="badge ${getRoleBadgeClass(user.role)}">${user.role}</span></td>
              <td style="color:var(--text-secondary)">${formatDate(user.createdAt)}</td>
              <td>
                <button class="btn-danger" onclick="deleteUser('${user.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${state.users.length === 0 ? '<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><p>No users found. Add your first team member!</p></div>' : ''}
    </div>
  `;
}

function renderProducts() {
  const content = $('#content-area');
  content.innerHTML = `
    <div class="section-header animate-in">
      <h2 class="section-title">Products Catalog</h2>
      <button class="btn-primary" id="add-product-btn" onclick="openProductModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Product
      </button>
    </div>
    <div class="cards-grid">
      ${state.products.map((product, i) => `
        <div class="product-card animate-in">
          <div class="product-card-header">
            <div>
              <div class="product-category">${product.category}</div>
              <div class="product-name">${product.name}</div>
            </div>
            <span class="badge ${product.status}">
              <span class="badge-dot"></span>
              ${product.status}
            </span>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="btn-danger" onclick="deleteProduct('${product.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Remove
            </button>
          </div>
        </div>
      `).join('')}
      ${state.products.length === 0 ? '<div class="empty-state" style="grid-column:1/-1"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg><p>No products found. Add your first product!</p></div>' : ''}
    </div>
  `;
}

function renderServices() {
  const content = $('#content-area');
  content.innerHTML = `
    <div class="section-header animate-in">
      <h2 class="section-title">Service Architecture</h2>
    </div>
    <div class="services-grid">
      <div class="service-card animate-in">
        <div class="service-header">
          <div class="service-icon gateway">🌐</div>
          <div>
            <div class="service-name">API Gateway</div>
            <div class="service-port">localhost:3333</div>
          </div>
          <span class="badge ${state.gatewayOnline ? 'active' : 'inactive'}" style="margin-left:auto">
            <span class="badge-dot"></span>
            ${state.gatewayOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div class="service-details">
          <div class="service-detail">
            <span class="service-detail-label">Type</span>
            <span class="service-detail-value">Reverse Proxy</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Port</span>
            <span class="service-detail-value">3333</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Routes</span>
            <span class="service-detail-value">/api/* → Backend</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Health</span>
            <span class="service-detail-value">/health</span>
          </div>
        </div>
      </div>

      <div class="service-card animate-in">
        <div class="service-header">
          <div class="service-icon backend">⚡</div>
          <div>
            <div class="service-name">Backend Service</div>
            <div class="service-port">localhost:4000</div>
          </div>
          <span class="badge ${state.gatewayOnline ? 'active' : 'inactive'}" style="margin-left:auto">
            <span class="badge-dot"></span>
            ${state.gatewayOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div class="service-details">
          <div class="service-detail">
            <span class="service-detail-label">Type</span>
            <span class="service-detail-value">REST API</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Port</span>
            <span class="service-detail-value">4000</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Endpoints</span>
            <span class="service-detail-value">Users, Products</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Database</span>
            <span class="service-detail-value">In-Memory</span>
          </div>
        </div>
      </div>

      <div class="service-card animate-in">
        <div class="service-header">
          <div class="service-icon frontend">🎨</div>
          <div>
            <div class="service-name">Frontend Service</div>
            <div class="service-port">localhost:3000</div>
          </div>
          <span class="badge active" style="margin-left:auto">
            <span class="badge-dot"></span>
            Online
          </span>
        </div>
        <div class="service-details">
          <div class="service-detail">
            <span class="service-detail-label">Type</span>
            <span class="service-detail-value">Static Server</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Port</span>
            <span class="service-detail-value">3000</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Tech</span>
            <span class="service-detail-value">HTML / CSS / JS</span>
          </div>
          <div class="service-detail">
            <span class="service-detail-label">Gateway</span>
            <span class="service-detail-value">→ :3333</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== Modal Handlers =====
function openUserModal() {
  $('#modal-title').textContent = 'Add New User';
  $('#modal-body').innerHTML = `
    <form id="user-form" onsubmit="handleAddUser(event)">
      <div class="form-group">
        <label class="form-label" for="user-name">Full Name</label>
        <input type="text" class="form-input" id="user-name" placeholder="e.g. John Doe" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="user-email">Email</label>
        <input type="email" class="form-input" id="user-email" placeholder="e.g. john@example.com" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="user-role">Role</label>
        <select class="form-select" id="user-role" required>
          <option value="">Select a role</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="DevOps">DevOps</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Add User</button>
      </div>
    </form>
  `;
  $('#modal-overlay').classList.add('active');
}

function openProductModal() {
  $('#modal-title').textContent = 'Add New Product';
  $('#modal-body').innerHTML = `
    <form id="product-form" onsubmit="handleAddProduct(event)">
      <div class="form-group">
        <label class="form-label" for="product-name">Product Name</label>
        <input type="text" class="form-input" id="product-name" placeholder="e.g. Cloud Server Pro" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="product-category">Category</label>
        <select class="form-select" id="product-category" required>
          <option value="">Select category</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Security">Security</option>
          <option value="Data">Data</option>
          <option value="Monitoring">Monitoring</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="product-price">Price ($)</label>
        <input type="number" class="form-input" id="product-price" placeholder="e.g. 199.99" step="0.01" min="0" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="product-desc">Description</label>
        <input type="text" class="form-input" id="product-desc" placeholder="Brief product description">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Add Product</button>
      </div>
    </form>
  `;
  $('#modal-overlay').classList.add('active');
}

function closeModal() {
  $('#modal-overlay').classList.remove('active');
}

// ===== Form Handlers =====
async function handleAddUser(e) {
  e.preventDefault();
  const data = {
    name: $('#user-name').value,
    email: $('#user-email').value,
    role: $('#user-role').value
  };

  const res = await API.createUser(data);
  if (res?.success) {
    showToast(`${data.name} added successfully`, 'success');
    closeModal();
    await loadData();
    renderPage();
  } else {
    showToast('Failed to add user', 'error');
  }
}

async function handleAddProduct(e) {
  e.preventDefault();
  const data = {
    name: $('#product-name').value,
    category: $('#product-category').value,
    price: $('#product-price').value,
    description: $('#product-desc').value
  };

  const res = await API.createProduct(data);
  if (res?.success) {
    showToast(`${data.name} added successfully`, 'success');
    closeModal();
    await loadData();
    renderPage();
  } else {
    showToast('Failed to add product', 'error');
  }
}

async function deleteUser(id) {
  const res = await API.deleteUser(id);
  if (res?.success) {
    showToast('User removed', 'success');
    await loadData();
    renderPage();
  } else {
    showToast('Failed to delete user', 'error');
  }
}

async function deleteProduct(id) {
  const res = await API.deleteProduct(id);
  if (res?.success) {
    showToast('Product removed', 'success');
    await loadData();
    renderPage();
  } else {
    showToast('Failed to delete product', 'error');
  }
}

// ===== Navigation =====
function navigateTo(page) {
  state.currentPage = page;

  // Update nav
  $$('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update header
  const titles = {
    dashboard: ['Dashboard', 'Overview of your microservices'],
    users: ['Users', 'Manage your team members'],
    products: ['Products', 'Browse and manage products'],
    services: ['Services', 'Monitor service health & architecture']
  };

  const [title, subtitle] = titles[page] || ['Dashboard', ''];
  $('#page-title').textContent = title;
  $('#page-subtitle').textContent = subtitle;

  renderPage();
}

function renderPage() {
  const renderers = {
    dashboard: renderDashboard,
    users: renderUsers,
    products: renderProducts,
    services: renderServices
  };

  (renderers[state.currentPage] || renderDashboard)();
}

// ===== Data Loading =====
async function loadData() {
  const [users, products] = await Promise.all([
    API.getUsers(),
    API.getProducts()
  ]);

  state.users = users;
  state.products = products;
}

async function checkGatewayHealth() {
  state.gatewayOnline = await API.checkHealth();
  const statusEl = $('#gateway-status');
  if (state.gatewayOnline) {
    statusEl.className = 'gateway-status online';
    statusEl.querySelector('span').textContent = 'Gateway: Online';
  } else {
    statusEl.className = 'gateway-status offline';
    statusEl.querySelector('span').textContent = 'Gateway: Offline';
  }
}

// ===== Event Listeners =====
function initEvents() {
  // Nav clicks
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // Mobile menu
  $('#menu-toggle').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
  });

  // Close sidebar on content click (mobile)
  $('.content-area').addEventListener('click', () => {
    $('#sidebar').classList.remove('open');
  });

  // Modal close
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Refresh button
  $('#refresh-btn').addEventListener('click', async () => {
    showToast('Refreshing data...', 'info');
    await loadData();
    await checkGatewayHealth();
    renderPage();
    showToast('Data refreshed!', 'success');
  });
}

// ===== Initialize App =====
async function init() {
  initEvents();
  await checkGatewayHealth();
  await loadData();
  renderPage();

  // Periodic health check every 30s
  setInterval(checkGatewayHealth, 30000);
}

document.addEventListener('DOMContentLoaded', init);
