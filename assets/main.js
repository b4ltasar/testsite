// ---------------- Theme ----------------
(function () {
  const root = document.documentElement;
  const getTheme = () => localStorage.getItem("nw-theme") || "light";
  const setTheme = (t) => {
    root.setAttribute("data-theme", t);
    localStorage.setItem("nw-theme", t);
    document.querySelectorAll(".dot").forEach((d) =>
      d.classList.toggle("on", t === "dark")
    );
  };

  // Kør tidligt, men vent på DOM til event bindings
  setTheme(getTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const toggleTheme = () => setTheme(getTheme() === "light" ? "dark" : "light");
    document.getElementById("theme-dot")?.addEventListener("click", toggleTheme);
    document.getElementById("theme-dot-drawer")?.addEventListener("click", toggleTheme);

    // Sync dots én gang mere efter DOM (hvis dot først findes nu)
    setTheme(getTheme());
  });
})();

// ---------------- Drawer ----------------
document.addEventListener("DOMContentLoaded", () => {
  const drawer  = document.getElementById("drawer");
  const burger  = document.getElementById("burger");
  const closeBtn = document.getElementById("drawer-close");
  const backdrop = drawer?.querySelector(".drawer-backdrop");
  const links    = drawer?.querySelectorAll(".drawer-nav a") || [];

  if (!drawer || !burger || !closeBtn || !backdrop) return;

  let lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  }

  function closeDrawer() {
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    // Giv fokus tilbage til burger for god UX
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    } else {
      burger.focus();
    }
  }

  burger.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  links.forEach(a => a.addEventListener("click", closeDrawer));
});
