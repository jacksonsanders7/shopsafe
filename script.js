const TABLE = window.SHOPPSAFE_SUPABASE_TABLE || "shops";
const issueDatabase = {
  "israel war": [
    { name: "No War Store", url: "https://example.com/no-war-store", reason: "Public anti-war neutrality statement.", affiliate: false },
  ],
};

const supabase = window.supabase.createClient(
  window.SHOPPSAFE_SUPABASE_URL,
  window.SHOPPSAFE_SUPABASE_PUBLISHABLE_KEY
);

const form = document.getElementById("issue-form");
const issueInput = document.getElementById("issue-input");
const suggestionsEl = document.getElementById("suggestions");
const issuesHint = document.getElementById("issues-hint");
const resultsSection = document.getElementById("results-section");
const resultsCopy = document.getElementById("results-copy");
const resultsList = document.getElementById("results-list");

let cachedData = {};

const normalizeIssue = (text) => text.trim().toLowerCase();

async function fetchSupabaseRows() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, issue, name, reason, url, affiliate")
    .order("id", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data || [], error: null };
}

async function refreshData() {
  const combined = JSON.parse(JSON.stringify(issueDatabase));
  const { rows, error } = await fetchSupabaseRows();

  if (error) {
    issuesHint.textContent = `Database fetch failed (${TABLE}): ${error}`;
    cachedData = combined;
    return;
  }

  rows.forEach((row) => {
    const issue = normalizeIssue(row.issue || "");
    if (!issue) return;
    combined[issue] ||= [];
    combined[issue].push({
      id: row.id,
      name: row.name,
      url: row.url,
      reason: row.reason,
      affiliate: !!row.affiliate,
    });
  });

  cachedData = combined;
  const keys = Object.keys(cachedData).sort();
  issuesHint.textContent = `Connected to "${TABLE}". ${keys.length} issue${keys.length === 1 ? "" : "s"}: ${keys.join(", ")}`;
}

function hideSuggestions() {
  suggestionsEl.classList.add("hidden");
  suggestionsEl.innerHTML = "";
}

function renderSuggestions(query) {
  const value = normalizeIssue(query);
  if (!value) return hideSuggestions();

  const matches = Object.keys(cachedData)
    .sort()
    .filter((issue) => issue.includes(value))
    .slice(0, 8);

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
  const shops = cachedData[issue];
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await refreshData();
  renderResults(normalizeIssue(issueInput.value));
  hideSuggestions();
});

issueInput.addEventListener("input", () => renderSuggestions(issueInput.value));
issueInput.addEventListener("blur", () => setTimeout(hideSuggestions, 120));

(async () => {
  await refreshData();
  document.getElementById("year").textContent = new Date().getFullYear();
})();
