-- Blog demo seed (6 bài — idempotent qua ON CONFLICT slug DO NOTHING)
-- Run: docker exec -i <db-container> psql -U adc_admin -d adc_marketing < prisma/seed-blog.sql
-- Nguồn nội dung: contex/pricing.md (bảng giá chuẩn ADC 2026-04-18)

BEGIN;

INSERT INTO blog_posts (
  id, title_vi, slug, excerpt_vi, content_vi,
  featured_image_url, category, tags, status,
  published_at, seo_title, seo_description,
  view_count, ai_generated, created_at, updated_at
) VALUES

-- ========== 1. Cập nhật bảng giá CAD/CAM 2026 (featured, 2026-04-18, tin-tuc) ==========
(
  gen_random_uuid(),
  'Cập nhật bảng giá dịch vụ CAD/CAM 2026 cho labo đối tác',
  'cap-nhat-bang-gia-cad-cam-2026',
  'Từ 18/04/2026, Alpha Digital Center áp dụng bảng giá mới — tách riêng 9 nhóm dịch vụ gia công CAD/CAM, in kim loại 3D CoCr/Titan, scan và thiết kế. Minh bạch từng công đoạn để labo inhouse dễ ước lượng chi phí.',
  $c1$Từ ngày 18/04/2026, Alpha Digital Center (ADC) chính thức áp dụng bảng giá dịch vụ gia công mới dành cho các labo và phòng khám đối tác. Lần cập nhật này tập trung vào **minh bạch hoá chi phí từng công đoạn** và mở rộng các dịch vụ gia công CAD/CAM theo hướng module, giúp labo inhouse dễ ước lượng khi nhận case mới.

## Điểm mới trong bảng giá 2026

Ba thay đổi lớn nhất:

- **Tách riêng dịch vụ cắt khô theo vật liệu** — Zirconia, PMMA, PEEK/BioHPP và Hybrid Ceramic được tính giá độc lập, không còn gộp chung "dịch vụ CAD/CAM" như trước.
- **In kim loại 3D tách đôi CoCr và Titan** — với chênh lệch đúng 2x giữa hai vật liệu trên hầu hết dòng sản phẩm.
- **Phí thiết kế được công khai** — từ 10.000đ/sườn đến 1.000.000đ/khung toàn hàm implant, khách hàng chủ động chọn có thuê thiết kế hay không.

## Chi tiết dịch vụ CAD/CAM cắt khô

Dành cho labo đã có máy scan nhưng chưa đầu tư máy phay 5 trục, ADC nhận cắt từ file khách hàng gửi với phôi do khách cấp:

- Sườn Zirconia: **75.000đ/đơn vị**
- Khung toàn hàm Zirconia: **3.000.000đ/khung**
- Khung toàn hàm PMMA: **1.000.000đ/khung**
- Khung toàn hàm PEEK/BioHPP: **1.500.000đ/khung**
- Hybrid Ceramic / Emax Press: **250.000đ/đơn vị**

Cam kết: nếu cắt hỏng do máy, ADC cắt lại miễn phí trong 24 giờ. Không bảo hành lỗi thiết kế — trách nhiệm file thuộc về labo đặt hàng.

## In kim loại 3D — chênh lệch CoCr/Titan

Công nghệ SLM cho phép in khung kim loại trực tiếp từ file CAD, bỏ qua công đoạn đổ sáp:

| Sản phẩm | CoCr | Titan |
|---|---|---|
| Sườn mão | 35.000đ | 70.000đ |
| Sườn trên implant | 50.000đ | 100.000đ |
| Thanh bar bán hàm | 600.000đ | 1.200.000đ |
| Thanh bar toàn hàm | 800.000đ | 1.600.000đ |
| Thimble bán hàm | 800.000đ | 1.600.000đ |
| Thimble toàn hàm | 1.200.000đ | 2.400.000đ |
| Hàm khung | 300.000đ | 500.000đ |

Với case cần bảo hành dài hạn hoặc bệnh nhân nhạy cảm kim loại, chúng tôi khuyến nghị Titan dù giá cao hơn. Với phục hình tạm và case kinh tế, CoCr in 3D là lựa chọn tối ưu.

## Dịch vụ scan và thiết kế

Labo chưa có scanner nội bộ có thể đặt ADC scan mẫu:

- Scan lab: 50.000đ/hàm
- Scan trên miệng (chỉnh nha): 500.000đ/ca
- Scan implant đơn lẻ: 700.000đ/ca
- Scan implant toàn hàm: 1.500.000đ/ca

Phí thiết kế CAD rõ ràng theo từng hạng mục — từ thiết kế sườn (10.000đ), full cutback (15.000đ), mẫu hàm (30.000đ), đến thiết kế khung toàn hàm implant (1.000.000đ).

## Điều khoản áp dụng

Bảng giá mới áp dụng ngay cho khu vực TP.HCM. Labo ở tỉnh khác liên hệ NVKD để có ưu đãi vận chuyển kèm theo. Các case đã chốt báo giá trước 18/04/2026 vẫn giữ nguyên giá cũ đến khi giao hàng.

Bảng giá đầy đủ 9 nhóm dịch vụ + 5 nhóm sản phẩm đã gửi email các labo đối tác. Nếu chưa nhận, liên hệ hotline **0378.422.498** hoặc trụ sở 28 Tân Phước, P.8, Q. Tân Bình, TP HCM.$c1$,
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80',
  'tin-tuc',
  ARRAY['bảng-giá','cad-cam','2026','zirconia','pmma'],
  'published',
  '2026-04-18 09:00:00',
  'Bảng giá CAD/CAM 2026 Alpha Digital Center — Cập nhật mới',
  'Bảng giá dịch vụ gia công CAD/CAM, in kim loại 3D CoCr/Titan, scan và thiết kế 2026 của Alpha Digital Center. Minh bạch từng công đoạn cho labo đối tác.',
  0, false, NOW(), NOW()
),

-- ========== 2. So sánh 5 phôi Zirconia (2026-04-16, kien-thuc) ==========
(
  gen_random_uuid(),
  'So sánh 5 phôi Zirconia cao cấp: Cercon, Zolid, Lava, Nacera, Orodent',
  'so-sanh-phoi-zirconia-cercon-zolid-lava-nacera-orodent',
  'Không phải phôi Zirconia nào cũng giống nhau. So sánh chi tiết 5 dòng phôi phổ biến tại ADC về độ bền, truyền sáng và giá — kèm gợi ý chọn phôi theo từng loại case lâm sàng.',
  $c2$Zirconia đã thống trị thị trường phục hình cố định trong hơn một thập kỷ, nhưng không phải tất cả phôi đều giống nhau. Từ Cercon của Dentsply Sirona đến dòng Orodent mới nổi, mỗi thương hiệu có chất lượng, độ truyền sáng và mức giá khác nhau. Bài viết này so sánh 5 dòng phôi Zirconia phổ biến nhất tại Alpha Digital Center để labo và nha sĩ chọn đúng phôi cho từng case.

## 1. Cercon — chuẩn lâm sàng đã chứng minh

Cercon từ Dentsply Sirona là một trong những phôi Zirconia có bề dày lâm sàng dài nhất tại Việt Nam. Ưu điểm lớn: độ bền uốn ổn định (>1000 MPa), đồng đều giữa các lô, dễ xử lý shade.

- **Sườn:** 310.000đ/đơn vị
- **Full/Cutback:** 330.000đ/đơn vị

Phù hợp: case cầu dài 3-4 đơn vị, răng sau cần chịu lực, labo cần phôi ổn định không surprise.

## 2. Zolid (Amann Girrbach) — cân bằng thẩm mỹ và độ bền

Zolid nổi bật với độ truyền sáng cao hơn Cercon, đặc biệt dòng Zolid Gen-X có thể in layer bằng kỹ thuật cutback rất đẹp.

- **Sườn:** 430.000đ/đơn vị
- **Full/Cutback:** 450.000đ/đơn vị

Phù hợp: case răng trước, vùng cười cần translucency cao, cầu ngắn 1-3 đơn vị.

## 3. Lava (3M) — premium cho răng trước

Lava Plus từ 3M là một trong những phôi có độ ổn định màu và translucency tốt nhất thị trường. Giá cao hơn 60-80% so với Cercon nhưng đổi lại kết quả thẩm mỹ rất ổn định.

- **Sườn:** 560.000đ/đơn vị
- **Full/Cutback:** 580.000đ/đơn vị

Phù hợp: case veneer, crown răng trước single, implant vùng thẩm mỹ.

## 4. Nacera — lựa chọn châu Âu cân bằng

Nacera có độ bền cao tương đương Cercon nhưng translucency nhỉnh hơn, giá gần tương đương Lava.

- **Sườn:** 550.000đ/đơn vị
- **Full/Cutback:** 570.000đ/đơn vị

Phù hợp: case hybrid cầu dài kết hợp vùng trước cần thẩm mỹ, full arch zirconia.

## 5. Orodent — dải sản phẩm đa phân khúc

Orodent có 4 dòng phôi trải từ tầm trung đến cao cấp:

- **White Matt:** 580.000đ / 600.000đ — tầm trung, translucency trung bình
- **Gold:** 620.000đ / 640.000đ — shade ấm, phù hợp da Á châu
- **High Translucent:** 750.000đ / 770.000đ — dòng truyền sáng cao
- **Bleach:** 800.000đ / 820.000đ — shade trắng sáng nhất

Phù hợp: labo cần linh hoạt nhiều shade/phân khúc trong cùng hệ thương hiệu.

## Gợi ý chọn phôi theo case

| Case | Phôi gợi ý |
|---|---|
| Cầu sau 3-4 đơn vị | Cercon, Zolid |
| Veneer/Crown răng trước | Lava, Orodent HT |
| Full arch zirconia | Nacera, Cercon |
| Bệnh nhân da ấm | Orodent Gold |
| Bệnh nhân yêu cầu trắng sáng | Orodent Bleach |
| Case kinh tế | UNC (180-200K), Zirconia chung (110-130K) |

## Lưu ý kỹ thuật

Tất cả phôi Zirconia đều cần sintering ở nhiệt độ chuẩn nhà sản xuất (~1450-1550°C tuỳ dòng). ADC có lò sintering chuyên biệt cho từng thương hiệu, đảm bảo không cross-contamination. Khi đặt hàng, nha sĩ có thể yêu cầu Certificate of Authenticity nếu cần lưu hồ sơ cho bệnh nhân.

Để tư vấn chọn phôi cho case cụ thể, liên hệ team kỹ thuật ADC qua hotline **0378.422.498**.$c2$,
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1400&q=80',
  'kien-thuc',
  ARRAY['zirconia','phôi-sứ','so-sánh','cercon','lava'],
  'published',
  '2026-04-16 10:00:00',
  'So sánh 5 phôi Zirconia: Cercon, Zolid, Lava, Nacera, Orodent',
  'Hướng dẫn chọn phôi Zirconia theo case — so sánh độ bền, translucency, giá của 5 dòng phôi phổ biến tại Alpha Digital Center: Cercon, Zolid, Lava, Nacera, Orodent.',
  0, false, NOW(), NOW()
),

-- ========== 3. Titan vs CoCr (2026-04-15, kien-thuc) ==========
(
  gen_random_uuid(),
  'Titan hay CoCr cho khung implant toàn hàm — Chọn vật liệu nào?',
  'titan-vs-cocr-khung-implant-toan-ham',
  'Chênh lệch giá đúng 2x giữa Titan và CoCr in 3D — nhưng sự khác biệt về sinh học, độ bền mỏi và thẩm mỹ còn lớn hơn. Phân tích cho từng loại case phục hình implant toàn hàm.',
  $c3$Khi chỉ định phục hình implant toàn hàm cố định, câu hỏi đầu tiên về vật liệu khung thường là: **Titan hay CoCr in 3D?** Hai lựa chọn có chênh lệch chi phí đến 2x, nhưng cũng khác nhau rất rõ về đặc tính sinh học, độ bền và quy trình gia công.

## Chênh lệch giá tại Alpha Digital Center

Bảng giá ADC 2026 cho thấy chênh lệch đều đặn giữa hai vật liệu:

| Cấu kiện | CoCr in 3D | Titan in 3D | Titan cắt ướt |
|---|---|---|---|
| Thanh bar bán hàm | 600.000đ | 1.200.000đ | 2.500.000đ |
| Thanh bar toàn hàm | 800.000đ | 1.600.000đ | 4.000.000đ |
| Thimble bán hàm | 800.000đ | 1.600.000đ | 3.500.000đ |
| Thimble toàn hàm | 1.200.000đ | 2.400.000đ | 6.000.000đ |

Lưu ý: cắt ướt Titan từ phôi nguyên khối cho kết quả đặc hơn in 3D, phù hợp case yêu cầu bảo hành rất dài.

## Ưu điểm của CoCr in 3D

- **Chi phí thấp:** bằng 1/2 so với Titan cùng cấu kiện.
- **In nhanh:** thời gian in ~40% nhanh hơn Titan do nhiệt độ nung thấp hơn.
- **Độ bền cơ học tốt:** phù hợp khung dài, chịu lực nhai cao.
- **Độ chính xác sau in:** ±25μm với máy SLM chuẩn của ADC.

Nhược điểm: **niken** trong một số hợp kim CoCr có thể gây phản ứng với bệnh nhân nhạy cảm. Tính tương thích sinh học không bằng Titan cho phục hình dài hạn.

## Ưu điểm của Titan

- **Tương thích sinh học vượt trội:** không độc, không gây viêm quanh implant dài hạn.
- **Nhẹ:** khối lượng khung Titan nhẹ hơn CoCr ~40%, bệnh nhân cảm giác thoải mái hơn.
- **Ít ăn mòn điện hoá:** đặc biệt quan trọng khi khung tiếp xúc nhiều loại hợp kim khác.
- **Độ bền mỏi cao:** chịu được chu kỳ nhai dài hạn tốt hơn.

Nhược điểm: giá gấp đôi, in chậm hơn, độ cứng cao gây khó khăn khi cần chỉnh sửa trên lâm sàng.

## Khi nào chọn Titan?

- Bệnh nhân có tiền sử dị ứng kim loại (niken, crom).
- Case phục hình trọn đời (40-60 tuổi, đủ răng implant).
- Khung toàn hàm full arch cố định (All-on-4, All-on-6).
- Bệnh nhân yêu cầu vật liệu "biomedical grade" rõ ràng.

## Khi nào chọn CoCr in 3D?

- Case bán hàm, chịu tải vừa phải.
- Bệnh nhân không có tiền sử dị ứng.
- Ngân sách hạn chế nhưng vẫn cần độ chính xác máy in 3D.
- Phục hình tạm chờ osseointegration (có thể nâng cấp Titan sau).

## Lưu ý quy trình tại ADC

Tất cả khung in kim loại 3D tại ADC đều qua **heat treatment** sau in để giải phóng ứng suất, rồi **mài chỉnh CNC** để đạt fit implant chính xác. Quy trình này đã được ISO 13485 chứng nhận. Với case toàn hàm full arch, chúng tôi kèm try-in model 3D resin trước khi gia công khung cuối.

---

Không có câu trả lời duy nhất cho "Titan hay CoCr". Quyết định phụ thuộc bệnh nhân, ngân sách và định hướng phục hình. Team kỹ thuật ADC sẵn sàng tư vấn cho từng case — liên hệ **0378.422.498**.$c3$,
  'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=1400&q=80',
  'kien-thuc',
  ARRAY['titan','cocr','implant','khung-toàn-hàm','so-sánh'],
  'published',
  '2026-04-15 14:00:00',
  'Titan hay CoCr cho khung implant toàn hàm — Phân tích chi tiết',
  'Chênh lệch 2x giá giữa Titan và CoCr in 3D. Phân tích đặc tính sinh học, độ bền mỏi và chỉ định lâm sàng để chọn vật liệu khung implant toàn hàm phù hợp.',
  0, false, NOW(), NOW()
),

-- ========== 4. In 3D kim loại thay thế đúc (2026-04-13, cong-nghe) ==========
(
  gen_random_uuid(),
  'In 3D kim loại thay thế đúc — Bao giờ nên chuyển, bao giờ vẫn nên đúc?',
  'in-3d-kim-loai-thay-the-duc-truyen-thong',
  'Chênh lệch chỉ 30-60.000đ giữa sườn đúc NiCr và sườn in 3D CoCr, nhưng khác biệt về độ chính xác (±25μm vs 50-100μm) và workflow thì rất lớn. Khi nào nên chuyển đổi?',
  $c4$Công nghệ in kim loại 3D (Selective Laser Melting — SLM) đã được thương mại hoá hơn 15 năm, nhưng chỉ 3-4 năm gần đây mới thực sự thay thế được quy trình đúc truyền thống trong labo nha khoa tại Việt Nam. Bài viết này phân tích khi nào nên chuyển sang in 3D và khi nào đúc vẫn là lựa chọn tốt hơn.

## So sánh chi phí trực tiếp

Với sườn kim loại đơn lẻ, bảng giá ADC cho thấy:

- **Đúc NiCr truyền thống:** 50.000đ/sườn, 80.000đ/full
- **In 3D CoCr:** 80.000đ/sườn, 100.000đ/full

Chênh lệch ~30.000đ-60.000đ/đơn vị nhưng kèm nhiều ưu điểm về độ chính xác và thời gian.

## Ưu điểm của in 3D

### 1. Độ chính xác cao hơn

Máy SLM chuẩn cho độ chính xác layer **±25μm**, cao hơn đúc truyền thống (~50-100μm do co rút sáp). Điều này quan trọng nhất với:

- Khung nhiều đơn vị (cầu dài 4+ đơn vị).
- Khung implant cần fit chính xác abutment.
- Case có undercut phức tạp.

### 2. Quy trình nhất quán

Đúc phụ thuộc tay nghề kỹ thuật viên: pha sáp, đặt cánh rót, lệch nhiệt khi đúc — đều có thể gây sai số. In 3D **số hoá hoàn toàn**: từ file STL đến kim loại, không có bước thủ công.

### 3. Không cần sáp, không có phế liệu

Phôi kim loại dư sau in có thể được tái sinh sau nhiều chu kỳ. Quy trình đúc tạo rác sáp, cánh rót, rất tốn công dọn dẹp.

### 4. Tiết kiệm thời gian cho case nhiều đơn vị

Đúc một case 10 đơn vị mất 2-3 ngày (đổ sáp, gắn cánh rót, burn-out, đúc, cắt, mài). In 3D 10 đơn vị cùng lúc chỉ mất 6-8 giờ in + 2 giờ mài chỉnh.

## Khi nào đúc vẫn tốt hơn?

### 1. Case siêu nhỏ lẻ, 1-2 đơn vị

Setup máy in 3D tốn ~30 phút mỗi batch. Nếu chỉ có 1-2 sườn, đúc thủ công nhanh hơn và rẻ hơn.

### 2. Labo chưa có máy scan và CAD

Đúc bắt đầu từ mẫu vật lý, không cần số hoá. Nếu labo chưa đầu tư scanner và phần mềm, đúc vẫn là lựa chọn thực tế.

### 3. Vật liệu đặc biệt chưa có bột in

Một số hợp kim quý (vàng, palladium) chưa có bột SLM phổ biến. Những case này vẫn phải đúc.

### 4. Case cùi giả truyền thống

Với cùi giả NiCr (30.000đ), đúc nhanh gọn — khách hàng không yêu cầu độ chính xác >50μm.

## Lựa chọn trung gian: gia công dịch vụ tại ADC

Nếu labo muốn tận dụng in 3D nhưng chưa đầu tư máy, ADC có dịch vụ gia công từ file khách gửi:

- Sườn mão CoCr: **35.000đ**
- Sườn trên implant CoCr: **50.000đ**
- Thanh bar bán hàm CoCr: **600.000đ**
- Hàm khung CoCr: **300.000đ**

Lưu ý: dịch vụ này không hoàn thiện, không bảo hành — in hỏng cắt lại. Với mức giá này, labo có thể "test" in 3D cho 10-20 case đầu tiên trước khi quyết định đầu tư máy.

## Kết luận

In 3D kim loại không phải là công nghệ "thay thế hoàn toàn" đúc — ít nhất chưa phải ở thời điểm 2026. Nhưng với case nhiều đơn vị, khung implant, hoặc labo muốn số hoá hoàn toàn quy trình, in 3D đã vượt đúc cả về chi phí tổng và chất lượng. Câu hỏi không còn là "có chuyển không" mà là "chuyển khi nào và từ loại case nào".

Để tư vấn roadmap số hoá cho labo của bạn, liên hệ ADC qua hotline **0378.422.498**.$c4$,
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1400&q=80',
  'cong-nghe',
  ARRAY['in-3d','cocr','đúc','cad-cam','workflow'],
  'published',
  '2026-04-13 11:00:00',
  'In 3D kim loại thay thế đúc — Khi nào nên chuyển đổi quy trình?',
  'Phân tích kinh tế và kỹ thuật của in 3D kim loại SLM so với đúc truyền thống trong labo nha khoa. Chi phí, độ chính xác, thời gian — khi nào nên chuyển, khi nào nên giữ đúc.',
  0, false, NOW(), NOW()
),

-- ========== 5. Custom Abutment Implant (2026-04-12, kien-thuc) ==========
(
  gen_random_uuid(),
  'Custom Abutment Implant — Khi nào Titan, Zirconia, PEEK hay Multi-unit?',
  'custom-abutment-implant-chon-vat-lieu',
  'Bốn vật liệu cho custom abutment tại ADC: Titan (400K), Zirconia (400K), PEEK (800K), Multi-unit (1.5M). Chỉ định lâm sàng cụ thể cho từng loại case — răng trước, răng sau, nướu mỏng, bruxism, All-on-4.',
  $c5$Custom abutment — trụ cầu implant cá nhân hoá — là một trong những bước tiến quan trọng nhất của phục hình implant trong 10 năm qua. Thay vì dùng abutment stock sẵn từ hãng với hình dạng cố định, custom abutment được thiết kế theo đúng giải phẫu nướu và răng thay thế của từng bệnh nhân. Nhưng chọn vật liệu gì cho custom abutment là câu hỏi còn gây tranh cãi.

## 4 vật liệu chính tại Alpha Digital Center

Bảng giá ADC 2026 cung cấp 4 lựa chọn vật liệu cho customized abutment:

- **Titan:** 400.000đ
- **Zirconia:** 400.000đ
- **PEEK:** 800.000đ
- **Multi-unit (composite):** 1.500.000đ

Giá gần bằng nhau giữa Titan và Zirconia, PEEK gấp đôi, Multi-unit cao nhất. Nhưng chỉ định lâm sàng rất khác nhau.

## Khi nào chọn Titan?

Titan là "tiêu chuẩn vàng" cho custom abutment — đã chứng minh lâm sàng >30 năm:

- **Case răng sau:** chịu lực nhai lớn (>500N), Titan cho độ bền cơ học tốt nhất.
- **Nướu dày (>2mm):** màu xám của Titan không ảnh hưởng thẩm mỹ khi nướu che phủ đủ.
- **Bệnh nhân có bruxism:** nghiến răng mạn tính làm tăng tải lên abutment, Titan an toàn hơn.
- **Case phục hình đa đơn vị trên 1 implant:** cần độ cứng cao để tránh nứt.

Nhược điểm: màu xám có thể "xuyên qua" nướu mỏng, làm nướu trông tím nhẹ ở vùng cổ răng — không phù hợp case răng trước với biotype nướu mỏng.

## Khi nào chọn Zirconia?

Zirconia giải quyết đúng điểm yếu của Titan: **thẩm mỹ vùng cổ răng**:

- **Case răng trước vùng cười:** nướu mỏng, ánh sáng tự nhiên xuyên qua — Zirconia trắng không làm nướu tím.
- **Bệnh nhân biotype nướu mỏng:** Zirconia bảo toàn thẩm mỹ dài hạn.
- **Case single implant tải trung bình:** Zirconia chịu tải đủ cho răng trước đơn lẻ.

Nhược điểm: giòn hơn Titan, không khuyến cáo cho case nghiến răng hoặc cầu dài. Cần cẩn thận khi torque — quá mức có thể gây nứt chân abutment.

## Khi nào chọn PEEK?

PEEK (Polyetheretherketone) là vật liệu polymer sinh học cao cấp, modulus đàn hồi gần xương thật:

- **Bệnh nhân dị ứng kim loại và zirconia:** PEEK hoàn toàn trơ sinh học.
- **Phục hình tạm dài hạn:** khi chờ osseointegration hoàn tất (3-6 tháng), PEEK không quá rigid gây stress lên implant mới.
- **Case giảm chấn:** PEEK hấp thụ lực nhai, bảo vệ implant khỏi stress peak.

Nhược điểm: giá gấp đôi Titan/Zirconia, không có độ cứng đủ cho răng sau chịu tải lớn dài hạn.

## Khi nào chọn Multi-unit abutment?

Multi-unit là lựa chọn đặc thù cho phục hình **toàn hàm cố định trên implant** (All-on-4, All-on-6):

- Chuyển đổi kết nối implant sang kết nối hàm (screw-retained).
- Bù trừ góc implant không song song.
- Cho phép tháo lắp khung phục hình khi cần bảo trì.

Giá 1.500.000đ/abutment phản ánh độ phức tạp cơ học — multi-unit không chỉ là trụ đơn lẻ mà là hệ thống kết nối 2 cấp.

## Quy trình gia công tại ADC

Tất cả custom abutment đều bắt đầu từ **scan implant position** (trên miệng hoặc trên mẫu) → thiết kế CAD → gia công:

- **Titan và Zirconia:** cắt CNC 5 trục từ phôi chính hãng (HQ abutment 250.000đ cắt, chính hãng 400.000đ cắt).
- **PEEK:** cắt CNC hoặc in 3D tuỳ case.
- **Multi-unit:** cắt Titan + kiểm tra torque fit thủ công.

Thời gian gia công tiêu chuẩn: 2-3 ngày làm việc từ khi nhận file scan.

---

Không có vật liệu nào "tốt nhất" cho mọi case. Titan cho độ bền, Zirconia cho thẩm mỹ, PEEK cho sinh học, Multi-unit cho cơ học. Team kỹ thuật ADC sẵn sàng tư vấn vật liệu phù hợp từng ca — liên hệ **0378.422.498**.$c5$,
  'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1400&q=80',
  'kien-thuc',
  ARRAY['abutment','implant','titan','zirconia','peek'],
  'published',
  '2026-04-12 15:30:00',
  'Custom Abutment Implant — Chọn Titan, Zirconia, PEEK hay Multi-unit?',
  'Hướng dẫn chọn vật liệu custom abutment cho từng case lâm sàng: răng trước, răng sau, nướu mỏng, bruxism, All-on-4. So sánh Titan, Zirconia, PEEK, Multi-unit.',
  0, false, NOW(), NOW()
),

-- ========== 6. Workflow số (2026-04-10, cong-nghe) ==========
(
  gen_random_uuid(),
  'Workflow số từ scan đến giao hàng: Alpha Digital Center vận hành như thế nào?',
  'workflow-so-tu-scan-den-giao-hang',
  'Labo số không chỉ là máy scan và máy phay — mà là chuỗi 6 bước từ lấy dấu đến giao hàng. ADC công khai từng công đoạn và chi phí để labo đối tác tính được biên lợi nhuận rõ ràng.',
  $c6$Khi nói về "labo số" (digital dental lab), phần đông nghĩ đến máy scan và máy phay. Nhưng thực tế, **digital workflow** là cả chuỗi từ lúc nha sĩ lấy dấu đến lúc phục hình đến tay bệnh nhân. Alpha Digital Center đã xây dựng quy trình số hoàn chỉnh qua 12 năm vận hành. Bài viết này mô tả từng bước.

## Bước 1: Lấy dấu — Scan miệng hoặc scan lab

Workflow số bắt đầu từ file 3D của mẫu hàm hoặc trực tiếp miệng bệnh nhân:

- **Scan lab** (scan mẫu thạch cao sau khi lấy dấu silicon): **50.000đ/hàm** — phù hợp phòng khám chưa có scanner miệng.
- **Scan miệng chỉnh nha:** **500.000đ/ca**
- **Scan miệng implant đơn lẻ:** **700.000đ/ca**
- **Scan miệng implant toàn hàm:** **1.500.000đ/ca**

ADC dùng scanner 3Shape E4 và Medit T710 cho scan lab với độ chính xác **7μm**. Scanner miệng iTero/Medit i700 cho workflow trên bệnh nhân trực tiếp.

## Bước 2: Thiết kế CAD

File STL được đưa vào phần mềm CAD chuyên ngành (exocad, 3Shape Dental System) để thiết kế phục hình. ADC công khai phí thiết kế theo từng hạng mục:

- Sườn: **10.000đ**
- Full cutback: **15.000đ**
- Full: **15.000đ**
- Mẫu hàm: **30.000đ**
- Abutment: **30.000đ**
- Hàm khung: **100.000đ**
- Máng HDPT (hướng dẫn phẫu thuật): **250.000đ**
- Thanh bar: **500.000đ**
- Khung toàn hàm implant: **1.000.000đ**

Labo có thể chọn **tự thiết kế rồi gửi file** hoặc **đặt ADC thiết kế trọn gói**. Với case phức tạp (implant full arch, cầu dài), team thiết kế ADC thường trao đổi qua video call với nha sĩ để thống nhất phương án.

## Bước 3: Gia công — CAM, in 3D hoặc đúc

Tuỳ loại phục hình, file CAD được gửi vào máy tương ứng:

### Phay CNC (cắt khô)

Dùng cho sườn sứ, khung PMMA/PEEK:

- Máy Roland DWX, IMES-ICORE chuyên cho zirconia, lithium disilicate.
- Độ chính xác **±10μm**.
- Sườn Zirconia: 75.000đ dịch vụ cắt.

### In 3D kim loại (SLM)

Dùng cho khung CoCr, Titan:

- Máy SLM công suất cao, kích thước buồng in đủ 1 quadrant.
- Độ chính xác **±25μm**.
- Sườn CoCr 35.000đ, Titan 70.000đ.

### In 3D nhựa (DLP)

Dùng cho mẫu hàm, máng HDPT, sườn temporary:

- Mẫu hàm: **200.000đ**
- Máng HDPT: **500.000đ**
- Sườn resin: **15.000đ**
- Khoá chuyển implant: **50.000đ**

### Đúc truyền thống

Vẫn dùng cho sườn NiCr 50.000đ, cùi giả 30.000đ — case nhỏ lẻ.

## Bước 4: Hoàn thiện

- **Sintering** (với zirconia): nung ở 1450-1550°C tuỳ dòng phôi.
- **Heat treatment** (với kim loại in 3D): giải phóng ứng suất nội.
- **Mài chỉnh fit** trên mẫu hoặc try-in case.
- **Đắp sứ/layer** cho case cần thẩm mỹ cao.
- **Đánh bóng cuối** trước đóng gói.

## Bước 5: QC và đóng gói

Mỗi phục hình qua 3 lớp kiểm tra:

1. **Kỹ thuật viên làm chính:** tự kiểm fit và thẩm mỹ.
2. **QC độc lập:** đo độ dày, shade, marginal fit bằng kính hiển vi.
3. **Trưởng bộ phận:** review cuối, ký duyệt.

Mỗi đơn hàng kèm **phiếu giao hàng có mã bảo hành** — nha sĩ và bệnh nhân có thể tra cứu vật liệu, thời hạn bảo hành (lên đến 19 năm với một số dòng) qua trang /bao-hanh trên website ADC.

## Bước 6: Giao hàng

- **Nội thành TP.HCM:** giao tận nơi trong ngày.
- **Khu vực tỉnh:** qua đối tác chuyển phát nhanh, 1-2 ngày.
- **Cần gấp:** có dịch vụ chuyển nhanh trong 4-6 giờ (phí phụ thu).

---

Workflow số không phải là bộ máy móc đắt tiền — mà là chuỗi quyết định rõ ràng về chất lượng ở từng công đoạn. ADC công khai từng bước, từng chi phí, để labo đối tác có thể tính toán biên lợi nhuận và chọn gói dịch vụ phù hợp. Liên hệ **0378.422.498** để nhận tư vấn workflow cho labo của bạn.$c6$,
  'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1400&q=80',
  'cong-nghe',
  ARRAY['workflow','scan','cad-cam','quy-trình','digital-lab'],
  'published',
  '2026-04-10 09:30:00',
  'Workflow số ADC: 6 bước từ scan đến giao phục hình nha khoa',
  'Mô tả chi tiết workflow số tại Alpha Digital Center — scan, thiết kế CAD, gia công CAM/in 3D/đúc, hoàn thiện, QC 3 lớp và giao hàng. Phí từng công đoạn minh bạch.',
  0, false, NOW(), NOW()
)

ON CONFLICT (slug) DO NOTHING;

COMMIT;
