import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI, aiAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowLeft,
  Calendar
} from 'lucide-react';

export function DonateFoodPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [foodType, setFoodType] = useState('Veg');
  const [location, setLocation] = useState('');
  const [pickupDeadline, setPickupDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState('');

  // Auto calculate AI preview on change
  const handleCalculateAi = (type, deadline) => {
    if (type && deadline) {
      aiAPI.getFreshnessEstimate({ foodType: type, pickupDeadline: deadline })
        .then((res) => {
          if (res.freshnessEstimate) {
            setAiPreview(res.freshnessEstimate);
          }
        })
        .catch(() => {});
    }
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setFoodType(val);
    handleCalculateAi(val, pickupDeadline);
  };

  const handleDeadlineChange = (e) => {
    const val = e.target.value;
    setPickupDeadline(val);
    handleCalculateAi(foodType, val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !quantity || !location || !pickupDeadline) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await donationAPI.createDonation({
        foodName,
        quantity,
        foodType,
        pickupDeadline,
        location,
        description,
        image: imageUrl
      });

      addToast('Food donation posted successfully!', 'success');
      navigate('/history');
    } catch (err) {
      addToast(err.message || 'Failed to submit donation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset sample data for rapid testing
  const applySampleData = (sample) => {
    const now = new Date();
    const future = new Date(now.getTime() + (sample.hours || 4) * 60 * 60 * 1000);
    // Format YYYY-MM-DDTHH:MM for datetime-local input
    const isoString = future.toISOString().slice(0, 16);

    setFoodName(sample.name);
    setQuantity(sample.qty);
    setFoodType(sample.type);
    setLocation(sample.loc);
    setDescription(sample.desc);
    setPickupDeadline(isoString);
    setImageUrl(sample.img);
    handleCalculateAi(sample.type, isoString);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-slate-900/90 p-8 rounded-3xl border border-emerald-900/40 shadow-2xl space-y-6 backdrop-blur-md">
          
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" />
              <span>Surplus Food Donation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Post Surplus Food</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Provide food details. Our AI will automatically estimate freshness duration for local NGO pick-ups.
            </p>
          </div>

          {/* Quick Preset Samplers */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold uppercase text-emerald-400 tracking-wider block">
              Quick Samples (Click to Autofill)
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => applySampleData({
                  name: 'Paneer Butter Masala & Naan',
                  qty: '35 Meals',
                  type: 'Veg',
                  loc: 'Hyderabad - Jubilee Hills',
                  desc: 'Freshly prepared cottage cheese curry with handmade tandoori naan bread.',
                  hours: 4,
                  img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60'
                })}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 border border-slate-700 hover:border-emerald-500/40 transition-colors"
              >
                + Paneer Butter Masala (35 Meals)
              </button>
              <button
                type="button"
                onClick={() => applySampleData({
                  name: 'Fresh Pastry & Muffin Box',
                  qty: '25 Packs',
                  type: 'Veg',
                  loc: 'Vijayawada - MG Road',
                  desc: 'Assorted chocolate croissants, blueberry muffins, and fruit tarts.',
                  hours: 8,
                  img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60'
                })}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 text-slate-300 border border-slate-700 hover:border-emerald-500/40 transition-colors"
              >
                + Bakery Pastry Box (25 Packs)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Food Name & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Veg Biryani / Sandwich Boxes"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50 Meals / 30 Packs / 15 KG"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Food Type & Pickup Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Food Dietary Type *
                </label>
                <select
                  value={foodType}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                >
                  <option value="Veg">Vegetarian (Veg)</option>
                  <option value="Non-Veg">Non-Vegetarian (Non-Veg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Pickup Deadline (Date & Time) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupDeadline}
                  onChange={handleDeadlineChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pickup Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Banjara Hills Road No 12, Hyderabad"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Food Description & Packaging Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention storage state (hot/chilled), packaging type, allergen info..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Optional Photo URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Photo URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* AI FRESHNESS ESTIMATE PREVIEW */}
            {aiPreview && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-start space-x-3 text-emerald-200">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-400 block mb-0.5">
                    FoodBridge AI Freshness Recommendation
                  </span>
                  <p className="text-sm italic">"{aiPreview}"</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-slate-950 font-bold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 text-base"
            >
              {loading ? (
                <span>Posting Donation...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Donation</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
