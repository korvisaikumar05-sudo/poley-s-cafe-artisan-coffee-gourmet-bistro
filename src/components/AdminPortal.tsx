import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  DollarSign,
  User,
  Calendar,
  X,
  FileSpreadsheet,
  AlertCircle,
  Database,
  RefreshCw,
  Code,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { SUPABASE_SCHEMA_SQL } from '../lib/supabase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
  onDeleteBooking: (id: string) => void;
  onAddBooking: (booking: Booking) => void;
  onRefresh?: () => Promise<void>;
  isDbConnected?: boolean;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onAddBooking,
  onRefresh,
  isDbConnected = true,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Dashboard Filters & Search
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // New manual booking form fields
  const [newCustName, setNewCustName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState('Specialty Coffee & Dinner Table (Regular Dining)');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('08:00 PM');
  const [newGuests, setNewGuests] = useState(2);
  const [newAmount, setNewAmount] = useState(800);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password.trim() === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. (Hint: Username: admin, Passcode: 1234)');
    }
  };

  // Instant Demo Auto-Fill
  const handleAutoFill = () => {
    setUsername('admin');
    setPassword('1234');
    setAuthError('');
  };

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // KPI Calculations
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const estimatedRevenue = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + (b.estimatedAmount || 0), 0);

  // Filtered Bookings List
  const filteredBookings = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceOrTable.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newPhone) return;

    const manualBooking: Booking = {
      id: `PC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustName.trim(),
      phone: newPhone.startsWith('+91') ? newPhone : `+91 ${newPhone.trim()}`,
      date: newDate,
      timeSlot: newTime,
      serviceOrTable: newService,
      guests: Number(newGuests),
      status: 'Confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedAmount: Number(newAmount),
      specialRequests: 'Walk-in / Phone reservation entered by Admin',
    };

    onAddBooking(manualBooking);
    setIsAddModalOpen(false);
    // Reset form
    setNewCustName('');
    setNewPhone('');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Confirmed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Pending</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-xl flex flex-col">
      {/* 1. CREDENTIAL GATE MODAL (If not yet authenticated) */}
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl glass-panel bg-slate-900/90 border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Top Close button to return to public site */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Return to Website"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lock Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif-heading text-white">
                Admin Management Portal
              </h3>
              <p className="text-xs text-slate-400">
                Protected dashboard for Poley's Cafe managers and reception staff.
              </p>
            </div>

            {/* Quick Demo Credential Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Default Credentials:</span>
                <span className="font-mono text-amber-300 font-semibold">User: admin | Pass: 1234</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-semibold text-xs transition-colors"
              >
                Demo Auto-Fill
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Management Portal</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Return to Public Website
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED EXECUTIVE DASHBOARD */
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Admin Bar */}
          <header className="bg-slate-900/90 border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Poley's Cafe</span>
                    <span className="text-[11px] font-sans font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Supabase Live</span>
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400">
                    Floor Management, Table Reservations & Backend Database
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                {/* View Supabase SQL Button */}
                <button
                  onClick={() => setIsSqlModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                  title="View and copy exact Supabase SQL schema"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>SQL Schema</span>
                </button>

                {/* Refresh DB button */}
                <button
                  onClick={handleRefreshClick}
                  disabled={isRefreshing}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-white/10 transition-colors disabled:opacity-50"
                  title="Refetch live records from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Booking</span>
                </button>

                <button
                  onClick={onClose}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-white/10 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>

                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  title="Lock / Sign Out"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Main Content */}
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8 flex-1">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Bookings */}
              <div className="rounded-2xl glass-card p-5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Bookings
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-serif-heading text-white">
                    {totalBookingsCount}
                  </span>
                  <span className="text-xs text-indigo-400 font-medium">All Time</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Includes table reserves & group packages</p>
              </div>

              {/* Pending Requests */}
              <div className="rounded-2xl glass-card p-5 border border-amber-500/20 bg-amber-950/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    Pending Requests
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-serif-heading text-amber-400">
                    {pendingCount}
                  </span>
                  <span className="text-xs text-amber-300/80 font-medium">Requires Action</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Awaiting confirmation from cafe desk</p>
              </div>

              {/* Confirmed Appointments */}
              <div className="rounded-2xl glass-card p-5 border border-emerald-500/20 bg-emerald-950/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Confirmed Tables
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-serif-heading text-emerald-400">
                    {confirmedCount}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">Active Slots</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Tables blocked and prepared</p>
              </div>

              {/* Estimated Revenue */}
              <div className="rounded-2xl glass-card p-5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Estimated Revenue
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-3xl font-bold font-serif-heading text-amber-400">
                    ₹{estimatedRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">Live Bookings</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Calculated from confirmed experiences</p>
              </div>
            </div>

            {/* Bookings Management Card */}
            <div className="rounded-2xl glass-panel bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
              {/* Table Toolbar */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Active Bookings & Guest Roster</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {filteredBookings.length} entries
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Directly synchronized with Supabase database</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg glass-input text-xs text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* Status Filter buttons */}
                  <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-950/80 border border-white/10">
                    {(['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                          statusFilter === st
                            ? 'bg-amber-400 text-slate-950 font-bold shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st === 'all' ? 'All' : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Responsive Bookings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Customer & Contact</th>
                      <th className="py-3 px-4">Service / Table Experience</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Guests</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No bookings found matching your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono font-medium text-amber-400">
                            {booking.id}
                            <span className="block text-[10px] text-slate-500 font-sans">
                              {booking.createdAt}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block text-sm">
                              {booking.customerName}
                            </span>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <a
                                href={`tel:${booking.phone}`}
                                className="inline-flex items-center space-x-1 text-slate-400 hover:text-white"
                                title="Call customer"
                              >
                                <Phone className="w-3 h-3 text-amber-400" />
                                <span>{booking.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(booking.customerName)},%20this%20is%20Poley's%20Cafe%20regarding%20your%20reservation%20(${booking.id}).`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300"
                                title="WhatsApp chat"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            </div>
                            {booking.specialRequests && (
                              <p className="text-[11px] text-amber-300/80 mt-1 max-w-xs line-clamp-1 italic">
                                Note: {booking.specialRequests}
                              </p>
                            )}
                          </td>

                          {/* Service / Table */}
                          <td className="py-3.5 px-4">
                            <span className="text-slate-200 font-medium block">
                              {booking.serviceOrTable}
                            </span>
                            <span className="text-[11px] text-amber-400 font-semibold">
                              Est: ₹{booking.estimatedAmount}
                            </span>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span className="font-medium text-white">{booking.date}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-slate-400 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{booking.timeSlot}</span>
                            </div>
                          </td>

                          {/* Guests */}
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getStatusBadge(booking.status)}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center space-x-1.5">
                              {booking.status !== 'Confirmed' && (
                                <button
                                  onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                                  title="Confirm booking (Syncs with Supabase)"
                                >
                                  Confirm
                                </button>
                              )}

                              {booking.status !== 'Cancelled' && (
                                <button
                                  onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                                  className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-[11px] font-medium transition-colors"
                                  title="Cancel booking (Syncs with Supabase)"
                                >
                                  Cancel
                                </button>
                              )}

                              {booking.status === 'Confirmed' && (
                                <button
                                  onClick={() => onUpdateStatus(booking.id, 'Completed')}
                                  className="px-2 py-1 rounded bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-[11px] font-medium transition-colors"
                                  title="Mark as Completed"
                                >
                                  Done
                                </button>
                              )}

                              <button
                                onClick={() => onDeleteBooking(booking.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete record from Supabase"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {/* Quick Add Manual Booking Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-slate-900 border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white">Add New Walk-In / Phone Reservation</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleManualAddSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98490 00000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={newGuests}
                        onChange={(e) => setNewGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl glass-input text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Est. Amount (₹)</label>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl glass-input text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Table / Package Type</label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-white bg-slate-900"
                    >
                      <option value="Specialty Coffee & Dinner Table (Regular Dining)">Regular Dining Table</option>
                      <option value="Romantic Candlelight Rooftop Table">Romantic Candlelight Rooftop Table (₹1,499)</option>
                      <option value="Work & Brew Dedicated Day Pass">Work & Brew Pass (₹499)</option>
                      <option value="Friends Group Lounge & Board Games (6-8 Guests)">Friends Lounge & Board Games (₹1,999)</option>
                      <option value="Private Birthday / Milestone Party Deck">Birthday Party Deck (₹3,499)</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                    >
                      Save Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Supabase SQL Schema Modal */}
          {isSqlModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
              <div className="relative w-full max-w-2xl rounded-2xl glass-panel bg-slate-900 border border-white/10 p-6 space-y-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">Supabase SQL Editor Script</h3>
                  </div>
                  <button onClick={() => setIsSqlModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Run this SQL in your <span className="text-amber-300 font-mono">Supabase SQL Editor</span> to create the table and enable RLS policies for live client access:
                </p>

                <div className="relative flex-1 overflow-hidden rounded-xl bg-slate-950 border border-white/10 p-4">
                  <pre className="text-[11px] font-mono text-emerald-300/90 overflow-y-auto max-h-72 whitespace-pre-wrap select-all">
                    {SUPABASE_SCHEMA_SQL}
                  </pre>
                  <button
                    onClick={handleCopySql}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-md hover:bg-amber-300 transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Target: public.bookings table with RLS enabled</span>
                  <button
                    onClick={() => setIsSqlModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
