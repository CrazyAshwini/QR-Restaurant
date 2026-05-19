const { readFileSync } = require('fs')
const path = require('path')

const demo = JSON.parse(readFileSync(path.join(__dirname, '..', 'data', 'demo-data.json'), 'utf8'))

// Lightweight runtime that attempts to seed Firebase if configured
;(async function(){
  try {
    const svc = require('../services/firebaseService')
    const isConfigured = svc.isConfigured || false
    const seedDemoData = svc.seedDemoData || (async ()=>{})
    if (!isConfigured) {
      console.log('Firebase not configured. To seed live DB, add your config to src/firebase/config.js')
      console.log('Demo data prepared for local use:')
      console.log(JSON.stringify(demo, null, 2))
      process.exit(0)
    }
    console.log('Seeding demo data to Firebase...')
    await seedDemoData(demo)
    console.log('Seed complete')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
})()
