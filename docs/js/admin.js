























/* ============================================================
   ADMIN DASHBOARD — JS  (Fixed: real API + dynamic URL)
   ============================================================ */

// ─── 1. DETECT API BASE URL ──────────────────────────────────
// Priority: localStorage override → same-origin → localhost
function getApiBase() {
  const override = localStorage.getItem('portfolioApiUrl');
  if (override) return override.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';

  const { hostname, origin } = window.location;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return origin + '/api';
  }
  return 'http://localhost:5000/api';
}

const API = getApiBase();
console.log('[Admin] API base:', API);

// ─── 2. TOKEN MANAGEMENT ─────────────────────────────────────
let token = localStorage.getItem('adminToken');

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
}

// ─── 3. API FETCH HELPER ─────────────────────────────────────
async function apiFetch(path, options) {
  options = options || {};
  const res = await fetch(API + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    token = null;
    showLoginScreen('Session expired. Please log in again.');
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'HTTP ' + res.status);
  return data;
}

// ─── 4. LOGIN ────────────────────────────────────────────────
document.getElementById('loginForm') && document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;
  const errorEl  = document.getElementById('loginError');
  const btn      = e.target.querySelector('button[type="submit"]');

  errorEl.classList.remove('show');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';

  try {
    const res = await fetch(API + '/auth/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ username: username, password: password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      initDashboard();
    } else {
      errorEl.textContent = data.message || 'Invalid credentials';
      errorEl.classList.add('show');
    }
  } catch (err) {
    errorEl.innerHTML = '<strong>Cannot reach API server.</strong><br>'
      + 'Tried: <code>' + API + '</code><br>'
      + '<a href="#" onclick="configureApiUrl()" style="color:#00E5C3;text-decoration:underline;">Set a different API URL</a>';
    errorEl.classList.add('show');
    console.error('Login error:', err);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
});

function configureApiUrl() {
  const current = localStorage.getItem('portfolioApiUrl') || window.location.origin;
  const url = window.prompt(
    'Enter your API server URL (without /api):\nExample: https://shadie10.onrender.com',
    current
  );
  if (url && url.trim()) {
    localStorage.setItem('portfolioApiUrl', url.trim().replace(/\/api\/?$/, '').replace(/\/$/, ''));
    window.location.reload();
  }
}

// ─── 5. LOGOUT ───────────────────────────────────────────────
document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('adminToken');
  token = null;
  showLoginScreen();
});

function showLoginScreen(msg) {
  document.getElementById('dashboard').style.display   = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  if (msg) {
    var el = document.getElementById('loginError');
    el.textContent = msg;
    el.classList.add('show');
  }
}

// ─── 6. INIT DASHBOARD ───────────────────────────────────────
function initDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display   = 'flex';
  loadDashboardStats();
  loadProjectsTable();
  loadExpTable();
  loadMessages();
}

// Auto-login if stored token — verify it first
if (token) {
  fetch(API + '/auth/verify', { headers: authHeaders() })
    .then(function(r) { return r.ok ? initDashboard() : showLoginScreen('Session expired. Please log in.'); })
    .catch(function()  { showLoginScreen(); });
}

// ─── 7. NAVIGATION ───────────────────────────────────────────
var SECTIONS = { overview: 'Dashboard Overview', projects: 'Manage Projects', experience: 'Manage Experience', messages: 'Inbox' };

function showSection(name) {
  Object.keys(SECTIONS).forEach(function(s) {
    var el = document.getElementById('sec-' + s);
    if (el) el.style.display = (s === name) ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-link[data-section]').forEach(function(l) {
    l.classList.toggle('active', l.dataset.section === name);
  });
  var titleEl = document.getElementById('topbarTitle');
  if (titleEl) titleEl.textContent = SECTIONS[name];
}

document.querySelectorAll('.sidebar-link[data-section]').forEach(function(link) {
  link.addEventListener('click', function() {
    showSection(link.dataset.section);
    document.getElementById('sidebar').classList.remove('open');
  });
});

var sidebarToggle = document.getElementById('sidebarToggle');
var sidebarClose  = document.getElementById('sidebarClose');
sidebarToggle && sidebarToggle.addEventListener('click', function() { document.getElementById('sidebar').classList.toggle('open'); });
sidebarClose  && sidebarClose.addEventListener('click',  function() { document.getElementById('sidebar').classList.remove('open'); });

// ─── 8. DASHBOARD STATS ──────────────────────────────────────
async function loadDashboardStats() {
  try {
    var data = await apiFetch('/stats/dashboard');
    var c = (data.data && data.data.counts) ? data.data.counts : {};
    setText('statProjects', c.projects);
    setText('statExp',      c.experiences);
    setText('statMsgs',     c.messages);
    setText('statFeatured', c.featured);

    var unread = c.unread || 0;
    var badge  = document.getElementById('msgBadge');
    if (badge) { badge.textContent = unread; badge.classList.toggle('show', unread > 0); }
    setText('unreadCount', unread + ' unread');
  } catch(e) {
    console.warn('Stats load failed:', e.message);
  }
}
function loadOverview() { loadDashboardStats(); }
function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = (val !== undefined && val !== null) ? val : '—'; }

// ─── 9. PROJECTS TABLE ───────────────────────────────────────
var projects = [];

async function loadProjectsTable() {
  var tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--admin-faint)"><i class="fas fa-spinner fa-spin"></i> Loading…</td></tr>';
  try {
    var data = await apiFetch('/projects/admin/all');
    projects  = data.projects || [];
    renderProjectsTable();
  } catch(err) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="admin-empty"><p>Failed to load: ' + escHtml(err.message) + '</p></div></td></tr>';
  }
}

function renderProjectsTable() {
  var tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;
  if (!projects.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="admin-empty"><i class="fas fa-briefcase"></i><p>No projects yet. Add your first project!</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = projects.map(function(p) {
    return '<tr>'
      + '<td class="td-title">' + escHtml(p.title) + '</td>'
      + '<td>' + escHtml(p.category) + '</td>'
      + '<td><span class="' + (p.featured ? 'featured-chip' : 'plain-chip') + '">' + (p.featured ? '⭐ Yes' : 'No') + '</span></td>'
      + '<td>' + (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—') + '</td>'
      + '<td><div class="tbl-actions">'
        + '<button class="tbl-btn edit" onclick="editProject(\'' + p._id + '\')"><i class="fas fa-edit"></i> Edit</button>'
        + '<button class="tbl-btn del"  onclick="deleteProject(\'' + p._id + '\')"><i class="fas fa-trash"></i></button>'
      + '</div></td>'
    + '</tr>';
  }).join('');
}

var editingProjectId = null;

function openProjectForm(p) {
  p = p || null;
  editingProjectId = p ? p._id : null;
  document.getElementById('projectFormTitle').textContent = p ? 'Edit Project' : 'Add Project';
  document.getElementById('projectId').value    = p && p._id        ? p._id        : '';
  document.getElementById('pTitle').value       = p && p.title      ? p.title      : '';
  document.getElementById('pCategory').value    = p && p.category   ? p.category   : 'api';
  document.getElementById('pDescription').value = p && p.description? p.description: '';
  document.getElementById('pImage').value       = p && p.imageUrl   ? p.imageUrl   : '';
  document.getElementById('pGithub').value      = p && p.githubLink ? p.githubLink : '';
  document.getElementById('pLive').value        = p && p.liveLink   ? p.liveLink   : '';
  document.getElementById('pTech').value        = p && p.techStack  ? p.techStack.join(', ') : '';
  document.getElementById('pTags').value        = p && p.tags       ? p.tags.join(', ')      : '';
  document.getElementById('pFeatured').checked  = p ? !!p.featured : false;
  document.getElementById('projectModal').classList.add('open');
}

function closeProjectModal() { document.getElementById('projectModal').classList.remove('open'); }

function editProject(id) {
  var p = projects.find(function(x) { return x._id === id; });
  if (p) openProjectForm(p);
}

async function deleteProject(id) {
  if (!confirm('Delete this project permanently?')) return;
  try {
    await apiFetch('/projects/' + id, { method: 'DELETE' });
    projects = projects.filter(function(p) { return p._id !== id; });
    renderProjectsTable();
    loadDashboardStats();
    showToast('Project deleted');
  } catch(err) { showToast('Delete failed: ' + err.message, 'error'); }
}

document.getElementById('projectForm') && document.getElementById('projectForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Saving…';

  var payload = {
    title      : document.getElementById('pTitle').value,
    category   : document.getElementById('pCategory').value,
    description: document.getElementById('pDescription').value,
    imageUrl   : document.getElementById('pImage').value,
    githubLink : document.getElementById('pGithub').value,
    liveLink   : document.getElementById('pLive').value,
    techStack  : document.getElementById('pTech').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
    tags       : document.getElementById('pTags').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
    featured   : document.getElementById('pFeatured').checked,
  };

  try {
    if (editingProjectId) {
      var data = await apiFetch('/projects/' + editingProjectId, { method: 'PUT', body: JSON.stringify(payload) });
      var idx = projects.findIndex(function(p){ return p._id === editingProjectId; });
      if (idx > -1) projects[idx] = data.project;
    } else {
      var data = await apiFetch('/projects', { method: 'POST', body: JSON.stringify(payload) });
      projects.unshift(data.project);
    }
    closeProjectModal();
    renderProjectsTable();
    loadDashboardStats();
    showToast('Project saved ✓');
  } catch(err) { showToast('Save failed: ' + err.message, 'error'); }

  btn.disabled = false; btn.textContent = 'Save Project';
});

// ─── 10. EXPERIENCE ──────────────────────────────────────────
var experiences = [];

async function loadExpTable() {
  var tbody = document.getElementById('expTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--admin-faint)"><i class="fas fa-spinner fa-spin"></i> Loading…</td></tr>';
  try {
    var data = await apiFetch('/experiences');
    experiences = data.experiences || [];
    renderExpTable();
  } catch(err) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="admin-empty"><p>Failed to load: ' + escHtml(err.message) + '</p></div></td></tr>';
  }
}

function renderExpTable() {
  var tbody = document.getElementById('expTableBody');
  if (!tbody) return;
  if (!experiences.length) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="admin-empty"><i class="fas fa-clock"></i><p>No experiences yet.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = experiences.map(function(exp) {
    return '<tr>'
      + '<td class="td-title">' + escHtml(exp.role) + '</td>'
      + '<td>' + escHtml(exp.company) + '</td>'
      + '<td>' + escHtml(exp.duration || '—') + '</td>'
      + '<td><div class="tbl-actions">'
        + '<button class="tbl-btn edit" onclick="editExp(\'' + exp._id + '\')"><i class="fas fa-edit"></i> Edit</button>'
        + '<button class="tbl-btn del"  onclick="deleteExp(\'' + exp._id + '\')"><i class="fas fa-trash"></i></button>'
      + '</div></td>'
    + '</tr>';
  }).join('');
}

var editingExpId = null;

function openExpForm(exp) {
  exp = exp || null;
  editingExpId = exp ? exp._id : null;
  document.getElementById('expFormTitle').textContent    = exp ? 'Edit Experience' : 'Add Experience';
  document.getElementById('expId').value                 = exp && exp._id   ? exp._id   : '';
  document.getElementById('eRole').value                 = exp && exp.role  ? exp.role  : '';
  document.getElementById('eCompany').value              = exp && exp.company ? exp.company : '';
  document.getElementById('eDuration').value             = exp && exp.duration ? exp.duration : '';
  document.getElementById('eResponsibilities').value     = exp && exp.responsibilities ? exp.responsibilities.join('\n') : '';
  document.getElementById('eTech').value                 = exp && exp.technologies ? exp.technologies.join(', ') : '';
  document.getElementById('expModal').classList.add('open');
}

function closeExpModal() { document.getElementById('expModal').classList.remove('open'); }

function editExp(id) {
  var exp = experiences.find(function(x){ return x._id === id; });
  if (exp) openExpForm(exp);
}

async function deleteExp(id) {
  if (!confirm('Delete this experience?')) return;
  try {
    await apiFetch('/experiences/' + id, { method: 'DELETE' });
    experiences = experiences.filter(function(e){ return e._id !== id; });
    renderExpTable();
    showToast('Experience deleted');
  } catch(err) { showToast('Delete failed: ' + err.message, 'error'); }
}

document.getElementById('expForm') && document.getElementById('expForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  var btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Saving…';

  var durVal   = document.getElementById('eDuration').value;
  var isCurrent = durVal.toLowerCase().includes('present');
  var payload = {
    role            : document.getElementById('eRole').value,
    company         : document.getElementById('eCompany').value,
    duration        : durVal,
    startDate       : isCurrent ? new Date(new Date().setFullYear(new Date().getFullYear()-1)).toISOString() : new Date().toISOString(),
    isCurrent       : isCurrent,
    responsibilities: document.getElementById('eResponsibilities').value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean),
    technologies    : document.getElementById('eTech').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
  };

  try {
    if (editingExpId) {
      var data = await apiFetch('/experiences/' + editingExpId, { method: 'PUT', body: JSON.stringify(payload) });
      var idx = experiences.findIndex(function(e){ return e._id === editingExpId; });
      if (idx > -1) experiences[idx] = data.experience;
    } else {
      var data = await apiFetch('/experiences', { method: 'POST', body: JSON.stringify(payload) });
      experiences.unshift(data.experience);
    }
    closeExpModal();
    renderExpTable();
    showToast('Experience saved ✓');
  } catch(err) { showToast('Save failed: ' + err.message, 'error'); }

  btn.disabled = false; btn.textContent = 'Save Experience';
});

// ─── 11. MESSAGES ────────────────────────────────────────────
var messages = [];

async function loadMessages() {
  var list = document.getElementById('messagesList');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--admin-faint)"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
  try {
    var data = await apiFetch('/contact');
    messages  = data.messages || [];
    var unread = data.unread || 0;
    var badge  = document.getElementById('msgBadge');
    if (badge) { badge.textContent = unread; badge.classList.toggle('show', unread > 0); }
    setText('unreadCount', unread + ' unread');
    renderMessages();
  } catch(err) {
    list.innerHTML = '<div class="admin-empty"><i class="fas fa-exclamation-triangle"></i><p>Failed: ' + escHtml(err.message) + '</p></div>';
  }
}

function renderMessages() {
  var list = document.getElementById('messagesList');
  if (!list) return;
  if (!messages.length) {
    list.innerHTML = '<div class="admin-empty"><i class="fas fa-inbox"></i><p>No messages yet.</p></div>';
    return;
  }
  list.innerHTML = messages.map(function(m) {
    return '<div class="message-card ' + (m.status === 'unread' ? 'unread' : '') + '" onclick="openMsg(\'' + m._id + '\')">'
      + '<div>'
        + '<div class="msg-name">'    + escHtml(m.name)    + '</div>'
        + '<div class="msg-subject">' + escHtml(m.projectType || 'General Inquiry') + ' · ' + escHtml(m.email) + '</div>'
        + '<div class="msg-preview">' + escHtml(m.message) + '</div>'
      + '</div>'
      + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">'
        + '<span class="msg-date">' + new Date(m.createdAt).toLocaleDateString() + '</span>'
        + (m.status === 'unread' ? '<div class="msg-unread-dot"></div>' : '')
      + '</div>'
    + '</div>';
  }).join('');
}

async function openMsg(id) {
  var m = messages.find(function(x){ return x._id === id; });
  if (!m) return;

  document.getElementById('msgContent').innerHTML =
    '<div class="msg-detail-row"><label>From</label><p><strong>' + escHtml(m.name) + '</strong> · ' + escHtml(m.email) + '</p></div>'
    + (m.phone ? '<div class="msg-detail-row"><label>Phone</label><p>' + escHtml(m.phone) + '</p></div>' : '')
    + '<div class="msg-detail-row"><label>Project Type</label><p>' + escHtml(m.projectType || '—') + '</p></div>'
    + '<div class="msg-detail-row"><label>Budget</label><p>' + escHtml(m.budget || '—') + '</p></div>'
    + '<div class="msg-detail-row"><label>Message</label><p>' + escHtml(m.message).replace(/\n/g,'<br>') + '</p></div>'
    + (m.collaboration ? '<div class="msg-detail-row"><label>Collaboration</label><p>✅ Interested in long-term collaboration</p></div>' : '')
    + '<div class="msg-detail-row"><label>Received</label><p>' + new Date(m.createdAt).toLocaleString() + '</p></div>'
    + '<div class="admin-modal-footer">'
      + '<button class="admin-btn-ghost" onclick="closeMsgModal()">Close</button>'
      + '<a href="mailto:' + m.email + '?subject=Re:%20' + encodeURIComponent(m.projectType || 'Your inquiry') + '" class="admin-btn-primary"><i class="fas fa-reply"></i> Reply</a>'
    + '</div>';

  document.getElementById('msgModal').classList.add('open');

  if (m.status === 'unread') {
    try {
      await apiFetch('/contact/' + id + '/status', { method: 'PATCH', body: JSON.stringify({ status: 'read' }) });
      m.status = 'read';
      renderMessages();
      loadDashboardStats();
    } catch(e) { /* non-critical */ }
  }
}

function closeMsgModal() { document.getElementById('msgModal').classList.remove('open'); }

// ─── 12. MODAL BACKDROP ──────────────────────────────────────
['projectModal','expModal','msgModal'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('click', function(e) {
    if (e.target.id === id) { closeProjectModal(); closeExpModal(); closeMsgModal(); }
  });
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeProjectModal(); closeExpModal(); closeMsgModal(); }
});

// ─── 13. TOAST ───────────────────────────────────────────────
function showToast(msg, type) {
  type = type || 'success';
  var existing = document.getElementById('adminToast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'adminToast';
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;'
    + 'background:' + (type === 'error' ? '#1a0a06' : '#061a16') + ';'
    + 'border:1px solid ' + (type === 'error' ? '#FF6B35' : '#00E5C3') + ';'
    + 'color:' + (type === 'error' ? '#FF6B35' : '#00E5C3') + ';'
    + 'padding:12px 20px;border-radius:10px;font-size:0.875rem;font-weight:600;'
    + 'box-shadow:0 8px 32px rgba(0,0,0,0.4);';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.remove(); }, 3500);
}

// ─── 14. XSS PROTECTION ──────────────────────────────────────
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


















// const API = "https://shadie10.onrender.com/api";
// let token = localStorage.getItem('adminToken');

// // ─── Auth ─────────────────────────────────────────────────
// document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const user = document.getElementById('loginUser').value;
//   const pass = document.getElementById('loginPass').value;
//   const errorEl = document.getElementById('loginError');
//   errorEl.classList.remove('show');
//   try {
//     const res = await fetch(`${API}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username: user, password: pass }),
//     });
//     const data = await res.json();
//     if (data.token) {
//       token = data.token;
//       localStorage.setItem('adminToken', token);
//       initDashboard();
//     // } else {
//     //   // Demo mode login
//     //   if (user === 'shadie' && pass === 'shadie') {
//     //     token = 'demo-token';
//     //     localStorage.setItem('adminToken', token);
//     //     initDashboard();
//     //   } else {
//     //     errorEl.textContent = 'Invalid credentials.';
//     //     errorEl.classList.add('show');
//     //   }
//     }
//   } catch {
//     // Demo fallback
//     // if (user === 'shadie' && pass === 'shadie10') {
//     //   token = 'demo-token';
//     //   localStorage.setItem('adminToken', token);
//     //   initDashboard();
//     // } else {
//     //   errorEl.textContent = 'Invalid credentials. ';
//     //   errorEl.classList.add('show');
//     // }
//    }
// });

// document.getElementById('logoutBtn')?.addEventListener('click', () => {
//   localStorage.removeItem('adminToken');
//   token = null;
//   document.getElementById('dashboard').style.display = 'none';
//   document.getElementById('loginScreen').style.display = 'flex';
// });

// function initDashboard() {
//   document.getElementById('loginScreen').style.display = 'none';
//   document.getElementById('dashboard').style.display = 'flex';
//   loadOverview();
//   loadProjectsTable();
//   loadExpTable();
//   loadMessages();
// }

// // Auto-login if token exists
// if (token) initDashboard();

// // ─── Navigation ───────────────────────────────────────────
// const sections = { overview: 'Overview', projects: 'Manage Projects', experience: 'Experience', messages: 'Inbox' };

// function showSection(name) {
//   Object.keys(sections).forEach(s => {
//     const el = document.getElementById(`sec-${s}`);
//     if (el) el.style.display = s === name ? 'block' : 'none';
//   });
//   document.querySelectorAll('.sidebar-link[data-section]').forEach(l => {
//     l.classList.toggle('active', l.dataset.section === name);
//   });
//   document.getElementById('topbarTitle').textContent = sections[name];
// }

// document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
//   link.addEventListener('click', () => {
//     showSection(link.dataset.section);
//     // Close sidebar on mobile
//     document.getElementById('sidebar').classList.remove('open');
//   });
// });

// // Mobile sidebar toggle
// document.getElementById('sidebarToggle')?.addEventListener('click', () => {
//   document.getElementById('sidebar').classList.toggle('open');
// });
// document.getElementById('sidebarClose')?.addEventListener('click', () => {
//   document.getElementById('sidebar').classList.remove('open');
// });

// // ─── Sample Data (when API unavailable) ───────────────────
// let projects = [
//   { _id: '1', title: 'MicroAuth Service', category: 'backend', description: 'JWT authentication microservice.', techStack: ['Node.js', 'Express', 'MongoDB'], tags: ['auth'], githubLink: 'https://github.com', liveLink: '', featured: true, imageUrl: 'https://picsum.photos/seed/auth2/600/400', createdAt: '2024-02-20' },
//   ];
// let experiences = [
   
//   { _id: '1', role: 'Backend Developer', company: 'BuildStack Technologies', duration: 'Jun 2021 – Dec 2022', responsibilities: ['Built SaaS platform APIs', 'Designed multi-tenant database schema'], technologies: ['Node.js', 'Express.js', 'MongoDB'] },
// ];
// let messages = [
//   { _id: '1', name: 'James Mwangi', email: 'james@finpay.com', projectType: 'API Development', budget: '$5,000–$15,000', message: 'Hi Alex, I need help building a payment API for our startup. Can we talk?', read: false, createdAt: new Date().toISOString() },
//   { _id: '2', name: 'Sarah Rahman', email: 'sarah@buildstack.io', projectType: 'System Design Consultation', budget: '$2,000–$5,000', message: 'Looking for an architect to review our microservices design before we scale.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
// ];

// // ─── Overview ─────────────────────────────────────────────
// async function loadOverview() {
//   document.getElementById('statProjects').textContent = projects.length;
//   document.getElementById('statExp').textContent = experiences.length;
//   document.getElementById('statMsgs').textContent = messages.length;
//   document.getElementById('statFeatured').textContent = projects.filter(p => p.featured).length;
//   const unread = messages.filter(m => !m.read).length;
//   const badge = document.getElementById('msgBadge');
//   badge.textContent = unread;
//   badge.classList.toggle('show', unread > 0);
//   document.getElementById('unreadCount').textContent = `${unread} unread`;
// }

// // ─── Projects Table ───────────────────────────────────────
// function loadProjectsTable() {
//   const tbody = document.getElementById('projectsTableBody');
//   if (!projects.length) {
//     tbody.innerHTML = `<tr><td colspan="5"><div class="admin-empty"><i class="fas fa-briefcase"></i><p>No projects yet. Add your first project!</p></div></td></tr>`;
//     return;
//   }
//   tbody.innerHTML = projects.map(p => `
//     <tr>
//       <td class="td-title">${p.title}</td>
//       <td>${p.category}</td>
//       <td><span class="${p.featured ? 'featured-chip' : 'plain-chip'}">${p.featured ? '⭐ Yes' : 'No'}</span></td>
//       <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
//       <td>
//         <div class="tbl-actions">
//           <button class="tbl-btn edit" onclick="editProject('${p._id}')"><i class="fas fa-edit"></i> Edit</button>
//           <button class="tbl-btn del" onclick="deleteProject('${p._id}')"><i class="fas fa-trash"></i></button>
//         </div>
//       </td>
//     </tr>
//   `).join('');
// }

// // ─── Project Modal ────────────────────────────────────────
// let editingProjectId = null;

// function openProjectForm(p = null) {
//   editingProjectId = p ? p._id : null;
//   document.getElementById('projectFormTitle').textContent = p ? 'Edit Project' : 'Add Project';
//   document.getElementById('projectId').value = p?._id || '';
//   document.getElementById('pTitle').value = p?.title || '';
//   document.getElementById('pCategory').value = p?.category || 'api';
//   document.getElementById('pDescription').value = p?.description || '';
//   document.getElementById('pImage').value = p?.imageUrl || '';
//   document.getElementById('pGithub').value = p?.githubLink || '';
//   document.getElementById('pLive').value = p?.liveLink || '';
//   document.getElementById('pTech').value = (p?.techStack || []).join(', ');
//   document.getElementById('pTags').value = (p?.tags || []).join(', ');
//   document.getElementById('pFeatured').checked = p?.featured || false;
//   document.getElementById('projectModal').classList.add('open');
// }

// function closeProjectModal() { document.getElementById('projectModal').classList.remove('open'); }

// function editProject(id) {
//   const p = projects.find(x => x._id === id);
//   if (p) { openProjectForm(p); showSection('projects'); }
// }

// async function deleteProject(id) {
//   if (!confirm('Delete this project?')) return;
//   projects = projects.filter(p => p._id !== id);
//   loadProjectsTable();
//   loadOverview();
// }

// document.getElementById('projectForm')?.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const id = editingProjectId || String(Date.now());
//   const updated = {
//     _id: id,
//     title: document.getElementById('pTitle').value,
//     category: document.getElementById('pCategory').value,
//     description: document.getElementById('pDescription').value,
//     imageUrl: document.getElementById('pImage').value,
//     githubLink: document.getElementById('pGithub').value,
//     liveLink: document.getElementById('pLive').value,
//     techStack: document.getElementById('pTech').value.split(',').map(s => s.trim()).filter(Boolean),
//     tags: document.getElementById('pTags').value.split(',').map(s => s.trim()).filter(Boolean),
//     featured: document.getElementById('pFeatured').checked,
//     createdAt: new Date().toISOString(),
//   };
//   if (editingProjectId) {
//     const idx = projects.findIndex(p => p._id === editingProjectId);
//     if (idx > -1) projects[idx] = updated;
//   } else {
//     projects.push(updated);
//   }
//   closeProjectModal();
//   loadProjectsTable();
//   loadOverview();
//   alert('Project saved! (In production, this syncs to your database.)');
// });

// // ─── Experience Table ─────────────────────────────────────
// function loadExpTable() {
//   const tbody = document.getElementById('expTableBody');
//   if (!experiences.length) {
//     tbody.innerHTML = `<tr><td colspan="4"><div class="admin-empty"><i class="fas fa-clock"></i><p>No experiences yet.</p></div></td></tr>`;
//     return;
//   }
//   tbody.innerHTML = experiences.map(exp => `
//     <tr>
//       <td class="td-title">${exp.role}</td>
//       <td>${exp.company}</td>
//       <td>${exp.duration}</td>
//       <td>
//         <div class="tbl-actions">
//           <button class="tbl-btn edit" onclick="editExp('${exp._id}')"><i class="fas fa-edit"></i> Edit</button>
//           <button class="tbl-btn del" onclick="deleteExp('${exp._id}')"><i class="fas fa-trash"></i></button>
//         </div>
//       </td>
//     </tr>
//   `).join('');
// }

// let editingExpId = null;

// function openExpForm(exp = null) {
//   editingExpId = exp ? exp._id : null;
//   document.getElementById('expFormTitle').textContent = exp ? 'Edit Experience' : 'Add Experience';
//   document.getElementById('expId').value = exp?._id || '';
//   document.getElementById('eRole').value = exp?.role || '';
//   document.getElementById('eCompany').value = exp?.company || '';
//   document.getElementById('eDuration').value = exp?.duration || '';
//   document.getElementById('eResponsibilities').value = (exp?.responsibilities || []).join('\n');
//   document.getElementById('eTech').value = (exp?.technologies || []).join(', ');
//   document.getElementById('expModal').classList.add('open');
// }

// function closeExpModal() { document.getElementById('expModal').classList.remove('open'); }

// function editExp(id) {
//   const exp = experiences.find(x => x._id === id);
//   if (exp) { openExpForm(exp); showSection('experience'); }
// }

// function deleteExp(id) {
//   if (!confirm('Delete this experience?')) return;
//   experiences = experiences.filter(e => e._id !== id);
//   loadExpTable();
//   loadOverview();
// }

// document.getElementById('expForm')?.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const id = editingExpId || String(Date.now());
//   const updated = {
//     _id: id,
//     role: document.getElementById('eRole').value,
//     company: document.getElementById('eCompany').value,
//     duration: document.getElementById('eDuration').value,
//     responsibilities: document.getElementById('eResponsibilities').value.split('\n').map(s => s.trim()).filter(Boolean),
//     technologies: document.getElementById('eTech').value.split(',').map(s => s.trim()).filter(Boolean),
//   };
//   if (editingExpId) {
//     const idx = experiences.findIndex(e => e._id === editingExpId);
//     if (idx > -1) experiences[idx] = updated;
//   } else {
//     experiences.push(updated);
//   }
//   closeExpModal();
//   loadExpTable();
//   loadOverview();
//   alert('Experience saved!');
// });

// // ─── Messages ─────────────────────────────────────────────
// function loadMessages() {
//   const list = document.getElementById('messagesList');
//   if (!messages.length) {
//     list.innerHTML = `<div class="admin-empty"><i class="fas fa-inbox"></i><p>No messages yet.</p></div>`;
//     return;
//   }
//   list.innerHTML = messages.map(m => `
//     <div class="message-card ${m.read ? '' : 'unread'}" onclick="openMsg('${m._id}')">
//       <div>
//         <div class="msg-name">${m.name}</div>
//         <div class="msg-subject">${m.projectType || 'General Inquiry'} · ${m.email}</div>
//         <div class="msg-preview">${m.message}</div>
//       </div>
//       <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
//         <span class="msg-date">${new Date(m.createdAt).toLocaleDateString()}</span>
//         ${!m.read ? '<div class="msg-unread-dot"></div>' : ''}
//       </div>
//     </div>
//   `).join('');
// }

// function openMsg(id) {
//   const m = messages.find(x => x._id === id);
//   if (!m) return;
//   m.read = true;
//   document.getElementById('msgContent').innerHTML = `
//     <div class="msg-detail-row"><label>From</label><p><strong>${m.name}</strong> · ${m.email}</p></div>
//     ${m.phone ? `<div class="msg-detail-row"><label>Phone</label><p>${m.phone}</p></div>` : ''}
//     <div class="msg-detail-row"><label>Project Type</label><p>${m.projectType || '—'}</p></div>
//     <div class="msg-detail-row"><label>Budget</label><p>${m.budget || '—'}</p></div>
//     <div class="msg-detail-row"><label>Message</label><p>${m.message}</p></div>
//     <div class="msg-detail-row"><label>Received</label><p>${new Date(m.createdAt).toLocaleString()}</p></div>
//     <div class="admin-modal-footer">
//       <button class="admin-btn-ghost" onclick="closeMsgModal()">Close</button>
//       <a href="mailto:${m.email}" class="admin-btn-primary"><i class="fas fa-reply"></i> Reply</a>
//     </div>
//   `;
//   document.getElementById('msgModal').classList.add('open');
//   loadMessages();
//   loadOverview();
// }

// function closeMsgModal() { document.getElementById('msgModal').classList.remove('open'); }

// // Close modals on backdrop click
// ['projectModal', 'expModal', 'msgModal'].forEach(id => {
//   document.getElementById(id)?.addEventListener('click', e => {
//     if (e.target === e.currentTarget) {
//       closeProjectModal(); closeExpModal(); closeMsgModal();
//     }
//   });
// });

// document.addEventListener('keydown', e => {
//   if (e.key === 'Escape') { closeProjectModal(); closeExpModal(); closeMsgModal(); }
// });


