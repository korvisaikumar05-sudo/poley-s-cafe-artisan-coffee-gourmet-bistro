import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Check, Sparkles, Phone, User, MessageSquare, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Database, Loader2 } from 'lucide-react';
import { MenuItem, Booking } from '../types';
import { BUSINESS_INFO } from '../data/cafeData';
import { insertSupabaseBooking } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: MenuItem | null;
  onBookingCreated: (booking: Booking) => void;
}

const TIME_SLOTS = [
  // Lunch / Afternoon
  '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM',
  // Evening / Golden Hour
  '04:30 PM', '05:30 PM', '06:30 PM',
  // Prime Dinner & Rooftop
  '07:30 PM', '08:30 PM', '09:30 PM', '10:30 PM'
];

const EXPERIENCE_OPTIONS = [
  { id: 'regular', name: 'Regular Cafe & Bistro Table', price: 0, desc: 'Casual dining, artisanal coffees, and quick bites.' },
  { id: 'romantic', name: 'Romantic Candlelight Rooftop Table', price: 1499, desc: 'Fairy lights, floral setup, custom message, 2 mocktails & dessert.' },
  { id: 'work', name: 'Work & Brew Gigabit Pass', price: 499, desc: 'Dedicated charging socket, 300 Mbps WiFi, unlimited coffee & pastry.' },
  { id: 'group', name: 'Friends Lounge & Board Games (6-8 Guests)', price: 1999, desc: 'Lounge sectional, 20+ board games, loaded nachos platter.' },
  { id: 'birthday', name: 'Private Birthday / Milestone Party Deck', price: 3499, desc: 'Neon backdrop, music control, server, and welcome coolers.' },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedItem,
  onBookingCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedExperience, setSelectedExperience] = useState<string>('regular');
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('07:30 PM');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [dbSynced, setDbSynced] = useState<boolean>(false);

  // Initialize minimum date as today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDate(todayStr);
      setErrorMsg('');
      if (preselectedItem) {
        if (preselectedItem.category === 'experiences') {
          setSelectedExperience(preselectedItem.id);
        } else {
          setSpecialRequests(`Requesting availability for: ${preselectedItem.name}`);
        }
      }
    }
  }, [isOpen, preselectedItem, todayStr]);

  if (!isOpen) return null;

  const handleNextStep1 = () => {
    if (guests < 1) {
      setErrorMsg('Please select at least 1 guest.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!date) {
      setErrorMsg('Please select a date.');
      return;
    }
    if (!timeSlot) {
      setErrorMsg('Please select a preferred time slot.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }

    const expObj = EXPERIENCE_OPTIONS.find(e => e.id === selectedExperience);
    const chosenExpName = preselectedItem && preselectedItem.category === 'experiences' 
      ? preselectedItem.name 
      : expObj?.name || 'Regular Cafe Dining';

    const baseAmount = preselectedItem && preselectedItem.category === 'experiences'
      ? preselectedItem.price
      : expObj?.price || (guests * 450);

    const newBooking: Booking = {
      id: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      phone: phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`,
      email: email.trim() || undefined,
      date,
      timeSlot,
      serviceOrTable: chosenExpName,
      guests,
      specialRequests: specialRequests.trim() || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedAmount: baseAmount,
    };

    setIsSubmitting(true);
    try {
      const res = await insertSupabaseBooking(newBooking);
      setDbSynced(res.success);
    } catch {
      setDbSynced(false);
    } finally {
      setIsSubmitting(false);
      setCreatedBooking(newBooking);
      onBookingCreated(newBooking);
      setStep(4);
    }
  };

  const formatWhatsAppText = () => {
    if (!createdBooking) return '';
    return encodeURIComponent(
      `Hello Poley's Cafe! I have placed an appointment / table reservation:\n\n` +
      `Booking ID: ${createdBooking.id}\n` +
      `Name: ${createdBooking.customerName}\n` +
      `Date: ${createdBooking.date}\n` +
      `Time: ${createdBooking.timeSlot}\n` +
      `Guests: ${createdBooking.guests}\n` +
      `Table/Package: ${createdBooking.serviceOrTable}\n` +
      (createdBooking.specialRequests ? `Special Request: ${createdBooking.specialRequests}\n` : '') +
      `\nPlease confirm availability. Thank you!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel bg-slate-900/95 border border-white/10 shadow-2xl overflow-hidden my-8">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reserve a Table / Experience</h3>
              <p className="text-xs text-slate-400">Poley's Cafe • Hastinapuram, Hyderabad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="px-6 py-3 bg-slate-950/30 border-b border-white/5 flex items-center justify-between text-xs">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}>
                1
              </span>
              <span>Experience</span>
            </div>
            <div className="h-0.5 w-8 bg-white/10" />
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}>
                2
              </span>
              <span>Date & Slot</span>
            </div>
            <div className="h-0.5 w-8 bg-white/10" />
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}>
                3
              </span>
              <span>Contact</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-200">
                ✕
              </button>
            </div>
          )}

          {/* STEP 1: Experience & Guest count */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Select Dining Type or Experience
                </label>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedExperience(opt.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                        selectedExperience === opt.id
                          ? 'bg-amber-400/10 border-amber-400/50 shadow-md'
                          : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{opt.name}</span>
                          {opt.price > 0 && (
                            <span className="text-xs font-semibold text-amber-400">
                              (₹{opt.price})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{opt.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                        selectedExperience === opt.id ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}>
                        {selectedExperience === opt.id && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Number of Guests
                </label>
                <div className="flex items-center space-x-3">
                  {[1, 2, 4, 6, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        guests === num
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <span>Select Date & Time Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time slot */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Reservation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Open daily from 11:00 AM onwards.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium transition-all border ${
                        timeSlot === slot
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-900/70 text-slate-300 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-slate-800 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <span>Enter Guest Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Information */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Reddy"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mobile Number (Calling & WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">We’ll send your booking confirmation via WhatsApp/SMS.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Special Requests / Dietary Preferences
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday anniversary decor, corner table, almond milk requested..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs sm:text-sm text-white resize-none"
                />
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-slate-800 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Saving Reservation...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && createdBooking && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Reservation Received!
                </span>
                <h3 className="text-2xl font-bold font-serif-heading text-white">
                  You're Booked at Poley's Cafe
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Our team has recorded your reservation and notified our floor manager.
                </p>
                <div className="pt-1 flex items-center justify-center space-x-1.5 text-[11px] text-emerald-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>{dbSynced ? 'Directly synced to live Supabase backend' : 'Confirmed & stored in reservations ledger'}</span>
                </div>
              </div>

              {/* Confirmation Details Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Booking Reference</span>
                  <span className="font-mono font-bold text-amber-400">{createdBooking.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Guest Name</span>
                  <span className="text-white font-medium">{createdBooking.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Date & Slot</span>
                  <span className="text-white font-medium">{createdBooking.date} at {createdBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Party Size</span>
                  <span className="text-white font-medium">{createdBooking.guests} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pending Confirmation
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Action Link */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/919121612356?text=${formatWhatsAppText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation Directly</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
