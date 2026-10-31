/**
 * main.js
 * Handles: FAQ accordion · Any additional page-level init
 *
 * Elite Care Ambulance — elite-ambulance.online
 */

'use strict';

/* ─────────────────────────────────────────────
   FAQ ACCORDION
   Accessible: aria-expanded, aria-controls, hidden attr
───────────────────────────────────────────── */
function initFAQ() {
  const buttons = document.querySelectorAll('.faq-btn');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const bodyId  = btn.getAttribute('aria-controls');
      const body    = document.getElementById(bodyId);
      const isOpen  = !body.hidden;

      // Close all items first
      buttons.forEach((b) => {
        const i     = b.closest('.faq-item');
        const bBody = document.getElementById(b.getAttribute('aria-controls'));
        i.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
        bBody.hidden = true;
      });

      // If it was closed, open it
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        body.hidden = false;
      }
    });
  });
}

/* ─────────────────────────────────────────────
   MOBILE NAV TOGGLE
───────────────────────────────────────────── */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navLinks');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─────────────────────────────────────────────
   BOOKING FORM — submit via WhatsApp + Email
───────────────────────────────────────────── */
function submitBooking(event) {
  event.preventDefault();
  const name    = document.getElementById('bName').value.trim();
  const phone   = document.getElementById('bPhone').value.trim();
  const area    = document.getElementById('bArea').value.trim();
  const service = document.getElementById('bService').value;
  const date    = document.getElementById('bDate').value;
  const time    = document.getElementById('bTime').value;
  const msg     = document.getElementById('bMsg').value.trim();

  if (!name || !phone || !area || !service || !date || !time) return false;

  const text = `🔖 *حجز خدمة جديدة*
👤 الاسم: ${name}
📞 الهاتف: ${phone}
📍 المنطقة: ${area}
🛠️ الخدمة: ${service}
📅 التاريخ: ${date}
⏰ الوقت: ${time}
📝 ملاحظات: ${msg || '—'}`;

  const waUrl = `https://wa.me/201111456662?text=${encodeURIComponent(text)}`;

  // Send email via FormSubmit (free, no account needed)
  const formData = new FormData();
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('area', area);
  formData.append('service', service);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('message', msg || '—');
  formData.append('_subject', `🔖 حجز جديد: ${service} - ${name}`);
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');

  fetch('https://formsubmit.co/elite.care.ambulance1@gmail.com', {
    method: 'POST',
    body: formData
  }).catch(() => {});

  if (typeof gtag === 'function') {
    gtag('event', 'booking_submit', {
      event_category: 'conversion',
      event_label: service,
      value: 1
    });
  }

  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return false;
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initNav();
});

// ClickBan + Google Ads conversions
(function () {
  var s = document.createElement('script');
  s.src = 'https://clickban.org/assets/js/cf.js';
  s.async = true;
  s.setAttribute('data-k', 'acf33b9ea78504e8');
  document.head.appendChild(s);

  if (typeof gtag === 'function') gtag('config', 'AW-18478345071');

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href*="wa.me"], a[href*="whatsapp"]');
    if (a && typeof gtag === 'function') {
      gtag('event', 'conversion', {
        send_to: 'AW-18478345071/WTeWCJ7yvK4dEO_WlOtE',
        value: 1.0,
        currency: 'EGP'
      });
    }
  });
})();