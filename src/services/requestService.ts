
import { supabase } from '../lib/supabase';

import type {
  AutomationRequest,
  RequestFormData,
} from '../types/request';

export const requestService = {
  async getAll(): Promise<AutomationRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []) as AutomationRequest[];
  },

  async create(
    userId: string,
    form: RequestFormData
  ): Promise<AutomationRequest> {
    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: userId,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
      })
      .select()
      .single();

    if (error) throw error;

    return data as AutomationRequest;
  },

  async remove(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Заявка не найдена или нет прав на удаление');
  },

  async update(
    id: string,
    form: RequestFormData
  ): Promise<AutomationRequest> {
    const { data, error } = await supabase
      .from('requests')
      .update({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as AutomationRequest;
  },
};
