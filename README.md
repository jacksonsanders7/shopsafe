# Shoppsafe

**Tagline:** Shop with a purpose.

## Current build (Supabase connected)

- Public homepage with Version B search and live suggestions.
- Admin page with add/delete/upload/export features.
- Admin login credentials:
  - Username: `BigJack`
  - Password: `SimgaTung123`
- Shared data now comes from Supabase table: `shops`.
- Supabase project URL in `config.js`:
  - `https://jqwyadsjhgbpqcauapwv.supabase.co`

## Required Supabase table

Create table `shops` with columns:
- `id` (bigint identity, primary key)
- `issue` (text)
- `name` (text)
- `reason` (text)
- `url` (text)
- `affiliate` (boolean)

## Run locally

```bash
python3 -m http.server 8000
```

Open:
- http://localhost:8000/index.html
- http://localhost:8000/admin.html

## Important

If inserts/deletes fail, update Supabase RLS policies to allow appropriate access.


## Troubleshooting

- Admin page now shows live database status and explicit Supabase error messages.
- Homepage shows Supabase fetch errors directly under the search bar if connection/RLS fails.
