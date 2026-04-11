const STORAGE_KEY = "shoppsafe_admin_data";

const issueDatabase = {
  "israel war": [
    {
      name: "No War Store",
      url: "https://example.com/no-war-store",
      reason: "Published anti-war donation policy and neutrality statement.",
      affiliate: false,
    },
  ],
  vegan: [
    {
      name: "Plant Pantry",
      url: "https://example.com/plant-pantry?ref=shoppsafe",
      reason: "100% vegan catalogue and transparent sourcing.",
      affiliate: true,
    },
  ],
  "fast fashion": [
    {
      name: "Slow Stitch Market",
      url: "https://example.com/slow-stitch?ref=shoppsafe",
      reason: "Audited supply chain and fair labor certifications.",
      affiliate: true,
    },
  ],
  "animal testing": [
    {
      name: "Cruelty-Free Beauty Hub",
      url: "https://example.com/cruelty-free?ref=shoppsafe",
      reason: "Leaping Bunny-certified, no animal testing policy.",
      affiliate: false,
    },
  ],
};

const form = document.getElementById("issue-form");
const issueSelect = document.getElementById("issue-select");
const resultsSection = document.getElementById("results-section");
const resultsCopy = document.getElementById("results-copy");
const resultsList = document.getElementById("results-list");
const issuesHint = document.getElementById("issues-hint");

function normalizeIssue(text) {
  return text.trim().toLowerCase();
}

function getAdminRows() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getCombinedData() {
  const combined = JSON.parse(JSON.stringify(issueDatabase));
  const rows = getAdminRows();

  rows.forEach((row) => {
    const issue = normalizeIssue(row.issue || "");
    if (!issue) return;

    if (!combined[issue]) {
      combined[issue] = [];
    }

    combined[issue].push({
      name: row.name,
      url: row.url,
      reason: row.reason,
      affiliate: !!row.affiliate,
    });
  });

  return combined;
}

function renderCategoryDropdown() {
  const allIssues = Object.keys(getCombinedData()).sort();
  issueSelect.innerHTML = "";

  allIssues.forEach((issue) => {
    const option = document.createElement("option");
    option.value = issue;
    option.textContent = issue;
    issueSelect.appendChild(option);
  });

  issuesHint.textContent = `Available categories: ${allIssues.join(", ")}`;
}

function renderResults(issue, shops) {
  resultsList.innerHTML = "";

  if (!shops?.length) {
    resultsCopy.textContent = `No matches yet for “${issue}”. Add a row in Admin.`;
    resultsSection.classList.remove("hidden");
    return;
  }

  resultsCopy.textContent = `Found ${shops.length} shop${
    shops.length > 1 ? "s" : ""
  } for “${issue}”.`;

  shops.forEach((shop) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${shop.name}</strong>
      ${shop.affiliate ? '<span class="badge">Affiliate</span>' : ""}
      <p>${shop.reason}</p>
      <a href="${shop.url}" target="_blank" rel="noopener noreferrer">Visit shop</a>
    `;
    resultsList.appendChild(li);
  });

  resultsSection.classList.remove("hidden");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const issue = normalizeIssue(issueSelect.value);
  const combinedData = getCombinedData();
  renderResults(issue, combinedData[issue]);
});

issueSelect.addEventListener("change", () => {
  form.requestSubmit();
});

renderCategoryDropdown();
if (issueSelect.value) {
  form.requestSubmit();
}
document.getElementById("year").textContent = new Date().getFullYear();
