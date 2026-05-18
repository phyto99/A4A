-- A4A Paintings Table Setup
-- Run this entire file in Supabase → SQL Editor → Run

CREATE TABLE IF NOT EXISTS paintings (
  id                  uuid primary key default gen_random_uuid(),
  source_key          text not null,
  source              text,
  source_id           text,
  title               text,
  artist              text,
  artist_nationality  text,
  artist_begin_date   text,
  artist_end_date     text,
  date_display        text,
  medium              text,
  dimensions          text,
  culture             text,
  period              text,
  movement            text,
  genre               text,
  place_of_origin     text,
  credit_line         text,
  accession_year      text,
  provenance_text     text,
  exhibition_history  text,
  publication_history text,
  fun_fact            text,
  wall_description    text,
  inscriptions        text,
  century             text,
  icon_class          text,
  object_name         text,
  object_url          text,
  gallery_title       text,
  gallery_number      text,
  tags                text[],
  subject_titles      text[],
  style_titles        text[],
  materials           text[],
  techniques          text[],
  production_places   text[],
  constituents        text[],
  colors              jsonb,
  harvard_colors      jsonb,
  aic_dominant_color  text,
  colorfulness        float4,
  is_highlight        bool default false,
  is_public_domain    bool default false,
  is_on_view          bool default false,
  wikidata_id         text,
  wikidata_verified   bool default false,
  confidence          text,
  richness_score      int4,
  total_page_views    int4,
  harvard_rank        int4,
  exhibition_count    int4,
  publication_count   int4,
  fiscal_year_acq     text,
  image_url           text,
  stored_image_url    text,
  enriched_at         timestamptz,
  created_at          timestamptz default now()
);

-- Unique constraint (upsert key)
ALTER TABLE paintings
  ADD CONSTRAINT paintings_source_key_unique UNIQUE (source_key);

-- Indexes
CREATE INDEX idx_paintings_source      ON paintings(source);
CREATE INDEX idx_paintings_richness    ON paintings(richness_score DESC NULLS LAST);
CREATE INDEX idx_paintings_public      ON paintings(is_public_domain) WHERE is_public_domain = true;
CREATE INDEX idx_paintings_enriched    ON paintings(enriched_at DESC NULLS LAST);
CREATE INDEX idx_paintings_wikidata    ON paintings(wikidata_verified) WHERE wikidata_verified = true;
CREATE INDEX idx_paintings_created     ON paintings(created_at DESC);

-- Row Level Security
ALTER TABLE paintings ENABLE ROW LEVEL SECURITY;

-- Anyone (anon key) can read
CREATE POLICY "public read" ON paintings
  FOR SELECT USING (true);

-- Only service_role can write (no INSERT/UPDATE/DELETE policy for anon)
