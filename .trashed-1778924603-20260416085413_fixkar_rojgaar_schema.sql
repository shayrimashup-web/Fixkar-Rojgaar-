
/*
  # Fixkar Rojgaar - Complete Schema

  ## Overview
  This migration creates the full database schema for the Fixkar Rojgaar app,
  which connects customers with local workers (plumber, electrician, etc.)

  ## Tables Created
  1. `profiles` - Extended user profiles for all users (customer/worker/admin)
  2. `categories` - Service categories (Plumber, Electrician, etc.)
  3. `workers` - Worker-specific data (skills, charges, availability)
  4. `bookings` - Customer booking records
  5. `reviews` - Ratings and reviews
  6. `notifications` - In-app notifications
  7. `wallet_transactions` - Worker earnings and withdrawals
  8. `saved_workers` - Customer's saved/favourite workers
  9. `chat_messages` - Chat between customer and worker
  10. `banners` - Admin-controlled promotional banners

  ## Security
  - RLS enabled on all tables
  - Role-based access policies
  - Admin-only management policies
*/

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'worker', 'admin')),
  city text DEFAULT '',
  address text DEFAULT '',
  is_active boolean DEFAULT true,
  is_banned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_hindi text DEFAULT '',
  icon text DEFAULT '',
  color text DEFAULT '#2563EB',
  workers_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- WORKERS TABLE
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  category_name text DEFAULT '',
  experience_years integer DEFAULT 0,
  hourly_rate decimal(10,2) DEFAULT 0,
  daily_rate decimal(10,2) DEFAULT 0,
  description text DEFAULT '',
  service_areas text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  portfolio_images text[] DEFAULT '{}',
  aadhaar_url text DEFAULT '',
  is_available boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_jobs integer DEFAULT 0,
  total_earnings decimal(10,2) DEFAULT 0,
  wallet_balance decimal(10,2) DEFAULT 0,
  work_timing_start text DEFAULT '08:00',
  work_timing_end text DEFAULT '20:00',
  city text DEFAULT '',
  latitude decimal(10,8) DEFAULT 0,
  longitude decimal(11,8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved workers"
  ON workers FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Workers can view own record"
  ON workers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Workers can insert own record"
  ON workers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Workers can update own record"
  ON workers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage workers"
  ON workers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  worker_id uuid NOT NULL REFERENCES workers(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected')),
  problem_description text DEFAULT '',
  problem_images text[] DEFAULT '{}',
  scheduled_date date,
  scheduled_time text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  estimated_cost decimal(10,2) DEFAULT 0,
  final_cost decimal(10,2) DEFAULT 0,
  commission decimal(10,2) DEFAULT 0,
  customer_notes text DEFAULT '',
  worker_notes text DEFAULT '',
  is_emergency boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Workers can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers w WHERE w.id = worker_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Workers can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers w WHERE w.id = worker_id AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers w WHERE w.id = worker_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  worker_id uuid NOT NULL REFERENCES workers(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  type text DEFAULT 'general' CHECK (type IN ('general', 'booking', 'payment', 'review', 'system')),
  is_read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES workers(id),
  booking_id uuid REFERENCES bookings(id),
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal', 'bonus')),
  amount decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own transactions"
  ON wallet_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workers w WHERE w.id = worker_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can insert own transactions"
  ON wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers w WHERE w.id = worker_id AND w.user_id = auth.uid()
    )
  );

-- SAVED WORKERS TABLE
CREATE TABLE IF NOT EXISTS saved_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id),
  worker_id uuid NOT NULL REFERENCES workers(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, worker_id)
);

ALTER TABLE saved_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage saved workers"
  ON saved_workers FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can save workers"
  ON saved_workers FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can remove saved workers"
  ON saved_workers FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  message text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booking participants can view messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id = booking_id 
      AND (b.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM workers w WHERE w.id = b.worker_id AND w.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Booking participants can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  link text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- SEED CATEGORIES DATA
INSERT INTO categories (name, name_hindi, icon, color, sort_order) VALUES
  ('Plumber', 'प्लंबर', 'droplets', '#2563EB', 1),
  ('Electrician', 'इलेक्ट्रीशियन', 'zap', '#F59E0B', 2),
  ('Painter', 'पेंटर', 'paintbrush', '#8B5CF6', 3),
  ('Carpenter', 'बढ़ई', 'hammer', '#D97706', 4),
  ('AC Repair', 'एसी रिपेयर', 'wind', '#06B6D4', 5),
  ('Bike Mechanic', 'बाइक मैकेनिक', 'bike', '#10B981', 6),
  ('Car Mechanic', 'कार मैकेनिक', 'car', '#EF4444', 7),
  ('Cleaner', 'सफाई वाले', 'sparkles', '#6366F1', 8),
  ('Driver', 'ड्राइवर', 'navigation', '#14B8A6', 9),
  ('Tutor', 'ट्यूटर', 'book-open', '#F97316', 10),
  ('Mason', 'राजमिस्त्री', 'layers', '#84CC16', 11),
  ('Welder', 'वेल्डर', 'flame', '#DC2626', 12)
ON CONFLICT DO NOTHING;
