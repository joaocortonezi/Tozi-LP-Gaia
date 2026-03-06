/* ============================================================
   Gaia by SPL — Cookie Consent
   ============================================================ */

(function () {
  const COOKIE_KEY = 'gaia_cookies_accepted';

  // ── Helpers ──────────────────────────────────────────────
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, part) => {
      const [k, v] = part.split('=');
      return k === name ? v : acc;
    }, null);
  }

  // ── Inject banner HTML ────────────────────────────────────
  function injectBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-text">
          <span class="cookie-ico">🍪</span>
          <div>
            <strong>Usamos cookies</strong>
            <p>Para melhorar sua experiência nesta página, utilizamos cookies. Ao continuar navegando, você concorda com nossa
              <a href="pages/privacidade.html">Política de Privacidade</a>.
            </p>
          </div>
        </div>
        <div class="cookie-actions">
          <button id="cookie-reject">Só essenciais</button>
          <button id="cookie-accept">Aceitar todos</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Animate in after a short delay
    requestAnimationFrame(() => {
      setTimeout(() => banner.classList.add('show'), 600);
    });

    document.getElementById('cookie-accept').addEventListener('click', () => {
      setCookie(COOKIE_KEY, 'all', 365);
      hideBanner(banner);
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
      setCookie(COOKIE_KEY, 'essential', 365);
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('show');
    banner.classList.add('hide');
    setTimeout(() => banner.remove(), 400);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    if (getCookie(COOKIE_KEY)) return; // already answered
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
      injectBanner();
    }
  }

  init();
})();
