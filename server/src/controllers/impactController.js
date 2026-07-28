import { getDb } from '../config/database.js';

function parseMealCount(quantityStr) {
  if (!quantityStr) return 10;
  const match = quantityStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

export const getImpactMetrics = async (req, res) => {
  try {
    const db = await getDb();
    const donations = await db.all('SELECT * FROM donations');
    const ngos = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'ngo'");

    let totalDonations = donations.length;
    let totalMeals = 0;
    let vegCount = 0;
    let nonVegCount = 0;

    const monthlyMap = {};

    donations.forEach(d => {
      const meals = parseMealCount(d.quantity);
      totalMeals += meals;

      if (d.foodType && d.foodType.toLowerCase() === 'non-veg') {
        nonVegCount++;
      } else {
        vegCount++;
      }

      // Group by YYYY-MM for chart trends
      const dateObj = new Date(d.createdAt);
      const monthYear = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { month: monthYear, meals: 0, donations: 0, co2Saved: 0 };
      }
      monthlyMap[monthYear].meals += meals;
      monthlyMap[monthYear].donations += 1;
      monthlyMap[monthYear].co2Saved += Math.round(meals * 2.5);
    });

    const co2SavedKg = Math.round(totalMeals * 2.5);
    const estimatedPeopleFed = totalMeals;

    const overTimeData = Object.values(monthlyMap);
    if (overTimeData.length === 0) {
      // Provide default fallback timeline if database is freshly initialized
      overTimeData.push(
        { month: 'May 26', meals: 120, donations: 4, co2Saved: 300 },
        { month: 'Jun 26', meals: 240, donations: 8, co2Saved: 600 },
        { month: 'Jul 26', meals: totalMeals || 145, donations: totalDonations || 4, co2Saved: co2SavedKg || 362 }
      );
    }

    const foodTypeDistribution = [
      { name: 'Vegetarian', value: vegCount || 4, fill: '#10B981' },
      { name: 'Non-Vegetarian', value: nonVegCount || 1, fill: '#F59E0B' }
    ];

    return res.status(200).json({
      success: true,
      metrics: {
        totalMealsDonated: totalMeals,
        estimatedPeopleFed,
        totalDonations,
        co2SavedKg,
        ngosConnected: ngos ? ngos.count : 1
      },
      charts: {
        overTimeData,
        foodTypeDistribution
      }
    });
  } catch (error) {
    console.error('Impact Controller Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve impact statistics' });
  }
};
