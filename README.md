# Shortly — URL Shortener

A full-stack URL shortener with click analytics. Create compact links, redirect visitors to the original URL, and view click totals and referrer data.

**Live API:** [url-shortener-vk52.onrender.com](https://url-shortener-vk52.onrender.com)  
**Live frontend:** [short-go-url.vercel.app](https://short-go-url.vercel.app)

## Features

- Create unique Base62 short codes from PostgreSQL IDs
- Redirect active links with `302 Found` so every visit can be tracked
- Record click time, referrer, IP address, and user agent
- View total clicks, clicks per day, and referrer counts
- Reject malformed requests and invalid `http`/`https` URLs
- Handle missing links (`404`) and expired/deactivated links (`410`)

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon)
- **Hosting:** Vercel (frontend), Render (API)

## Architecture

```text
React frontend (Vercel)
        │
        │ /api/* rewrite
        ▼
Express API (Render)
        │
        ▼
PostgreSQL (Neon)
```

The project uses a controller-service-repository pattern:

```text
Route → Middleware → Controller → Service → Repository → PostgreSQL
```

## API endpoints

### Create a short URL

```http
POST /api/shorten
Content-Type: application/json
```

```json
{
  "longUrl": "https://example.com/a/long/path"
}
```

Successful response: `201 Created`

```json
{
  "id": 1,
  "shortCode": "1",
  "longUrl": "https://example.com/a/long/path",
  "shortUrl": "https://your-api-domain/1",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "expiresAt": null,
  "isActive": true
}
```

### Redirect to the original URL

```http
GET /:shortCode
```

- `302 Found` — active short URL
- `404 Not Found` — code does not exist
- `410 Gone` — URL expired or was deactivated

### Get link statistics

```http
GET /api/stats/:shortCode
```

Successful response: `200 OK`

```json
{
  "url": {
    "shortCode": "1",
    "longUrl": "https://example.com/a/long/path",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "expiresAt": null,
    "isActive": true
  },
  "totalClicks": 0,
  "clicksByDay": [],
  "referrers": []
}
```

## Run locally

### 1. Configure the backend

Create `.env` in the repository root from `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@host/database
BASE_URL=http://localhost:3000
```

Run the database schema in your PostgreSQL database using:

```text
src/migrations/001_init.sql
```

Install and start the backend:

```bash
npm install
npm start
```

The API runs at `http://localhost:3000`.

### 2. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite address shown in the terminal, usually `http://localhost:5173`.

During local development, Vite forwards `/api/*` requests to the backend at port `3000`.

## Deployment configuration

### Render (backend)

Deploy the repository root as a Node web service.

- Build command: `npm install`
- Start command: `npm start`

Set these environment variables on Render:

```text
DATABASE_URL=<your Neon PostgreSQL connection string>
BASE_URL=https://url-shortener-vk52.onrender.com
```

Do not commit `.env` or database credentials.

### Vercel (frontend)

Deploy the `client` directory as a Vite project.

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

`client/vercel.json` rewrites frontend `/api/*` calls to the Render API. This keeps browser requests same-origin and avoids exposing database credentials to the frontend.

## Project structure

```text
src/
├── controllers/   # HTTP request/response handling
├── db/            # pg pool and parameterized SQL repositories
├── middleware/    # validation and centralized error handling
├── migrations/    # PostgreSQL schema
├── routes/        # endpoint definitions
├── services/      # framework-independent business logic
└── utils/         # Base62 and domain-error helpers

client/
├── src/           # React UI
├── vite.config.js # local API proxy
└── vercel.json    # production API rewrite
```

## Security notes

- All SQL uses parameterized queries.
- `DATABASE_URL` stays on the backend only.
- `.env` is ignored by Git.
- URLs are validated in the service layer and constrained again in PostgreSQL.
