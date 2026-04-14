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
const entryMessage = document.getElementById("entry-message");
const uploadMessage = document.getElementById("upload-message");

const csvInput = document.getElementById("csv-file");
const uploadBtn = document.getElementById("upload-btn");
const downloadBtn = document.getElementById("download-btn");
const logoutBtn = document.getElementById("logout-btn");

function getRows() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRows(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function normalizeRow(row) {
  return {
    issue: String(row.issue || "").trim().toLowerCase(),
    name: String(row.name || "").trim(),
    reason: String(row.reason || "").trim(),
    url: String(row.url || "").trim(),
    affiliate: Boolean(row.affiliate),
  };
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidRow(row) {
  return !!(row.issue && row.name && row.reason && row.url && isValidUrl(row.url));
}

function renderTable() {
  rowsEl.innerHTML = "";
  getRows().forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.issue}</td><td>${row.name}</td><td>${row.reason}</td><td><a href="${row.url}" target="_blank" rel="noopener noreferrer">Link</a></td><td>${row.affiliate ? "Yes" : "No"}</td><td><button type="button" data-delete="${idx}">Delete</button></td>`;
    rowsEl.appendChild(tr);
  });
}

function addRow(raw) {
  const row = normalizeRow(raw);
  if (!isValidRow(row)) return false;
  const rows = getRows();
  rows.push(row);
  saveRows(rows);
  renderTable();
  return true;
}

function setLoggedIn(value) {
  if (value) {
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

function parseCsv(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const [header, ...rows] = lines;
  const cols = header.split(",").map((c) => c.trim().toLowerCase());
  const keys = ["issue", "name", "reason", "url", "affiliate"];
  if (!keys.every((k) => cols.includes(k))) return [];

  const idx = Object.fromEntries(keys.map((k) => [k, cols.indexOf(k)]));

  return rows.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return {
      issue: values[idx.issue],
      name: values[idx.name],
      reason: values[idx.reason],
      url: values[idx.url],
      affiliate: ["true", "1", "yes", "y"].includes((values[idx.affiliate] || "").toLowerCase()),
    };
  });
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    loginMessage.textContent = "";
    setLoggedIn(true);
  } else {
    loginMessage.textContent = "Incorrect username or password.";
  }
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ok = addRow({
    issue: document.getElementById("issue").value,
    name: document.getElementById("storeName").value,
    reason: document.getElementById("description").value,
    url: document.getElementById("url").value,
    affiliate: document.getElementById("affiliate").checked,
  });
  entryMessage.textContent = ok ? "Row added." : "Invalid row. Check all fields and URL.";
  if (ok) entryForm.reset();
});

rowsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const index = target.getAttribute("data-delete");
  if (index === null) return;
  const rows = getRows();
  rows.splice(Number(index), 1);
  saveRows(rows);
  renderTable();
});

uploadBtn.addEventListener("click", async () => {
  uploadMessage.textContent = "";
  const file = csvInput.files?.[0];
  if (!file) {
    uploadMessage.textContent = "Choose a CSV file first.";
    return;
  }

  const parsed = parseCsv(await file.text());
  if (!parsed.length) {
    uploadMessage.textContent = "CSV invalid. Use headers: issue,name,reason,url,affiliate";
    return;
  }

  let count = 0;
  parsed.forEach((row) => {
    if (addRow(row)) count += 1;
  });
  uploadMessage.textContent = `Uploaded ${count} rows.`;
  csvInput.value = "";
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(getRows(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "shoppsafe-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

logoutBtn.addEventListener("click", () => setLoggedIn(false));
setLoggedIn(localStorage.getItem(SESSION_KEY) === "1");
