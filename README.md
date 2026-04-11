# Shoppsafe

**Tagline:** Shop with a purpose.

Shoppsafe is a starter website for discovering online shops that align with user-selected social issues.

## What works now

- Homepage search by issue.
- Admin icon (top-right checkmark box) that opens `admin.html`.
- Admin login using:
  - Username: `BigJack`
  - Password: `SimgaTung123`
- Admin “spreadsheet” table where you can add:
  - issue (example: vegan)
  - store name
  - store description
  - store/affiliate link
  - affiliate checkbox
- New admin rows save in `localStorage` and appear in homepage results.

## Run locally

Shoppsafe is a starter website for discovering online shops that align with user-selected social issues. This prototype demonstrates:

- A searchable social issue input.
- Results that display suggested shops.
- Affiliate-badge support for monetization transparency.
- A note encouraging evidence-based listings and disclosure.

## Run locally

Because this is a static site, you can open `index.html` directly, or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open:
- <http://localhost:8000/index.html>
- <http://localhost:8000/admin.html>

## Note

This is a prototype. For production, do not keep credentials in frontend JavaScript.
Then open <http://localhost:8000>.

## Important next steps before launch

1. Replace sample data with a real, reviewed dataset.
2. Add source citations for every shop/issue relationship.
3. Add legal pages (Terms, Privacy, Affiliate Disclosure).
4. Add moderation/reporting tools for disputed entries.
5. Track affiliate performance ethically and transparently.
