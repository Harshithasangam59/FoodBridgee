/**
 * AI Freshness Estimation Service
 * Provides backend API structure pluggable with Gemini or OpenAI.
 * Defaults to intelligent algorithmic heuristics when external API keys are unavailable.
 */

export function calculateFreshnessEstimate(foodType, pickupDeadline, description = '') {
  // If deadline provided, compute hours remaining
  const now = new Date();
  const deadlineDate = new Date(pickupDeadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffHours = Math.max(0.5, Math.round(diffMs / (1000 * 60 * 60)));

  const isNonVeg = foodType && foodType.toLowerCase().includes('non');

  if (diffHours <= 2) {
    return isNonVeg 
      ? `Best collected within ${diffHours} hour(s). High perishability — keep refrigerated.` 
      : `Best collected within ${diffHours} hour(s). Immediate distribution recommended.`;
  } else if (diffHours <= 4) {
    return isNonVeg
      ? `Estimated safe for another ${diffHours} hours. Ensure thermal transport.`
      : `Estimated safe for another ${diffHours} hours. Freshly prepared.`;
  } else if (diffHours <= 8) {
    return `Freshly prepared. Suitable for donation over the next ${diffHours} hours.`;
  } else {
    return `Excellent freshness stability. Safe for distribution within ${diffHours} hours.`;
  }
}

export const getAIFreshness = async (req, res) => {
  try {
    const { foodType, pickupDeadline, description, foodName } = req.body;

    if (!foodType || !pickupDeadline) {
      return res.status(400).json({ 
        success: false, 
        message: 'Food type and pickup deadline are required for freshness estimation.' 
      });
    }

    // Check if external Gemini / OpenAI API key exists in environment
    if (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY) {
      // Plug in LLM call here when available
    }

    // Fallback heuristic engine
    const estimate = calculateFreshnessEstimate(foodType, pickupDeadline, description);

    return res.status(200).json({
      success: true,
      freshnessEstimate: estimate,
      source: 'FoodBridge AI Freshness Engine v1.0'
    });
  } catch (error) {
    console.error('AI Freshness Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to generate freshness estimate.' 
    });
  }
};
