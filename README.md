# Shoppsafe

**Tagline:** Shop with a purpose.

## Current build

- Public homepage with **Version B** search: live, clickable issue suggestions.
- Admin page accessible from the top-right ☑ Admin button.
- Admin login credentials:
  - Username: `BigJack`
  - Password: `SimgaTung123`
- Admin spreadsheet actions:
  - add row manually
  - delete row
  - upload CSV (`issue,name,reason,url,affiliate`)
  - download JSON backup
- Data is persisted in browser `localStorage`.

## Run locally

```bash
python3 -m http.server 8000
```

Open:
- http://localhost:8000/index.html
- http://localhost:8000/admin.html

## Prototype note

Credentials are intentionally frontend-only for demo purposes. Use server-side auth before production.
