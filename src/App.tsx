/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesMenuGrid } from './components/ServicesMenuGrid';
import { AmbienceGallery } from './components/AmbienceGallery';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/AdminPortal';
import { INITIAL_BOOKINGS } from './data/cafeData';
import { Booking, BookingStatus, MenuItem } from './types';
import { Calendar, Check, X } from 'lucide-react';
import {
  fetchSupabaseBookings,
  updateSupabaseBookingStatus,
  deleteSupabaseBooking,
  insertSupabaseBooking,
  supabase,
  mapRowToBooking,
  DbBookingRow,
  isSupabaseConfigured
} from './lib/supabase';

const STORAGE_KEY = 'poleys_cafe_bookings_v1';

export default function App() {
  // Load bookings from localStorage or initialize with realistic entries
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load bookings from localStorage', e);
    }
    return INITIAL_BOOKINGS;
  });

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [preselectedItem, setPreselectedItem] = useState<MenuItem | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync bookings to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to persist bookings', e);
    }
  }, [bookings]);

  // Load from Supabase on mount
  const loadBookingsFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await fetchSupabaseBookings();
      if (!error && data && data.length > 0) {
        setBookings(data);
      }
    } catch (err) {
      console.warn('Supabase fetch notice: using cached bookings', err);
    }
  }, []);

  useEffect(() => {
    loadBookingsFromSupabase();

    // Listen to real-time postgres changes on bookings table
    const channel = supabase
      .channel('realtime_bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as DbBookingRow;
            const newBooking = mapRowToBooking(newRow);
            setBookings((prev) => {
              if (prev.some((b) => b.id === newBooking.id)) return prev;
              return [newBooking, ...prev];
            });
            showToast(`New booking #${newBooking.id} received in real-time!`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new as DbBookingRow;
            const updatedBooking = mapRowToBooking(updatedRow);
            setBookings((prev) =>
              prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string })?.id;
            if (deletedId) {
              setBookings((prev) => prev.filter((b) => b.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadBookingsFromSupabase]);

  const handleOpenBooking = (item?: MenuItem) => {
    setPreselectedItem(item || null);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedItem(null);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => {
      if (prev.some((b) => b.id === newBooking.id)) return prev;
      return [newBooking, ...prev];
    });
    showToast(`Reservation #${newBooking.id} confirmed and saved to Supabase!`);
  };

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    // 1. Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Booking #${id} status changed to ${newStatus}.`);

    // 2. Persist to Supabase
    try {
      const res = await updateSupabaseBookingStatus(id, newStatus);
      if (!res.success && res.error) {
        console.warn('Supabase status update error:', res.error.message);
      }
    } catch (e) {
      console.warn('Status update sync error:', e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking entry?')) {
      // 1. Optimistic update
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showToast(`Booking #${id} deleted.`);

      // 2. Persist to Supabase
      try {
        await deleteSupabaseBooking(id);
      } catch (e) {
        console.warn('Delete sync error:', e);
      }
    }
  };

  const handleAddManualBooking = async (newBooking: Booking) => {
    // 1. Optimistic update
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Walk-in booking #${newBooking.id} added.`);

    // 2. Persist to Supabase
    try {
      await insertSupabaseBooking(newBooking);
    } catch (e) {
      console.warn('Manual booking sync error:', e);
    }
  };

  const handleExploreMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Client Top Bar (Clean, no technical IDs or backend placeholders) */}
      <TopBar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 2. Primary Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 3. Hero Section */}
      <HeroSection
        onOpenBooking={() => handleOpenBooking()}
        onExploreMenu={handleExploreMenu}
      />

      {/* 4. Services / Offerings Grid */}
      <ServicesMenuGrid
        onSelectItemForBooking={(item) => handleOpenBooking(item)}
      />

      {/* 5. Ambience & Experience Highlights */}
      <AmbienceGallery />

      {/* 6. Customer Reviews (Google Maps Verified) */}
      <ReviewsSection />

      {/* 7. Location, Timings & Directions */}
      <LocationSection />

      {/* 8. Client-Facing Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action Button for Mobile Booking */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center space-x-3 sm:hidden">
        <button
          onClick={() => handleOpenBooking()}
          className="p-3.5 rounded-full bg-amber-400 text-slate-950 shadow-2xl shadow-amber-500/50 flex items-center justify-center font-bold"
          aria-label="Book Table"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Booking / Reservation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedItem={preselectedItem}
        onBookingCreated={handleBookingCreated}
      />

      {/* Protected Admin Management Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateStatus}
        onDeleteBooking={handleDeleteBooking}
        onAddBooking={handleAddManualBooking}
        onRefresh={loadBookingsFromSupabase}
        isDbConnected={isSupabaseConfigured}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl glass-panel bg-slate-900/95 border border-amber-400/30 text-white text-xs sm:text-sm shadow-2xl animate-fade-in max-w-md">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
