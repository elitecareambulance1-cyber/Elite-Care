/**
 * location.js
 * Handles: GPS location request · Error handling · Manual fallback UI
 *
 * Exported API (used by modal.js):
 *   - LocationService.request()   → triggers geolocation
 *   - LocationService.getData()   → returns { lat, lng } or null
 *
 * Elite Care Ambulance — elite-ambulance.online
 */

'use strict';

const LocationService = (() => {
  // Internal state — cleared on each modal open
  let _data = { lat: null, lng: null };

  // Error code → user-friendly Arabic message
  const ERROR_MESSAGES = {
    1: 'الإذن مرفوض',
    2: 'الموقع غير متاح',
    3: 'انتهت المهلة',
  };

  /**
   * Show the manual address fallback fields
   */
  function showFallback() {
    const fallback = document.getElementById('locFallback');
    if (fallback) fallback.style.display = 'block';
  }

  /**
   * Update the location button and status text
   * @param {'idle'|'loading'|'success'|'error'} state
   * @param {string} [message]
   */
  function updateUI(state, message = '') {
    const btn    = document.getElementById('locBtn');
    const btnTxt = document.getElementById('locBtnText');
    const status = document.getElementById('locStatus');
    if (!btn || !btnTxt || !status) return;

    const states = {
      idle:    { disabled: false, btn: '📍 إرسال موقعي الحالي', status: '',        cls: '' },
      loading: { disabled: true,  btn: 'جاري تحديد موقعك...',   status: '⏳ يرجى الانتظار...', cls: '' },
      success: { disabled: false, btn: '✅ تم تحديد موقعك!',    status: message,   cls: 'ok' },
      error:   { disabled: false, btn: '📍 إرسال موقعي الحالي', status: message,   cls: 'err' },
    };

    const s = states[state] || states.idle;
    btn.disabled     = s.disabled;
    btnTxt.textContent = s.btn;
    status.textContent = s.status;
    status.className = 'loc-status' + (s.cls ? ' ' + s.cls : '');
  }

  /**
   * Request the user's GPS location.
   * On success → stores lat/lng, updates UI.
   * On failure → shows manual fallback.
   */
  function request() {
    if (!navigator.geolocation) {
      updateUI('error', 'المتصفح لا يدعم الموقع — أدخله يدويًا');
      showFallback();
      return;
    }

    updateUI('loading');

    navigator.geolocation.getCurrentPosition(
      // SUCCESS
      (position) => {
        _data.lat = position.coords.latitude.toFixed(5);
        _data.lng = position.coords.longitude.toFixed(5);
        updateUI('success', `📍 ${_data.lat}, ${_data.lng}`);
      },

      // ERROR
      (error) => {
        const reason = ERROR_MESSAGES[error.code] || 'تعذر التحديد';
        updateUI('error', `${reason} — أدخل موقعك يدويًا`);
        showFallback();
      },

      // OPTIONS
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  /**
   * Reset internal location data (called on modal open)
   */
  function reset() {
    _data = { lat: null, lng: null };
  }

  /**
   * Get current location data
   * @returns {{ lat: string|null, lng: string|null }}
   */
  function getData() {
    return { ..._data };
  }

  /**
   * Build a WhatsApp message body with all collected info
   * @returns {string}
   */
  function buildWhatsAppMessage() {
    const name     = document.getElementById('pname')?.value.trim()     || '';
    const desc     = document.getElementById('edesc')?.value.trim()     || '';
    const gov      = document.getElementById('fGov')?.value.trim()      || '';
    const area     = document.getElementById('fArea')?.value.trim()     || '';
    const landmark = document.getElementById('fLandmark')?.value.trim() || '';

    let msg = '🚨 طلب إسعاف عاجل\n';

    if (name)     msg += `الاسم: ${name}\n`;
    if (desc)     msg += `الحالة: ${desc}\n`;
    if (_data.lat && _data.lng) {
      msg += `الموقع: https://maps.google.com/?q=${_data.lat},${_data.lng}\n`;
    }
    if (gov)      msg += `المحافظة: ${gov}\n`;
    if (area)     msg += `المنطقة: ${area}\n`;
    if (landmark) msg += `معلم: ${landmark}`;

    return msg.trim();
  }

  // Expose public API
  return { request, reset, getData, buildWhatsAppMessage };
})();

// Attach location button click handler after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const locBtn = document.getElementById('locBtn');
  if (locBtn) {
    locBtn.addEventListener('click', () => LocationService.request());
  }
});
