const issueDatabase = {
  "israel war": [
    {
      name: "Ethical Outfitters",
      url: "https://example.com/ethical-outfitters?ref=shoppsafe",
      reason: "Public neutrality statement and no political donations found.",
      affiliate: true,
    },
    {
      name: "Conscious Home Co.",
      url: "https://example.com/conscious-home?ref=shoppsafe",
      reason: "Published policy against funding armed conflict.",
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
const input = document.getElementById("issue-input");
const resultsSection = document.getElementById("results-section");
const resultsCopy = document.getElementById("results-copy");
const resultsList = document.getElementById("results-list");

function normalizeIssue(text) {
  return text.trim().toLowerCase();
}

function renderResults(issue, shops) {
  resultsList.innerHTML = "";

  if (!shops?.length) {
    resultsCopy.textContent = `No matches yet for “${issue}”. Add review-backed shops to your dataset.`;
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
  const issue = normalizeIssue(input.value);
  renderResults(issue, issueDatabase[issue]);
});

document.querySelectorAll(".linkish").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.fill;
    form.requestSubmit();
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
