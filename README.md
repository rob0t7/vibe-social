# ETLS Vegas Suggestions App

A web application for ETLS conference attendees to suggest and vote on places to visit in Las Vegas.

## Features

- 🏆 **Leaderboard** - Top voted suggestions with medal rankings
- 📝 **Add Suggestions** - Submit new Vegas places with categories
- 👍 **Voting System** - Vote for your favorite suggestions (one vote per user)
- 💾 **Persistent Storage** - All data stored in JSON database
- 📱 **Responsive Design** - Works on desktop and mobile

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access the app:**
   Open http://localhost:3000 in your browser

## API Endpoints

- `GET /api/suggestions` - Get all suggestions
- `POST /api/suggestions` - Add a new suggestion
- `POST /api/suggestions/:id/vote` - Vote for a suggestion
- `GET /api/user/:userId/votes` - Get user's vote history

## Database

The app uses a JSON file (`database.json`) for persistent storage with the following structure:

```json
{
  "suggestions": [
    {
      "id": 1,
      "placeName": "Place Name",
      "category": "restaurant",
      "description": "Description...",
      "yourName": "User Name",
      "timestamp": "1/1/2024",
      "votes": 5
    }
  ],
  "userVotes": {
    "user_123": [1, 2, 3]
  }
}
```

## Categories

- 🍽️ Restaurant
- 🍸 Bar/Lounge  
- 🎭 Show/Entertainment
- 🎢 Attraction
- 🛍️ Shopping
- ☕ Coffee Shop
- 🌟 Other

## Development

The app consists of:
- `server.js` - Express backend with API endpoints (for local development)
- `api/` - Vercel serverless functions
- `lib/database.js` - In-memory database for Vercel
- `index.html` - Frontend with embedded CSS and JavaScript
- `vercel.json` - Vercel deployment configuration
- `package.json` - Node.js dependencies

## Local Development

```bash
npm install
npm start
```

## Vercel Development

```bash
npm install
npm run vercel-dev
```

## Vercel Deployment

### Option 1: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

### Option 2: Using Git Integration

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/etls-vegas-suggestions.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically deploy on every push

### Important Notes for Vercel

- **Database Persistence**: Vercel uses serverless functions with read-only filesystem
- Data is stored in-memory and will reset on each deployment
- For production, consider integrating with:
  - Vercel KV (Redis)
  - PlanetScale (MySQL)
  - Supabase (PostgreSQL)
  - MongoDB Atlas

### Environment Variables

No environment variables are required for the basic deployment.

## Production Deployment

For production deployment, consider:
- Using a proper database (PostgreSQL, MongoDB, Redis)
- Implementing real user authentication
- Adding rate limiting for API endpoints
- Using environment variables for configuration
- Adding proper error handling and logging
- Setting up monitoring and analytics
