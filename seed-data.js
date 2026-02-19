// Run this script locally after deploying to seed initial marker data
// Usage: NETLIFY_SITE_ID=your-site-id NETLIFY_AUTH_TOKEN=your-token node seed-data.js

const { getStore } = require("@netlify/blobs");

const initialMarkers = {
  markers: [
    {
      "id": "1771255708658",
      "x": 3416,
      "y": 384,
      "title": "Richard - Iron Hands + IK",
      "description": "",
      "faction": "imperium",
      "createdAt": "2026-02-16T15:28:28.658Z"
    },
    {
      "id": "1771255723256",
      "x": 1436,
      "y": 764,
      "title": "Kiran - Tau or Tyranids",
      "description": "",
      "faction": "interlopers",
      "createdAt": "2026-02-16T15:28:43.256Z"
    },
    {
      "id": "1771259697479",
      "x": 3404,
      "y": 512,
      "title": "Mads G - Sisters of Battle",
      "description": "",
      "faction": "raiders",
      "createdAt": "2026-02-16T16:34:57.479Z"
    }
  ]
};

async function seed() {
  const store = getStore({
    name: "markers",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN
  });

  await store.setJSON("data", initialMarkers);
  console.log("Seeded", initialMarkers.markers.length, "markers");
}

seed().catch(console.error);
