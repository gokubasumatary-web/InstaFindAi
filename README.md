# InstaFind AI

AI-powered Instagram Account Discovery tool. Describe the accounts you're looking for in natural language, and the AI parses, searches, filters, ranks, and displays matching Instagram accounts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI Parsing | Google Gemini 1.5 Flash (with regex fallback) |
| Real Data | RapidAPI Instagram Scraper (PullAPI) |

## Features

- **Natural Language Search** - Type queries like "Find fitness coaches in India with 10K-50K followers"
- **AI Query Parsing** - Gemini extracts structured filters from your description (or regex fallback)
- **Match Scoring** - 0-100 scoring based on category, location, followers, and engagement
- **Real Instagram Data** - Integrates with RapidAPI PullAPI for live account data
- **Filters & Sorting** - Filter by category, location, follower range, engagement rate
- **Responsive UI** - Works on desktop and mobile
- **CSV Export** - Download search results as CSV

## Project Structure

```
instafind-ai/
  backend/
    server.js          # Express server (port 5000)
    routes/index.js    # API routes + mock data + real API integration
    seed.js            # Seed script
    .env               # Environment variables
    package.json
  frontend/
    src/
      pages/           # HomePage, SearchPage, DashboardPage
      components/      # SearchBar, AccountCard, FilterPanel, SortDropdown
      hooks/           # useSearch
      lib/             # API client
    vite.config.js
    tailwind.config.cjs
    package.json
```

## Setup

### Backend

```bash
cd instafind-ai/backend
npm install
```

Create `.env` file:

```env
PORT=5000
GEMINI_API_KEY=your-gemini-api-key-here     # Optional: enables AI parsing
RAPIDAPI_KEY=your-rapidapi-key-here          # Optional: enables real Instagram data
```

Start backend:

```bash
node server.js
```

### Frontend

```bash
cd instafind-ai/frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Optional: Real Instagram Data

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [Instagram Scraper API14](https://rapidapi.com/pullapi-pullapi-default/api/instagram-scraper-api14) (free tier: 100 requests/month)
3. Copy your API key into `.env` as `RAPIDAPI_KEY`
4. Restart the backend

Without the key, the app uses 80 deterministic mock accounts.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse-query` | Parse natural language to structured filters |
| POST | `/api/search` | Search accounts with filters |
| POST | `/api/save` | Save an account |
| POST | `/api/export-csv` | Export results as CSV |
| POST | `/api/similar` | Find similar accounts |

## License

MIT
