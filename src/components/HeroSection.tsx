import React from 'react';
import { Star, Calendar, Utensils, CheckCircle2, Award, Users, Coffee, Wifi, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking, onExploreMenu }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Propositions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Real Rating Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-xs shadow-lg backdrop-blur-md">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-white">4.8</span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-medium">342+ Verified Google Reviews</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-medium text-[11px]">Top Rated in Hastinapuram</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-heading text-white tracking-tight leading-[1.15]">
              Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Artisanal Coffee</span> Meets Unhurried Conversations.
            </h1>

            {/* Subtitle / Value Propositions based on actual customer reviews */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              Hyderabad’s go-to rooftop cafe for freshly roasted single-origin Arabica, velvety Truffle Alfredo pastas, stone-baked thin crust pizzas, and cozy open-air vibes.
            </p>

            {/* Checkmark value pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                "100% Single-Estate Specialty Arabica",
                "Wood-Fired Styled Pizzas & Vibrant Pastas",
                "Scenic Rooftop Breeze & Board Games",
                "Gigabit High-Speed WiFi & Power Desks",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* High-Impact CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5 text-slate-950" />
                <span>Book Now / Reserve</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/70 hover:bg-slate-800/90 border border-white/10 hover:border-amber-400/40 backdrop-blur-md transition-all duration-200"
              >
                <Utensils className="w-5 h-5 text-amber-400" />
                <span>Explore Services & Menu</span>
              </button>
            </div>

            {/* Social Proof / Stats Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold font-serif-heading text-white">4.8 ★</p>
                <p className="text-xs text-slate-400">Google Maps Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-heading text-amber-400">45+</p>
                <p className="text-xs text-slate-400">Handcrafted Delicacies</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-heading text-white">Midnight</p>
                <p className="text-xs text-slate-400">Weekend Rooftop Hours</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Glass Card */}
          <div className="lg:col-span-5 relative">
            {/* Subtle glow border */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
              <div className="relative rounded-[22px] overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10">
                {/* Hero Showcase Image */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
                    alt="Poley's Cafe Ambience"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating badge top right */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Specialty Brew Bar</span>
                  </div>

                  {/* Floating Experience Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Signature Experience</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-400">From ₹240</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">Spanish Latte & Truffle Penne</h3>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      Our most loved duo ordered by 1,200+ guests this season.
                    </p>
                  </div>
                </div>

                {/* Sub Features grid inside card */}
                <div className="p-4 grid grid-cols-2 gap-3 bg-slate-900/90 text-xs border-t border-white/5">
                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                      <Wifi className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Gigabit WiFi</p>
                      <p className="text-[11px] text-slate-400">Work-ready seating</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Rooftop Lounge</p>
                      <p className="text-[11px] text-slate-400">Groups & dates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
