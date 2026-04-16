import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '@/lib/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDemoUser: (role: UserRole) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  setDemoUser: () => {},
  isDemoMode: false,
});

const DEMO_PROFILES: Record<UserRole, Profile> = {
  customer: {
    id: 'demo-customer',
    full_name: 'Amit Verma',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=200',
    role: 'customer',
    city: 'Delhi',
    address: 'A-234, Lajpat Nagar, New Delhi',
    is_active: true,
    is_banned: false,
    created_at: '2024-01-01',
  },
  worker: {
    id: 'demo-worker',
    full_name: 'Ramesh Kumar',
    phone: '+91 87654 32109',
    avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200',
    role: 'worker',
    city: 'Delhi',
    address: 'Lajpat Nagar, Delhi',
    is_active: true,
    is_banned: false,
    created_at: '2023-01-15',
  },
  admin: {
    id: 'demo-admin',
    full_name: 'Admin User',
    phone: '+91 99999 88888',
    avatar_url: '',
    role: 'admin',
    city: 'Delhi',
    address: 'Admin Office',
    is_active: true,
    is_banned: false,
    created_at: '2022-01-01',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        (async () => {
          await fetchProfile(session.user.id);
        })();
      } else if (!isDemoMode) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) setProfile(data);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (session) await fetchProfile(session.user.id);
  };

  const signOut = async () => {
    if (isDemoMode) {
      setProfile(null);
      setIsDemoMode(false);
    } else {
      await supabase.auth.signOut();
    }
  };

  const setDemoUser = (role: UserRole) => {
    setProfile(DEMO_PROFILES[role]);
    setIsDemoMode(true);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      session,
      profile,
      role: profile?.role ?? null,
      loading,
      signOut,
      refreshProfile,
      setDemoUser,
      isDemoMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
