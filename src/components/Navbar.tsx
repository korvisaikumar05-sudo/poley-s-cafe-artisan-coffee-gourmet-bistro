import React, { useState } from 'react';
import { Coffee, Menu, X, Calendar, Sparkles, Shield } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Menu & Offerings', href: '#menu' },
    { label: 'Rooftop Vibe', href: '#ambience' },
    { label: 'Customer Reviews', href: '#reviews' },
    { label: 'Location & Hours', href: '#location' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-900/70 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Coffee className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-serif-heading tracking-wide text-white flex items-center gap-1.5">
                POLEY'S <span className="text-amber-400 font-sans font-light text-sm uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">CAFE</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                Specialty Roastery & Gourmet Kitchen • Hyderabad
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="relative group inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Now / Reserve</span>
              <Sparkles className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow"
            >
              Reserve
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-amber-400 transition-all"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-xl text-center text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table / Reserve Experience</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-xl text-center text-xs font-medium text-slate-300 border border-white/10 hover:bg-white/5 flex items-center justify-center space-x-2"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
