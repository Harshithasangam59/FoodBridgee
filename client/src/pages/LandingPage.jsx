import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
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
  Phone
} from 'lucide-react';
import { impactAPI } from '../services/api';

// ─── Animated Counter ───────────────────────────────────────────────────────
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
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-slate-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-900/60 hover:bg-slate-900/80 transition-colors group"
      >
        <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">{q}</span>
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
        <div className="px-5 pb-5 pt-2 text-sm text-slate-400 leading-relaxed bg-slate-950/40">
          {a}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Floating Blob ───────────────────────────────────────────────────────────
function FloatingBlob({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all group cursor-default backdrop-blur-sm relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color === 'emerald' ? 'bg-emerald-500/5' : 'bg-teal-500/5'} rounded-full blur-2xl transition-all group-hover:opacity-100 opacity-0`} />
      <div className={`w-12 h-12 rounded-xl ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-teal-500/10 text-teal-400'} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Testimonial Card ────────────────────────────────────────────────────────
function TestimonialCard({ text, name, role, initial, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/20 space-y-4 relative overflow-hidden group"
    >
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-slate-300 italic leading-relaxed">"{text}"</p>
      <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
        <div className={`w-10 h-10 rounded-full ${color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'} font-bold flex items-center justify-center text-sm`}>
          {initial}
        </div>
        <div>
          <h5 className="text-sm font-semibold text-white">{name}</h5>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

const faqData = [
  {
    q: 'Who can register as a food donor on FoodBridge?',
    a: 'Any food business or individual can register – restaurants, bakeries, hotels, supermarkets, caterers, event organizers, and home cooks. If you have surplus food that would otherwise go to waste, FoodBridge is for you.'
  },
  {
    q: 'How does the AI freshness estimation work?',
    a: 'FoodBridge uses an intelligent rule-based AI engine that analyzes food type, pickup deadline, and description to generate an estimated safe consumption window. The system is built to be plugged into Google Gemini or OpenAI for enhanced predictions in the future.'
  },
  {
    q: 'Is there any cost to use FoodBridge?',
    a: 'FoodBridge is completely free for both food donors and NGO partners. Our mission is to maximize food redistribution impact, not profit.'
  },
  {
    q: 'How are NGOs verified on the platform?',
    a: 'NGO accounts are registered with organizational details. All NGOs agree to our food safety and hygiene guidelines upon registration. Our team continuously monitors activity to ensure safe food handling standards are maintained.'
  },
  {
    q: 'Can I generate a CSR report for tax or audit purposes?',
    a: 'Yes! Donors have access to a professional, printable CSR report that includes itemized donation records, meals donated, people fed, and CO₂ emissions prevented. You can download it as a PDF directly from your dashboard.'
  },
  {
    q: 'What happens if a donation expires without being reserved?',
    a: 'Donations past their pickup deadline remain visible in your donation history with a "Pending" status but will not appear in the available listings for NGOs. We encourage setting realistic deadlines to maximize redistribution.'
  }
];

export function LandingPage() {
  const [stats, setStats] = useState({
    totalMealsDonated: 1250,
    estimatedPeopleFed: 1250,
    co2SavedKg: 3125,
    ngosConnected: 14
  });

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
      <section className="relative overflow-hidden pt-28 pb-40 md:pt-36 md:pb-52 bg-slate-950 border-b border-emerald-900/20">
        {/* Responsive Unsplash Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="Food Donation Community"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
          />
          {/* Dark Radial & Linear Gradient Overlays for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-emerald-950/40 to-slate-950/90" />
        </div>

        {/* Animated glowing background blobs */}
        <FloatingBlob className="w-[850px] h-[850px] bg-emerald-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" delay={0} />
        <FloatingBlob className="w-[550px] h-[550px] bg-teal-400/15 top-10 right-10 z-0" delay={2} />

        {/* Tech radial mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <span>AI-Powered Food Waste Reduction Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
            >
              Reduce Waste.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Feed More Lives.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              FoodBridge connects restaurants, bakeries, hotels, and supermarkets with local NGOs in real-time — turning surplus food into immediate nourishment for families in need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/signup?role=donor"
                className="btn-emerald w-full sm:w-auto px-8 py-4 rounded-xl font-bold shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center space-x-2 text-base"
              >
                <span>Start Donating Food</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/available"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-100 bg-slate-900/80 border border-emerald-500/40 hover:bg-slate-800 hover:border-emerald-400/60 transition-all flex items-center justify-center space-x-2 text-base backdrop-blur-sm"
              >
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>Browse as NGO</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 pt-4"
            >
              {[
                { icon: CheckCircle2, text: 'Instant NGO Match' },
                { icon: Zap, text: 'AI Freshness Engine' },
                { icon: FileText, text: 'CSR Audit Ready' },
                { icon: ShieldCheck, text: 'Secure & Private' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center space-x-1.5">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATISTICS SECTION ────────────────────────────────────────────── */}
      <section className="py-14 bg-slate-900/40 border-y border-emerald-950/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Meals Saved', value: stats.totalMealsDonated, suffix: '+', color: 'text-emerald-400' },
              { label: 'CO₂ Prevented', value: stats.co2SavedKg, suffix: ' kg', color: 'text-teal-400' },
              { label: 'NGOs Connected', value: stats.ngosConnected, suffix: '', color: 'text-emerald-300' },
              { label: 'Hygienic Traceability', value: 100, suffix: '%', color: 'text-teal-300' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-900/30 backdrop-blur-sm hover:border-emerald-500/30 transition-colors"
              >
                <div className={`text-3xl sm:text-4xl font-extrabold mb-1 ${s.color}`}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm font-medium text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase font-bold text-emerald-400 tracking-wider"
          >
            Why Choose FoodBridge
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Empowering Surplus Food Redistribution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm"
          >
            A complete ecosystem built for efficiency, transparency, and maximum impact.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={Utensils} title="Donate Food" color="emerald" delay={0} desc="Post available surplus meals in under 60 seconds with pickup deadlines, location, and photo upload." />
          <FeatureCard icon={Building2} title="Find Donations" color="teal" delay={0.1} desc="NGOs instantly browse pending food listings sorted by proximity and nearest deadline for rapid retrieval." />
          <FeatureCard icon={BarChart3} title="Impact Tracking" color="emerald" delay={0.2} desc="Visualize meals saved, people fed, and carbon emissions prevented using real-time interactive charts." />
          <FeatureCard icon={FileText} title="CSR Reporting" color="teal" delay={0.3} desc="Generate downloadable PDF and printable CSR reports for corporate sustainability and compliance." />
        </div>

        {/* Bento Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-900/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:opacity-70 transition-opacity" />
            <Zap className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Freshness Engine</h3>
            <p className="text-slate-400 text-sm max-w-md">
              Our intelligent system analyzes food type and deadline to generate real-time freshness estimates — helping NGOs prioritize urgent pickups and donors communicate safety accurately.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Gemini-Ready', 'OpenAI-Ready', 'Rule-Based Fallback', 'Instant Preview'].map(tag => (
                <span key={tag} className="px-3 py-1 text-xs font-semibold bg-emerald-950 border border-emerald-500/30 text-emerald-300 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-900/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
            <Globe className="w-8 h-8 text-teal-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Zero Waste. Maximum Impact.</h3>
            <p className="text-slate-400 text-sm">
              Every meal donated prevents CO₂ emissions and feeds real people. Track your environmental impact in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-900/30 border-y border-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase font-bold text-emerald-400 tracking-wider"
            >
              Simple 4-Step Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              How FoodBridge Works
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            {[
              { step: 1, title: 'Donor Posts Food', desc: 'Restaurants or bakeries list surplus food items with pickup location and deadline in under 60 seconds.', icon: Package },
              { step: 2, title: 'NGO Reserves Food', desc: 'Verified NGOs claim the donation with a single click, locking it to prevent double reservation.', icon: Building2 },
              { step: 3, title: 'Food Collected', desc: 'NGO collects food from donor location before deadline and marks the item as collected.', icon: CheckCircle2 },
              { step: 4, title: 'Impact Recorded', desc: 'Platform automatically records meals saved and updates carbon offset metrics for CSR reports.', icon: TrendingUp },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all group"
              >
                <div className="btn-emerald w-12 h-12 rounded-full font-extrabold flex items-center justify-center mx-auto mb-4 text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  {step}
                </div>
                <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-100 mb-2">{title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase font-bold text-emerald-400 tracking-wider"
          >
            Community Voices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Trusted by Food Heroes
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            text="FoodBridge transformed our hotel's food management. Instead of throwing away untouched banquet meals, we now feed over 200 people every week!"
            name="Rajesh Kumar"
            role="Banquet Manager, Grand Hotel"
            initial="R"
            color="emerald"
            delay={0}
          />
          <TestimonialCard
            text="The AI freshness estimates and deadline alerts give us total peace of mind. We collect fresh meals within 1 hour of reservation."
            name="Sister Maria"
            role="Coordinator, Hope Foundation NGO"
            initial="S"
            color="teal"
            delay={0.1}
          />
          <TestimonialCard
            text="The automated CSR reporting helped our bakery chain achieve annual carbon offset targets and tax exemption documentation effortlessly."
            name="Anita Sharma"
            role="CSR Director, Green Bakery Chain"
            initial="A"
            color="emerald"
            delay={0.2}
          />
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900/20 border-t border-emerald-950/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs uppercase font-bold text-emerald-400 tracking-wider"
            >
              Got Questions?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <FloatingBlob className="w-[500px] h-[500px] bg-emerald-500/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={1} />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-teal-950/80 border border-emerald-700/20 backdrop-blur-sm shadow-2xl space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <HeartHandshake className="w-4 h-4" />
              <span>Join 1,000+ Food Heroes</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to Make a Difference?</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base">
              Start saving meals and nourishing communities today. Register as a food donor or NGO partner in minutes — completely free.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/signup?role=donor"
                className="btn-emerald px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                <span>Sign Up as Donor</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/signup?role=ngo"
                className="px-8 py-4 rounded-xl font-bold text-slate-100 bg-slate-800/80 hover:bg-slate-700 border border-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>Register as NGO</span>
              </Link>
            </div>
            <p className="text-xs text-slate-500">No credit card required. 100% free platform.</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
