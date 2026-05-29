import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'teclia.db');

let db = null;
let SQL = null;

export const initDb = async () => {
  SQL = await initSqlJs();

  // Load existing database if it exists
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    avatar_url TEXT DEFAULT NULL,
    reset_pin TEXT DEFAULT NULL,
    reset_pin_expires_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    is_free INTEGER DEFAULT 0,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
  )`);

  // If upgrading from older DB, try to add new user columns (ignored if exists)
  try {
    db.run('ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL');
  } catch (err) {
    // ignore if column already exists or ALTER not supported
  }
  try {
    db.run('ALTER TABLE users ADD COLUMN reset_pin TEXT DEFAULT NULL');
  } catch (err) {
    // ignore if column already exists or ALTER not supported
  }
  try {
    db.run('ALTER TABLE users ADD COLUMN reset_pin_expires_at DATETIME DEFAULT NULL');
  } catch (err) {
    // ignore if column already exists or ALTER not supported
  }
  // If upgrading from older DB, try to add is_free column (ignored if exists)
  try {
    db.run('ALTER TABLE content ADD COLUMN is_free INTEGER DEFAULT 0');
  } catch (err) {
    // ignore if column already exists or ALTER not supported
  }

  // Seed users
  const adminPassword = bcryptjs.hashSync('Admin123!', 10);
  const studentPassword = bcryptjs.hashSync('Student123!', 10);

  try {
    db.run(
      'INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['admin@teclia.com', adminPassword, 'Admin Teclia', 'admin']
    );

    db.run(
      'INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['student1@teclia.com', studentPassword, 'Estudiante 1', 'student']
    );

    db.run(
      'INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['student2@teclia.com', studentPassword, 'Estudiante 2', 'student']
    );

    // Get admin ID to seed content
    const adminResult = db.exec('SELECT id FROM users WHERE email = ?', ['admin@teclia.com']);
    if (adminResult.length > 0 && adminResult[0].values.length > 0) {
      const adminId = adminResult[0].values[0][0];

      db.run(
        'INSERT OR IGNORE INTO content (title, description, type, url, uploaded_by) VALUES (?, ?, ?, ?, ?)',
        ['Intro a Piano', 'Lección introductoria', 'video', 'https://example.com/intro-piano.mp4', adminId]
      );

      db.run(
        'INSERT OR IGNORE INTO content (title, description, type, url, uploaded_by) VALUES (?, ?, ?, ?, ?)',
        ['Teoría Musical PDF', 'Fundamentos de teoría musical', 'pdf', 'https://example.com/teoria.pdf', adminId]
      );
    }
  } catch (e) {
    console.log('Seed data already exists:', e.message);
  }

  saveDb();
};

const saveDb = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
};

export const getDb = () => db;
export const saveDatabase = saveDb;

export default { initDb, getDb, saveDatabase };

