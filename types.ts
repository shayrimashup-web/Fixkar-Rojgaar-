export type UserRole = 'customer' | 'worker' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  city: string;
  address: string;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_hindi: string;
  icon: string;
  color: string;
  workers_count: number;
  is_active: boolean;
  sort_order: number;
}

export interface Worker {
  id: string;
  user_id: string;
  category_id: string;
  category_name: string;
  experience_years: number;
  hourly_rate: number;
  daily_rate: number;
  description: string;
  service_areas: string[];
  skills: string[];
  portfolio_images: string[];
  is_available: boolean;
  is_verified: boolean;
  is_approved: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  wallet_balance: number;
  work_timing_start: string;
  work_timing_end: string;
  city: string;
  profiles?: Profile;
}

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

export interface Booking {
  id: string;
  customer_id: string;
  worker_id: string;
  status: BookingStatus;
  problem_description: string;
  problem_images: string[];
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  city: string;
  estimated_cost: number;
  final_cost: number;
  is_emergency: boolean;
  created_at: string;
  workers?: Worker;
  profiles?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'general' | 'booking' | 'payment' | 'review' | 'system';
  is_read: boolean;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  worker_id: string;
  booking_id?: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
