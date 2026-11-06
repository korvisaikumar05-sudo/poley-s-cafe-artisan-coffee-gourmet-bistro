import { createClient } from '@supabase/supabase-js';
import { Booking, BookingStatus } from '../types';

// Supabase credentials provided by user, with Vite env override capability
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://tckojjdkbiwhycsznekb.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KOSso6qS1I8HjGXXFg770A_MRuZuvmf';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const SUPABASE_SCHEMA_SQL = `-- 1. Create the bookings table
create table if not exists public.bookings (
  id text primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone_number text not null,
  service_name text not null,
  booking_date text not null,
  time_slot text not null,
  guest_count integer not null default 2,
  status text not null default 'Pending',
  notes text,
  estimated_amount numeric default 0
);

-- 2. Enable Row Level Security (RLS)
alter table public.bookings enable row level security;

-- 3. Drop existing policies if any (for clean re-runs)
drop policy if exists "Allow public read access" on public.bookings;
drop policy if exists "Allow public insert access" on public.bookings;
drop policy if exists "Allow public update access" on public.bookings;
drop policy if exists "Allow public delete access" on public.bookings;

-- 4. Create RLS Policies allowing client demo access
create policy "Allow public read access"
  on public.bookings
  for select
  using (true);

create policy "Allow public insert access"
  on public.bookings
  for insert
  with check (true);

create policy "Allow public update access"
  on public.bookings
  for update
  using (true)
  with check (true);

create policy "Allow public delete access"
  on public.bookings
  for delete
  using (true);

-- 5. Enable real-time replication for bookings
alter publication supabase_realtime add table public.bookings;
`;

export interface DbBookingRow {
  id: string;
  created_at?: string;
  customer_name: string;
  phone_number: string;
  service_name: string;
  booking_date: string;
  time_slot: string;
  guest_count: number;
  status: string;
  notes?: string | null;
  estimated_amount?: number;
}

// Convert DB row to UI Booking type
export function mapRowToBooking(row: DbBookingRow): Booking {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone_number,
    date: row.booking_date,
    timeSlot: row.time_slot,
    serviceOrTable: row.service_name,
    guests: row.guest_count,
    status: (row.status as BookingStatus) || 'Pending',
    createdAt: row.created_at ? row.created_at.replace('T', ' ').substring(0, 16) : new Date().toISOString().substring(0, 16),
    estimatedAmount: Number(row.estimated_amount) || 0,
    specialRequests: row.notes || undefined,
  };
}

// Convert UI Booking to DB row
export function mapBookingToRow(booking: Booking): DbBookingRow {
  return {
    id: booking.id,
    customer_name: booking.customerName,
    phone_number: booking.phone,
    service_name: booking.serviceOrTable,
    booking_date: booking.date,
    time_slot: booking.timeSlot,
    guest_count: booking.guests,
    status: booking.status,
    notes: booking.specialRequests || null,
    estimated_amount: booking.estimatedAmount,
  };
}

// Fetch all bookings from Supabase
export async function fetchSupabaseBookings(): Promise<{ data: Booking[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const mapped = (data as DbBookingRow[]).map(mapRowToBooking);
    return { data: mapped, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

// Insert a booking into Supabase
export async function insertSupabaseBooking(booking: Booking): Promise<{ success: boolean; error: Error | null }> {
  try {
    const row = mapBookingToRow(booking);
    const { error } = await supabase.from('bookings').insert([row]);
    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// Update booking status in Supabase
export async function updateSupabaseBookingStatus(
  id: string,
  newStatus: BookingStatus
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}

// Delete booking from Supabase
export async function deleteSupabaseBooking(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
}
