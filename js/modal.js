/**
 * modal.js
 * Handles: Emergency modal open · close · submit · focus trap · keyboard nav
 * Depends on: location.js (LocationService)
 *
 * Elite Care Ambulance — elite-ambulance.online
 */

'use strict';

const Modal = (() => {
  // DOM references (cached after DOMContentLoaded)
  let overlay, sheet, closeBtn, floatBtn, submitBtn;
  let formSection, successSection;

  const WHATSAPP_NUMBER = '201111456662';

  /* ─────────────────────────────────
     OPEN
  ───────────────────────────────── */
  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset form state on each open
    resetForm();
    LocationService.reset();

    // Auto-request location when modal opens (convenience UX)
    if (navigator.geolocation) {
      LocationService.request();
    }

    // Delay focus to after sheet animation completes
    setTimeout(() => {
      const firstInput = document.getElementById('pname');
      if (firstInput) firstInput.focus();
    }, 380);
  }

  /* ─────────────────────────────────
     CLOSE
  ───────────────────────────────── */
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    // Return focus to the floating button
    if (floatBtn) floatBtn.focus();
  }

  /* ─────────────────────────────────
     SUBMIT — build WhatsApp link
  ───────────────────────────────── */
  function submit() {
    const msg    = LocationService.buildWhatsAppMessage();
    const waUrl  = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    // Show success state
    formSection.style.display    = 'none';
    successSection.style.display = 'block';

    // Focus the success message for screen readers
    const heading = successSection.querySelector('h4');
    if (heading) heading.focus();

    // Open WhatsApp after short delay (allows success animation to render)
    setTimeout(() => {
      const link = document.createElement('a');
      link.href   = waUrl;
      link.target = '_blank';
      link.rel    = 'noopener noreferrer';
      link.click();
    }, 800);
  }

  /* ─────────────────────────────────
     RESET FORM to initial state
  ───────────────────────────────── */
  function resetForm() {
    if (formSection)    formSection.style.display    = '';
    if (successSection) successSection.style.display = 'none';

    // Clear text inputs
    ['pname', 'edesc', 'fGov', 'fArea', 'fLandmark'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // Hide fallback
    const fallback = document.getElementById('locFallback');
    if (fallback) fallback.style.display = 'none';

    // Reset location status
    const locStatus = document.getElementById('locStatus');
    if (locStatus) { locStatus.textContent = ''; locStatus.className = 'loc-status'; }

    const locBtnText = document.getElementById('locBtnText');
    if (locBtnText) locBtnText.textContent = 'إرسال موقعي الحالي';

    const locBtn = document.getElementById('locBtn');
    if (locBtn) locBtn.disabled = false;
  }

  /* ─────────────────────────────────
     FOCUS TRAP — keep Tab inside modal
  ───────────────────────────────── */
  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusable = overlay.querySelectorAll(
      'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  /* ─────────────────────────────────
     INIT — wire up all event listeners
  ───────────────────────────────── */
  function init() {
    overlay        = document.getElementById('modalOverlay');
    closeBtn       = document.getElementById('modalClose');
    floatBtn       = document.getElementById('floatBtn');
    submitBtn      = document.getElementById('submitBtn');
    formSection    = document.getElementById('modalForm');
    successSection = document.getElementById('modalSuccess');

    if (!overlay) return; // modal not present on this page

    // Close button → close
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Click outside sheet → close
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    // Escape key → close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    // Tab focus trap
    overlay.addEventListener('keydown', trapFocus);

    // Submit button
    if (submitBtn) submitBtn.addEventListener('click', submit);
  }

  return { init, open, close };
})();

document.addEventListener('DOMContentLoaded', () => {
  Modal.init();

  // Video modal logic
    const openBtn = document.getElementById('openVideo');
    const overlay = document.getElementById('videoOverlay');
    const closeBtn = document.getElementById('closeVideo');
    const video = document.getElementById('promoVideo');

    // التحقق من وجود العناصر قبل إضافة الأوامر (لمنع الأخطاء)
    if (openBtn && overlay) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.style.setProperty('display', 'flex', 'important');
            video.play();
        });

        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        });

        // إغلاق عند الضغط خارج الفيديو
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeBtn.click();
            }
        });
    } else {
        console.error("IDs not found! Check your HTML for 'openVideo' and 'videoOverlay'");
    }
});