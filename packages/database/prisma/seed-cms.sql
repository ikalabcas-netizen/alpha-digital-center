-- CMS content seed (one-shot, idempotent via ON CONFLICT / NOT EXISTS)
-- Run: docker exec -i <db-container> psql -U adc_admin -d adc_marketing < seed-cms.sql

BEGIN;

-- ========== Page Hero (7 rows, upsert by page_slug) ==========
INSERT INTO cms_page_hero (id, page_slug, eyebrow, title_lead, title_accent, title_tail, subtitle, image_url, updated_at)
VALUES
  (gen_random_uuid(), 'home', 'Digital dental laboratory · Est. 2020', 'Nơi tinh hoa', 'nha khoa', 'kỹ thuật số được kiến tạo.',
   'Alpha Digital Center — đối tác gia công bán thành phẩm cao cấp cho labo và phòng khám. Công nghệ CAD/CAM chính xác, vật liệu Đức/Mỹ, bảo hành đến 19 năm.',
   'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1400&q=80', NOW()),
  (gen_random_uuid(), 'about', 'About us · Về chúng tôi', 'Hơn một', 'xưởng gia công —', 'một đối tác kỹ thuật.',
   'Alpha Digital Center thành lập năm 2020 tại TP.HCM. Chúng tôi đồng hành cùng labo và phòng khám nha khoa bằng dịch vụ gia công số chất lượng, minh bạch, bảo hành dài hạn.',
   'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=80', NOW()),
  (gen_random_uuid(), 'products', 'Products · Sản phẩm', 'Danh mục', 'sản phẩm gia công —', 'đầy đủ & chính hãng.',
   'Từ sứ Zirconia cao cấp đến custom abutment titanium — toàn bộ vật liệu có Certificate of Authenticity từ nhà sản xuất.',
   'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1000&q=80', NOW()),
  (gen_random_uuid(), 'news', 'Insights · Tin tức', 'Góc nhìn', 'chuyên gia —', 'cập nhật từ phòng lab.',
   'Chia sẻ kinh nghiệm, công nghệ mới, vật liệu và case study từ đội ngũ kỹ thuật Alpha Digital Center.',
   NULL, NOW()),
  (gen_random_uuid(), 'warranty', 'Warranty · Bảo hành', 'Cam kết', 'bảo hành —', 'đến 19 năm.',
   'Nhập mã bảo hành in trên phiếu giao hàng để tra cứu thông tin sản phẩm, thời hạn và chính sách.',
   NULL, NOW()),
  (gen_random_uuid(), 'careers', 'Careers · Tuyển dụng', 'Cùng xây dựng', 'tương lai', 'nha khoa số.',
   'Alpha Digital Center đang mở rộng đội ngũ. Cơ hội nghề nghiệp cho kỹ thuật viên, chuyên viên CAD/CAM, QC, sales và marketing.',
   'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1400&q=80', NOW()),
  (gen_random_uuid(), 'contact', 'Contact · Liên hệ', 'Hãy', 'trò chuyện', 'với chúng tôi.',
   'Dù là báo giá, tư vấn kỹ thuật hay đối tác hợp tác — đội ngũ Alpha Digital Center phản hồi trong vòng 24 giờ.',
   NULL, NOW())
ON CONFLICT (page_slug) DO NOTHING;

-- ========== Story Block (about) ==========
INSERT INTO cms_story_blocks (id, page_slug, image_url_1, image_url_2, paragraph1, paragraph2, founded_year)
VALUES (gen_random_uuid(), 'about',
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1400&q=80',
  'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1200&q=80',
  'Alpha Digital Center được thành lập năm 2020 tại TP.HCM bởi nhóm kỹ thuật viên trẻ đam mê nha khoa số. Ban đầu chỉ là một xưởng gia công nhỏ phục vụ 20 phòng khám nội thành, chúng tôi dần tạo dựng uy tín bằng chất lượng ổn định và dịch vụ tận tâm.',
  'Sau hơn 12 năm, Alpha Digital Center đã trở thành đối tác gia công tin cậy của hơn 500 labo, phòng khám trên cả nước. Đội ngũ 45 kỹ thuật viên, 3 xưởng sản xuất chuẩn ISO 13485, hàng chục máy CNC 5 trục và scanner 3D — tất cả phục vụ sứ mệnh: giúp nha sĩ và labo tập trung vào điều trị, để Alpha lo phần kỹ thuật.',
  '2020')
ON CONFLICT (page_slug) DO NOTHING;

-- ========== Tech Cards (skip if table has rows) ==========
INSERT INTO cms_tech_cards (id, tag, meta, title, description, image_url, display_order, is_active)
SELECT gen_random_uuid(), tag, meta, title, description, image_url, display_order, true
FROM (VALUES
  ('01', '±10μm', 'Máy phay CNC 5 trục',
    'Hệ thống milling Roland DWX và IMES-ICORE chuyên dụng cho zirconia, lithium disilicate, PMMA và titanium.',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&q=80', 1),
  ('02', '7μm', 'Scanner 3D chính xác cao',
    '3Shape E4, Medit T710 — quét nhanh mẫu hàm, khung sườn, hold rigid với độ chính xác 7µm.',
    'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1000&q=80', 2),
  ('03', '25μm', 'In 3D kim loại & nhựa',
    'Máy in Laser SLM cho khung CoCr, Ti abutment. Máy in DLP cho model, splint, temporary crown.',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1000&q=80', 3)
) AS t(tag, meta, title, description, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_tech_cards);

-- ========== Materials ==========
INSERT INTO cms_materials (id, name, country, material, since_year, display_order, is_active)
SELECT gen_random_uuid(), name, country, material, since_year, display_order, true
FROM (VALUES
  ('Dentsply Sirona', 'Germany / USA', 'Cercon HT Zirconia', 'Từ 2016', 1),
  ('Ivoclar Vivadent', 'Liechtenstein', 'IPS e.max Press', 'Từ 2017', 2),
  ('Amann Girrbach', 'Austria', 'Zolid Gen-X', 'Từ 2019', 3),
  ('Kuraray Noritake', 'Japan', 'Katana Zirconia', 'Từ 2020', 4)
) AS t(name, country, material, since_year, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_materials);

-- ========== Core Values ==========
INSERT INTO cms_core_values (id, number, title, description, display_order)
SELECT gen_random_uuid(), number, title, description, display_order
FROM (VALUES
  ('01', 'Chính xác', 'Mỗi sản phẩm qua 5 vòng QC — từ scan mẫu, thiết kế, milling đến nhuộm, glaze và kiểm tra cuối.', 1),
  ('02', 'Chính hãng', 'Chỉ dùng phôi có Certificate of Authenticity từ nhà sản xuất gốc Đức, Áo, Liechtenstein, Nhật.', 2),
  ('03', 'Chính trực', 'Bảo hành đến 19 năm. Mọi phiếu bảo hành đều có thể tra cứu trực tuyến với mã ADC.', 3),
  ('04', 'Chuyên nghiệp', 'Đội ngũ 40+ KTV CAD/CAM được đào tạo bài bản, có chứng nhận từ Dentsply Sirona, Ivoclar.', 4)
) AS t(number, title, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_core_values);

-- ========== Timeline ==========
INSERT INTO cms_timeline_entries (id, year, title, description, display_order)
SELECT gen_random_uuid(), year, title, description, display_order
FROM (VALUES
  ('2020', 'Thành lập', 'Mở xưởng gia công đầu tiên tại TP.HCM với 3 kỹ thuật viên, phục vụ 20 phòng khám nội thành.', 1),
  ('2016', 'Đối tác Dentsply', 'Chính thức trở thành đối tác chiến lược của Dentsply Sirona tại khu vực phía Nam.', 2),
  ('2018', 'Mở rộng CAD/CAM', 'Đầu tư 3 máy CNC 5 trục, 2 scanner E4, mở rộng đội ngũ lên 25 người.', 3),
  ('2020', '500 labo đối tác', 'Phủ sóng 63 tỉnh thành, trở thành đối tác gia công chủ lực cho labo inhouse và phòng khám lớn.', 4),
  ('2023', 'Chứng nhận ISO 13485', 'Đạt chuẩn ISO 13485:2016 cho hệ thống quản lý chất lượng thiết bị y tế.', 5),
  ('2026', 'Digital Center 2.0', 'Ra mắt nền tảng đặt hàng trực tuyến, tra cứu bảo hành, tư vấn kỹ thuật 24/7 cho đối tác.', 6)
) AS t(year, title, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_timeline_entries);

-- ========== Warranty Policy Groups + Items ==========
DO $$
DECLARE
  g1 UUID := gen_random_uuid();
  g2 UUID := gen_random_uuid();
  g3 UUID := gen_random_uuid();
  g4 UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cms_warranty_policy_groups) THEN
    INSERT INTO cms_warranty_policy_groups (id, category_name, display_order) VALUES
      (g1, 'Toàn sứ (Zirconia)', 1),
      (g2, 'Sứ ép', 2),
      (g3, 'Implant', 3),
      (g4, 'Hàm tháo lắp', 4);
    INSERT INTO cms_warranty_policy_items (id, group_id, product_name, warranty_text, display_order) VALUES
      (gen_random_uuid(), g1, 'Cercon HT', '10 năm', 1),
      (gen_random_uuid(), g1, 'Zolid Gen-X', '15 năm', 2),
      (gen_random_uuid(), g1, 'Katana UTML', '12 năm', 3),
      (gen_random_uuid(), g2, 'IPS e.max Press', '7 năm', 1),
      (gen_random_uuid(), g2, 'IPS e.max CAD', '7 năm', 2),
      (gen_random_uuid(), g3, 'Custom Abutment Ti', '10 năm', 1),
      (gen_random_uuid(), g3, 'Abutment Zirconia', '10 năm', 2),
      (gen_random_uuid(), g4, 'Flexi Partial', '5 năm', 1),
      (gen_random_uuid(), g4, 'Hàm nhựa', '3 năm', 2);
  END IF;
END $$;

-- ========== Contact Channels ==========
INSERT INTO cms_contact_channels (id, label, value, subtitle, icon_key, display_order, is_active)
SELECT gen_random_uuid(), label, value, subtitle, icon_key, display_order, true
FROM (VALUES
  ('HOTLINE · 24/7', '0378 422 496', 'Hỗ trợ kỹ thuật & đặt hàng', 'phone', 1),
  ('EMAIL', 'info@alphacenter.vn', 'Phản hồi trong 2 giờ', 'mail', 2),
  ('ZALO OFFICIAL', '0378 422 496', 'Chat nhanh, gửi file CAD', 'zalo', 3),
  ('GIỜ LÀM VIỆC', '07:30 — 17:30', 'Thứ 2 đến Thứ 7', 'clock', 4)
) AS t(label, value, subtitle, icon_key, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_contact_channels);

-- ========== Job Perks ==========
INSERT INTO cms_job_perks (id, title, description, icon_key, display_order)
SELECT gen_random_uuid(), title, description, NULL, display_order
FROM (VALUES
  ('Lương cạnh tranh', 'Base + thưởng sản lượng theo case. Reviewed 6 tháng/lần. Thưởng dự án, thưởng Tết 13-14 tháng.', 1),
  ('Đào tạo quốc tế', 'Workshop định kỳ từ Dentsply Sirona, Ivoclar, Amann Girrbach. Có cơ hội tham dự IDS Cologne.', 2),
  ('Bảo hiểm cao cấp', 'BHYT + BHNT + gói khám sức khỏe định kỳ. Hỗ trợ 100% chi phí nha khoa cho nhân viên và gia đình.', 3),
  ('Môi trường chuyên nghiệp', 'Xưởng sản xuất đạt ISO 13485, thiết bị hiện đại. Đội ngũ 45 người, 70% gắn bó trên 5 năm.', 4)
) AS t(title, description, display_order)
WHERE NOT EXISTS (SELECT 1 FROM cms_job_perks);

-- ========== Site Settings (upsert by key) ==========
INSERT INTO site_settings (id, key, value, "group", updated_at) VALUES
  (gen_random_uuid(), 'contact.officeAddressLine1', '242/12 Phạm Văn Hai', 'contact', NOW()),
  (gen_random_uuid(), 'contact.officeAddressLine2', 'Phường 5, Quận Tân Bình, TP.HCM, Việt Nam', 'contact', NOW()),
  (gen_random_uuid(), 'contact.mapEmbedUrl', 'https://maps.google.com/?q=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', 'contact', NOW()),
  (gen_random_uuid(), 'contact.mapButton1Url', 'https://maps.google.com/?q=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', 'contact', NOW()),
  (gen_random_uuid(), 'contact.mapButton2Url', 'https://www.google.com/maps/dir/?api=1&destination=242/12+Phạm+Văn+Hai,+Tân+Bình,+TP.HCM', 'contact', NOW()),
  (gen_random_uuid(), 'site.companyName', 'Alpha Digital Center', 'general', NOW()),
  (gen_random_uuid(), 'site.tagline', 'Digital dental laboratory — Est. 2020', 'general', NOW()),
  (gen_random_uuid(), 'stats.years', '12+', 'stats', NOW()),
  (gen_random_uuid(), 'stats.labs', '500+', 'stats', NOW()),
  (gen_random_uuid(), 'stats.warrantyMax', '19 năm', 'stats', NOW()),
  (gen_random_uuid(), 'seo.defaultTitle', 'Alpha Digital Center — Labo gia công nha khoa số', 'seo', NOW()),
  (gen_random_uuid(), 'seo.defaultDescription', 'Đối tác gia công bán thành phẩm cao cấp. CAD/CAM chính xác, vật liệu Đức/Mỹ/Nhật, bảo hành đến 19 năm.', 'seo', NOW())
ON CONFLICT (key) DO NOTHING;

COMMIT;

-- Summary
SELECT 'cms_page_hero' AS t, count(*) FROM cms_page_hero
UNION ALL SELECT 'cms_story_blocks', count(*) FROM cms_story_blocks
UNION ALL SELECT 'cms_tech_cards', count(*) FROM cms_tech_cards
UNION ALL SELECT 'cms_materials', count(*) FROM cms_materials
UNION ALL SELECT 'cms_core_values', count(*) FROM cms_core_values
UNION ALL SELECT 'cms_timeline_entries', count(*) FROM cms_timeline_entries
UNION ALL SELECT 'cms_warranty_policy_groups', count(*) FROM cms_warranty_policy_groups
UNION ALL SELECT 'cms_warranty_policy_items', count(*) FROM cms_warranty_policy_items
UNION ALL SELECT 'cms_contact_channels', count(*) FROM cms_contact_channels
UNION ALL SELECT 'cms_job_perks', count(*) FROM cms_job_perks
UNION ALL SELECT 'site_settings (new)', count(*) FROM site_settings WHERE key LIKE 'contact.%' OR key LIKE 'stats.%' OR key LIKE 'seo.%' OR key LIKE 'site.%';
