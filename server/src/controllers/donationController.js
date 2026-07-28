import { getDb } from '../config/database.js';
import { calculateFreshnessEstimate } from './aiController.js';

// Parse numeric meal count from string like "50 Meals", "30 Packs", "40 Boxes", or "25"
function parseMealCount(quantityStr) {
  if (!quantityStr) return 10;
  const match = quantityStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

export const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, foodType, pickupDeadline, location, description, image } = req.body;

    if (!foodName || !quantity || !foodType || !pickupDeadline || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (foodName, quantity, foodType, pickupDeadline, location).'
      });
    }

    const donorId = req.user.id;
    const freshnessEstimate = calculateFreshnessEstimate(foodType, pickupDeadline, description);

    const defaultImage = foodType.toLowerCase() === 'veg'
      ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60'
      : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60';

    const finalImage = image && image.trim() !== '' ? image : defaultImage;

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO donations (donorId, foodName, quantity, foodType, description, location, image, pickupDeadline, freshnessEstimate, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        donorId,
        foodName.trim(),
        quantity.trim(),
        foodType,
        description ? description.trim() : '',
        location.trim(),
        finalImage,
        pickupDeadline,
        freshnessEstimate
      ]
    );

    const newDonation = await db.get('SELECT * FROM donations WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Food donation posted successfully!',
      donation: newDonation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating donation' });
  }
};

export const getAvailableDonations = async (req, res) => {
  try {
    const { search, foodType, location } = req.query;

    const db = await getDb();
    let query = `
      SELECT d.*, u.name as donorName, u.email as donorEmail 
      FROM donations d 
      JOIN users u ON d.donorId = u.id 
      WHERE d.status = 'Pending'
    `;
    const params = [];

    if (foodType && foodType !== 'All') {
      query += ` AND d.foodType = ?`;
      params.push(foodType);
    }

    if (location && location.trim() !== '') {
      query += ` AND d.location LIKE ?`;
      params.push(`%${location.trim()}%`);
    }

    if (search && search.trim() !== '') {
      query += ` AND (d.foodName LIKE ? OR d.location LIKE ? OR d.description LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Sort by Nearest Pickup Deadline First
    query += ` ORDER BY d.pickupDeadline ASC`;

    const donations = await db.all(query, params);

    return res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    console.error('Get available donations error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching available donations' });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const db = await getDb();
    const donations = await db.all(
      `SELECT d.*, r.ngoId, u.name as ngoName 
       FROM donations d 
       LEFT JOIN reservations r ON d.id = r.donationId 
       LEFT JOIN users u ON r.ngoId = u.id 
       WHERE d.donorId = ? 
       ORDER BY d.createdAt DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      donations
    });
  } catch (error) {
    console.error('Get my donations error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching donation history' });
  }
};

export const reserveDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const ngoId = req.user.id;

    const db = await getDb();

    // Check donation exists and is Pending
    const donation = await db.get('SELECT * FROM donations WHERE id = ?', [id]);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Donation cannot be reserved because it is currently '${donation.status}'`
      });
    }

    // Prevent multiple reservations
    const existingRes = await db.get('SELECT id FROM reservations WHERE donationId = ?', [id]);
    if (existingRes) {
      return res.status(400).json({ success: false, message: 'This donation has already been reserved by another NGO' });
    }

    // Begin updates
    await db.run(`UPDATE donations SET status = 'Reserved' WHERE id = ?`, [id]);

    await db.run(
      `INSERT INTO reservations (donationId, ngoId) VALUES (?, ?)`,
      [id, ngoId]
    );

    // Get NGO Name & Donor Name
    const ngoUser = await db.get('SELECT name FROM users WHERE id = ?', [ngoId]);

    // Send Notification to Donor
    await db.run(
      `INSERT INTO notifications (userId, type, message) VALUES (?, 'reservation', ?)`,
      [donation.donorId, `${ngoUser.name} reserved your donation: ${donation.foodName} (${donation.quantity})`]
    );

    // Send Notification to NGO
    await db.run(
      `INSERT INTO notifications (userId, type, message) VALUES (?, 'reservation', ?)`,
      [ngoId, `You successfully reserved donation: ${donation.foodName} (${donation.quantity})`]
    );

    const updatedDonation = await db.get('SELECT * FROM donations WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Donation reserved successfully!',
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Reserve donation error:', error);
    return res.status(500).json({ success: false, message: 'Server error reserving donation' });
  }
};

export const markCollected = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    const donation = await db.get('SELECT * FROM donations WHERE id = ?', [id]);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status !== 'Reserved') {
      return res.status(400).json({
        success: false,
        message: `Only reserved donations can be marked as collected. Current status: ${donation.status}`
      });
    }

    await db.run(`UPDATE donations SET status = 'Collected' WHERE id = ?`, [id]);

    // Get reservation details
    const reservation = await db.get('SELECT ngoId FROM reservations WHERE donationId = ?', [id]);
    const ngoUser = reservation ? await db.get('SELECT name FROM users WHERE id = ?', [reservation.ngoId]) : null;

    // Send notification to donor
    await db.run(
      `INSERT INTO notifications (userId, type, message) VALUES (?, 'collection', ?)`,
      [
        donation.donorId,
        `${ngoUser ? ngoUser.name : 'NGO'} collected your donation: ${donation.foodName} (${donation.quantity})`
      ]
    );

    const updatedDonation = await db.get('SELECT * FROM donations WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Donation marked as collected!',
      donation: updatedDonation
    });
  } catch (error) {
    console.error('Mark collected error:', error);
    return res.status(500).json({ success: false, message: 'Server error marking donation collected' });
  }
};

export const getNgoDashboard = async (req, res) => {
  try {
    const db = await getDb();
    const ngoId = req.user.id;

    const available = await db.all(
      `SELECT d.*, u.name as donorName FROM donations d JOIN users u ON d.donorId = u.id WHERE d.status = 'Pending' ORDER BY d.pickupDeadline ASC`
    );

    const myReservations = await db.all(
      `SELECT d.*, u.name as donorName, r.reservedAt 
       FROM donations d 
       JOIN reservations r ON d.id = r.donationId 
       JOIN users u ON d.donorId = u.id 
       WHERE r.ngoId = ? AND d.status = 'Reserved' 
       ORDER BY r.reservedAt DESC`,
      [ngoId]
    );

    const myCollected = await db.all(
      `SELECT d.*, u.name as donorName, r.reservedAt 
       FROM donations d 
       JOIN reservations r ON d.id = r.donationId 
       JOIN users u ON d.donorId = u.id 
       WHERE r.ngoId = ? AND d.status = 'Collected' 
       ORDER BY d.createdAt DESC`,
      [ngoId]
    );

    return res.status(200).json({
      success: true,
      counts: {
        available: available.length,
        reserved: myReservations.length,
        collected: myCollected.length
      },
      available,
      reserved: myReservations,
      collected: myCollected
    });
  } catch (error) {
    console.error('NGO Dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching NGO dashboard' });
  }
};

export const getCsrReport = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'this_month', 'last_3_months', 'all_time'
    const db = await getDb();

    let query = `SELECT * FROM donations WHERE donorId = ?`;
    const params = [req.user.id];

    const now = new Date();
    if (timeframe === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      query += ` AND createdAt >= ?`;
      params.push(firstDay);
    } else if (timeframe === 'last_3_months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
      query += ` AND createdAt >= ?`;
      params.push(threeMonthsAgo);
    }

    query += ` ORDER BY createdAt DESC`;

    const donations = await db.all(query, params);

    let totalDonations = donations.length;
    let totalMeals = 0;

    donations.forEach(d => {
      totalMeals += parseMealCount(d.quantity);
    });

    const co2SavedKg = Math.round(totalMeals * 2.5);

    return res.status(200).json({
      success: true,
      donorName: req.user.name,
      donorEmail: req.user.email,
      reportDate: new Date().toISOString(),
      timeframe: timeframe || 'all_time',
      summary: {
        totalDonations,
        totalMealsDonated: totalMeals,
        estimatedPeopleFed: totalMeals,
        co2SavedKg
      },
      donations
    });
  } catch (error) {
    console.error('CSR Report error:', error);
    return res.status(500).json({ success: false, message: 'Error generating CSR report' });
  }
};
