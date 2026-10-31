import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session: Session | null) => {
        if (active) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        console.error('Ошибка восстановления сессии:', error.message);
      }

      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

