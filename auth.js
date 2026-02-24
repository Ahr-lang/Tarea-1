const USERS_STORAGE_KEY = "users_json";
const SESSION_STORAGE_KEY = "current_user_json";

function readUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("No se pudo leer el JSON de usuarios:", error);
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function setupRegister() {
  const form = document.querySelector(".form-register");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = (form.elements.namedItem("nombre")?.value || "").trim();
    const email = (form.elements.namedItem("email")?.value || "").trim().toLowerCase();
    const usuario = (form.elements.namedItem("usuario")?.value || "").trim().toLowerCase();
    const contrasena = form.elements.namedItem("contrasena")?.value || "";
    const contrasena2 = form.elements.namedItem("contrasena2")?.value || "";

    if (!nombre || !email || !usuario || !contrasena || !contrasena2) {
      alert("Completa todos los campos.");
      return;
    }

    if (contrasena !== contrasena2) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const users = readUsers();
    const exists = users.some((u) => u.usuario === usuario || u.email === email);

    if (exists) {
      alert("Ese usuario o correo ya existe.");
      return;
    }

    const newUser = {
      nombre,
      email,
      usuario,
      contrasena
    };

    users.push(newUser);
    writeUsers(users);

    console.log("Usuario registrado en JSON:", newUser);
    console.log("Listado actual en JSON:", users);

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    form.reset();
    window.location.href = "index.html";
  });
}

function setupLogin() {
  const form = document.querySelector(".form-login");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = (form.elements.namedItem("usuario")?.value || "").trim().toLowerCase();
    const contrasena = form.elements.namedItem("contrasena")?.value || "";

    if (!usuario || !contrasena) {
      alert("Ingresa usuario y contraseña.");
      return;
    }

    const users = readUsers();
    const found = users.find((u) => u.usuario === usuario && u.contrasena === contrasena);

    if (!found) {
      alert("Credenciales inválidas.");
      return;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      nombre: found.nombre,
      usuario: found.usuario
    }));

    window.location.href = "hola.html";
  });
}

function setupHello() {
  const target = document.getElementById("welcome-user");
  if (!target) return;

  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return;

  try {
    const user = JSON.parse(raw);
    if (user?.nombre) {
      target.textContent = `Has ingresado como ${user.nombre}.`;
      return;
    }
  } catch (error) {
    console.error("No se pudo leer la sesión:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupRegister();
  setupLogin();
  setupHello();
});
