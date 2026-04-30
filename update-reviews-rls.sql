-- Allow public to insert reviews (anonymous)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (true);

-- Ensure public can read approved reviews (already exists, but reinforcing)
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" 
  ON reviews FOR SELECT 
  USING (is_approved = TRUE);

-- Allow admin (service role) to do everything (handled by Supabase by default)
