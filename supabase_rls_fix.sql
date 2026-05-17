-- Allow anon key to write paintings (pool grows from browser)
CREATE POLICY "public insert" ON paintings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public update" ON paintings
  FOR UPDATE USING (true);
