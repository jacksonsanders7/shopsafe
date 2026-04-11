const STORAGE_KEY = "shoppsafe_admin_data";

const issueDatabase = {
  "israel war": [
    { name: "No War Store", url: "https://example.com/no-war-store", reason: "Public anti-war neutrality statement.", affiliate: false },
  ],
  vegan: [
    { name: "Plant Pantry", url: "https://example.com/plant-pantry", reason: "100% vegan catalog.", affiliate: true },
  ],
  "animal testing": [
    { name: "Cruelty-Free Beauty Hub", url: "https://example.com/cruelty-free", reason: "Cruelty-free policy.", affiliate: false },
  ],
};

const form = document.getElementById("issue-form");
const issueInput = document.getElementById("issue-input");
const suggestionsEl = document.getElementById("suggestions");
const issuesHint = document.getElementById("issues-hint");
const resultsSection = document.getElementById("results-section");
const resultsCopy = document.getElementById("results-copy");
const resultsList = document.getElementById("results-list");

const normalizeIssue = (text) => text.trim().toLowerCase();

function getAdminRows() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getCombinedData() {
  const combined = JSON.parse(JSON.stringify(issueDatabase));
  getAdminRows().forEach((row) => {
    const issue = normalizeIssue(row.issue || "");
    if (!issue) return;
    combined[issue] ||= [];
    combined[issue].push({
      name: row.name,
      url: row.url,
      reason: row.reason,
      affiliate: !!row.affiliate,
    });
  });
  return combined;
}

function getAllIssues() {
  return Object.keys(getCombinedData()).sort();
}

function hideSuggestions() {
  suggestionsEl.classList.add("hidden");
  suggestionsEl.innerHTML = "";
}

function renderSuggestions(query) {
  const value = normalizeIssue(query);
  if (!value) return hideSuggestions();

  const matches = getAllIssues().filter((issue) => issue.includes(value)).slice(0, 8);
  suggestionsEl.innerHTML = "";
  if (!matches.length) return hideSuggestions();

  matches.forEach((issue) => {
    const li = document.createElement("li");
    li.textContent = issue;
    li.addEventListener("mousedown", () => {
      issueInput.value = issue;
      hideSuggestions();
      form.requestSubmit();
    });
    suggestionsEl.appendChild(li);
  });

  suggestionsEl.classList.remove("hidden");
}

function renderResults(issue) {
  const shops = getCombinedData()[issue];
  resultsList.innerHTML = "";

  if (!shops?.length) {
    resultsCopy.textContent = `No stores yet for “${issue}”. Add one in Admin.`;
    resultsSection.classList.remove("hidden");
    return;
  }

  resultsCopy.textContent = `Found ${shops.length} store${shops.length === 1 ? "" : "s"} for “${issue}”.`;
  shops.forEach((shop) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${shop.name}</strong>${shop.affiliate ? ' <span class="badge">Affiliate</span>' : ""}<p>${shop.reason}</p><a href="${shop.url}" target="_blank" rel="noopener noreferrer">Visit store</a>`;
    resultsList.appendChild(li);
  });

  resultsSection.classList.remove("hidden");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults(normalizeIssue(issueInput.value));
  hideSuggestions();
});

issueInput.addEventListener("input", () => renderSuggestions(issueInput.value));
issueInput.addEventListener("blur", () => setTimeout(hideSuggestions, 120));

issuesHint.textContent = `Available social issues: ${getAllIssues().join(", ")}`;
document.getElementById("year").textContent = new Date().getFullYear();
