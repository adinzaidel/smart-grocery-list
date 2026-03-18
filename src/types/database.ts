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

export type List = {
  id: string;
  owner_id: string;
  name: string;
  store_name?: string | null;
  is_template: boolean;
  created_at?: string;
};

export type PantryItem = {
  id: string;
  user_id: string;
  name: string;
  category?: string | null;
  quantity: number;
  expiration_date?: string | null;
  added_at?: string;
};