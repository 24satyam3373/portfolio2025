/* ══════════════════════════════════════════════════════
   MODERN 3D PORTFOLIO — MAIN JAVASCRIPT
   Satyam Kumar Raj | 2025
══════════════════════════════════════════════════════ */

// ─── FORMSPREE CONFIG ──────────────────────────────────────
// Formspree automatically delivers messages to your Gmail.
// NO signup needed — just verify once via Gmail on first submission.
const FORMSPREE_URL = 'https://formspree.io/f/mnpakawl';
// ↗️ This uses your email: sksatyam3373@gmail.com

// ─── DOM READY ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyped();
  initTilt();
  initScrollReveal();
  initNav();
  initSkillBars();
  initContactForm();
  initCursorGlow();
  initBackTop();
});

/* ══════════════════════════════════════════════════════
   1. THREE.JS — 3D PARTICLE FIELD
══════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // ─── Particles ───────────────────────────────────────
  const count = 3000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color('#7c3aed'),
    new THREE.Color('#2563eb'),
    new THREE.Color('#06b6d4'),
    new THREE.Color('#a78bfa'),
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ─── Connection Lines ─────────────────────────────────
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.08,
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = [];
  const threshold = 2.5;

  for (let i = 0; i < Math.min(count, 300); i++) {
    for (let j = i + 1; j < Math.min(count, 300); j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < threshold) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }

  lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ─── Mouse Interaction ────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // ─── Resize Handler ───────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation Loop ───────────────────────────────────
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.04 + mouseX;
    particles.rotation.x = t * 0.02 - mouseY;
    lines.rotation.y = t * 0.04 + mouseX;
    lines.rotation.x = t * 0.02 - mouseY;

    renderer.render(scene, camera);
  }
  animate();
}

/* ══════════════════════════════════════════════════════
   2. TYPED.JS — TYPEWRITER EFFECT
══════════════════════════════════════════════════════ */
function initTyped() {
  const el = document.getElementById('typedText');
  if (!el || typeof Typed === 'undefined') return;

  const cursor = document.querySelector('.cursor-blink');
  if (cursor) cursor.style.display = 'none';

  new Typed('#typedText', {
    strings: [
      'Full Stack Developer',
      'Frontend Engineer',
      'Backend Developer',
      'UI/UX Enthusiast',
      'Problem Solver',
    ],
    typeSpeed: 70,
    backSpeed: 45,
    backDelay: 1800,
    loop: true,
    showCursor: true,
    cursorChar: '|',
  });
}

/* ══════════════════════════════════════════════════════
   3. VANILLA TILT — 3D CARD HOVER EFFECT
══════════════════════════════════════════════════════ */
function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;

  VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
    max: 12,
    speed: 400,
    glare: true,
    'max-glare': 0.12,
    perspective: 800,
    scale: 1.02,
  });

  // Lighter tilt for the hero image
  const heroTilt = document.getElementById('heroTilt');
  if (heroTilt) {
    VanillaTilt.init(heroTilt, {
      max: 8,
      speed: 600,
      glare: true,
      'max-glare': 0.15,
      perspective: 1000,
      scale: 1.03,
    });
  }
}

/* ══════════════════════════════════════════════════════
   4. SCROLL REVEAL — SECTION ANIMATIONS
══════════════════════════════════════════════════════ */
function initScrollReveal() {
  if (typeof ScrollReveal === 'undefined') return;

  const sr = ScrollReveal({
    duration: 900,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    once: true,
    reset: false,
    viewFactor: 0,        // trigger as soon as element enters viewport edge
    viewOffset: { top: 60, right: 0, bottom: 0, left: 0 },
  });

  sr.reveal('.reveal-up', { origin: 'bottom', distance: '50px', delay: 100 });
  sr.reveal('.reveal-left', { origin: 'left', distance: '60px', delay: 150 });
  sr.reveal('.reveal-right', { origin: 'right', distance: '60px', delay: 150 });

  sr.reveal('.service-card', {
    origin: 'bottom',
    distance: '40px',
    interval: 100,
    delay: 100,
  });

  sr.reveal('.portfolio-card', {
    origin: 'bottom',
    distance: '40px',
    interval: 120,
  });

  sr.reveal('.stat-card', {
    origin: 'bottom',
    distance: '30px',
    interval: 80,
  });
}

/* ══════════════════════════════════════════════════════
   5. NAV — SCROLL EFFECTS & HAMBURGER
══════════════════════════════════════════════════════ */
function initNav() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll-based header style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('open');
      document.body.style.overflow = navbar.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('active');
      navbar && navbar.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }
}

/* ══════════════════════════════════════════════════════
   6. SKILL BARS — INTERSECTION OBSERVER ANIMATION
══════════════════════════════════════════════════════ */
function initSkillBars() {
  // Technical bars
  const bars = document.querySelectorAll('.bar-fill');
  const radials = document.querySelectorAll('.radial-fill');

  // Inject SVG gradient defs
  const svgDefs = `
    <svg width="0" height="0" style="position:absolute">
      <defs>
        <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>`;
  document.body.insertAdjacentHTML('afterbegin', svgDefs);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('bar-fill')) {
          setTimeout(() => entry.target.classList.add('animated'), 200);
        }
        if (entry.target.classList.contains('radial-fill')) {
          setTimeout(() => entry.target.classList.add('animated'), 300);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
  radials.forEach(r => observer.observe(r));
}

/* ══════════════════════════════════════════════════════
   7. CONTACT FORM — FORMSPREE
   Bilkul simple! Formspree directly Gmail pe deliver karta hai.
   Koi signup nahi — pehli submission pe Gmail pe ek
   verification email aayega, usme "Confirm" click karo. Done!
══════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Gather values
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Client-side validation
    let valid = true;
    if (!name) { form.name.classList.add('error'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.classList.add('error');
      valid = false;
    }
    if (!message) { form.message.classList.add('error'); valid = false; }

    if (!valid) {
      showToast('Saare required fields sahi se bharo.', 'error');
      return;
    }

    // Show loading state
    setSubmitLoading(submitBtn, true);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || 'Portfolio Contact',
          message,
          _replyto: email,
          _subject: `[Portfolio] ${subject || 'New message from ' + name}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('🚀 Message bhej diya! Jald milenge.', 'success');
        form.reset();
      } else {
        const errMsg = data?.errors?.map(e => e.message).join(', ')
          || 'Message nahi gaya. Please try again.';
        showToast(errMsg, 'error');
      }
    } catch (err) {
      console.error('Formspree error:', err);
      showToast('Network error. Internet check karo.', 'error');
    } finally {
      setSubmitLoading(submitBtn, false);
    }
  });
}

function setSubmitLoading(btn, loading) {
  const textEl = btn.querySelector('.btn-text');
  const loadingEl = btn.querySelector('.btn-loading');
  btn.disabled = loading;
  if (loading) {
    textEl.style.display = 'none';
    loadingEl.style.display = 'inline-flex';
  } else {
    textEl.style.display = 'inline-flex';
    loadingEl.style.display = 'none';
  }
}

/* ══════════════════════════════════════════════════════
   8. TOAST NOTIFICATION
══════════════════════════════════════════════════════ */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  toastMsg.textContent = message;
  toast.className = `toast ${type} show`;
  toastIcon.className = type === 'success'
    ? 'bx bx-check-circle'
    : 'bx bx-error-circle';

  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════════════════
   9. CURSOR GLOW
══════════════════════════════════════════════════════ */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    // Hide glow on touch devices
    if (glow) glow.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ══════════════════════════════════════════════════════
   10. BACK TO TOP BUTTON
══════════════════════════════════════════════════════ */
function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
}