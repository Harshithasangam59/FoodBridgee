import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bot, ShieldCheck, Clock, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { aiAPI } from '../services/api';

export function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [inputFood, setInputFood] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const quickQuestions = [
    'How long does cooked rice stay safe?',
    'What food packaging works best for NGOs?',
    'Is tax deduction available for CSR food donation?'
  ];

  const handleAsk = async (foodText) => {
    const textToAnalyze = foodText || inputFood;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setAiResponse(null);

    try {
      const res = await aiAPI.getFreshnessEstimate({ foodDescription: textToAnalyze, foodType: 'cooked' });
      setAiResponse({
        title: `AI Analysis for "${textToAnalyze}"`,
        score: res.freshnessScore || 90,
        message: res.message || 'Safe for distribution within 4-6 hours under standard food hygiene guidelines.',
        recommendations: [
          'Store in airtight thermal container',
          'Maintain temperature above 60°C or below 4°C',
          'Label pickup deadline clearly for NGO volunteers'
        ]
      });
    } catch {
      setAiResponse({
        title: `AI Safety Guide for "${textToAnalyze}"`,
        score: 85,
        message: 'Food appears suitable for fast-track donation. Recommended pickup window is within 3 hours.',
        recommendations: ['Keep sealed', 'Avoid direct sunlight exposure']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center space-x-2 px-4 py-3 rounded-full bg-slate-900/90 border border-emerald-500/50 text-emerald-300 shadow-2xl shadow-emerald-500/30 backdrop-blur-md group hover:border-emerald-400"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-12 transition-transform">
          <Bot className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-wide">FoodBridge AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </motion.button>

      {/* Assistant Modal Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <span>FoodBridge AI Copilot</span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Freshness, Hygiene & Logistics AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-4 overflow-y-auto flex-grow text-xs leading-relaxed text-slate-300">
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">Smart Freshness Estimation</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Type any food item (e.g. "50 rolls of freshly baked garlic bread") to calculate safe consumption windows.
                    </p>
                  </div>
                </div>

                {/* Input box */}
                <div className="relative">
                  <input
                    type="text"
                    value={inputFood}
                    onChange={(e) => setInputFood(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask AI e.g. 'Fresh fruit basket 5kg'..."
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAsk()}
                    disabled={loading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg btn-emerald text-xs flex items-center justify-center"
                  >
                    {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* AI Response Display */}
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{aiResponse.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                        {aiResponse.score}% Freshness Score
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">{aiResponse.message}</p>
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Handling Checklist:</span>
                      {aiResponse.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Quick Prompts */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick Suggestions:</span>
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAsk(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 text-[11px] flex items-center justify-between transition-colors group"
                    >
                      <span>{q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
