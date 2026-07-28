import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'foodbridge.db');

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON;');

  await initDatabase(dbInstance);

  return dbInstance;
}

async function initDatabase(db) {
  // Create Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('donor', 'ngo')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Donations table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donorId INTEGER NOT NULL,
      foodName TEXT NOT NULL,
      quantity TEXT NOT NULL,
      foodType TEXT NOT NULL CHECK(foodType IN ('Veg', 'Non-Veg')),
      description TEXT,
      location TEXT NOT NULL,
      image TEXT,
      pickupDeadline DATETIME NOT NULL,
      freshnessEstimate TEXT,
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Reserved', 'Collected')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donorId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Reservations table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donationId INTEGER NOT NULL UNIQUE,
      ngoId INTEGER NOT NULL,
      reservedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (donationId) REFERENCES donations(id) ON DELETE CASCADE,
      FOREIGN KEY (ngoId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Notifications table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed default data if users table is empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    await seedDemoData(db);
  }
}

async function seedDemoData(db) {
  console.log('🌱 Seeding initial demo data for FoodBridge...');
  const salt = await bcrypt.genSalt(10);
  const donorPassword = await bcrypt.hash('password123', salt);
  const ngoPassword = await bcrypt.hash('password123', salt);

  // Insert Donor
  const donorRes = await db.run(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    ['Green Bakery & Foods', 'donor@foodbridge.org', donorPassword, 'donor']
  );
  const donorId = donorRes.lastID;

  // Insert NGO
  const ngoRes = await db.run(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    ['Hope Foundation NGO', 'ngo@foodbridge.org', ngoPassword, 'ngo']
  );
  const ngoId = ngoRes.lastID;

  // Seed Required Demo Data (4 items requested in prompt)
  const now = new Date();
  
  const d1Deadline = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
  const d2Deadline = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();
  const d3Deadline = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
  const d4Deadline = new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString();

  // 1. Veg Biryani - 50 Meals - Hyderabad
  await db.run(
    `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      donorId,
      'Veg Biryani',
      '50 Meals',
      'Veg',
      'Freshly prepared aromatic Hyderabadi vegetable biryani with raita. Packed in hygienic containers.',
      'Hyderabad',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
      d1Deadline,
      'Best collected within 3 hours. Suitable for donation.',
      'Pending'
    ]
  );

  // 2. Bakery Bread Packs - 30 Packs - Vijayawada
  await db.run(
    `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      donorId,
      'Bakery Bread Packs',
      '30 Packs',
      'Veg',
      'Whole wheat and multigrain fresh sandwich bread loaves baked today morning.',
      'Vijayawada',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60',
      d2Deadline,
      'Estimated safe for another 8 hours.',
      'Pending'
    ]
  );

  // 3. Vegetable Pulao - 25 Meals - Visakhapatnam (Mark as Reserved for demo)
  const d3 = await db.run(
    `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      donorId,
      'Vegetable Pulao',
      '25 Meals',
      'Veg',
      'Mildly spiced mixed vegetable pulao prepared for lunch event.',
      'Visakhapatnam',
      'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=60',
      d3Deadline,
      'Best collected within 2 hours.',
      'Reserved'
    ]
  );

  await db.run(
    `INSERT INTO reservations (donationId, ngoId) VALUES (?, ?)`,
    [d3.lastID, ngoId]
  );

  // 4. Sandwich Boxes - 40 Boxes - Guntur (Mark as Collected for demo)
  const d4 = await db.run(
    `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      donorId,
      'Sandwich Boxes',
      '40 Boxes',
      'Veg',
      'Fresh veggie and cheese grilled sandwiches individually boxed.',
      'Guntur',
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60',
      d4Deadline,
      'Freshly prepared. Suitable for donation.',
      'Collected'
    ]
  );

  await db.run(
    `INSERT INTO reservations (donationId, ngoId) VALUES (?, ?)`,
    [d4.lastID, ngoId]
  );

  // Notifications
  await db.run(
    `INSERT INTO notifications (userId, type, message) VALUES (?, ?, ?)`,
    [donorId, 'reservation', 'Hope Foundation NGO reserved your donation: Vegetable Pulao (25 Meals)']
  );

  await db.run(
    `INSERT INTO notifications (userId, type, message) VALUES (?, ?, ?)`,
    [donorId, 'collection', 'Hope Foundation NGO collected your donation: Sandwich Boxes (40 Boxes)']
  );

  await db.run(
    `INSERT INTO notifications (userId, type, message) VALUES (?, ?, ?)`,
    [ngoId, 'reservation', 'You successfully reserved donation: Vegetable Pulao (25 Meals)']
  );

  console.log('✅ Demo data successfully seeded!');
}
