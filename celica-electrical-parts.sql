-- =============================================================================
-- Toyota Celica (2000–2005) Electrical Parts – Import Script
-- Run this in the Supabase SQL Editor after the main schema has been applied.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1 – Vehicles
--   The schema already contains 2003 Celica rows (cel-2003-18-1zz / 2zz).
--   Insert the remaining years (2000-2002, 2004-2005) for both engine variants.
-- -----------------------------------------------------------------------------
INSERT INTO vehicles (id, year, make, model, engine, engine_code) VALUES
  ('cel-2000-18-1zz', 2000, 'Toyota', 'Celica', '1.8L 4-Cylinder (1ZZ-FE)', '1ZZ-FE'),
  ('cel-2000-18-2zz', 2000, 'Toyota', 'Celica', '1.8L 4-Cylinder (2ZZ-GE)', '2ZZ-GE'),
  ('cel-2001-18-1zz', 2001, 'Toyota', 'Celica', '1.8L 4-Cylinder (1ZZ-FE)', '1ZZ-FE'),
  ('cel-2001-18-2zz', 2001, 'Toyota', 'Celica', '1.8L 4-Cylinder (2ZZ-GE)', '2ZZ-GE'),
  ('cel-2002-18-1zz', 2002, 'Toyota', 'Celica', '1.8L 4-Cylinder (1ZZ-FE)', '1ZZ-FE'),
  ('cel-2002-18-2zz', 2002, 'Toyota', 'Celica', '1.8L 4-Cylinder (2ZZ-GE)', '2ZZ-GE'),
  -- 2003 rows already exist in the main schema seed; skip with ON CONFLICT
  ('cel-2004-18-1zz', 2004, 'Toyota', 'Celica', '1.8L 4-Cylinder (1ZZ-FE)', '1ZZ-FE'),
  ('cel-2004-18-2zz', 2004, 'Toyota', 'Celica', '1.8L 4-Cylinder (2ZZ-GE)', '2ZZ-GE'),
  ('cel-2005-18-1zz', 2005, 'Toyota', 'Celica', '1.8L 4-Cylinder (1ZZ-FE)', '1ZZ-FE'),
  ('cel-2005-18-2zz', 2005, 'Toyota', 'Celica', '1.8L 4-Cylinder (2ZZ-GE)', '2ZZ-GE')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- STEP 2 – Parts
-- -----------------------------------------------------------------------------
INSERT INTO parts (sku, name, description, price, brand, category_id, part_number, in_stock, stock_count, is_active) VALUES

  -- Air Bag group
  ('TYT-CEL-45130-20550-B0',
   'Air Bag Assembly Steering Wheel – Celica 2000–2005',
   'Genuine Toyota OEM driver-side air bag module for the steering wheel. Fits all 2000–2005 Toyota Celica models. Replace after deployment or when SRS warning light is triggered.',
   685.42, 'Genuine OEM', 'electrical', '45130-20550-B0', TRUE, 4, TRUE),

  ('TYT-CEL-73970-20081-B1',
   'Air Bag Assembly Instrument Panel – Celica 2000–2005',
   'Genuine Toyota OEM passenger-side air bag assembly mounted in the instrument panel. For all 2000–2005 Toyota Celica variants. Must be replaced after any deployment event.',
   758.10, 'Genuine OEM', 'electrical', '73970-20081-B1', TRUE, 3, TRUE),

  ('TYT-CEL-89173-29165',
   'Sensor Air Bag Front – Celica 2000–2005',
   'Genuine Toyota OEM front impact sensor for the SRS air bag system. Detects collision forces and triggers the air bag control unit. Fits 2000–2005 Toyota Celica.',
   185.20, 'Genuine OEM', 'electrical', '89173-29165', TRUE, 8, TRUE),

  -- Antenna group
  ('TYT-CEL-86300-20370',
   'Antenna Assembly Manual – Celica 2000–2005',
   'Genuine Toyota OEM manual antenna assembly for AM/FM radio reception. Direct bolt-on replacement for all 2000–2005 Toyota Celica models.',
   52.15, 'Genuine OEM', 'electrical', '86300-20370', TRUE, 12, TRUE),

  ('TYT-CEL-86392-20190',
   'Ornament Antenna – Celica 2000–2005',
   'Genuine Toyota OEM antenna ornament/base trim piece. Covers the antenna mounting point on the body for a factory-finished appearance. Fits 2000–2005 Toyota Celica.',
   12.45, 'Genuine OEM', 'electrical', '86392-20190', TRUE, 20, TRUE),

  ('TYT-CEL-86396-20030',
   'Nut Antenna – Celica 2000–2005',
   'Genuine Toyota OEM antenna mounting nut. Secures the antenna assembly to the vehicle body. Fits 2000–2005 Toyota Celica.',
   4.50, 'Genuine OEM', 'electrical', '86396-20030', TRUE, 35, TRUE),

  -- Center Stop Lamp group
  ('TYT-CEL-81570-20160',
   'Center Stop Lamp Assembly – Celica 2000–2005',
   'Genuine Toyota OEM centre high-mounted stop lamp (CHMSL) assembly. Complete unit including lens and housing. Fits all 2000–2005 Toyota Celica models.',
   142.30, 'Genuine OEM', 'electrical', '81570-20160', TRUE, 7, TRUE),

  ('TYT-CEL-81571-20160',
   'Lens & Body Center Stop Lamp – Celica 2000–2005',
   'Genuine Toyota OEM lens and body sub-assembly for the centre stop lamp. Use when the housing is cracked or lens is damaged. Fits 2000–2005 Toyota Celica.',
   95.10, 'Genuine OEM', 'electrical', '81571-20160', TRUE, 9, TRUE),

  ('TYT-CEL-90981-11048',
   'Bulb Center Stop Lamp – Celica 2000–2005',
   'Genuine Toyota OEM replacement bulb for the centre high-mounted stop lamp. Fits 2000–2005 Toyota Celica CHMSL assembly (part# 81570-20160).',
   3.50, 'Genuine OEM', 'electrical', '90981-11048', TRUE, 50, TRUE)

ON CONFLICT (sku) DO NOTHING;

-- -----------------------------------------------------------------------------
-- STEP 3 – Part Images
-- -----------------------------------------------------------------------------
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
  ('TYT-CEL-45130-20550-B0', 'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Air Bag/45130-20550-B0.jpg', 'Air Bag Assembly Steering Wheel',      TRUE,  0),
  ('TYT-CEL-73970-20081-B1', 'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Air Bag/73970-20081-B1.jpg', 'Air Bag Assembly Instrument Panel',    TRUE,  0),
  ('TYT-CEL-89173-29165',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Air Bag/89173-29165.jpg',    'Sensor Air Bag Front',                 TRUE,  0),
  ('TYT-CEL-86300-20370',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Antenna/86300-20370.jpg',    'Antenna Assembly Manual',              TRUE,  0),
  ('TYT-CEL-86392-20190',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Antenna/86392-20190.jpg',    'Ornament Antenna',                     TRUE,  0),
  ('TYT-CEL-86396-20030',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Antenna/86396-20030.jpg',    'Nut Antenna',                          TRUE,  0),
  ('TYT-CEL-81570-20160',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Center Stop Lamp/81570-20160.jpg', 'Center Stop Lamp Assembly',     TRUE,  0),
  ('TYT-CEL-81571-20160',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Center Stop Lamp/81571-20160.jpg', 'Lens & Body Center Stop Lamp',  TRUE,  0),
  ('TYT-CEL-90981-11048',    'https://images.urparts.com/index.cfm/page/catalogue/Toyota/2003/Celica/Electrical/Center Stop Lamp/90981-11048.jpg', 'Bulb Center Stop Lamp',         TRUE,  0);

-- -----------------------------------------------------------------------------
-- STEP 4 – Part Fitment
--   All 9 parts fit every 2000–2005 Celica (both engine variants = 12 vehicles).
-- -----------------------------------------------------------------------------
INSERT INTO part_fitment (sku, vehicle_id) VALUES
  -- Air Bag Assembly Steering Wheel
  ('TYT-CEL-45130-20550-B0', 'cel-2000-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2000-18-2zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2001-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2001-18-2zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2002-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2002-18-2zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2003-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2003-18-2zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2004-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2004-18-2zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2005-18-1zz'),
  ('TYT-CEL-45130-20550-B0', 'cel-2005-18-2zz'),

  -- Air Bag Assembly Instrument Panel
  ('TYT-CEL-73970-20081-B1', 'cel-2000-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2000-18-2zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2001-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2001-18-2zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2002-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2002-18-2zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2003-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2003-18-2zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2004-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2004-18-2zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2005-18-1zz'),
  ('TYT-CEL-73970-20081-B1', 'cel-2005-18-2zz'),

  -- Sensor Air Bag Front
  ('TYT-CEL-89173-29165', 'cel-2000-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2000-18-2zz'),
  ('TYT-CEL-89173-29165', 'cel-2001-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2001-18-2zz'),
  ('TYT-CEL-89173-29165', 'cel-2002-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2002-18-2zz'),
  ('TYT-CEL-89173-29165', 'cel-2003-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2003-18-2zz'),
  ('TYT-CEL-89173-29165', 'cel-2004-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2004-18-2zz'),
  ('TYT-CEL-89173-29165', 'cel-2005-18-1zz'),
  ('TYT-CEL-89173-29165', 'cel-2005-18-2zz'),

  -- Antenna Assembly Manual
  ('TYT-CEL-86300-20370', 'cel-2000-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2000-18-2zz'),
  ('TYT-CEL-86300-20370', 'cel-2001-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2001-18-2zz'),
  ('TYT-CEL-86300-20370', 'cel-2002-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2002-18-2zz'),
  ('TYT-CEL-86300-20370', 'cel-2003-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2003-18-2zz'),
  ('TYT-CEL-86300-20370', 'cel-2004-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2004-18-2zz'),
  ('TYT-CEL-86300-20370', 'cel-2005-18-1zz'),
  ('TYT-CEL-86300-20370', 'cel-2005-18-2zz'),

  -- Ornament Antenna
  ('TYT-CEL-86392-20190', 'cel-2000-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2000-18-2zz'),
  ('TYT-CEL-86392-20190', 'cel-2001-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2001-18-2zz'),
  ('TYT-CEL-86392-20190', 'cel-2002-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2002-18-2zz'),
  ('TYT-CEL-86392-20190', 'cel-2003-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2003-18-2zz'),
  ('TYT-CEL-86392-20190', 'cel-2004-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2004-18-2zz'),
  ('TYT-CEL-86392-20190', 'cel-2005-18-1zz'),
  ('TYT-CEL-86392-20190', 'cel-2005-18-2zz'),

  -- Nut Antenna
  ('TYT-CEL-86396-20030', 'cel-2000-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2000-18-2zz'),
  ('TYT-CEL-86396-20030', 'cel-2001-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2001-18-2zz'),
  ('TYT-CEL-86396-20030', 'cel-2002-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2002-18-2zz'),
  ('TYT-CEL-86396-20030', 'cel-2003-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2003-18-2zz'),
  ('TYT-CEL-86396-20030', 'cel-2004-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2004-18-2zz'),
  ('TYT-CEL-86396-20030', 'cel-2005-18-1zz'),
  ('TYT-CEL-86396-20030', 'cel-2005-18-2zz'),

  -- Center Stop Lamp Assembly
  ('TYT-CEL-81570-20160', 'cel-2000-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2000-18-2zz'),
  ('TYT-CEL-81570-20160', 'cel-2001-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2001-18-2zz'),
  ('TYT-CEL-81570-20160', 'cel-2002-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2002-18-2zz'),
  ('TYT-CEL-81570-20160', 'cel-2003-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2003-18-2zz'),
  ('TYT-CEL-81570-20160', 'cel-2004-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2004-18-2zz'),
  ('TYT-CEL-81570-20160', 'cel-2005-18-1zz'),
  ('TYT-CEL-81570-20160', 'cel-2005-18-2zz'),

  -- Lens & Body Center Stop Lamp
  ('TYT-CEL-81571-20160', 'cel-2000-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2000-18-2zz'),
  ('TYT-CEL-81571-20160', 'cel-2001-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2001-18-2zz'),
  ('TYT-CEL-81571-20160', 'cel-2002-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2002-18-2zz'),
  ('TYT-CEL-81571-20160', 'cel-2003-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2003-18-2zz'),
  ('TYT-CEL-81571-20160', 'cel-2004-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2004-18-2zz'),
  ('TYT-CEL-81571-20160', 'cel-2005-18-1zz'),
  ('TYT-CEL-81571-20160', 'cel-2005-18-2zz'),

  -- Bulb Center Stop Lamp
  ('TYT-CEL-90981-11048', 'cel-2000-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2000-18-2zz'),
  ('TYT-CEL-90981-11048', 'cel-2001-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2001-18-2zz'),
  ('TYT-CEL-90981-11048', 'cel-2002-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2002-18-2zz'),
  ('TYT-CEL-90981-11048', 'cel-2003-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2003-18-2zz'),
  ('TYT-CEL-90981-11048', 'cel-2004-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2004-18-2zz'),
  ('TYT-CEL-90981-11048', 'cel-2005-18-1zz'),
  ('TYT-CEL-90981-11048', 'cel-2005-18-2zz')

ON CONFLICT (sku, vehicle_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- OPTIONAL – Related parts within the same groups
-- -----------------------------------------------------------------------------
INSERT INTO related_parts (sku, related_sku, relation) VALUES
  -- Air bag group cross-links
  ('TYT-CEL-45130-20550-B0', 'TYT-CEL-73970-20081-B1', 'often_together'),
  ('TYT-CEL-45130-20550-B0', 'TYT-CEL-89173-29165',    'often_together'),
  ('TYT-CEL-73970-20081-B1', 'TYT-CEL-45130-20550-B0', 'often_together'),
  ('TYT-CEL-73970-20081-B1', 'TYT-CEL-89173-29165',    'often_together'),
  ('TYT-CEL-89173-29165',    'TYT-CEL-45130-20550-B0', 'often_together'),
  ('TYT-CEL-89173-29165',    'TYT-CEL-73970-20081-B1', 'often_together'),
  -- Antenna group cross-links
  ('TYT-CEL-86300-20370', 'TYT-CEL-86392-20190', 'often_together'),
  ('TYT-CEL-86300-20370', 'TYT-CEL-86396-20030', 'often_together'),
  ('TYT-CEL-86392-20190', 'TYT-CEL-86300-20370', 'often_together'),
  ('TYT-CEL-86396-20030', 'TYT-CEL-86300-20370', 'often_together'),
  -- Stop lamp group cross-links
  ('TYT-CEL-81570-20160', 'TYT-CEL-81571-20160', 'often_together'),
  ('TYT-CEL-81570-20160', 'TYT-CEL-90981-11048', 'often_together'),
  ('TYT-CEL-81571-20160', 'TYT-CEL-81570-20160', 'often_together'),
  ('TYT-CEL-90981-11048', 'TYT-CEL-81570-20160', 'often_together')
ON CONFLICT (sku, related_sku) DO NOTHING;
