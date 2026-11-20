// All content and navigation work without JavaScript.
(() => {
  document.documentElement.classList.add('js');
  const preferenceKey = 'arcana-site-language';
  const language = document.documentElement.lang;
  const readPreference = () => { try { return localStorage.getItem(preferenceKey); } catch { return null; } };
  const savePreference = (value) => { try { localStorage.setItem(preferenceKey, value); } catch { /* Storage may be unavailable. */ } };
  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => savePreference(link.dataset.language));
  });
  // Only the neutral entry point negotiates language. Explicit page URLs and
  // translated links are never redirected, preserving browser back/forward.
  if (document.body.dataset.page === 'home' && language === 'en') {
    const fromSite = document.referrer && new URL(document.referrer).origin === location.origin;
    const preferred = readPreference();
    if (!fromSite && (preferred === 'ru' || (!preferred && navigator.language.toLowerCase().startsWith('ru')))) {
      location.replace(new URL(`ru/index.html${location.search}${location.hash}`, location.href));
      return;
    }
  }
  const preview = document.querySelector('[data-theme-preview]');
  document.querySelectorAll('[data-theme]').forEach(button => {
    button.addEventListener('click', () => {
      preview.dataset.themePreview = button.dataset.theme;
      document.querySelectorAll('[data-theme]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.querySelector('[data-theme-name]').textContent = button.textContent.trim();
    });
  });
})();
