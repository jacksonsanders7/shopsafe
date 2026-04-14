# Shoppsafe

**Tagline:** Shop with a purpose.

## What was cleaned up

- Website and admin now share one configurable Supabase table name via `config.js`.
- Admin has a **Reload** button and clearer DB status/errors.
- Homepage now shows explicit connection status and table name.
- Unnecessary Next.js demo files were removed to keep this as a clean static + Supabase project.

## Supabase config

In `config.js`:

- `window.SHOPPSAFE_SUPABASE_URL`
- `window.SHOPPSAFE_SUPABASE_PUBLISHABLE_KEY`
- `window.SHOPPSAFE_SUPABASE_TABLE` (default: `shops`)

## Required table columns

- `id` (bigint identity primary key)
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

## If data still doesn't appear

1. Check admin status line for exact DB error.
2. Make sure your Supabase table name matches `SHOPPSAFE_SUPABASE_TABLE`.
3. Confirm RLS policies allow `select`, `insert`, and `delete` for your current auth mode.
