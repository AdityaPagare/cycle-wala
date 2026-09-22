# Deploying Cycle Wala

The site is a Next.js app that stores orders, bookings, catalogue edits and
uploaded photos as files. It therefore needs a host with a **persistent disk
and a long-running Node process** (a VPS, Render/Railway with a disk, etc.).
It will **not** keep data on serverless platforms with a read-only or
throw-away filesystem (e.g. Vercel's default functions) — if that is where it
must live, the storage needs to move to a database first.

## 1. Environment variables

Copy `.env.example` and set these in the host's environment settings:

| Variable | Required | What it is |
|---|---|---|
| `ADMIN_EMAIL` | yes | Email used to sign in at `/admin` |
| `ADMIN_PASSWORD` | yes | 10+ characters. Without it the admin refuses every login in production |
| `NEXT_PUBLIC_SITE_URL` | yes | Public address, e.g. `https://cyclewala.in`. **Set before building** — it is baked into the sitemap and link previews |
| `DATA_DIR` | yes | Folder on the persistent disk, outside the code (e.g. `/var/lib/cyclewala`) |
| `ADMIN_SESSION_SECRET` | optional | Long random string that signs admin session cookies |

## 2. Build and run

```bash
npm ci
npm run build
npm start          # listens on port 3000; use PORT=... to change
```

Put it behind a reverse proxy that terminates **HTTPS** and forwards
`X-Forwarded-For` / `X-Forwarded-Proto` (nginx, Caddy, or the host's own
router). The rate limiter and the cookie's `Secure` flag rely on those.

## 3. First run with `DATA_DIR`

The first time the site starts with a new `DATA_DIR`, it copies the current
`data/products.json` (your catalogue and prices) into it. From then on the
files in `DATA_DIR` are the live data — redeploying the code never touches
them.

```
DATA_DIR/products.json   catalogue + prices (admin edits)
DATA_DIR/orders.json     customer orders   (names, phones, addresses)
DATA_DIR/bookings.json   service bookings  (names, phones, addresses)
DATA_DIR/uploads/        photos uploaded in the admin
```

## 4. Backups

`DATA_DIR` is the only thing worth backing up. Copy it somewhere safe daily
(e.g. `cp -r /var/lib/cyclewala /backups/cyclewala-$(date +%F)`). The orders
and bookings files contain customers' personal details — keep backups
private.

## 5. Before going live

- [ ] Real admin email + strong password set; the old development login is
      ignored in production.
- [ ] `NEXT_PUBLIC_SITE_URL` set and the site rebuilt.
- [ ] Add the shop's real Instagram / Facebook links and email in
      `lib/site.ts` (`instagram`, `facebook`, `email`) — they stay hidden until
      filled in.
- [ ] Confirm the service list and prices in `data/services.ts`, including
      whether Home Service is really offered.
- [ ] Confirm the star ratings shown in the shop. They are illustrative
      values, not real reviews; showing invented ratings to customers can
      breach consumer-protection rules. Hide them or replace them with real
      reviews before launch.
- [ ] Place a test order and a test booking, check them in `/admin`, then
      delete the test entries from `DATA_DIR`.
