export type Item = {
  id: string;
  list_id: string;
  name: string;
  is_checked: boolean;
  notes?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
};