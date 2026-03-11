/* ============================================================
   Gaia by SPL — Scripts principais
   ============================================================ */

// Nav sticky
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// Reveal on scroll
const allReveal = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("in"), (i % 4) * 100);
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);
allReveal.forEach((el) => obs.observe(el));

// ── MODAL ──────────────────────────────────────
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

// ── FORMS ──────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz0TnVXepwSC9CRJJzjA7ZFVfDrhLgh2t721TrN_4DlcEoTyNiqtlWjx5zXMPQo1J8/exec';

function getFields(prefix) {
  return {
    nome:      document.getElementById(prefix + '-nome').value.trim(),
    whatsapp:  document.getElementById(prefix + '-whats').value.trim(),
    email:     document.getElementById(prefix + '-email').value.trim(),
    interesse: document.getElementById(prefix + '-interesse').value,
  };
}

function validate(fields) {
  if (!fields.nome || !fields.whatsapp || !fields.email || !fields.interesse) {
    alert("Por favor, preencha todos os campos.");
    return false;
  }
  return true;
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Enviando...' : btn.dataset.label;
}

async function enviar(prefix, origem, btn) {
  const fields = getFields(prefix);
  if (!validate(fields)) return;

  btn.dataset.label = btn.textContent;
  setLoading(btn, true);

  const formData = new FormData();
  formData.append('nome',      fields.nome);
  formData.append('whatsapp',  fields.whatsapp);
  formData.append('email',     fields.email);
  formData.append('interesse', fields.interesse);
  formData.append('origem',    origem);

  // no-cors sempre retorna resposta opaca — não tenta ler o resultado
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData,
  });

  // Limpa campos e mostra sucesso imediatamente
  ['nome','whats','email','interesse'].forEach(f => {
    const el = document.getElementById(prefix + '-' + f);
    if (el) el.value = '';
  });

  if (origem === 'Modal') closeModal();
  showSuccess();
  setLoading(btn, false);
}

function showSuccess() {
  // Swap alert for a nicer in-page toast
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function submitHeroForm()  { enviar('h', 'Hero',    document.querySelector('.btn-hero-submit')); }
function submitMainForm()  { enviar('f', 'Formulário', document.querySelector('.btn-submit')); }
function submitModalForm() { enviar('m', 'Modal',   document.querySelector('.btn-modal-submit')); }