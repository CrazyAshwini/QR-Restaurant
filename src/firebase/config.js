// Firebase configuration placeholder.
// Create a Firebase project and paste your config below.
// See README.md for setup steps.

import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Edit these values after creating a Firebase project.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID'

let app = null
let db = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  db = getDatabase(app)
}

export { app, db, isConfigured }
