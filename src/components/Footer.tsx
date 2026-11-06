import React from 'react';
import { Coffee, Phone, MapPin, MessageSquare, Shield, Clock, Heart } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenAdmin }) => {
  return (
    <footer className="bg-[#06080F] border-t border-white/10 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Coffee className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-bold font-serif-heading tracking-wide text-white">
                POLEY'S CAFE
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Hastinapuram’s premier neighborhood rooftop cafe and espresso kitchen. Serving ethically sourced single-origin coffees, hand-tossed pizzas, and comfort classics.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900 transition-colors flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Menu & Artisanal Offerings
                </a>
              </li>
              <li>
                <a href="#ambience" className="hover:text-amber-400 transition-colors">
                  Rooftop Vibe & Coworking
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  Customer Reviews (4.8★)
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  Location & Driving Directions
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Book Table / Event Deck
                </button>
              </li>
            </ul>
          </div>

          {/* Timings & Location */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Cafe Hours & Address
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mon – Thu: 11:00 AM – 11:00 PM</p>
                  <p className="text-amber-300/90 font-medium">Fri – Sun: 11:00 AM – 12:00 AM Midnight</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  8A, Nagarjuna Sagar Road, above V9 Fitness Station, Shirdi Sai Nagar, Hasthinapuram Central, Hyderabad — 500079
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Poley's Cafe. All rights reserved. Hastinapuram, Hyderabad.</p>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <span>Handcrafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>for coffee lovers</span>
            </span>

            {/* Discrete Admin Link */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors"
              title="Staff Management Portal"
            >
              <Shield className="w-3 h-3 text-amber-400/70" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
