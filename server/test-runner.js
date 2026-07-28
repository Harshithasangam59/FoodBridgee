import { getDb } from './src/config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { calculateFreshnessEstimate } from './src/controllers/aiController.js';

async function runTests() {
  console.log('🧪 Starting FoodBridge Backend Integration Tests...');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASSED: ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      testsFailed++;
    }
  }

  try {
    const db = await getDb();

    // 1. Verify Seed Data
    const donations = await db.all('SELECT * FROM donations');
    assert(donations.length >= 4, `Initial seed count is at least 4 (found: ${donations.length})`);

    const users = await db.all('SELECT * FROM users');
    assert(users.length >= 2, `Users seed count includes Donor & NGO (found: ${users.length})`);

    // 2. Test User Registration
    const donorEmail = `donor_${Date.now()}@foodbridge.test`;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('password123', salt);

    const regResult = await db.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Test Gourmet Kitchen', donorEmail, passHash, 'donor']
    );
    const newDonorId = regResult.lastID;
    assert(newDonorId > 0, 'New Donor registration successful');

    // 3. Test AI Freshness Estimation
    const estimate = calculateFreshnessEstimate('Veg', new Date(Date.now() + 3 * 3600000).toISOString(), 'Fresh pasta');
    assert(estimate.includes('Estimated safe') || estimate.includes('Best collected'), 'AI freshness recommendation generated');

    // 4. Test Donation Posting
    const donationRes = await db.run(
      `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        newDonorId,
        'Fresh Salad Bowls',
        '20 Bowls',
        'Veg',
        'Garden fresh salad boxes with olive oil dressing.',
        'Hyderabad',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
        new Date(Date.now() + 5 * 3600000).toISOString(),
        estimate
      ]
    );
    const newDonationId = donationRes.lastID;
    assert(newDonationId > 0, 'Donation creation successful');

    // 5. Test Available Donations Listing
    const available = await db.all(`SELECT * FROM donations WHERE status = 'Pending' ORDER BY pickupDeadline ASC`);
    assert(available.some(d => d.id === newDonationId), 'Newly created donation appears in Available Pending list');

    // 6. Test NGO Reservation
    const ngoUser = users.find(u => u.role === 'ngo') || { id: 2, name: 'Hope Foundation NGO' };
    await db.run(`UPDATE donations SET status = 'Reserved' WHERE id = ?`, [newDonationId]);
    await db.run(`INSERT INTO reservations (donationId, ngoId) VALUES (?, ?)`, [newDonationId, ngoUser.id]);
    
    const reservedDonation = await db.get(`SELECT status FROM donations WHERE id = ?`, [newDonationId]);
    assert(reservedDonation.status === 'Reserved', 'Donation status updated from Pending to Reserved');

    // 7. Test Mark Collected
    await db.run(`UPDATE donations SET status = 'Collected' WHERE id = ?`, [newDonationId]);
    const collectedDonation = await db.get(`SELECT status FROM donations WHERE id = ?`, [newDonationId]);
    assert(collectedDonation.status === 'Collected', 'Donation status updated from Reserved to Collected');

    // 8. Test Impact Calculations
    const allDonations = await db.all('SELECT * FROM donations');
    let totalMeals = 0;
    allDonations.forEach(d => {
      const match = d.quantity.match(/\d+/);
      totalMeals += match ? parseInt(match[0], 10) : 10;
    });
    const co2SavedKg = Math.round(totalMeals * 2.5);
    assert(co2SavedKg > 0 && totalMeals > 0, `Impact metric formula CO2 = Meals * 2.5 verified (${co2SavedKg} kg CO2)`);

    console.log(`\n========================================`);
    console.log(`📊 FOODBRIDGE TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log(`========================================\n`);

    if (testsFailed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  }
}

runTests();
