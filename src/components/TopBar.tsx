import React, { useState, useEffect } from 'react';
import { Phone, MapPin, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';

interface TopBarProps {
  onOpenAdmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAdmin }) => {
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Check live operating hours
  useEffect(() => {
    const checkOpenStatus = () => {
      // Local time check
      const now = new Date();
      const hours = now.getHours();
      // Open from 11:00 AM to 11:00 PM (23:00) or Midnight (0:00) on weekends
      const day = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
      const isWeekend = day === 0 || day === 5 || day === 6;
      const closingHour = isWeekend ? 24 : 23;
      setIsOpenNow(hours >= 11 && hours < closingHour);
    };

    checkOpenStatus();
    const timer = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#070A11] border-b border-white/5 text-xs text-slate-300 py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live Status & Hours */}
        <div className="flex items-center space-x-3 flex-wrap">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{isOpenNow ? 'Open Now' : 'Opens at 11:00 AM'}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Today: 11:00 AM – 11:00 PM</span>
          </div>

          <span className="hidden md:inline text-slate-700">|</span>

          {/* Clean Address Tag */}
          <a
            href={BUSINESS_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="Open in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-xs">8A Nagarjuna Sagar Rd, Hastinapuram, Hyderabad</span>
          </a>
        </div>

        {/* Right: Phone, WhatsApp & Discrete Admin Link */}
        <div className="flex items-center space-x-4 ml-auto">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium tracking-wide">{BUSINESS_INFO.displayPhone}</span>
          </a>

          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 hover:text-emerald-300 transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="font-medium">WhatsApp</span>
          </a>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/5 transition-all text-[11px]"
            title="Staff & Management Access"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400/80" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
