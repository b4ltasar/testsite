// Theme ----------------------------------------------------
const root = document.documentElement;
const getTheme = () => localStorage.getItem("nw-theme") || "light";
const setTheme = (t) => {
  root.setAttribute("data-theme", t);
  localStorage.setItem("nw-theme", t);
  // opdatér de små dots' visuelle state
  document.querySelectorAll(".dot").forEach(d => {
    if (t === "dark") d.classList.add("on"); else d.classList.remove("on");
  });
};

// init
setTheme(getTheme());

// togglers
const toggleTheme = () => setTheme(getTheme() === "light" ? "dark" : "light");
document.getElementById("theme-dot")?.addEventListener("click", toggleTheme);
document.getElementById("theme-dot-drawer")?.addEventListener("click", toggleTheme);

// Drawer ---------------------------------------------------
const drawer = document.getElementById("drawer");
const burger = document.getElementById("burger");
const closeBtn = document.getElementById("drawer-close");
const backdrop = drawer?.querySelector(".drawer-backdrop");

function openDrawer(){
  drawer.setAttribute("aria-hidden", "false");
  burger.setAttribute("aria-expanded", "true");
}
function closeDrawer(){
  drawer.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");
}

burger?.addEventListener("click", openDrawer);
closeBtn?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
