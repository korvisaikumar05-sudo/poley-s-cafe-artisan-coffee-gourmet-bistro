import React, { useState, useMemo } from 'react';
import { Search, Clock, Check, Star, Sparkles, Plus, Flame, Heart } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/cafeData';
import { MenuItem } from '../types';

interface ServicesMenuGridProps {
  onSelectItemForBooking: (item: MenuItem) => void;
}

export const ServicesMenuGrid: React.FC<ServicesMenuGridProps> = ({ onSelectItemForBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Search match
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      // Dietary filter
      const matchDietary =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'veg' && item.dietary === 'veg') ||
        (dietaryFilter === 'non-veg' && item.dietary === 'non-veg');

      return matchCategory && matchSearch && matchDietary;
    });
  }, [selectedCategory, searchQuery, dietaryFilter]);

  return (
    <section id="menu" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Culinary & Brew Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-heading text-white">
            Services & Artisanal Offerings
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Crafted with ethically sourced beans, imported cheeses, and hand-stretched sourdough. Explore our signature items or reserve a dedicated experience table.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-8 space-y-4">
          {/* Search & Dietary Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coffee, pastas, pizzas, mocktails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Switcher */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 border border-white/10 self-stretch sm:self-auto justify-center">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'all'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Menu
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-500 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-rose-500 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 border border-white"></span>
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Categorized Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/60 text-slate-300 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>Showing {filteredItems.length} curated offerings</span>
          {favorites.length > 0 && (
            <span className="text-amber-400 font-medium">
              ❤️ {favorites.length} saved to your favorites
            </span>
          )}
        </div>

        {/* Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-white/5 p-8">
            <p className="text-slate-400 text-base mb-2">No menu offerings found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl glass-card glass-card-hover overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Image & Badges */}
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Action Tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        {/* Dietary Badge */}
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border ${
                            item.dietary === 'veg'
                              ? 'border-emerald-500 bg-emerald-950/80 text-emerald-400'
                              : item.dietary === 'non-veg'
                              ? 'border-rose-500 bg-rose-950/80 text-rose-400'
                              : 'border-amber-500 bg-amber-950/80 text-amber-400'
                          }`}
                          title={item.dietary.toUpperCase()}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.dietary === 'veg'
                                ? 'bg-emerald-400'
                                : item.dietary === 'non-veg'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>

                        {item.isChefSpecial && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-slate-950 font-bold text-[10px] tracking-wide shadow-md">
                            <Flame className="w-3 h-3 fill-slate-950" />
                            <span>CHEF'S PICK</span>
                          </span>
                        )}

                        {item.isPopular && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/80 text-slate-950 font-bold text-[10px] tracking-wide shadow-md">
                            POPULAR
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isFav
                            ? 'bg-rose-500/80 text-white'
                            : 'bg-slate-900/70 text-slate-300 hover:text-rose-400'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>

                      {/* Duration / Prep Time Badge */}
                      <div className="absolute bottom-3 right-3 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.prepTime}</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-3">
                      {/* Name & Price in ₹ */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-extrabold text-amber-400">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Highlights with Clean Checkmarks */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        {item.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            <span className="truncate">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Rating & Reserve Action */}
                  <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center space-x-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-white">{item.rating}</span>
                      {item.reviewsCount && (
                        <span className="text-slate-400 text-[11px]">({item.reviewsCount})</span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectItemForBooking(item)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm group-hover:shadow-amber-500/20"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-950" />
                      <span>Reserve / Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
