

const API_BASE = "https://shadie10.onrender.com/api";

// ─── Loader ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 25;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    progress.style.width = pct + '%';
  }, 80);
  setTimeout(() => {
    loader.classList.add('hidden');
    initAnimations();
  }, 1400);
});

// ─── Custom Cursor ────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const animateCursor = () => {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  document.querySelectorAll('a, button, .tech-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─── Theme Toggle ─────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
document.body.classList.toggle('dark', savedTheme === 'dark');

themeToggle?.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  document.body.classList.toggle('dark', next === 'dark');
  localStorage.setItem('theme', next);
});

// ─── Navbar ───────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTopBtn').classList.toggle('visible', window.scrollY > 300);
});
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
  });
});
// Active nav on scroll
const sections = ['hero','about','skills','projects','experience','testimonials','contact'];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Canvas Background ────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,195,${p.alpha})`;
      ctx.fill();
    });
    // Connect nearby particles
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,229,195,${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
initCanvas();

// ─── Typed Text ───────────────────────────────────────────
const titles = [
  'Backend Engineer',
  'API Architect',
  'System Design Enthusiast',
  'Database Craftsman',
  'Performance Engineer',
];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedText');
function typeLoop() {
  if (!typedEl) return;
  const current = titles[ti];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typedEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();

// ─── Scroll Animations (AOS-like) ─────────────────────────
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('aos-animate'); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// ─── Animated Counters ────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = target === 99 ? '%' : target === 12 ? '+' : '+';
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}
const statsSection = document.querySelector('.about-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// ─── Skill Bars ───────────────────────────────────────────
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
  const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.disconnect();
    }
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

// ─── Projects ─────────────────────────────────────────────
let allProjects = [];
async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects/`);
    const data = await res.json();
    allProjects = data.projects || data || [];
    renderProjects(allProjects);
  } catch {
    // Use sample data if API unavailable
    allProjects = getSampleProjects();
    renderProjects(allProjects);
  }
}

function getSampleProjects() {
  return [
    
    {
      _id: '1', title: 'MicroAuth Service(DIGITAL LIBRARY)', category: 'backend',
      description: 'Production-grade JWT authentication microservice with refresh token rotation, RBAC, rate limiting, and OAuth2 social login integration.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      tags: ['auth', 'security', 'microservice'],
      githubLink: 'https://github.com/Express_security', liveLink: 'https://digitalLibrary.com',
      featured: true,
      imageUrl: 'https://picsum.photos/seed/auth2/600/400',
    },
   
  
    
 
  ];
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('projectsEmpty');
  if (!grid) return;
  if (!projects.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = projects.map(p => `
    <div class="project-card" onclick="openProjectModal('${p._id}')" data-category="${p.category || ''}" data-tags="${(p.tags || []).join(',')}">
      <div class="project-img-wrap">
        <img src="${p.imageUrl || p.images?.[0] || 'https://picsum.photos/seed/' + p._id + '/600/400'}" alt="${p.title}" loading="lazy" onerror="this.src='https://picsum.photos/seed/fallback/600/400'" />
        <div class="project-overlay">
          ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" class="overlay-btn secondary" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Code</a>` : ''}
          ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="overlay-btn primary" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
        </div>
        ${p.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
      </div>
      <div class="project-body">
        <span class="project-category">${p.category || 'project'}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${(p.techStack || p.tags || []).slice(0,4).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Filter & Search
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterProjects();
  });
});
document.getElementById('projectSearch')?.addEventListener('input', filterProjects);

function filterProjects() {
  const filter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
  const search = document.getElementById('projectSearch')?.value.toLowerCase() || '';
  const filtered = allProjects.filter(p => {
    const matchFilter = filter === 'all' || p.category === filter || (p.tags || []).includes(filter);
    const matchSearch = !search || p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });
  renderProjects(filtered);
}

// Project Modal
function openProjectModal(id) {
  const p = allProjects.find(x => x._id == id);
  if (!p) return;
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div style="margin-bottom:24px;">
      <img src="${p.imageUrl || p.images?.[0] || 'https://picsum.photos/seed/' + id + '/720/405'}" alt="${p.title}" style="width:100%;border-radius:12px;margin-bottom:20px;aspect-ratio:16/9;object-fit:cover;" onerror="this.style.display='none'" />
      ${p.featured ? '<span class="featured-badge" style="position:static;display:inline-block;margin-bottom:12px;">⭐ Featured</span>' : ''}
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:8px;">${p.title}</h2>
      <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;">${p.category || ''}</span>
    </div>
    <p style="color:var(--text-muted);line-height:1.75;margin-bottom:24px;">${p.description}</p>
    <div style="margin-bottom:20px;">
      <h4 style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-faint);margin-bottom:12px;">Tech Stack</h4>
      <div class="project-tags">${(p.techStack || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>
    ${p.tags?.length ? `<div style="margin-bottom:24px;">
      <h4 style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-faint);margin-bottom:12px;">Tags</h4>
      <div class="project-tags">${p.tags.map(t => `<span class="tag" style="color:var(--accent);border-color:rgba(0,229,195,0.2);">#${t}</span>`).join('')}</div>
    </div>` : ''}
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" class="btn-secondary-custom"><i class="fab fa-github"></i> View Code</a>` : ''}
      ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="btn-primary-custom"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('projectModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
function closeModal() {
  document.getElementById('projectModal')?.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

fetchProjects();

// ─── Experience ───────────────────────────────────────────
async function fetchExperience() {
  const timeline = document.getElementById('experienceTimeline');
  if (!timeline) return;
  let experiences;
  try {
    const res = await fetch(`${API_BASE}/experiences`);
    const data = await res.json();
    experiences = data.experiences || data || [];
  } catch {
    experiences = getSampleExperiences();
  }
  if (!experiences.length) { timeline.innerHTML = '<p style="color:var(--text-muted);">No experiences found.</p>'; return; }
  timeline.innerHTML = experiences.map((exp, i) => `
    <div class="timeline-item" style="animation-delay:${i * 0.1}s;">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <div class="timeline-role">${exp.role}</div>
            <div class="timeline-company">${exp.company}</div>
          </div>
          <span class="timeline-duration">${exp.duration}</span>
        </div>
        ${exp.responsibilities?.length ? `
          <ul class="timeline-responsibilities">
            ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
          </ul>
        ` : ''}
        ${exp.technologies?.length ? `
          <div class="timeline-tech">
            ${exp.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function getSampleExperiences() {
  return [
    
    {
      role: 'Backend Developer',
      company: 'BuildStack Technologies · Full-time',
      duration: 'Jan 2026 – present',
      responsibilities: [
        'Built RESTful APIs for a SaaS project management platform with 20k+ active users.',
        'Designed relational database schema supporting complex multi-tenant data isolation.',
        'Integrated third-party services: Stripe, Twilio, SendGrid, and Google OAuth.',
        'Wrote comprehensive API documentation and maintained a 98% uptime SLO.',
      ],
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Stripe API', 'SendGrid'],
    },
    {
      role: 'Junior Backend Developer',
      company: 'DataSync Labs · Full-time',
      duration: 'Dec 2025 – Jan 2026',
      responsibilities: [
        'Developed data ingestion pipelines processing 2M+ records daily from external APIs.',
        'Built admin dashboards and internal tools using Django and vanilla JavaScript.',
        'Contributed to open-source ORM tooling used by 1,200+ developers on GitHub.',
      ],
      technologies: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'JavaScript'],
    },
  ];
}

fetchExperience();

// // ─── Contact Form ─────────────────────────────────────────
// document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const btn = document.getElementById('submitBtn');
//   const status = document.getElementById('formStatus');
//   const form = e.target;
//   btn.disabled = true;
//   btn.querySelector('span').textContent = 'Sending...';
//   const body = {
//     name: form.name.value,
//     email: form.email.value,
//     phone: form.phone?.value,
//     projectType: form.projectType?.value,
//     budget: form.budget?.value,
//     message: form.message.value,
//     collaboration: form.collaboration?.checked,
//   };
//   try {
//     const res = await fetch(`${API}/contact`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     if (res.ok) {
//       status.className = 'form-status success';
//       status.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
//       form.reset();
//     } else {
//       throw new Error('Server error');
//     }
//   } catch {
//     status.className = 'form-status success';
//     status.textContent = '✓ Message not sent! ';
//     form.reset();
//   }
//   btn.disabled = false;
//   btn.querySelector('span').textContent = 'Send Message';
// });


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) {
    console.log("❌ contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("📩 Form submitted");

    const btn = document.getElementById("submitBtn");
    const status = document.getElementById("formStatus");

    btn.disabled = true;
    btn.querySelector("span").textContent = "Sending...";

    const body = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone?.value,
      projectType: form.projectType?.value,
      budget: form.budget?.value,
      message: form.message.value,
      collaboration: form.collaboration?.checked,
    };

    console.log("🚀 Payload:", body);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("📡 Response status:", res.status);

      if (res.ok) {
        status.className = "form-status success";
        status.textContent = "✓ Message sent!";
        form.reset();
      } else {
        const err = await res.text();
        console.log("❌ Server error:", err);
        throw new Error("Server error");
      }

    } catch (err) {
      console.log("❌ Catch error:", err);

      status.className = "form-status error";
      status.textContent = "✗ Message not sent!";
    }

    btn.disabled = false;
    btn.querySelector("span").textContent = "Send Message";
  });
});





// ─── Command Palette ──────────────────────────────────────
const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const commands = [
  { icon: 'fas fa-home', label: 'Go to Hero', action: () => scrollToSection('hero') },
  { icon: 'fas fa-user', label: 'About Me', action: () => scrollToSection('about') },
  { icon: 'fas fa-code', label: 'Skills & Tech', action: () => scrollToSection('skills') },
  { icon: 'fas fa-briefcase', label: 'View Projects', action: () => scrollToSection('projects') },
  { icon: 'fas fa-clock', label: 'Experience', action: () => scrollToSection('experience') },
  { icon: 'fas fa-envelope', label: 'Contact Me', action: () => scrollToSection('contact') },
  { icon: 'fas fa-sun', label: 'Toggle Theme', action: () => themeToggle?.click() },
  { icon: 'fab fa-github', label: 'Open GitHub', action: () => window.open('https://github.com', '_blank') },
  { icon: 'fab fa-linkedin', label: 'Open LinkedIn', action: () => window.open('https://linkedin.com', '_blank') },
  { icon: 'fas fa-download', label: 'Download Resume', action: () => {} },
];

function renderCmdResults(query = '') {
  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  cmdResults.innerHTML = filtered.map((c, i) => `
    <div class="cmd-item" data-idx="${i}" onclick="runCmd(${i})">
      <i class="${c.icon}"></i>
      <span>${c.label}</span>
    </div>
  `).join('') || '<div class="cmd-item"><span style="color:var(--text-faint)">No commands found</span></div>';
}

function openCmd() { cmdOverlay.classList.add('open'); cmdInput.focus(); renderCmdResults(); }
function closeCmd() { cmdOverlay.classList.remove('open'); cmdInput.value = ''; }
function runCmd(idx) {
  const query = cmdInput.value;
  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  filtered[idx]?.action();
  closeCmd();
}

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); cmdOverlay.classList.contains('open') ? closeCmd() : openCmd(); }
  if (e.key === 'Escape' && cmdOverlay.classList.contains('open')) closeCmd();
});
cmdOverlay?.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });
cmdInput?.addEventListener('input', e => renderCmdResults(e.target.value));

// Keyboard shortcut hint
setTimeout(() => {
  const hint = document.createElement('div');
  hint.style.cssText = 'position:fixed;bottom:32px;left:32px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:0.72rem;color:var(--text-muted);z-index:50;font-family:var(--font-mono);display:flex;gap:8px;align-items:center;';
  hint.innerHTML = '<kbd style="background:var(--bg3);padding:1px 6px;border-radius:3px;font-size:0.7rem;">⌘K</kbd> Command Palette';
  document.body.appendChild(hint);
  setTimeout(() => hint.style.opacity = '0', 4000);
  setTimeout(() => hint.remove(), 4600);
}, 3000);