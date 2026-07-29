import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Calendar,
  Leaf,
  Upload,
  X
} from 'lucide-react';

const inputClass = "w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-sm transition-all";
const labelClass = "block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2";

const sampleData = [
  {
    name: 'Paneer Butter Masala & Naan',
    qty: '35 Meals',
    type: 'Veg',
    loc: 'Hyderabad - Jubilee Hills',
    desc: 'Freshly prepared cottage cheese curry with handmade tandoori naan bread.',
    hours: 4,
    img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Fresh Pastry & Muffin Box',
    qty: '25 Packs',
    type: 'Veg',
    loc: 'Vijayawada - MG Road',
    desc: 'Assorted chocolate croissants, blueberry muffins, and fruit tarts.',
    hours: 8,
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Chicken Biryani Pots',
    qty: '40 Meals',
    type: 'Non-Veg',
    loc: 'Vizag - MVP Colony',
    desc: 'Slow-cooked Dum biryani with raita and salan. Sealed containers.',
    hours: 3,
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60'
  }
];

export function DonateFoodPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    foodName: '',
    quantity: '',
    foodType: 'Veg',
    location: '',
    pickupDeadline: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const getAiEstimate = (type, deadline) => {
    if (!type || !deadline) return;
    setAiLoading(true);
    aiAPI.getFreshnessEstimate({ foodType: type, pickupDeadline: deadline })
      .then((res) => { if (res.freshnessEstimate) setAiPreview(res.freshnessEstimate); })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'foodType') getAiEstimate(value, form.pickupDeadline);
    if (field === 'pickupDeadline') getAiEstimate(form.foodType, value);
    if (field === 'imageUrl') setImagePreview(value);
  };

  const applySample = (sample) => {
    const future = new Date(Date.now() + (sample.hours || 4) * 60 * 60 * 1000);
    const deadline = future.toISOString().slice(0, 16);
    setForm({ foodName: sample.name, quantity: sample.qty, foodType: sample.type, location: sample.loc, description: sample.desc, pickupDeadline: deadline, imageUrl: sample.img });
    setImagePreview(sample.img);
    getAiEstimate(sample.type, deadline);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.foodName || !form.quantity || !form.location || !form.pickupDeadline) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    try {
      setLoading(true);
      await donationAPI.createDonation({
        foodName: form.foodName,
        quantity: form.quantity,
        foodType: form.foodType,
        pickupDeadline: form.pickupDeadline,
        location: form.location,
        description: form.description,
        image: form.imageUrl
      });
      addToast('Food donation posted successfully! 🎉', 'success');
      navigate('/history');
    } catch (err) {
      addToast(err.message || 'Failed to submit donation.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900/90 p-8 rounded-3xl border border-emerald-900/30 shadow-2xl backdrop-blur-md"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-7">
            {/* Header */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Utensils className="w-4 h-4" />
                <span>Surplus Food Donation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Post Surplus Food</h1>
              <p className="text-slate-400 text-sm mt-1">
                Share your surplus meals with local NGOs. Our AI will estimate freshness automatically.
              </p>
            </div>

            {/* Quick Samples */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider block">
                ⚡ Quick Autofill Samples
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleData.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applySample(s)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all"
                  >
                    + {s.name.split(' ').slice(0, 2).join(' ')} ({s.qty})
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1: Name + Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Food Name *</label>
                  <input type="text" required value={form.foodName} onChange={e => handleChange('foodName', e.target.value)}
                    placeholder="e.g. Veg Biryani, Sandwich Boxes"
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Quantity *</label>
                  <input type="text" required value={form.quantity} onChange={e => handleChange('quantity', e.target.value)}
                    placeholder="e.g. 50 Meals / 30 Packs / 15 KG"
                    className={inputClass} />
                </div>
              </div>

              {/* Row 2: Food Type + Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Dietary Type *</label>
                  <div className="flex items-center space-x-3">
                    {['Veg', 'Non-Veg'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange('foodType', type)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                          form.foodType === type
                            ? type === 'Veg'
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {type === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Pickup Deadline *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="datetime-local" required value={form.pickupDeadline}
                      onChange={e => handleChange('pickupDeadline', e.target.value)}
                      className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>Pickup Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" required value={form.location}
                    onChange={e => handleChange('location', e.target.value)}
                    placeholder="e.g. Banjara Hills Road No 12, Hyderabad"
                    className={`${inputClass} pl-10`} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Food Description & Packaging Notes</label>
                <textarea rows={3} value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Mention storage state (hot/chilled), packaging type, allergen info, portion details..."
                  className={inputClass} />
              </div>

              {/* Image Upload & Photo URL */}
              <div>
                <label className={labelClass}>Food Image (File Upload or Image URL)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Local File Upload via Multer */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          setLoading(true);
                          const formData = new FormData();
                          formData.append('image', file);
                          const res = await donationAPI.uploadImage(formData);
                          if (res.imageUrl) {
                            handleChange('imageUrl', res.imageUrl);
                            setImagePreview(res.imageUrl);
                            addToast('Image uploaded successfully!', 'success');
                          }
                        } catch (err) {
                          addToast(err.message || 'Image upload failed', 'error');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 bg-slate-950 border border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center justify-center space-x-2 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo (Multer)</span>
                    </button>
                  </div>

                  {/* Photo URL */}
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={e => handleChange('imageUrl', e.target.value)}
                      placeholder="Or enter Image URL (Unsplash...)"
                      className={`${inputClass} pl-10 pr-10`}
                    />
                    {form.imageUrl && (
                      <button type="button" onClick={() => { handleChange('imageUrl', ''); setImagePreview(''); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 rounded-xl overflow-hidden border border-slate-800 relative group"
                  >
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover"
                      onError={() => setImagePreview('')} />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-slate-950/80 rounded-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      Image Ready
                    </div>
                  </motion.div>
                )}
              </div>

              {/* AI Freshness Preview */}
              <AnimatePresence>
                {(aiPreview || aiLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-start space-x-3"
                  >
                    <motion.div
                      animate={aiLoading ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: aiLoading ? Infinity : 0, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    </motion.div>
                    <div>
                      <span className="text-xs font-bold uppercase text-emerald-400 block mb-0.5">
                        FoodBridge AI Freshness Estimate
                      </span>
                      {aiLoading ? (
                        <div className="h-4 w-48 bg-emerald-900/50 rounded animate-pulse" />
                      ) : (
                        <p className="text-sm text-emerald-200 italic">"{aiPreview}"</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-emerald w-full py-4 rounded-xl font-bold disabled:opacity-60 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 text-base"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full"
                    />
                    <span>Posting Donation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submit Donation</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-slate-500">
                Your donation will be visible to verified NGOs immediately after posting.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
