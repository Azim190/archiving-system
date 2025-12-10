const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function openDb() {
    return open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });
}

async function initDb() {
    const db = await openDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT,
      client TEXT,
      clientPhone TEXT,
      location TEXT,
      year TEXT,
      type TEXT,
      oneDriveLink TEXT,
      imageUrl TEXT,
      createdAt TEXT
    )
  `);
    return db;
}

module.exports = { openDb, initDb };
