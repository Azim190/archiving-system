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
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      id_number TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      section TEXT
    );
  `);

  // Seed Users
  const users = [
    { name: 'Sayed', id_number: '2194502437', role: 'admin' },
    { name: 'Azim', id_number: '2599925308', role: 'admin' },
    { name: 'Ahmed', id_number: '2412913655', role: 'admin' },
    { name: 'Karim', id_number: '2503283125', role: 'user', section: 'structural' },
    { name: 'Waleed', id_number: '2360692046', role: 'user', section: 'architectural' },
    { name: 'Maher', id_number: '2494066174', role: 'user', section: 'architectural' },
    { name: 'Othman', id_number: '2017930765', role: 'user', section: 'architectural' },
    { name: 'Fouad', id_number: '2563937289', role: 'user', section: 'electrical' },
    { name: 'Bawadi', id_number: '2493732479', role: 'user', section: 'mechanical' },
    { name: 'Fikri', id_number: '2565169469', role: 'user', section: 'mechanical' },
    { name: 'Jaber', id_number: '2432205512', role: 'user', section: 'surveying' }
  ];

  const stmt = await db.prepare('INSERT OR IGNORE INTO users (name, id_number, role, section) VALUES (?, ?, ?, ?)');
  for (const user of users) {
    // We use INSERT OR IGNORE, relying on UNIQUE(id_number) constraint if we added it, 
    // but since we just defined it above, let's manual check or recreate table if needed.
    // For simplicity in this dev environment, we'll try to insert content.
    // Actually, 'INSERT OR IGNORE' works with the constraint. 
    // But since the table is created IF NOT EXISTS, we might have issues if we changed schema.
    // Let's rely on checking existence by id_number first to be safe.
    const existing = await db.get('SELECT id FROM users WHERE id_number = ?', user.id_number);
    if (!existing) {
      await stmt.run(user.name, user.id_number, user.role, user.section || null);
    }
  }
  await stmt.finalize();

  return db;
}

module.exports = { openDb, initDb };
