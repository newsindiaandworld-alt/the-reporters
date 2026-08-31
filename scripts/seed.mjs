// Quick one-off seed script — inserts 6 fake published local-news articles
// so the homepage grid has something to show. Run once from the project
// root with: node scripts/seed.mjs
//
// Uses better-sqlite3 directly (already a project dependency) rather than
// importing the TS schema, so it runs with plain `node` — no ts-node/tsx
// or path-alias setup required.

import Database from "better-sqlite3";

const db = new Database("sqlite.db");
const now = Math.floor(Date.now() / 1000); // schema stores created_at as unix seconds

const articles = [
  {
    title: "City council approves new pedestrian plaza on MG Road",
    content:
      "The proposal, debated for months, will convert two blocks of MG Road into a car-free zone on weekends starting next month. Local shop owners are divided on the impact to foot traffic and deliveries.",
    location: "MG Road",
    reporterName: "Asha Rao",
    offsetSeconds: 60 * 5,
  },
  {
    title: "Water supply disrupted after pipeline burst",
    content:
      "Residents in the eastern sector went without piped water for over 12 hours after a main line ruptured near the old bus depot. Municipal crews say repairs should be complete by tonight.",
    location: "Zaheerabad",
    reporterName: "Vikram Shetty",
    offsetSeconds: 60 * 45,
  },
  {
    title: "Local school wins state-level robotics competition",
    content:
      "Students from St. Xavier's High School took first place in the district robotics championship, beating out twelve other schools with an autonomous waste-sorting bot.",
    location: "Zaheerabad District",
    reporterName: "Neha Kulkarni",
    offsetSeconds: 60 * 90,
  },
  {
    title: "Monsoon repairs begin on flood-prone underpass",
    content:
      "Civic authorities have allocated emergency funds to reinforce drainage at the Kothapet underpass ahead of peak rainfall, following complaints of waist-deep flooding last season.",
    location: "Kothapet",
    reporterName: "Arjun Mehta",
    offsetSeconds: 60 * 150,
  },
  {
    title: "Weekend farmers market draws record crowds",
    content:
      "Vendors reported their busiest Saturday yet as the neighborhood market expanded to include a dozen new stalls selling organic produce and homemade preserves.",
    location: "Zaheerabad",
    reporterName: "Priya Nair",
    offsetSeconds: 60 * 200,
  },
  {
    title: "Power outage hits three neighborhoods after transformer fault",
    content:
      "A fault at the Ring Road substation cut electricity to roughly 4,000 households for close to three hours. Utility officials say backup transformers are now stabilizing supply.",
    location: "Ring Road",
    reporterName: "Vikram Shetty",
    offsetSeconds: 60 * 300,
  },
];

const insert = db.prepare(`
  INSERT INTO articles (title, content, status, reporter_name, location, created_at)
  VALUES (@title, @content, 'published', @reporterName, @location, @createdAt)
`);

const insertMany = db.transaction((rows) => {
  for (const row of rows) insert.run(row);
});

insertMany(
  articles.map((a) => ({
    title: a.title,
    content: a.content,
    reporterName: a.reporterName,
    location: a.location,
    createdAt: now - a.offsetSeconds,
  }))
);

console.log(`Seeded ${articles.length} published articles into sqlite.db.`);
db.close();
