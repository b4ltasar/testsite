// ---- Dark mode state ----
const THEME_KEY = 'nw-theme';
function applyStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    document.documentElement.removeAttribute('data-theme'); // follow system
  }
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
}
applyStoredTheme();

document.addEventListener('DOMContentLoaded', () => {
  const t1 = document.getElementById('themeToggle');
  const t2 = document.getElementById('themeToggleMobile');
  if (t1) t1.addEventListener('click', toggleTheme);
  if (t2) t2.addEventListener('click', toggleTheme);

  // ---- Drawer ----
  const burger = document.getElementById('burgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerClose');
  const backdrop = document.getElementById('drawerBackdrop');

  function openDrawer(){
    drawer.setAttribute('aria-hidden','false');
    burger.setAttribute('aria-expanded','true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    drawer.setAttribute('aria-hidden','true');
    burger.setAttribute('aria-expanded','false');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', () => {
    const hidden = drawer.getAttribute('aria-hidden') !== 'false';
    hidden ? openDrawer() : closeDrawer();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Luk when clicking a nav link (mobile)
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') closeDrawer();
  });
});

(function () {
  var root = document.documentElement;
  var btn  = document.getElementById('themeDot');

  // sync initial visual state (dot fill)
  function paintDot() {
    var t = root.getAttribute('data-theme') || 'light';
    if (t === 'dark') btn.classList.add('on'); else btn.classList.remove('on');
  }

  // toggle handler
  function toggleTheme() {
    var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch(e) {}
    paintDot();
  }

  if (btn) {
    btn.addEventListener('click', toggleTheme);
    paintDot();
  }
})();
