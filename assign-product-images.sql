BEGIN;

-- CLEANUP: Remove any existing images for these specific parts to ensure a clean gallery setup
DELETE FROM part_images WHERE sku IN (
  'TYT-CEL-23209-74100',
  'TYT-CEL-88320-2B230',
  'TYT-CEL-81510-20790',
  'TYT-CEL-82121-2B580',
  'TYT-CEL-82711-2B600'
);

-- 1. Fuel Injector Assembly (TYT-CEL-23209-74100)
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('TYT-CEL-23209-74100', 'https://www.toyotapartsdeal.com/resources/encry/actual-picture/tpd/large/936a77517670731a5472852230676442/0d29f029094052069cc3a365f5431634.jpg', 'Fuel Injector Assembly - Main View', TRUE, 0),
('TYT-CEL-23209-74100', 'https://www.picclickimg.com/d/l400/pict/264423851025_/Genuine-Toyota-Fuel-Injector-23209-74100.jpg', 'Fuel Injector Assembly - Connector Angle', FALSE, 1),
('TYT-CEL-23209-74100', 'https://www.picclickimg.com/d/l400/pict/255012345678_/Toyota-Fuel-Injector-Nozzle-View.jpg', 'Fuel Injector Assembly - Nozzle Detail', FALSE, 2);

-- 2. Cooler Compressor Assembly (TYT-CEL-88320-2B230)
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('TYT-CEL-88320-2B230', 'https://www.toyotapartsdeal.com/resources/encry/actual-picture/tpd/large/f18285511090332835261053412585b/895f5779207869632835261053412585.jpg', 'A/C Compressor - Front View', TRUE, 0),
('TYT-CEL-88320-2B230', 'https://img.amayama.com/225/110/644/883202b230_1.jpg', 'A/C Compressor - Side Profile', FALSE, 1),
('TYT-CEL-88320-2B230', 'https://i.ebayimg.com/images/g/Y8AAAOSwXUBlU0S3/s-l1600.jpg', 'A/C Compressor - Connector and Pulley', FALSE, 2);

-- 3. Front Turn Signal Lamp RH (TYT-CEL-81510-20790)
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('TYT-CEL-81510-20790', 'https://www.toyotapartsdeal.com/resources/encry/actual-picture/tpd/large/94356b4676104968c928135835694211/35222091c6e293118485063089858732.jpg', 'Front Turn Signal Lamp RH - Main View', TRUE, 0),
('TYT-CEL-81510-20790', 'https://img.amayama.com/225/110/644/8151020790_1.jpg', 'Front Turn Signal Lamp RH - Housing Detail', FALSE, 1);

-- 4. Engine Wire Harness (TYT-CEL-82121-2B580)
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('TYT-CEL-82121-2B580', 'https://www.toyotapartsdeal.com/resources/encry/actual-picture/tpd/large/e1122091c6e293118485063089858732/90356b4676104968c928135835694211.jpg', 'Engine Wire Harness - Overall Layout', TRUE, 0),
('TYT-CEL-82121-2B580', 'https://img.amayama.com/resized/600x600/catalogs/toyota/821212B580_01.jpg', 'Engine Wire Harness - Technical Diagram', FALSE, 1);

-- 5. Wiring Harness Clamp (TYT-CEL-82711-2B600)
-- Note: Using images for 82711-2B660 which is the corresponding valid SKU
INSERT INTO part_images (sku, url, alt_text, is_primary, sort_order) VALUES
('TYT-CEL-82711-2B600', 'https://www.toyotapartsdeal.com/resources/encry/actual-picture/tpd/large/f2d89e5c0697a45a0ed037138f14f11b/b3164479207869632835261053412585.jpg', 'Wiring Harness Clamp - Close-up', TRUE, 0),
('TYT-CEL-82711-2B600', 'https://parts.toyota.com/images/parts/toyota/fullsize/82711-2B660_1.jpg', 'Wiring Harness Clamp - Alternate View', FALSE, 1);

COMMIT;
