import React from 'react';
import { MapPin, Navigation, Clock, Phone, MessageSquare, Car, ExternalLink, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-16 sm:py-24 relative bg-slate-950/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Details, Timings & Contacts */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                Find Our Cafe
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-white">
                Visit Poley's Cafe
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Centrally located on Nagarjuna Sagar Main Road in Hastinapuram with dedicated customer parking and easy elevator access.
              </p>
            </div>

            {/* Address Card */}
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Address & Landmark</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {BUSINESS_INFO.address}
                  </p>
                  <p className="text-xs text-amber-300/90 mt-1 font-medium">
                    📌 Landmark: {BUSINESS_INFO.landmark}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3">
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Live Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-white/10 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call {BUSINESS_INFO.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Operational Timings Card */}
            <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Operational Hours</h3>
                  <p className="text-xs text-slate-400">Serving fresh brews and warm dishes daily</p>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-white/5">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300">Monday – Thursday</span>
                  <span className="font-semibold text-white">11:00 AM – 11:00 PM</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-300">Friday – Sunday (Weekend)</span>
                  <span className="font-semibold text-amber-400">11:00 AM – 12:00 AM (Midnight)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * {BUSINESS_INFO.operatingHours.note}
              </p>
            </div>
          </div>

          {/* Right Column: Visual Map Card with Coordinates & Directions */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl glass-panel p-2 border border-white/10 shadow-2xl relative">
              <div className="rounded-2xl overflow-hidden relative bg-slate-900 h-96 sm:h-[420px] flex flex-col justify-between p-6">
                {/* Background Map Graphic Mock */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Hastinapuram Central, Hyderabad</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-[11px] text-slate-300 font-mono">
                    17.3289° N, 78.5540° E
                  </div>
                </div>

                {/* Center Pin Highlight */}
                <div className="relative z-10 text-center my-auto py-8">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 mx-auto flex items-center justify-center animate-bounce shadow-xl shadow-amber-500/20">
                    <MapPin className="w-8 h-8 text-amber-400 fill-amber-400/30" />
                  </div>
                  <h4 className="text-xl font-bold font-serif-heading text-white mt-3">
                    Poley's Cafe
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
                    Above V9 Fitness Station, Nagarjuna Sagar Road
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-xl backdrop-blur-md">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span>Free Dedicated Parking Available</span>
                  </div>

                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
