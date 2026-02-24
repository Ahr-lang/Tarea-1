const SESSION_STORAGE_KEY = "current_user_json";
const PROTECTED_PAGES = new Set([
  "acerca.html",
  "servicios.html",
  "contacto.html",
  "hola.html"
]);

function getCurrentPage() {
  const path = window.location.pathname || "";
  const page = path.split("/").pop();
  return page || "index.html";
}

function readSession() {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.usuario || !parsed.token) return null;
    return parsed;
  } catch (error) {
    console.error("No se pudo leer la sesion:", error);
    return null;
  }
}

function isProtectedPage(page) {
  return PROTECTED_PAGES.has(page);
}

function protectPage() {
  const page = getCurrentPage();
  const session = readSession();

  if (isProtectedPage(page) && !session) {
    window.location.href = "index.html";
  }
}

function buildHeader() {
  const session = readSession();
  const shortToken = session?.token ? session.token.slice(0, 8) : "";
  const userSection = session
    ? `<div class="user-session">
        <span>Usuario: ${session.usuario}</span>
        <span>Token: ${shortToken}...</span>
        <button id="logout-btn" class="logout-btn" type="button">Cerrar sesion</button>
      </div>`
    : "";

  return `<header class="site-header">
    <div class="container site-header-content">
      <h1 class="logo">Mi Proyecto</h1>
      <nav class="main-nav">
        <a href="index.html">Inicio</a>
        <a href="register.html">Registro</a>
        <a href="acerca.html">Acerca</a>
        <a href="servicios.html">Servicios</a>
        <a href="contacto.html">Contacto</a>
      </nav>
      ${userSection}
    </div>
  </header>`;
}

function buildFooter() {
  return `<footer class="site-footer">
    <div class="container">
      <p>Tarea</p>
    </div>
  </footer>`;
}

function renderLayout() {
  const headerTarget = document.getElementById("shared-header");
  const footerTarget = document.getElementById("shared-footer");

  if (headerTarget) {
    headerTarget.innerHTML = buildHeader();
  }

  if (footerTarget) {
    footerTarget.innerHTML = buildFooter();
  }

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  protectPage();
  renderLayout();
});
