-- Ensure RLS is enabled on pantry_items
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

-- Note: The primary policy was already added in 0002_update_schema_issue_1.sql:
-- CREATE POLICY "Users can manage their own pantry items"
--   ON public.pantry_items FOR ALL
--   USING (auth.uid() = user_id);

-- This migration acts as a safety measure to explicitly ensure RLS is enabled.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'pantry_items'
          AND policyname = 'Users can manage their own pantry items'
    ) THEN
        CREATE POLICY "Users can manage their own pantry items"
          ON public.pantry_items FOR ALL
          USING (auth.uid() = user_id);
    END IF;
END
$$;
