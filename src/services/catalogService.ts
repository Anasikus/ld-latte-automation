
import { supabase } from '../lib/supabase';

export interface CatalogService {
  id: number;
  name: string;
  active: boolean;
}

export const catalogService = {
  async isAdmin(): Promise<boolean> {
    const { data, error } =
      await supabase.rpc('is_app_admin');

    if (error) throw error;

    return data === true;
  },

  async getAll(): Promise<CatalogService[]> {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, active')
      .order('id', { ascending: true });

    if (error) throw error;

    return data ?? [];
  },

  async create(name: string): Promise<CatalogService> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        name: name.trim(),
        active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: number,
    changes: Partial<Pick<CatalogService, 'name' | 'active'>>
  ): Promise<CatalogService> {
    const { data, error } = await supabase
      .from('services')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
