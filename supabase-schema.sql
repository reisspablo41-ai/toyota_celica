-- =============================================================================
-- ToyotaParts Direct – Supabase Database Schema
-- =============================================================================
-- Run this in the Supabase SQL Editor to create all tables.
-- Supabase automatically creates a "public" schema and enables Row Level
-- Security (RLS). Enable RLS policies after seeding data as required.
-- =============================================================================

-- -----------------------------------------------------------------------
-- 1. VEHICLES
--    Canonical list of Toyota year/model/engine combinations.
-- -----------------------------------------------------------------------
CREATE TABLE vehicles (
  id            TEXT        PRIMARY KEY,  -- e.g. 'cel-2003-18-1zz'
  year          SMALLINT    NOT NULL CHECK (year BETWEEN 1960 AND 2100),
  make          TEXT        NOT NULL DEFAULT 'Toyota',
  model         TEXT        NOT NULL,
  engine        TEXT        NOT NULL,
  engine_code   TEXT,                     -- e.g. '1ZZ-FE'
  trim          TEXT,
  body_style    TEXT,                     -- e.g. 'Coupe', 'Sedan', 'Ute'
  region        TEXT,                     -- e.g. 'Global', 'JDM', 'USDM'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_model ON vehicles (model);
CREATE INDEX idx_vehicles_year  ON vehicles (year);

-- -----------------------------------------------------------------------
-- 2. CATEGORIES
--    Top-level part categories (Engine, Brakes, Suspension, etc.)
-- -----------------------------------------------------------------------
CREATE TABLE categories (
  id          TEXT    PRIMARY KEY,        -- slug e.g. 'engine'
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,                       -- emoji or icon identifier
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- 3. PARTS
--    Core parts catalogue. One row per unique SKU.
-- -----------------------------------------------------------------------
CREATE TABLE parts (
  sku               TEXT        PRIMARY KEY,
  name              TEXT        NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10,2) CHECK (compare_at_price >= 0),
  brand             TEXT        NOT NULL CHECK (brand IN ('Genuine OEM', 'Aftermarket')),
  category_id       TEXT        NOT NULL REFERENCES categories (id),
  part_number       TEXT        NOT NULL,
  oem_cross_ref     TEXT,                 -- comma-separated OEM part numbers
  weight_kg         NUMERIC(6,3),
  material          TEXT,
  in_stock          BOOLEAN     NOT NULL DEFAULT TRUE,
  stock_count       INTEGER     NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  rating            NUMERIC(2,1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count      INTEGER     NOT NULL DEFAULT 0,
  tags              TEXT[],               -- array of search/filter tags
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parts_category  ON parts (category_id);
CREATE INDEX idx_parts_brand     ON parts (brand);
CREATE INDEX idx_parts_in_stock  ON parts (in_stock);
CREATE INDEX idx_parts_price     ON parts (price);
-- Full-text search index across name, description, and part_number
CREATE INDEX idx_parts_fts ON parts
  USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(part_number,'')));

-- -----------------------------------------------------------------------
-- 4. PART IMAGES
--    Multiple images per part, ordered by sort_order.
-- -----------------------------------------------------------------------
CREATE TABLE part_images (
  id          BIGSERIAL   PRIMARY KEY,
  sku         TEXT        NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  alt_text    TEXT,
  is_primary  BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_part_images_sku ON part_images (sku);

-- -----------------------------------------------------------------------
-- 5. PART FITMENT  (many-to-many: parts ↔ vehicles)
--    Records which vehicles a part is compatible with.
-- -----------------------------------------------------------------------
CREATE TABLE part_fitment (
  sku         TEXT    NOT NULL REFERENCES parts   (sku)        ON DELETE CASCADE,
  vehicle_id  TEXT    NOT NULL REFERENCES vehicles (id)        ON DELETE CASCADE,
  notes       TEXT,               -- e.g. 'Only for manual transmission variants'
  confirmed   BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (sku, vehicle_id)
);

CREATE INDEX idx_part_fitment_vehicle ON part_fitment (vehicle_id);
CREATE INDEX idx_part_fitment_sku     ON part_fitment (sku);

-- -----------------------------------------------------------------------
-- 6. RELATED PARTS  (self-referencing: "often replaced together")
-- -----------------------------------------------------------------------
CREATE TABLE related_parts (
  sku         TEXT    NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  related_sku TEXT    NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  relation    TEXT    NOT NULL DEFAULT 'often_together',  -- or 'accessory', 'upgrade'
  PRIMARY KEY (sku, related_sku)
);

-- -----------------------------------------------------------------------
-- 7. CUSTOMERS
--    Extends Supabase auth.users with profile data.
-- -----------------------------------------------------------------------
CREATE TABLE customers (
  id              UUID    PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT    NOT NULL UNIQUE,
  phone           TEXT,
  is_trade        BOOLEAN NOT NULL DEFAULT FALSE,
  trade_discount  NUMERIC(4,2) DEFAULT 0 CHECK (trade_discount BETWEEN 0 AND 100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- 8. GARAGE VEHICLES  (customer's saved vehicles)
-- -----------------------------------------------------------------------
CREATE TABLE garage_vehicles (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  vehicle_id  TEXT        NOT NULL REFERENCES vehicles  (id),
  nickname    TEXT,                   -- e.g. 'My Daily Driver'
  is_default  BOOLEAN     NOT NULL DEFAULT FALSE,
  vin         TEXT CHECK (length(vin) = 17 OR vin IS NULL),
  mileage_km  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_garage_customer ON garage_vehicles (customer_id);

-- -----------------------------------------------------------------------
-- 9. ADDRESSES
-- -----------------------------------------------------------------------
CREATE TABLE addresses (
  id            BIGSERIAL   PRIMARY KEY,
  customer_id   UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  type          TEXT        NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  company       TEXT,
  line1         TEXT        NOT NULL,
  line2         TEXT,
  city          TEXT        NOT NULL,
  state         TEXT,
  postal_code   TEXT        NOT NULL,
  country       TEXT        NOT NULL DEFAULT 'US',
  phone         TEXT,
  is_default    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_customer ON addresses (customer_id);

-- -----------------------------------------------------------------------
-- 10. CART ITEMS  (persisted server-side cart)
-- -----------------------------------------------------------------------
CREATE TABLE cart_items (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        REFERENCES customers (id) ON DELETE CASCADE,
  session_id  TEXT,                       -- for guest carts
  sku         TEXT        NOT NULL REFERENCES parts (sku),
  quantity    SMALLINT    NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL,     -- price at time of adding
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_owner CHECK (customer_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_cart_customer ON cart_items (customer_id);
CREATE INDEX idx_cart_session  ON cart_items (session_id);

-- -----------------------------------------------------------------------
-- 11. ORDERS
-- -----------------------------------------------------------------------
CREATE TABLE orders (
  id                  BIGSERIAL       PRIMARY KEY,
  order_number        TEXT            NOT NULL UNIQUE,  -- e.g. 'ORD-2026-00123'
  customer_id         UUID            REFERENCES customers (id),
  guest_email         TEXT,
  status              TEXT            NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','processing','shipped','delivered','cancelled','refunded')),
  subtotal            NUMERIC(10,2)   NOT NULL,
  shipping_cost       NUMERIC(10,2)   NOT NULL DEFAULT 0,
  tax                 NUMERIC(10,2)   NOT NULL DEFAULT 0,
  discount            NUMERIC(10,2)   NOT NULL DEFAULT 0,
  total               NUMERIC(10,2)   NOT NULL,
  currency            TEXT            NOT NULL DEFAULT 'USD',
  shipping_method     TEXT,
  tracking_number     TEXT,
  carrier             TEXT,
  shipping_address_id BIGINT          REFERENCES addresses (id),
  billing_address_id  BIGINT          REFERENCES addresses (id),
  notes               TEXT,
  placed_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer    ON orders (customer_id);
CREATE INDEX idx_orders_status      ON orders (status);
CREATE INDEX idx_orders_placed_at   ON orders (placed_at DESC);
CREATE INDEX idx_orders_number      ON orders (order_number);

-- -----------------------------------------------------------------------
-- 12. ORDER ITEMS
-- -----------------------------------------------------------------------
CREATE TABLE order_items (
  id            BIGSERIAL       PRIMARY KEY,
  order_id      BIGINT          NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  sku           TEXT            NOT NULL REFERENCES parts (sku),
  quantity      SMALLINT        NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10,2)   NOT NULL,
  total_price   NUMERIC(10,2)   NOT NULL,
  part_snapshot JSONB,                    -- snapshot of part name/number at purchase time
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_sku   ON order_items (sku);

-- -----------------------------------------------------------------------
-- 13. REVIEWS
-- -----------------------------------------------------------------------
CREATE TABLE reviews (
  id          BIGSERIAL   PRIMARY KEY,
  sku         TEXT        NOT NULL REFERENCES parts (sku) ON DELETE CASCADE,
  customer_id UUID        REFERENCES customers (id) ON DELETE SET NULL,
  order_id    BIGINT      REFERENCES orders (id) ON DELETE SET NULL,
  rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  author_name TEXT        NOT NULL,
  is_verified BOOLEAN     NOT NULL DEFAULT FALSE,   -- verified purchase
  is_approved BOOLEAN     NOT NULL DEFAULT FALSE,   -- moderation flag
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_sku        ON reviews (sku);
CREATE INDEX idx_reviews_customer   ON reviews (customer_id);
CREATE INDEX idx_reviews_approved   ON reviews (is_approved);

-- -----------------------------------------------------------------------
-- 14. TESTIMONIALS
--    Curated customer quotes displayed on the homepage and marketing pages.
--    Separate from product reviews — these are hand-picked / moderated entries.
-- -----------------------------------------------------------------------
CREATE TABLE testimonials (
  id              BIGSERIAL   PRIMARY KEY,
  author_name     TEXT        NOT NULL,
  author_location TEXT,                       -- e.g. 'Atlanta, GA'
  vehicle         TEXT        NOT NULL,       -- e.g. '2003 Toyota Celica GT'
  rating          SMALLINT    NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote           TEXT        NOT NULL,
  part_bought     TEXT,                       -- free-text summary of purchased item
  sku             TEXT        REFERENCES parts (sku) ON DELETE SET NULL,
  avatar_initials TEXT,                       -- e.g. 'MT'
  avatar_color    TEXT        DEFAULT '#EB0A1E',
  is_featured     BOOLEAN     NOT NULL DEFAULT FALSE,  -- show on homepage carousel
  is_approved     BOOLEAN     NOT NULL DEFAULT FALSE,  -- moderation gate
  display_order   SMALLINT    NOT NULL DEFAULT 0,
  published_at    DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured  ON testimonials (is_featured, is_approved, display_order);
CREATE INDEX idx_testimonials_sku       ON testimonials (sku);

-- RLS: public can read approved testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = TRUE);

-- Seed: matches lib/data.ts testimonials array
INSERT INTO testimonials (author_name, author_location, vehicle, rating, quote, part_bought, avatar_initials, avatar_color, is_featured, is_approved, display_order, published_at) VALUES
  ('Marcus T.',  'Atlanta, GA',    '2003 Toyota Celica GT',        5, 'I''ve been chasing the right water pump for my Celica for weeks. Every other site sent me the wrong part or couldn''t confirm fitment. ToyotaParts Direct had the exact OEM part number, confirmed it for my 1ZZ-FE, and it arrived next day.',                   'Water Pump Assembly – 1ZZ-FE',         'MT', '#EB0A1E', TRUE, TRUE, 1, '2026-03-01'),
  ('Priya S.',   'Melbourne, AU',  '2020 Toyota Camry 2.5L',       5, 'Ordered the front brake pad and rotor set for my XV70 Camry. The fitment checker confirmed compatibility in seconds. Parts arrived well packaged, genuine Toyota box, exactly as described. Fitted them myself in under an hour.',                                   'Front Brake Pad + Rotor Set',           'PS', '#2563eb', TRUE, TRUE, 2, '2026-02-01'),
  ('Ryan O.',    'Nairobi, KE',    '2022 Toyota Hilux Revo 2.8D',  5, 'Sourcing OEM struts for a Hilux Revo locally is a nightmare — everything is pattern-copy aftermarket. I ordered the genuine OEM front strut assembly here, shipped internationally. Arrived in 6 days, perfectly packaged.',                                       'Front Strut Assembly – Hilux Revo',     'RO', '#16a34a', TRUE, TRUE, 3, '2026-01-01'),
  ('Claire W.',  'Houston, TX',    '2019 Toyota Corolla 1.8L',     5, 'The head gasket set for my Corolla was exactly right. I was nervous ordering online because a mismatched gasket is a disaster, but the fitment database showed confirmed compatibility. The support team replied in under 2 hours.',                               'Head Gasket Set – 1ZZ-FE',              'CW', '#7c3aed', TRUE, TRUE, 4, '2026-03-10'),
  ('James P.',   'Toronto, CA',    '2020 Toyota Camry V6',         5, 'The aftermarket alternator saved me $140 versus the dealer price. It came with a 2-year warranty and fits perfectly. Sceptical about aftermarket, but the listing was honest and after 3 months it''s running flawlessly.',                                          'Alternator – 2AR-FE (Aftermarket)',     'JP', '#b45309', TRUE, TRUE, 5, '2025-12-01'),
  ('Aiko N.',    'Osaka, JP',      '2003 Toyota Celica GT-S',      5, 'Found the 2ZZ-GE timing chain kit that I could not find anywhere in Japan at a reasonable price. Shipped to Japan and arrived in 5 business days. Genuine OEM — I can tell immediately from the Toyota packaging.',                                                 'Timing Chain Kit – 2ZZ-GE',             'AN', '#0891b2', TRUE, TRUE, 6, '2026-02-15');

-- -----------------------------------------------------------------------
-- 15. WISHLISTS
-- -----------------------------------------------------------------------
CREATE TABLE wishlists (
  id          BIGSERIAL   PRIMARY KEY,
  customer_id UUID        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  sku         TEXT        NOT NULL REFERENCES parts (sku),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, sku)
);

CREATE INDEX idx_wishlists_customer ON wishlists (customer_id);

-- -----------------------------------------------------------------------
-- 15. NEWSLETTER SUBSCRIBERS
-- -----------------------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id          BIGSERIAL   PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  customer_id UUID        REFERENCES customers (id) ON DELETE SET NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  source      TEXT        DEFAULT 'footer_form',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------
-- TRIGGERS – auto-update "updated_at" columns
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER parts_updated_at    BEFORE UPDATE ON parts     FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER orders_updated_at   BEFORE UPDATE ON orders    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -----------------------------------------------------------------------
-- FUNCTION – recalculate part rating after review insert/update/delete
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION refresh_part_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE parts
  SET
    rating       = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE),
    review_count = (SELECT COUNT(*)                 FROM reviews WHERE sku = COALESCE(NEW.sku, OLD.sku) AND is_approved = TRUE)
  WHERE sku = COALESCE(NEW.sku, OLD.sku);
  RETURN NULL;
END;
$$;

CREATE TRIGGER reviews_after_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_part_rating();

-- -----------------------------------------------------------------------
-- ROW LEVEL SECURITY – enable and add basic policies
-- -----------------------------------------------------------------------
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage_vehicles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists         ENABLE ROW LEVEL SECURITY;

-- Customers can only access their own data
CREATE POLICY "customers_self"
  ON customers FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "garage_self"
  ON garage_vehicles FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "addresses_self"
  ON addresses FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "cart_self"
  ON cart_items FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "orders_self"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "order_items_self"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "wishlists_self"
  ON wishlists FOR ALL
  USING (auth.uid() = customer_id);

-- Public read access for catalogue tables (no auth required)
CREATE POLICY "public_read_parts"       ON parts       FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_categories"  ON categories  FOR SELECT USING (TRUE);
CREATE POLICY "public_read_vehicles"    ON vehicles    FOR SELECT USING (TRUE);
CREATE POLICY "public_read_images"      ON part_images FOR SELECT USING (TRUE);
CREATE POLICY "public_read_fitment"     ON part_fitment FOR SELECT USING (TRUE);
CREATE POLICY "public_read_related"     ON related_parts FOR SELECT USING (TRUE);
CREATE POLICY "public_read_reviews"     ON reviews     FOR SELECT USING (is_approved = TRUE);

-- -----------------------------------------------------------------------
-- SAMPLE SEED DATA (matches lib/data.ts mock data)
-- -----------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
  ('engine',       'Engine',         'engine',       'Gaskets, timing belts, water pumps, oil filters, and all internal engine components.',     '⚙️', 1),
  ('transmission', 'Transmission',   'transmission', 'Gearboxes, clutch kits, CVT belts, and drivetrain components.',                            '🔧', 2),
  ('suspension',   'Suspension',     'suspension',   'Shock absorbers, struts, control arms, tie rods, and bushings.',                           '🛞', 3),
  ('brakes',       'Brakes',         'brakes',       'Brake pads, rotors, calipers, brake lines, and master cylinders.',                         '🔴', 4),
  ('electrical',   'Electrical',     'electrical',   'Alternators, starters, sensors, ECU modules, and wiring harnesses.',                       '⚡', 5),
  ('body',         'Body & Exterior','body',         'Bumpers, panels, mirrors, grilles, and all exterior components.',                          '🚗', 6),
  ('cooling',      'Cooling',        'cooling',      'Radiators, thermostats, coolant hoses, and fans.',                                         '❄️', 7),
  ('fuel',         'Fuel System',    'fuel',         'Fuel pumps, injectors, filters, and fuel rails.',                                          '⛽', 8);

INSERT INTO vehicles (id, year, make, model, engine, engine_code) VALUES
  ('cel-2003-18-1zz',  2003, 'Toyota', 'Celica',       '1.8L 4-Cylinder (1ZZ-FE)',    '1ZZ-FE'),
  ('cel-2003-18-2zz',  2003, 'Toyota', 'Celica',       '1.8L 4-Cylinder (2ZZ-GE)',    '2ZZ-GE'),
  ('cam-2020-25',      2020, 'Toyota', 'Camry',        '2.5L 4-Cylinder (2AR-FE)',    '2AR-FE'),
  ('cam-2020-35v6',    2020, 'Toyota', 'Camry',        '3.5L V6 (2GR-FE)',            '2GR-FE'),
  ('hil-2022-28d',     2022, 'Toyota', 'Hilux',        '2.8L Diesel (1GD-FTV)',       '1GD-FTV'),
  ('cor-2019-18',      2019, 'Toyota', 'Corolla',      '1.8L 4-Cylinder (2ZR-FE)',    '2ZR-FE'),
  ('lc-2021-45d',      2021, 'Toyota', 'Land Cruiser', '4.5L V8 Diesel (1VD-FTV)',   '1VD-FTV'),
  ('rav-2022-25h',     2022, 'Toyota', 'RAV4',         '2.5L Hybrid',                 NULL);

INSERT INTO parts (sku, name, description, price, compare_at_price, brand, category_id, part_number, oem_cross_ref, weight_kg, material, in_stock, stock_count) VALUES
  ('TYT-WP-1ZZFE-OEM',     'Water Pump Assembly – 1ZZ-FE Engine',          'Genuine Toyota OEM water pump for the 1ZZ-FE engine.',      89.95,  119.00, 'Genuine OEM', 'engine',     '16100-29085', '16100-29085, 16100-29086', 1.2, 'Cast aluminium impeller, steel housing', TRUE,  23),
  ('TYT-GK-1ZZFE-OEM',     'Head Gasket Set – 1ZZ-FE Engine',              'Complete multi-layer steel head gasket set.',               64.50,  NULL,   'Genuine OEM', 'engine',     '04111-22090', '04111-22090',              0.4, 'Multi-layer steel (MLS)',                TRUE,  15),
  ('TYT-BELT-1ZZFE-OEM',   'Timing Chain Kit – 1ZZ-FE / 2ZZ-GE',          'OEM-spec timing chain kit for 1ZZ-FE and 2ZZ-GE engines.',  142.00, 185.00, 'Genuine OEM', 'engine',     '13506-22020', NULL,                       0.9, 'Hardened steel chain',                  TRUE,   8),
  ('TYT-BP-CAM-FRONT-OEM', 'Front Brake Pad Set – Camry 2018–2024',        'Genuine Toyota front brake pads for the Camry XV70.',       54.90,  NULL,   'Genuine OEM', 'brakes',     '04465-06190', '04465-06190, 04465-AZ101', 0.7, 'Semi-metallic compound',                TRUE,  42),
  ('TYT-ROTOR-CAM-FRONT',  'Front Brake Rotor – Camry 2018–2024',          'OEM-spec vented front brake rotor.',                       78.00,  95.00,  'Genuine OEM', 'brakes',     '43512-06220', NULL,                       5.1, 'Grey cast iron',                        TRUE,  19),
  ('TYT-STRUT-HIL-FRONT',  'Front Strut Assembly – Hilux Revo 2015+',      'Complete front strut assembly for the Hilux Revo.',        219.00, NULL,   'Genuine OEM', 'suspension', '48520-09891', NULL,                       8.4, 'High-tensile steel',                    FALSE,  0),
  ('TYT-ALT-2AR-AFT',      'Alternator – 2AR-FE Camry (Aftermarket)',      '130A alternator for Toyota Camry 2.5L models.',            169.00, 310.00, 'Aftermarket', 'electrical', '27060-0V150-84','27060-0V150',            3.8, 'Copper windings, aluminium housing',    TRUE,   6),
  ('TYT-THERM-OEM',        'Engine Thermostat – 1ZZ / 2ZZ / 1NZ',         'Genuine Toyota thermostat and housing assembly.',           28.50,  NULL,   'Genuine OEM', 'cooling',    '90916-03129', NULL,                       0.2, 'Wax-element thermostat, brass housing', TRUE,  54);

INSERT INTO part_fitment (sku, vehicle_id) VALUES
  ('TYT-WP-1ZZFE-OEM',     'cel-2003-18-1zz'),
  ('TYT-GK-1ZZFE-OEM',     'cel-2003-18-1zz'),
  ('TYT-GK-1ZZFE-OEM',     'cor-2019-18'),
  ('TYT-BELT-1ZZFE-OEM',   'cel-2003-18-1zz'),
  ('TYT-BELT-1ZZFE-OEM',   'cel-2003-18-2zz'),
  ('TYT-BP-CAM-FRONT-OEM', 'cam-2020-25'),
  ('TYT-BP-CAM-FRONT-OEM', 'cam-2020-35v6'),
  ('TYT-ROTOR-CAM-FRONT',  'cam-2020-25'),
  ('TYT-ROTOR-CAM-FRONT',  'cam-2020-35v6'),
  ('TYT-STRUT-HIL-FRONT',  'hil-2022-28d'),
  ('TYT-ALT-2AR-AFT',      'cam-2020-25'),
  ('TYT-THERM-OEM',        'cel-2003-18-1zz'),
  ('TYT-THERM-OEM',        'cel-2003-18-2zz'),
  ('TYT-THERM-OEM',        'cor-2019-18');

INSERT INTO related_parts (sku, related_sku, relation) VALUES
  ('TYT-WP-1ZZFE-OEM',   'TYT-GK-1ZZFE-OEM',   'often_together'),
  ('TYT-WP-1ZZFE-OEM',   'TYT-BELT-1ZZFE-OEM', 'often_together'),
  ('TYT-WP-1ZZFE-OEM',   'TYT-THERM-OEM',       'often_together'),
  ('TYT-GK-1ZZFE-OEM',   'TYT-WP-1ZZFE-OEM',   'often_together'),
  ('TYT-GK-1ZZFE-OEM',   'TYT-BELT-1ZZFE-OEM', 'often_together'),
  ('TYT-BP-CAM-FRONT-OEM','TYT-ROTOR-CAM-FRONT','often_together');
