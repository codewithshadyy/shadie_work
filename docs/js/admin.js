

const API = "http://localhost:4646/api";
let token = localStorage.getItem('adminToken');

// ─── Auth ─────────────────────────────────────────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('loginError');
  errorEl.classList.remove('show');
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    const data = await res.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      initDashboard();
    // } else {
    //   // Demo mode login
    //   if (user === 'shadie' && pass === 'shadie') {
    //     token = 'demo-token';
    //     localStorage.setItem('adminToken', token);
    //     initDashboard();
    //   } else {
    //     errorEl.textContent = 'Invalid credentials.';
    //     errorEl.classList.add('show');
    //   }
    }
  } catch {
    // Demo fallback
  //   if (user === 'shadie' && pass === 'shadie10') {
  //     token = 'demo-token';
  //     localStorage.setItem('adminToken', token);
  //     initDashboard();
  //   } else {
  //     errorEl.textContent = 'Invalid credentials. ';
  //     errorEl.classList.add('show');
  //   }
   }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  token = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
});

function initDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  loadOverview();
  loadProjectsTable();
  loadExpTable();
  loadMessages();
}

// Auto-login if token exists
if (token) initDashboard();

// ─── Navigation ───────────────────────────────────────────
const sections = { overview: 'Overview', projects: 'Manage Projects', experience: 'Experience', messages: 'Inbox' };

function showSection(name) {
  Object.keys(sections).forEach(s => {
    const el = document.getElementById(`sec-${s}`);
    if (el) el.style.display = s === name ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-link[data-section]').forEach(l => {
    l.classList.toggle('active', l.dataset.section === name);
  });
  document.getElementById('topbarTitle').textContent = sections[name];
}

document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
  link.addEventListener('click', () => {
    showSection(link.dataset.section);
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
  });
});

// Mobile sidebar toggle
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('sidebarClose')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
});

// ─── Sample Data (when API unavailable) ───────────────────
let projects = [
  { _id: '1', title: 'MicroAuth Service', category: 'backend', description: 'JWT authentication microservice.', techStack: ['Node.js', 'Express', 'MongoDB'], tags: ['auth'], githubLink: 'https://github.com', liveLink: '', featured: true, imageUrl: 'https://picsum.photos/seed/auth2/600/400', createdAt: '2024-02-20' },
  ];
let experiences = [
   
  { _id: '1', role: 'Backend Developer', company: 'BuildStack Technologies', duration: 'Jun 2021 – Dec 2022', responsibilities: ['Built SaaS platform APIs', 'Designed multi-tenant database schema'], technologies: ['Node.js', 'Express.js', 'MongoDB'] },
];
let messages = [
  { _id: '1', name: 'James Mwangi', email: 'james@finpay.com', projectType: 'API Development', budget: '$5,000–$15,000', message: 'Hi Alex, I need help building a payment API for our startup. Can we talk?', read: false, createdAt: new Date().toISOString() },
  { _id: '2', name: 'Sarah Rahman', email: 'sarah@buildstack.io', projectType: 'System Design Consultation', budget: '$2,000–$5,000', message: 'Looking for an architect to review our microservices design before we scale.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// ─── Overview ─────────────────────────────────────────────
async function loadOverview() {
  document.getElementById('statProjects').textContent = projects.length;
  document.getElementById('statExp').textContent = experiences.length;
  document.getElementById('statMsgs').textContent = messages.length;
  document.getElementById('statFeatured').textContent = projects.filter(p => p.featured).length;
  const unread = messages.filter(m => !m.read).length;
  const badge = document.getElementById('msgBadge');
  badge.textContent = unread;
  badge.classList.toggle('show', unread > 0);
  document.getElementById('unreadCount').textContent = `${unread} unread`;
}

// ─── Projects Table ───────────────────────────────────────
function loadProjectsTable() {
  const tbody = document.getElementById('projectsTableBody');
  if (!projects.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="admin-empty"><i class="fas fa-briefcase"></i><p>No projects yet. Add your first project!</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td class="td-title">${p.title}</td>
      <td>${p.category}</td>
      <td><span class="${p.featured ? 'featured-chip' : 'plain-chip'}">${p.featured ? '⭐ Yes' : 'No'}</span></td>
      <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn edit" onclick="editProject('${p._id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="tbl-btn del" onclick="deleteProject('${p._id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── Project Modal ────────────────────────────────────────
let editingProjectId = null;

function openProjectForm(p = null) {
  editingProjectId = p ? p._id : null;
  document.getElementById('projectFormTitle').textContent = p ? 'Edit Project' : 'Add Project';
  document.getElementById('projectId').value = p?._id || '';
  document.getElementById('pTitle').value = p?.title || '';
  document.getElementById('pCategory').value = p?.category || 'api';
  document.getElementById('pDescription').value = p?.description || '';
  document.getElementById('pImage').value = p?.imageUrl || '';
  document.getElementById('pGithub').value = p?.githubLink || '';
  document.getElementById('pLive').value = p?.liveLink || '';
  document.getElementById('pTech').value = (p?.techStack || []).join(', ');
  document.getElementById('pTags').value = (p?.tags || []).join(', ');
  document.getElementById('pFeatured').checked = p?.featured || false;
  document.getElementById('projectModal').classList.add('open');
}

function closeProjectModal() { document.getElementById('projectModal').classList.remove('open'); }

function editProject(id) {
  const p = projects.find(x => x._id === id);
  if (p) { openProjectForm(p); showSection('projects'); }
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  projects = projects.filter(p => p._id !== id);
  loadProjectsTable();
  loadOverview();
}

document.getElementById('projectForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = editingProjectId || String(Date.now());
  const updated = {
    _id: id,
    title: document.getElementById('pTitle').value,
    category: document.getElementById('pCategory').value,
    description: document.getElementById('pDescription').value,
    imageUrl: document.getElementById('pImage').value,
    githubLink: document.getElementById('pGithub').value,
    liveLink: document.getElementById('pLive').value,
    techStack: document.getElementById('pTech').value.split(',').map(s => s.trim()).filter(Boolean),
    tags: document.getElementById('pTags').value.split(',').map(s => s.trim()).filter(Boolean),
    featured: document.getElementById('pFeatured').checked,
    createdAt: new Date().toISOString(),
  };
  if (editingProjectId) {
    const idx = projects.findIndex(p => p._id === editingProjectId);
    if (idx > -1) projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  closeProjectModal();
  loadProjectsTable();
  loadOverview();
  alert('Project saved! (In production, this syncs to your database.)');
});

// ─── Experience Table ─────────────────────────────────────
function loadExpTable() {
  const tbody = document.getElementById('expTableBody');
  if (!experiences.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="admin-empty"><i class="fas fa-clock"></i><p>No experiences yet.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = experiences.map(exp => `
    <tr>
      <td class="td-title">${exp.role}</td>
      <td>${exp.company}</td>
      <td>${exp.duration}</td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn edit" onclick="editExp('${exp._id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="tbl-btn del" onclick="deleteExp('${exp._id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

let editingExpId = null;

function openExpForm(exp = null) {
  editingExpId = exp ? exp._id : null;
  document.getElementById('expFormTitle').textContent = exp ? 'Edit Experience' : 'Add Experience';
  document.getElementById('expId').value = exp?._id || '';
  document.getElementById('eRole').value = exp?.role || '';
  document.getElementById('eCompany').value = exp?.company || '';
  document.getElementById('eDuration').value = exp?.duration || '';
  document.getElementById('eResponsibilities').value = (exp?.responsibilities || []).join('\n');
  document.getElementById('eTech').value = (exp?.technologies || []).join(', ');
  document.getElementById('expModal').classList.add('open');
}

function closeExpModal() { document.getElementById('expModal').classList.remove('open'); }

function editExp(id) {
  const exp = experiences.find(x => x._id === id);
  if (exp) { openExpForm(exp); showSection('experience'); }
}

function deleteExp(id) {
  if (!confirm('Delete this experience?')) return;
  experiences = experiences.filter(e => e._id !== id);
  loadExpTable();
  loadOverview();
}

document.getElementById('expForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = editingExpId || String(Date.now());
  const updated = {
    _id: id,
    role: document.getElementById('eRole').value,
    company: document.getElementById('eCompany').value,
    duration: document.getElementById('eDuration').value,
    responsibilities: document.getElementById('eResponsibilities').value.split('\n').map(s => s.trim()).filter(Boolean),
    technologies: document.getElementById('eTech').value.split(',').map(s => s.trim()).filter(Boolean),
  };
  if (editingExpId) {
    const idx = experiences.findIndex(e => e._id === editingExpId);
    if (idx > -1) experiences[idx] = updated;
  } else {
    experiences.push(updated);
  }
  closeExpModal();
  loadExpTable();
  loadOverview();
  alert('Experience saved!');
});

// ─── Messages ─────────────────────────────────────────────
function loadMessages() {
  const list = document.getElementById('messagesList');
  if (!messages.length) {
    list.innerHTML = `<div class="admin-empty"><i class="fas fa-inbox"></i><p>No messages yet.</p></div>`;
    return;
  }
  list.innerHTML = messages.map(m => `
    <div class="message-card ${m.read ? '' : 'unread'}" onclick="openMsg('${m._id}')">
      <div>
        <div class="msg-name">${m.name}</div>
        <div class="msg-subject">${m.projectType || 'General Inquiry'} · ${m.email}</div>
        <div class="msg-preview">${m.message}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <span class="msg-date">${new Date(m.createdAt).toLocaleDateString()}</span>
        ${!m.read ? '<div class="msg-unread-dot"></div>' : ''}
      </div>
    </div>
  `).join('');
}

function openMsg(id) {
  const m = messages.find(x => x._id === id);
  if (!m) return;
  m.read = true;
  document.getElementById('msgContent').innerHTML = `
    <div class="msg-detail-row"><label>From</label><p><strong>${m.name}</strong> · ${m.email}</p></div>
    ${m.phone ? `<div class="msg-detail-row"><label>Phone</label><p>${m.phone}</p></div>` : ''}
    <div class="msg-detail-row"><label>Project Type</label><p>${m.projectType || '—'}</p></div>
    <div class="msg-detail-row"><label>Budget</label><p>${m.budget || '—'}</p></div>
    <div class="msg-detail-row"><label>Message</label><p>${m.message}</p></div>
    <div class="msg-detail-row"><label>Received</label><p>${new Date(m.createdAt).toLocaleString()}</p></div>
    <div class="admin-modal-footer">
      <button class="admin-btn-ghost" onclick="closeMsgModal()">Close</button>
      <a href="mailto:${m.email}" class="admin-btn-primary"><i class="fas fa-reply"></i> Reply</a>
    </div>
  `;
  document.getElementById('msgModal').classList.add('open');
  loadMessages();
  loadOverview();
}

function closeMsgModal() { document.getElementById('msgModal').classList.remove('open'); }

// Close modals on backdrop click
['projectModal', 'expModal', 'msgModal'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      closeProjectModal(); closeExpModal(); closeMsgModal();
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProjectModal(); closeExpModal(); closeMsgModal(); }
});