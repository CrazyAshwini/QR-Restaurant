# Campus Cafe — Prototype

This repository contains a Vite + React prototype for the Campus Cafe restaurant QR ordering system.

Getting started

1. Install dependencies

```bash
npm install
```

2. Create a Firebase project (Realtime Database + Authentication). Then copy your Firebase config into `src/firebase/config.js`.

3. Run the development server

```bash
npm run dev
```

4. Open `http://localhost:5173/` and try the routes:

- `/` — Public website
- `/table/1` — Customer QR panel (table 1)
- `/kitchen` — Kitchen display
- `/billdesk` — Cashier panel
- `/manage` — Manager dashboard

Deployment

This app is configured for Netlify deployment.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing: configured in `netlify.toml`

To deploy:

1. Push this repo to GitHub.
2. Create a new site in Netlify and connect the repository.
3. Use `npm run build` as the build command and `dist` as the publish directory.
4. Add any environment variables or Firebase config manually if you use a private config.

Or, using Netlify CLI once logged in:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Firebase setup: Create a Firebase project and paste your config into `src/firebase/config.js`.
