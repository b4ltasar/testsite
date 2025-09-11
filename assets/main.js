/* Theme + Drawer */

(function () {
  var root = document.documentElement;

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("nw-theme", t); } catch(e){}
  }
  function toggleTheme() {
    var now = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(now);
  }

  // attach to both dots (header + drawer)
  function hookThemeDot(id){
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", toggleTheme);
  }
  hookThemeDot("theme-dot");
  hookThemeDot("theme-dot-drawer");

  // Drawer
  var drawer   = document.getElementById("drawer");
  var burger   = document.getElementById("burger");
  var closeBtn = document.getElementById("drawer-close");
  var backdrop = drawer ? drawer.querySelector(".drawer-backdrop") : null;

  function openDrawer() {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", "false");
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", "true");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger)  burger.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  // close on ESC
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") closeDrawer();
  });
})();
