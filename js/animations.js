/**
 * animations.js
 * Handles: Custom cursor · Scroll progress bar · Navbar state
 *          IntersectionObserver scroll reveals · Stats counter
 *
 * Elite Care Ambulance — elite-ambulance.online
 */

'use strict';

/* ─────────────────────────────────────────────
   CUSTOM CURSOR  (fine-pointer / desktop only)
───────────────────────────────────────────── */
function initCursor() {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    // RTL: measure from right edge
    mx = window.innerWidth - e.clientX;
    my = e.clientY;
  }, { passive: true });

  // Smooth lag effect via RAF
  (function moveCursor() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    dot.style.right = cx + 'px';
    dot.style.top   = cy + 'px';
    requestAnimationFrame(moveCursor);
  })();

  // Hover expand on interactive elements
  const interactiveSelectors = [
    'a', 'button',
    '.service-card', '.why-feat',
    '.coverage-card', '.blog-card',
    '.contact-card', '.faq-btn'
  ].join(',');

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => dot.classList.add('hover'),    { passive: true });
    el.addEventListener('mouseleave', () => dot.classList.remove('hover'), { passive: true });
  });

  // Hide custom cursor over images to avoid visual artifacts on photos
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('mouseenter', () => { dot.style.display = 'none'; },    { passive: true });
    img.addEventListener('mouseleave', () => { dot.style.display = 'block'; }, { passive: true });
  });
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled   = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const ratio = totalHeight > 0 ? 1 - scrolled / totalHeight : 1;
    bar.style.transform = `scaleX(${ratio})`;
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   NAVBAR SCROLL STATE
───────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   STATS COUNTER ANIMATION
   Triggered once when stat section enters view
───────────────────────────────────────────── */
function animateCounter(el) {
  if (el._counted) return;
  el._counted = true;

  const target   = parseInt(el.dataset.target, 10);
  const duration = Math.max(1500, target * 50);
  const startTime = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(easeOut(progress) * target);
    el.textContent = current.toLocaleString('ar-EG');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER
   Reveals .reveal and .reveal-left elements,
   triggers counter animation on stat elements
───────────────────────────────────────────── */
function initScrollReveals() {
  const options = {
    threshold:   0.15,
    rootMargin: '0px 0px -5% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // Trigger counter if this element contains a counter target
      const counterEl = entry.target.querySelector('[data-target]');
      if (counterEl) animateCounter(counterEl);
    });
  }, options);

  document.querySelectorAll('.reveal, .reveal-left').forEach((el) => {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────
   INIT — run after DOM is ready
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initProgressBar();
  initNavbar();
  initScrollReveals();
});
