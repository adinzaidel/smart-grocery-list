import { createClient } from '@/lib/supabase/client';
import { Item } from '@/types/database';

export const itemsService = {
  async getItems(listId: string): Promise<Item[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async insertItem(item: Omit<Item, 'created_at' | 'updated_at'>): Promise<Item> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('items')
      .insert([{ ...item, id: item.id || crypto.randomUUID() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteItem(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};