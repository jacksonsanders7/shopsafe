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
const uploadBtn = document.getElementById("upload-btn");
const csvFileInput = document.getElementById("csv-file");
const uploadMessage = document.getElementById("upload-message");
const downloadBtn = document.getElementById("download-btn");
const entryMessage = document.getElementById("entry-message");

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

function normalizeRow(row) {
  return {
    issue: String(row.issue || "").trim().toLowerCase(),
    name: String(row.name || "").trim(),
    reason: String(row.reason || "").trim(),
    url: String(row.url || "").trim(),
    affiliate: Boolean(row.affiliate),
  };
}

function validRow(row) {
  if (!row.issue || !row.name || !row.reason || !row.url) {
    return false;
  }
  try {
    new URL(row.url);
    return true;
  } catch {
    return false;
  }
}

function renderTable() {
  const rows = getRows();
  rowsEl.innerHTML = "";

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.issue}</td>
      <td>${row.name}</td>
      <td>${row.reason}</td>
      <td><a href="${row.url}" target="_blank" rel="noopener noreferrer">Link</a></td>
      <td>${row.affiliate ? "Yes" : "No"}</td>
      <td><button type="button" data-delete-index="${index}">Delete</button></td>
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

function addRow(rawRow) {
  const row = normalizeRow(rawRow);
  if (!validRow(row)) {
    return false;
  }

  const rows = getRows();
  rows.push(row);
  saveRows(rows);
  renderTable();
  return true;
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const [header, ...rest] = lines;
  const columns = header.split(",").map((item) => item.trim().toLowerCase());
  const indexMap = {
    issue: columns.indexOf("issue"),
    name: columns.indexOf("name"),
    reason: columns.indexOf("reason"),
    url: columns.indexOf("url"),
    affiliate: columns.indexOf("affiliate"),
  };

  if (Object.values(indexMap).some((value) => value === -1)) {
    return [];
  }

  return rest.map((line) => {
    const values = line.split(",").map((item) => item.trim());
    return {
      issue: values[indexMap.issue],
      name: values[indexMap.name],
      reason: values[indexMap.reason],
      url: values[indexMap.url],
      affiliate: ["true", "1", "yes", "y"].includes(
        (values[indexMap.affiliate] || "").toLowerCase()
      ),
    };
  });
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

  const ok = addRow({
    issue: document.getElementById("issue").value,
    name: document.getElementById("storeName").value,
    reason: document.getElementById("description").value,
    url: document.getElementById("url").value,
    affiliate: document.getElementById("affiliate").checked,
  });

  if (ok) {
    entryMessage.textContent = "Row added.";
    entryForm.reset();
  } else {
    entryMessage.textContent = "Could not add row. Check all fields and URL.";
  }
});

rowsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const index = target.getAttribute("data-delete-index");
  if (index === null) return;

  const rows = getRows();
  rows.splice(Number(index), 1);
  saveRows(rows);
  renderTable();
});

uploadBtn.addEventListener("click", async () => {
  uploadMessage.textContent = "";
  const file = csvFileInput.files?.[0];

  if (!file) {
    uploadMessage.textContent = "Choose a CSV file first.";
    return;
  }

  const text = await file.text();
  const parsedRows = parseCsv(text);

  if (!parsedRows.length) {
    uploadMessage.textContent = "CSV format invalid. Required headers: issue,name,reason,url,affiliate";
    return;
  }

  let added = 0;
  parsedRows.forEach((row) => {
    if (addRow(row)) added += 1;
  });

  uploadMessage.textContent = `Uploaded ${added} rows.`;
  csvFileInput.value = "";
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(getRows(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "shoppsafe-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

logoutBtn.addEventListener("click", () => {
  setLoggedIn(false);
});

setLoggedIn(localStorage.getItem(SESSION_KEY) === "1");
