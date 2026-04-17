# Alternate Project React

React app for Vacation Sales Club Academy with:

- Mobile-first rep experience
- Admin console with CRUD per module
- Production-oriented structure for:
  - `Strategy`
  - `Top Producer Path`
  - `Coaching`
  - `Resources`

## Run locally

```bash
cd alternate-project
npm install
npm run dev
```

By default the app points to:

```bash
VITE_API_BASE_URL=http://localhost:8001
```

You can copy `.env.example` and adjust it if your FastAPI server runs on another port.

## Build for production

```bash
npm run build
npm run preview
```

## Routes

- `/rep` for the rep mobile command center
- `/rep/strategy`
- `/rep/path`
- `/rep/coaching`
- `/rep/resources`
- `/admin` for administration and CRUD

## Notes

- Data now comes from FastAPI.
- Public rep data uses `/api/academy/public/bootstrap`.
- Admin CRUD uses `/api/academy/admin/*`.
- Admin login uses the existing FastAPI auth endpoints with cookies.
- Downloads live in `public/downloads`.
- Netlify SPA fallback is included in `public/_redirects`.
