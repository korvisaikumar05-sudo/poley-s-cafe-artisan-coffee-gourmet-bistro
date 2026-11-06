import React from 'react';
import { Star, CheckCircle, ExternalLink, MessageCircle, Heart, Quote } from 'lucide-react';
import { GOOGLE_REVIEWS, BUSINESS_INFO } from '../data/cafeData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-heading text-white">
              Loved by Foodies & Coffee Enthusiasts
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Real reviews from verified Google Maps visitors who fell in love with our artisanal coffees, creamy Alfredo pasta, and rooftop energy.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl glass-card border border-amber-500/20 bg-slate-900/80 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-extrabold font-serif-heading text-white">4.8</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Based on 342+ reviews on Google Maps
              </p>
            </div>

            <a
              href={BUSINESS_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-all shrink-0"
            >
              <span>View Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </a>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {GOOGLE_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl glass-card p-6 sm:p-7 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between space-y-4 relative"
            >
              {/* Quote mark decoration */}
              <div className="absolute top-5 right-5 text-white/5 pointer-events-none">
                <Quote className="w-12 h-12" />
              </div>

              {/* Review Text */}
              <div className="space-y-3 relative z-10">
                {/* Highlight Tag */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-400/10 border border-amber-400/20 text-amber-300">
                  "{review.highlight}"
                </span>

                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{review.author}</span>
                      <span title="Verified Reviewer">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">{review.date} on Google Maps</p>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
