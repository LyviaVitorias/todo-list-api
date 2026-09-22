const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authSection = document.getElementById("auth-section");
const tasksSection = document.getElementById("tasks-section");
const logoutBtn = document.getElementById("logout-btn");

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const formBody = new URLSearchParams();
  formBody.append("username", username);
  formBody.append("password", password);

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: formBody,
      isForm: true,
      auth: false,
    });
    setToken(data.access_token);
    showTasksScreen();
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("register-error");
  errorEl.textContent = "";

  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: { username, email, password },
      auth: false,
    });
    tabLogin.click();
    document.getElementById("login-username").value = username;
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  showAuthScreen();
});

function showTasksScreen() {
  authSection.classList.add("hidden");
  tasksSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  loadTasks();
}

function showAuthScreen() {
  tasksSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
}

// Se já existe um token salvo, pula direto para a tela de tarefas.
if (getToken()) {
  showTasksScreen();
}
