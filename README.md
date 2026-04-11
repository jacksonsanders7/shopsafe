# Shoppsafe

**Tagline:** Shop with a purpose.

Shoppsafe is a starter website for discovering online shops that align with user-selected social issues.

## What works now

- Homepage social-issue dropdown (so users can directly pick the issue).
- Visible top-right **☑ Admin** button that opens `admin.html`.
- Homepage shows all currently available issues (default + admin-added).
- Admin login using:
  - Username: `BigJack`
  - Password: `SimgaTung123`
- Admin spreadsheet table where you can add:
  - issue (example: vegan)
  - store name
  - store description
  - store/affiliate link
  - affiliate checkbox
- Bulk CSV upload with headers: `issue,name,reason,url,affiliate`.
- Delete rows from the admin table.
- Download all admin rows as JSON backup.
- New admin rows save in `localStorage` and appear in homepage results.

## Run locally

```bash
python3 -m http.server 8000
```

Then open:
- <http://localhost:8000/index.html>
- <http://localhost:8000/admin.html>

## Note

This is a prototype. For production, do not keep credentials in frontend JavaScript.
