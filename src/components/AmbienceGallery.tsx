import React from 'react';
import { Sparkles, Compass, Moon, Wifi, Gamepad2, HeartHandshake } from 'lucide-react';

export const AmbienceGallery: React.FC = () => {
  const moments = [
    {
      title: 'Open-Air Rooftop Deck',
      subtitle: 'Gentle breezes, glowing fairy lights, and panoramic sunset views over Hastinapuram.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      tag: 'Sunset & Evenings',
      icon: Moon,
    },
    {
      title: 'Artisan Espresso Brew Bar',
      subtitle: 'Watch our skilled baristas extract single-origin Arabica with velvet micro-foam precision.',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
      tag: 'Specialty Roastery',
      icon: Compass,
    },
    {
      title: 'Work & Creative Hub',
      subtitle: 'High-speed gigabit fiber internet, dedicated charging points, and quiet focus booths.',
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
      tag: 'Work Friendly',
      icon: Wifi,
    },
    {
      title: 'Board Games & Social Lounge',
      subtitle: 'Over 20+ board games from Catan to Jenga for unforgettable weekend laughs with your tribe.',
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
      tag: 'Games & Gatherings',
      icon: Gamepad2,
    },
  ];

  return (
    <section id="ambience" className="py-16 sm:py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Poley's Atmosphere</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-heading text-white">
            Designed for Great Taste & Slow Living
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Whether you’re catching up with friends over board games, finishing remote work, or celebrating an intimate date night under the stars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {moments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl glass-card overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 h-80 sm:h-96"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.tag}</span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
