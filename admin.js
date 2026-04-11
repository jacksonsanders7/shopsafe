const ADMIN_USERNAME = "BigJack";
const ADMIN_PASSWORD = "SimgaTung123";
const STORAGE_KEY = "shoppsafe_admin_data";
const SESSION_KEY = "shoppsafe_admin_logged_in";

const loginCard = document.getElementById("login-card");
const adminCard = document.getElementById("admin-card");
const loginForm = document.getElementById("login-form");
const entryForm = document.getElementById("entry-form");
const rowsEl = document.getElementById("rows");
const loginMessage = document.getElementById("login-message");
const logoutBtn = document.getElementById("logout-btn");

function getRows() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveRows(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function renderTable() {
  const rows = getRows();
  rowsEl.innerHTML = "";

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.issue}</td>
      <td>${row.name}</td>
      <td>${row.reason}</td>
      <td><a href="${row.url}" target="_blank" rel="noopener noreferrer">Link</a></td>
      <td>${row.affiliate ? "Yes" : "No"}</td>
    `;
    rowsEl.appendChild(tr);
  });
}

function setLoggedIn(isLoggedIn) {
  if (isLoggedIn) {
    localStorage.setItem(SESSION_KEY, "1");
    loginCard.classList.add("hidden");
    adminCard.classList.remove("hidden");
    renderTable();
  } else {
    localStorage.removeItem(SESSION_KEY);
    adminCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    loginMessage.textContent = "";
    setLoggedIn(true);
    return;
  }

  loginMessage.textContent = "Incorrect username or password.";
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rows = getRows();
  rows.push({
    issue: document.getElementById("issue").value.trim().toLowerCase(),
    name: document.getElementById("storeName").value.trim(),
    reason: document.getElementById("description").value.trim(),
    url: document.getElementById("url").value.trim(),
    affiliate: document.getElementById("affiliate").checked,
  });

  saveRows(rows);
  renderTable();
  entryForm.reset();
});

logoutBtn.addEventListener("click", () => {
  setLoggedIn(false);
});

setLoggedIn(localStorage.getItem(SESSION_KEY) === "1");
