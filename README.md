# CodeCircle - LeetCode Social Extension

CodeCircle is a Chrome Extension that lets you link your LeetCode account, join or create groups, and view your friends’ problem-solving stats – all in one popup.

## Features

- 🔗 Link your LeetCode account
- 👥 Create or join learning groups
- 📊 See problems solved
- 🗑️ Remove linked accounts

## Upcoming Features 🚧

- 🏆 Group leaderboards based on problems solved
- 🔔 Notifications for group activity
- 🧠 Daily challenges for groups(random leetcode problems)
- 📅 Weekly performance insights(who did how many problems with difficulty stats)

and maybe - 💬 Chat or comments in groups too... 

## Setup

### 1. Backend (Node.js)
```bash
cd server
npm install
node app.js
```

### 2. Chrome Extension
- Open Chrome → `chrome://extensions/`
- Enable **Developer Mode**
- Click **Load Unpacked** and select the `codecircle-extension` directory

## API Base URL
Make sure your `popup.js` has:
```js
const BACKEND_URL = 'http://localhost:5000';
```

## Tech Stack
- Node.js + Express
- MongoDB (via Mongoose)
- Chrome Extension API
- LeetCode GraphQL API

---