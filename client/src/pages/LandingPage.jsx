import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import {
  HeartHandshake,
  Utensils,
  Leaf,
  ShieldCheck,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Users,
  Award,
  Sparkles,
  ChevronDown,
  Star,
  Zap,
  Globe,
  TrendingUp,
  Package,
  Wheat,
  Apple,
  ShoppingBasket,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { impactAPI } from '../services/api';

// ─── Animated Counter Component ─────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v))
    });
    return controls.stop;
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
      className="border border-slate-800 rounded-2xl overflow-hidden glass-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-900/60 hover:bg-slate-900/90 transition-colors group"
      >
        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 pt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/50">
          {a}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero Constellation Background ──────────────────────────────────────────
function HeroNetworkBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Image Overlay with dark vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
          alt="Food Donation Background"
          className="w-full h-full object-cover object-center opacity-15 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
      </div>

      {/* Floating ambient radial orbs */}
      <div
        className="hero-orb-1 absolute rounded-full pointer-events-none z-0"
        style={{
          width: '550px',
          height: '550px',
          top: '-100px',
          left: '-100px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.06) 55%, transparent 75%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="hero-orb-2 absolute rounded-full pointer-events-none z-0"
        style={{
          width: '400px',
          height: '400px',
          top: '-50px',
          right: '-80px',
          background: 'radial-gradient(circle, rgba(20,184,166,0.22) 0%, rgba(20,184,166,0.07) 55%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Grid pattern backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.12)_1px,transparent_1px)] bg-[size:48px_48px] z-0" />

      {/* Constellation SVG Lines */}
      <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line x1="12%" y1="22%" x2="28%" y2="30%" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="8%" y1="44%" x2="28%" y2="30%" stroke="url(#line-grad-1)" strokeWidth="2" />
        <line x1="72%" y1="30%" x2="88%" y2="22%" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1="72%" y1="30%" x2="92%" y2="44%" stroke="url(#line-grad-1)" strokeWidth="2" />
      </svg>

      {/* Floating Node Badges */}
      <div className="relative w-full h-full max-w-7xl mx-auto hidden md:block z-10">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[28%] left-[24%]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-emerald-500/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Wheat className="w-7 h-7 text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[44%] left-[6%]"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-teal-500/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-teal-500/20">
            <Apple className="w-6 h-6 text-teal-300" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[28%] right-[24%]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-emerald-500/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <ShoppingBasket className="w-7 h-7 text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[44%] right-[6%]"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-teal-500/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-teal-500/20">
            <Utensils className="w-6 h-6 text-teal-300" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Testimonials Data ──────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "FoodBridge transformed our hotel's surplus food management. Instead of disposing untouched banquet meals, we feed 250+ people weekly!",
    name: "Rajesh Kumar",
    role: "Director of Catering, Grand Horizon Hotel",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop",
    stats: "1,200+ Meals Donated"
  },
  {
    quote: "The live freshness estimates and instant NGO notification system let us claim high-quality prepared food within 30 minutes of posting.",
    name: "Sister Maria D'Souza",
    role: "Lead Coordinator, Hope Shelter NGO",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop",
    stats: "850 Families Nourished"
  },
  {
    quote: "Automated CSR reports give our restaurant chain itemized carbon offset proof for our annual sustainability audit and tax credits.",
    name: "Anita Sharma",
    role: "VP Sustainability, Artisan Bakery Group",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop",
    stats: "3,500 kg CO₂ Prevented"
  }
];

// ─── Partners Showcase Data ──────────────────────────────────────────────────
const partners = [
  { name: "Urban Bistro", category: "Restaurant Partner" },
  { name: "Green Earth NGO", category: "Verified NGO" },
  { name: "Grand Horizon Hotel", category: "Hospitality Partner" },
  { name: "Artisan Bakery", category: "Bakery Network" },
  { name: "City Food Bank", category: "Shelter Network" }
];

export function LandingPage() {
  const [stats, setStats] = useState({
    totalMealsDonated: 1250,
    estimatedPeopleFed: 1250,
    co2SavedKg: 3125,
    ngosConnected: 50
  });

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    impactAPI.getMetrics()
      .then((res) => {
        if (res.metrics) setStats(res.metrics);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-32 md:pt-36 md:pb-44 bg-slate-950 border-b border-emerald-900/20">
        <HeroNetworkBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>AI-Powered Food Redistribution Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.05]"
            >
              Reduce Waste.
              <br />
              <span className="text-gradient-emerald">
                Feed More Lives.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              FoodBridge connects restaurants, bakeries, hotels, and supermarkets directly with verified local NGOs in real-time — turning surplus food into immediate nourishment.
            </motion.p>

            {/* Call to action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/signup?role=donor"
                className="btn-emerald w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold shadow-2xl shadow-emerald-500/30 flex items-center justify-center space-x-2 text-base group"
              >
                <span>Start Donating Food</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/available"
                className="btn-glass w-full sm:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 text-base"
              >
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>Browse Available Food</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400 pt-6"
            >
              {[
                { icon: CheckCircle2, text: 'Instant Match Algorithm' },
                { icon: Zap, text: 'AI Freshness Scoring' },
                { icon: FileText, text: 'CSR Audit Export' },
                { icon: ShieldCheck, text: 'Hygienic Verification' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── LIVE METRICS SECTION ─────────────────────────────────────────── */}
      <section className="py-14 bg-slate-900/50 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Meals Saved', value: stats.totalMealsDonated, suffix: '+', color: 'text-emerald-400' },
              { label: 'CO₂ Offset', value: stats.co2SavedKg, suffix: ' kg', color: 'text-teal-400' },
              { label: 'NGO Partners', value: stats.ngosConnected, suffix: '+', color: 'text-emerald-300' },
              { label: 'Safety Compliance', value: 100, suffix: '%', color: 'text-teal-300' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card hover:border-emerald-500/40 transition-all"
              >
                <div className={`text-3xl sm:text-5xl font-black mb-1.5 ${s.color}`}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY & IMAGE SHOWCASE ────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Surplus Food Categories</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">What Food Can Be Donated?</h2>
          <p className="text-slate-400 text-sm">Every edible surplus item can find an immediate home before expiration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Bakery & Fresh Bread",
              desc: "Unsold artisan loaves, pastries, bagels, and rolls from local bakeries.",
              image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
              tag: "Fresh Daily"
            },
            {
              title: "Prepared Buffet Meals",
              desc: "Excess banquet dishes, catering trays, and hot meals packaged securely.",
              image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
              tag: "High Protein"
            },
            {
              title: "Organic Fresh Produce",
              desc: "Surplus fruits, vegetables, and greens from grocery markets.",
              image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1200&auto=format&fit=crop",
              tag: "Nutrient Rich"
            }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden glass-card glass-card-hover group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {cat.tag}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{cat.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
                </div>
                <Link to="/available" className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 pt-4 hover:underline">
                  <span>Browse Available Items</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS TIMELINE ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Simple 4-Step Process</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">How FoodBridge Operates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', title: 'Donor Posts Surplus', desc: 'Restaurants or bakeries list food items with pickup window & quantity in under 60 seconds.', icon: Package },
              { step: '02', title: 'NGO Reserves Item', desc: 'Verified NGOs instantly claim the donation with a single tap to reserve pickup.', icon: Building2 },
              { step: '03', title: 'Swift Pickup', desc: 'NGO volunteers retrieve the food before the deadline using digital receipt codes.', icon: CheckCircle2 },
              { step: '04', title: 'Impact Recorded', desc: 'System automatically logs meals served, CO₂ offset, and updates CSR reports.', icon: TrendingUp },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card glass-card-hover relative group text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-300 font-black text-lg group-hover:scale-110 transition-transform">
                  {step}
                </div>
                <Icon className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Community Impact Stories</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Trusted by Food Heroes</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-12 rounded-3xl glass-card relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shrink-0 border-2 border-emerald-500/40 shadow-2xl">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="flex justify-center md:justify-start space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-slate-200 italic font-medium leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div>
                <h4 className="text-base font-bold text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-xs text-slate-400">{testimonials[activeTestimonial].role}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                  {testimonials[activeTestimonial].stats}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Carousel Navigation Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === i ? 'bg-emerald-400 w-8' : 'bg-slate-800'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS & SUPPORTERS ────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Supported by Leading Food Organizations</span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
            {partners.map((p, i) => (
              <div key={i} className="flex items-center space-x-2 text-slate-300 font-extrabold text-sm sm:text-base">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Got Questions?</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "Who can register as a food donor?", a: "Any food business including restaurants, bakeries, hotels, caterers, and supermarkets can register for free." },
            { q: "How does the AI freshness estimation work?", a: "Our AI model analyzes food type, cooking timestamp, and storage temperature to generate a safe pickup window." },
            { q: "Is there any charge for using FoodBridge?", a: "FoodBridge is 100% free for both food donors and verified NGO partners." },
            { q: "Can donors generate tax exemption CSR reports?", a: "Yes! Donors can download audit-ready PDF CSR reports detailing total meals saved and carbon emissions offset." }
          ].map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Join 1,000+ Active Food Heroes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Ready to Make an Impact Today?</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Register your business or NGO in under 2 minutes. Start saving surplus food and feeding families immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/signup?role=donor" className="btn-emerald px-8 py-4 rounded-2xl font-extrabold">
              Sign Up as Food Donor
            </Link>
            <Link to="/signup?role=ngo" className="btn-glass px-8 py-4 rounded-2xl font-extrabold">
              Register as NGO Partner
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
