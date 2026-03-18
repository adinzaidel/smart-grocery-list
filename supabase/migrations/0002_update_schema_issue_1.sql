-- 1. Alter lists table
ALTER TABLE lists
  ADD COLUMN store_name TEXT,
  ADD COLUMN is_template BOOLEAN DEFAULT FALSE;

-- 2. Alter items table
ALTER TABLE items
  ADD COLUMN notes TEXT,
  ADD COLUMN image_url TEXT,
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Create pantry_items table
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  expiration_date DATE,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS)
-- Enable RLS on pantry_items
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see and edit their own pantry items"
  ON pantry_items
  FOR ALL
  USING (auth.uid() = user_id);

-- Enable RLS on items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can modify items on lists they are members of"
  ON items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM list_members
      WHERE list_members.list_id = items.list_id
      AND list_members.user_id = auth.uid()
    )
  );

-- Enable RLS on lists
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see lists they own or are members of"
  ON lists
  FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM list_members
      WHERE list_members.list_id = lists.id
      AND list_members.user_id = auth.uid()
    )
  );

-- 5. Supabase Storage Bucket
-- Create a storage bucket called item-images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policy: authenticated users can upload, anyone can read
CREATE POLICY "Anyone can read item-images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload to item-images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'item-images' AND auth.role() = 'authenticated');
