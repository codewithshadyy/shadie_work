

// const API = "https://shadie10.onrender.com/api";
// let token = localStorage.getItem('adminToken');



// // ─── Sample Data (when API unavailable) ───────────────────

// let projects = [
//   // { _id: '1', title: 'MicroAuth Service', category: 'backend', description: 'JWT authentication microservice.', techStack: ['Node.js', 'Express', 'MongoDB'], tags: ['auth'], githubLink: 'https://github.com', liveLink: '', featured: true, imageUrl: 'https://picsum.photos/seed/auth2/600/400', createdAt: '2024-02-20' },
//   ];
// let experiences = [
   
//   // { _id: '1', role: 'Backend Developer', company: 'BuildStack Technologies', duration: 'Jun 2021 – Dec 2022', responsibilities: ['Built SaaS platform APIs', 'Designed multi-tenant database schema'], technologies: ['Node.js', 'Express.js', 'MongoDB'] },
// ];
// let messages = [
// //   { _id: '1', name: 'James Mwangi', email: 'james@finpay.com', projectType: 'API Development', budget: '$5,000–$15,000', message: 'Hi Alex, I need help building a payment API for our startup. Can we talk?', read: false, createdAt: new Date().toISOString() },
// //   { _id: '2', name: 'Sarah Rahman', email: 'sarah@buildstack.io', projectType: 'System Design Consultation', budget: '$2,000–$5,000', message: 'Looking for an architect to review our microservices design before we scale.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
// ];




// const sections = { overview: 'Overview', projects: 'Manage Projects', experience: 'Experience', messages: 'Inbox' };






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


// if (token) initDashboard();

// // ─── Navigation ───────────────────────────────────────────
// // const sections = { overview: 'Overview', projects: 'Manage Projects', experience: 'Experience', messages: 'Inbox' };

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



// // // ─── Sample Data (when API unavailable) ───────────────────

// // let projects = [
// //   { _id: '1', title: 'MicroAuth Service', category: 'backend', description: 'JWT authentication microservice.', techStack: ['Node.js', 'Express', 'MongoDB'], tags: ['auth'], githubLink: 'https://github.com', liveLink: '', featured: true, imageUrl: 'https://picsum.photos/seed/auth2/600/400', createdAt: '2024-02-20' },
// //   ];
// // let experiences = [
   
// //   { _id: '1', role: 'Backend Developer', company: 'BuildStack Technologies', duration: 'Jun 2021 – Dec 2022', responsibilities: ['Built SaaS platform APIs', 'Designed multi-tenant database schema'], technologies: ['Node.js', 'Express.js', 'MongoDB'] },
// // ];
// // let messages = [
// //   { _id: '1', name: 'James Mwangi', email: 'james@finpay.com', projectType: 'API Development', budget: '$5,000–$15,000', message: 'Hi Alex, I need help building a payment API for our startup. Can we talk?', read: false, createdAt: new Date().toISOString() },
// //   { _id: '2', name: 'Sarah Rahman', email: 'sarah@buildstack.io', projectType: 'System Design Consultation', budget: '$2,000–$5,000', message: 'Looking for an architect to review our microservices design before we scale.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
// // ];

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
  


//  if (!Array.isArray(projects)) {
//     console.error("Projects is not an array");
//     return;
//   }


  
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





const API = "https://shadie10.onrender.com/api";
let token = localStorage.getItem('adminToken');

// ─── In-memory cache (populated from API) ─────────────────
let projects = [];
let experiences = [];
let messages = [];

// ─── Sections map ─────────────────────────────────────────
const sections = {
  overview: 'Overview',
  projects: 'Manage Projects',
  experience: 'Experience',
  messages: 'Inbox',
};

// ─── API Helper ───────────────────────────────────────────
// async function apiFetch(path, options = {}) {
//   const headers = { 'Content-Type': 'application/json' };
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   const res = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...options.headers } });
//   if (res.status === 401) {
//     handleUnauthorized();
//     throw new Error('Unauthorized');
//   }
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({ message: res.statusText }));
//     throw new Error(err.message || `Request failed: ${res.status}`);
//   }
//   // 204 No Content
//   if (res.status === 204) return null;
//   return res.json();
// }


async function apiFetch(path, options = {}) {

  const cleanPath = path.startsWith('/')
    ? path
    : `/${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${cleanPath}`, {
    ...options,
    headers
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {

    let err = {
      message: `Request failed: ${res.status}`
    };

    try {
      err = await res.json();
    } catch {}

    throw new Error(err.message);
  }

  if (res.status === 204) return null;

  return res.json();
}





function handleUnauthorized() {
  localStorage.removeItem('adminToken');
  token = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  showToast('Session expired. Please log in again.', 'error');
}

// ─── Toast Notifications ──────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      display: flex; flex-direction: column; gap: 10px; z-index: 9999;
    `;
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';
  toast.style.cssText = `
    background: ${bg}; color: #fff; padding: 12px 18px;
    border-radius: 8px; font-size: 14px; font-weight: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,.2);
    animation: slideInToast .3s ease;
    max-width: 320px;
  `;
  toast.textContent = message;

  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideInToast { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeOutToast { from { opacity:1; } to { opacity:0; } }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOutToast .4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─── Loading State ────────────────────────────────────────
function setLoading(btnEl, loading, originalText) {
  if (!btnEl) return;
  btnEl.disabled = loading;
  btnEl.textContent = loading ? 'Saving…' : originalText;
}

// ─── Auth ─────────────────────────────────────────────────
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('loginError');
  const btn = e.target.querySelector('button[type="submit"]');
  errorEl.classList.remove('show');
  setLoading(btn, true, 'Login');

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password: pass }),
    });
    if (data?.token) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      initDashboard();
    } else {
      errorEl.textContent = 'Invalid credentials.';
      errorEl.classList.add('show');
    }
  } catch (err) {
    errorEl.textContent = err.message || 'Login failed. Please try again.';
    errorEl.classList.add('show');
  } finally {
    setLoading(btn, false, 'Login');
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  token = null;
  projects = []; experiences = []; messages = [];
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
});

async function initDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  showSection('overview');
  await Promise.all([fetchProjects(), fetchExperiences(), fetchMessages()]);
  loadOverview();
}

if (token) initDashboard();

// ─── Navigation ───────────────────────────────────────────
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
    document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('sidebarClose')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
});

// ─── Overview ─────────────────────────────────────────────
function loadOverview() {
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

// ─── Projects — Fetch ─────────────────────────────────────
async function fetchProjects() {
  try {
    const data = await apiFetch('/projects');
    projects = Array.isArray(data) ? data : (data?.projects ?? data?.data ?? []);
    loadProjectsTable();
  } catch (err) {
    showToast(`Failed to load projects: ${err.message}`, 'error');
  }
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

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('open');
}

function editProject(id) {
  const p = projects.find(x => x._id === id);
  if (p) { openProjectForm(p); showSection('projects'); }
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await apiFetch(`/projects/${id}`, { method: 'DELETE' });
    projects = projects.filter(p => p._id !== id);
    loadProjectsTable();
    loadOverview();
    showToast('Project deleted.');
  } catch (err) {
    showToast(`Delete failed: ${err.message}`, 'error');
  }
}

document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn?.textContent || 'Save';
  setLoading(btn, true, originalText);

  const payload = {
    title: document.getElementById('pTitle').value,
    category: document.getElementById('pCategory').value,
    description: document.getElementById('pDescription').value,
    imageUrl: document.getElementById('pImage').value,
    githubLink: document.getElementById('pGithub').value,
    liveLink: document.getElementById('pLive').value,
    techStack: document.getElementById('pTech').value.split(',').map(s => s.trim()).filter(Boolean),
    tags: document.getElementById('pTags').value.split(',').map(s => s.trim()).filter(Boolean),
    featured: document.getElementById('pFeatured').checked,
  };

  try {
    if (editingProjectId) {
      const updated = await apiFetch(`/projects/${editingProjectId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const idx = projects.findIndex(p => p._id === editingProjectId);
      if (idx > -1) projects[idx] = updated?.project ?? updated;
    } else {
      const created = await apiFetch('/projects/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      projects.push(created?.project ?? created);
    }
    closeProjectModal();
    loadProjectsTable();
    loadOverview();
    showToast(editingProjectId ? 'Project updated!' : 'Project created!');
  } catch (err) {
    showToast(`Save failed: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false, originalText);
  }
});

// ─── Experiences — Fetch ──────────────────────────────────
async function fetchExperiences() {
  try {
    const data = await apiFetch('/experiences');
    experiences = Array.isArray(data) ? data : (data?.experiences ?? data?.data ?? []);
    loadExpTable();
  } catch (err) {
    showToast(`Failed to load experiences: ${err.message}`, 'error');
  }
}

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

function closeExpModal() {
  document.getElementById('expModal').classList.remove('open');
}

function editExp(id) {
  const exp = experiences.find(x => x._id === id);
  if (exp) { openExpForm(exp); showSection('experience'); }
}

async function deleteExp(id) {
  if (!confirm('Delete this experience?')) return;
  try {
    await apiFetch(`/experiences/${id}`, { method: 'DELETE' });
    experiences = experiences.filter(e => e._id !== id);
    loadExpTable();
    loadOverview();
    showToast('Experience deleted.');
  } catch (err) {
    showToast(`Delete failed: ${err.message}`, 'error');
  }
}

document.getElementById('expForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn?.textContent || 'Save';
  setLoading(btn, true, originalText);

  const payload = {
    role: document.getElementById('eRole').value,
    company: document.getElementById('eCompany').value,
    duration: document.getElementById('eDuration').value,
    responsibilities: document.getElementById('eResponsibilities').value.split('\n').map(s => s.trim()).filter(Boolean),
    technologies: document.getElementById('eTech').value.split(',').map(s => s.trim()).filter(Boolean),
  };

  try {
    if (editingExpId) {
      const updated = await apiFetch(`/experiences/${editingExpId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const idx = experiences.findIndex(e => e._id === editingExpId);
      if (idx > -1) experiences[idx] = updated?.experience ?? updated;
    } else {
      const created = await apiFetch('/experiences/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      experiences.push(created?.experience ?? created);
    }
    closeExpModal();
    loadExpTable();
    loadOverview();
    showToast(editingExpId ? 'Experience updated!' : 'Experience created!');
  } catch (err) {
    showToast(`Save failed: ${err.message}`, 'error');
  } finally {
    setLoading(btn, false, originalText);
  }
});

// ─── Messages — Fetch ─────────────────────────────────────
async function fetchMessages() {
  try {
    const data = await apiFetch('/contact');
    messages = Array.isArray(data) ? data : (data?.messages ?? data?.data ?? []);
    loadMessages();
  } catch (err) {
    showToast(`Failed to load messages: ${err.message}`, 'error');
  }
}

// ─── Messages List ────────────────────────────────────────
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

async function openMsg(id) {
  const m = messages.find(x => x._id === id);
  if (!m) return;

  // Mark as read on the server if not already
  if (!m.read) {
    try {
      await apiFetch(`/contact/${id}/read`, { method: 'PATCH' });
      m.read = true;
    } catch {
      // Non-critical — still show message even if marking read fails
    }
  }

  document.getElementById('msgContent').innerHTML = `
    <div class="msg-detail-row"><label>From</label><p><strong>${m.name}</strong> · ${m.email}</p></div>
    ${m.phone ? `<div class="msg-detail-row"><label>Phone</label><p>${m.phone}</p></div>` : ''}
    <div class="msg-detail-row"><label>Project Type</label><p>${m.projectType || '—'}</p></div>
    <div class="msg-detail-row"><label>Budget</label><p>${m.budget || '—'}</p></div>
    <div class="msg-detail-row"><label>Message</label><p>${m.message}</p></div>
    <div class="msg-detail-row"><label>Received</label><p>${new Date(m.createdAt).toLocaleString()}</p></div>
    <div class="admin-modal-footer">
      <button class="admin-btn-ghost" onclick="closeMsgModal()">Close</button>
      <button class="tbl-btn del" onclick="deleteMessage('${m._id}')"><i class="fas fa-trash"></i> Delete</button>
      <a href="mailto:${m.email}" class="admin-btn-primary"><i class="fas fa-reply"></i> Reply</a>
    </div>
  `;
  document.getElementById('msgModal').classList.add('open');
  loadMessages();
  loadOverview();
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await apiFetch(`/contact/${id}`, { method: 'DELETE' });
    messages = messages.filter(m => m._id !== id);
    closeMsgModal();
    loadMessages();
    loadOverview();
    showToast('Message deleted.');
  } catch (err) {
    showToast(`Delete failed: ${err.message}`, 'error');
  }
}

function closeMsgModal() {
  document.getElementById('msgModal').classList.remove('open');
}

// ─── Modal backdrop / Escape close ───────────────────────
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



