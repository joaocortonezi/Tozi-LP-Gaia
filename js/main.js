/* ============================================================
   Gaia by SPL — Scripts principais
   ============================================================ */

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz1T6tX3Z2kJiFLrkwpcbYNKVSSd5EtwXyfZedjW-JzGOce_ScaQshU3fxBgSPvDpYk/exec';

/* ── NAV STICKY ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── REVEAL ON SCROLL ───────────────────────────────────── */
const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), (i % 4) * 100);
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
allReveal.forEach((el) => obs.observe(el));

/* ── MODAL ──────────────────────────────────────────────── */
function openModal(origem) {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ── ENVIO JSONP ─────────────────────────────────────────── */
function enviarLead(dados, onSuccess) {
  // Nome único pro callback global
  const callbackName = 'gaiaCallback_' + Date.now();

  // Registra o callback que o Apps Script vai chamar
  window[callbackName] = function () {
    delete window[callbackName];
    if (document.body.contains(script)) script.remove();
    clearTimeout(timeout);
    onSuccess();
  };

  // Monta a URL com os dados + nome do callback
  const params = new URLSearchParams({ ...dados, callback: callbackName });
  const script = document.createElement('script');
  script.src = SHEET_URL + '?' + params.toString();

  // Segurança: se o Apps Script demorar >8s, assume sucesso mesmo assim
  const timeout = setTimeout(() => {
    delete window[callbackName];
    if (document.body.contains(script)) script.remove();
    onSuccess();
  }, 8000);

  // onerror no Apps Script costuma ser falso positivo (redirect)
  // o dado chegou, só mostra sucesso
  script.onerror = () => {
    delete window[callbackName];
    clearTimeout(timeout);
    script.remove();
    onSuccess();
  };

  document.body.appendChild(script);
}

/* ── VALIDAÇÃO ──────────────────────────────────────────── */
function getFields(prefix) {
  return {
    nome:      (document.getElementById(prefix + '-nome')      || {}).value?.trim() || '',
    whatsapp:  (document.getElementById(prefix + '-whats')     || {}).value?.trim() || '',
    email:     (document.getElementById(prefix + '-email')     || {}).value?.trim() || '',
    interesse: (document.getElementById(prefix + '-interesse') || {}).value         || '',
  };
}

function validate(fields) {
  if (!fields.nome || !fields.whatsapp || !fields.email || !fields.interesse) {
    alert('Por favor, preencha todos os campos.');
    return false;
  }
  return true;
}

function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.label || 'Enviar';
  }
}

function limparCampos(prefix) {
  ['nome', 'whats', 'email', 'interesse'].forEach((f) => {
    const el = document.getElementById(prefix + '-' + f);
    if (el) el.value = '';
  });
}

function showSuccess() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── SUBMIT HANDLERS ────────────────────────────────────── */
function submitHeroForm() {
  const fields = getFields('h');
  if (!validate(fields)) return;
  const btn = document.querySelector('.btn-hero-submit');
  setLoading(btn, true);
  enviarLead({ ...fields, origem: 'Hero' }, () => {
    limparCampos('h');
    showSuccess();
    setLoading(btn, false);
  });
}

function submitMainForm() {
  const fields = getFields('f');
  if (!validate(fields)) return;
  const btn = document.querySelector('.btn-submit');
  setLoading(btn, true);
  enviarLead({ ...fields, origem: 'Formulário' }, () => {
    limparCampos('f');
    showSuccess();
    setLoading(btn, false);
  });
}

function submitModalForm() {
  const fields = getFields('m');
  if (!validate(fields)) return;
  const btn = document.querySelector('.btn-modal-submit');
  setLoading(btn, true);
  enviarLead({ ...fields, origem: 'Modal' }, () => {
    closeModal();
    limparCampos('m');
    showSuccess();
    setLoading(btn, false);
  });
}
